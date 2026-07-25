import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import {
  DocumentoForm,
  EstadoVehiculo,
  FlotaStats,
  Vehiculo
} from 'src/app/shared/models/vehiculo.model';
import Swal from 'sweetalert2';

import { environment } from 'src/environment/environment';

type ModalMode = 'crear' | 'editar' | 'ver';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  vehiculos: Vehiculo[] = [];
  stats: FlotaStats = { total: 0, operativos: 0, en_taller: 0, inactivos: 0 };

  loading = false;
  saving = false;
  error = '';

  searchTerm = '';
  filtroEstado = '';
  filtroTipo: number | '' = '';

  showModal = false;
  showConfirm = false;
  modalMode: ModalMode = 'crear';

  placaParaEliminar = '';
  vehiculoSeleccionado: Vehiculo | null = null;

  form!: FormGroup;

  tipos: any[] = [];
  documentos: DocumentoForm[] = [];
  camposDinamicos: any[] = [];

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  camposVisibles: string[] = [];

  readonly ESTADOS: EstadoVehiculo[] = ['OPERATIVO', 'TALLER', 'INACTIVO'];

  constructor(
    private svc: VehiculoService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.cargarTipos();
    this.cargarDatos();

    // 🔥 solo escuchar cambios de tipo UNA vez
    this.form.get('tipo_vehiculo_id')?.valueChanges.subscribe(() => {
      this.onTipoChange();
    });
  }

  // ================================
  // FORM
  // ================================
  buildForm(): void {
    this.form = this.fb.group({
      placa: ['', Validators.required],
      tipo_vehiculo_id: [null, Validators.required],

      marca: [''],
      modelo: [''],
      color: [''],

      vin: [''],
      numero_chasis: [''],
      numero_motor: [''],

      propietario: [''],
      cc_propietario: [''],

      conductor: [''],
      cc_conductor: [''],

      servicio: ['PUBLICO'],
      km_actual: [0],

      gps_id: [''],
      estado: ['OPERATIVO'],
      notas: ['']
    });
  }

  // ================================
  // DATA
  // ================================
  cargarDatos(): void {
    //this.loading = true;
    this.error = '';

    this.svc.getStats().subscribe(s => this.stats = s);

    this.svc.listar({
      estado: this.filtroEstado || undefined,
      tipo_vehiculo_id: this.filtroTipo !== ''
        ? Number(this.filtroTipo)
        : undefined,
      search: this.searchTerm || undefined
    }).subscribe({
      next: data => {
        this.vehiculos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando vehículos';
        this.loading = false;
      }
    });
  }

  cargarTipos(): void {
    this.svc.getTipos().subscribe(t => this.tipos = t);
  }

  // ================================
  // 🔥 CAMBIO TIPO VEHÍCULO
  // ================================

  onTipoChange(): void {
    const tipoId = this.form.get('tipo_vehiculo_id')?.value;
    if (!tipoId) return;

    this.svc.getCamposTipo(tipoId).subscribe(campos => {

      // 🔥 CAMPOS QUE YA NO QUIERES
      const camposExcluir = [
        'fecha_vencimiento_poliza_hidrocarburos',
        'fecha_vencimiento_quinta_rueda',
        'fecha_vencimiento_arnes_eslinga'
      ];

      // 🔥 FILTRAR
      this.camposDinamicos = campos.filter(
        (c: any) => !camposExcluir.includes(c.nombre_campo)
      );

      this.camposDinamicos.forEach(c => {
        if (!this.form.contains(c.nombre_campo)) {
          this.form.addControl(
            c.nombre_campo,
            this.fb.control('')
          );
        }
      });

    });

    this.cargarDocumentos();
  }
  private isStaticField(field: string): boolean {
    const baseFields = [
      'placa', 'tipo_vehiculo_id', 'marca', 'modelo', 'color',
      'vin', 'numero_chasis', 'numero_motor',
      'propietario', 'cc_propietario',
      'conductor', 'cc_conductor',
      'servicio', 'km_actual',
      'gps_id', 'estado', 'notas'
    ];
    return baseFields.includes(field);
  }

  // ================================
  // DOCUMENTOS
  // ================================
  cargarDocumentos(): void {
    const tipoId = this.form.get('tipo_vehiculo_id')?.value;

    if (!tipoId) {
      this.documentos = [];
      return;
    }

    this.svc.getDocumentos(tipoId).subscribe(docs => {
      this.documentos = docs.map((d: any) => ({
        documento_tipo_id: d.id,
        nombre: d.nombre,
        requiere_numero: d.requiere_numero || false,
        numero: '',
        fecha_vencimiento: ''
      }));
    });
  }

  // ================================
  // MODAL
  // ================================
  abrirCrear(): void {
    this.modalMode = 'crear';
    this.vehiculoSeleccionado = null;

    this.form.reset({
      estado: 'OPERATIVO',
      km_actual: 0,
      servicio: 'PUBLICO'
    });

    this.camposDinamicos = [];
    this.documentos = [];
    this.previewUrl = null;
    this.selectedFile = null;

    this.showModal = true;
  }
  abrirEditar(v: Vehiculo): void {
    this.modalMode = 'editar';

    this.svc.getByPlaca(v.placa).subscribe(full => {

      this.vehiculoSeleccionado = full;

      // ==========================
      // 🧾 DATOS BASE
      // ==========================
      this.form.patchValue({
        placa: full.placa,
        tipo_vehiculo_id: full.tipo_vehiculo_id,
        marca: full.marca,
        modelo: full.modelo,
        color: full.color,
        propietario: full.propietario,
        cc_propietario: full.cc_propietario,
        conductor: full.conductor,
        cc_conductor: full.cc_conductor,
        servicio: full.servicio,
        km_actual: full.km_actual,
        gps_id: full.gps_id,
        estado: full.estado,
        notas: full.notas
      });

      // ==========================
      // 🖼 IMAGEN
      // ==========================
      this.previewUrl = full.foto_url
        ? environment.apiUrl + full.foto_url
        : null;

      // ==========================
      // 📄 DOCUMENTOS (🔥 CORRECTO)
      // ==========================
      this.svc.getDocumentos(full.tipo_vehiculo_id).subscribe(tipos => {

        this.documentos = tipos.map((t: any) => {

          const existente = (full.documentos || [])
            .find((d: any) => d.documento_tipo_id === t.id);

          return {
            documento_tipo_id: t.id,
            nombre: t.nombre,

            // 🔥 IMPORTANTE
            requiere_numero: t.requiere_numero,

            numero: existente?.numero || '',
            fecha_vencimiento: this.formatDate(existente?.fecha_vencimiento ?? null)
          };
        });

      });

      // ==========================
      // 🧠 CAMPOS DINÁMICOS
      // ==========================
      this.svc.getCamposTipo(full.tipo_vehiculo_id).subscribe(campos => {

        const camposExcluir = [
          'fecha_vencimiento_poliza_hidrocarburos',
          'fecha_vencimiento_quinta_rueda',
          'fecha_vencimiento_arnes_eslinga'
        ];

        this.camposDinamicos = campos.filter(
          (c: any) => !camposExcluir.includes(c.nombre_campo)
        );

        // 👉 crear controles si no existen
        campos.forEach(c => {
          if (!this.form.contains(c.nombre_campo)) {
            this.form.addControl(
              c.nombre_campo,
              this.fb.control('')
            );
          }
        });

        // 👉 setear valores
        if (full.campos_dinamicos?.length) {
          full.campos_dinamicos.forEach((campo: any) => {

            const key = campo.nombre;
            const value = campo.valor;

            if (this.form.contains(key)) {

              this.form.get(key)?.setValue(
                campo.tipo === 'date'
                  ? this.formatDate(value)
                  : value
              );

            }

          });

        }
        // ==========================
        // 🚀 ABRIR MODAL AL FINAL
        // ==========================
        this.showModal = true;
      });

    });
  }

  abrirVer(v: Vehiculo): void {
    this.modalMode = 'ver';

    this.svc.getByPlaca(v.placa).subscribe(full => {

      this.vehiculoSeleccionado = full;

      // ==========================
      // 🧾 DATOS BASE
      // ==========================
      this.form.patchValue({
        placa: full.placa,
        tipo_vehiculo_id: full.tipo_vehiculo_id,
        marca: full.marca,
        modelo: full.modelo,
        color: full.color,
        propietario: full.propietario,
        cc_propietario: full.cc_propietario,
        conductor: full.conductor,
        cc_conductor: full.cc_conductor,
        servicio: full.servicio,
        km_actual: full.km_actual,
        gps_id: full.gps_id,
        estado: full.estado,
        notas: full.notas
      });

      this.form.disable();

      // ==========================
      // 🖼 IMAGEN
      // ==========================
      this.previewUrl = full.foto_url
        ? environment.apiUrl + full.foto_url
        : null;

      // ==========================
      // 📄 DOCUMENTOS
      // ==========================
      this.svc.getDocumentos(full.tipo_vehiculo_id).subscribe(tipos => {

        this.documentos = tipos.map((t: any) => {

          const existente = (full.documentos || [])
            .find((d: any) => d.documento_tipo_id === t.id);

          return {
            documento_tipo_id: t.id,
            nombre: t.nombre,
            requiere_numero: t.requiere_numero,
            numero: existente?.numero || '',
            fecha_vencimiento: this.formatDate(existente?.fecha_vencimiento ?? null)
          };
        });

      });

      // ==========================
      // 🧠 CAMPOS DINÁMICOS
      // ==========================
      this.svc.getCamposTipo(full.tipo_vehiculo_id).subscribe(campos => {

        const camposExcluir = [
          'fecha_vencimiento_poliza_hidrocarburos',
          'fecha_vencimiento_quinta_rueda',
          'fecha_vencimiento_arnes_eslinga'
        ];

        this.camposDinamicos = campos.filter(
          (c: any) => !camposExcluir.includes(c.nombre_campo)
        );

        campos.forEach(c => {
          if (!this.form.contains(c.nombre_campo)) {
            this.form.addControl(
              c.nombre_campo,
              this.fb.control('')
            );
          }
        });

        if (full.campos_dinamicos?.length) {
          full.campos_dinamicos.forEach((campo: any) => {

            const key = campo.nombre;
            const value = campo.valor;

            if (this.form.contains(key)) {
              this.form.get(key)?.setValue(value);
            }

          });
        }

        this.showModal = true;
      });

    });
  }


  cerrarModal(): void {
    this.showModal = false;
    this.form.enable();
    this.previewUrl = null;
    this.selectedFile = null;
  }

  // ================================
  // GUARDAR
  // ================================

  guardar(): void {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa los campos requeridos'
      });
      return;
    }

    // 🔥 CONFIRMACIÓN ANTES DE GUARDAR
    Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true // O borra esta línea por completo

    }).then((result) => {

      if (!result.isConfirmed) return;

      this.saving = true;

      // 🔥 LOADING
      Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const formData = new FormData();
      const values = this.form.getRawValue();

      Object.keys(values).forEach(k => {
        if (values[k] !== null && values[k] !== undefined) {
          formData.append(k, values[k]);
        }
      });

      formData.append('documentos', JSON.stringify(this.documentos));

      const dinamicos: any[] = [];

      this.camposDinamicos.forEach(c => {
        dinamicos.push({
          nombre: c.nombre_campo,
          valor: this.form.get(c.nombre_campo)?.value || ''
        });
      });

      formData.append('campos_dinamicos', JSON.stringify(dinamicos));

      if (this.selectedFile) {
        formData.append('foto', this.selectedFile);
      }

      const req = this.modalMode === 'crear'
        ? this.svc.crear(formData)
        : this.svc.actualizar(this.vehiculoSeleccionado!.placa, formData);

      req.subscribe({
        next: () => {
          Swal.close();

          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'Vehículo guardado correctamente'
          });

          this.cerrarModal();
          this.cargarDatos();
          this.saving = false;
        },
        error: () => {
          Swal.close();

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar el vehículo'
          });

          this.saving = false;
        }
      });

    });
  }

  // ================================
  // ELIMINAR
  // ================================
  confirmarEliminar(placa: string): void {
    this.placaParaEliminar = placa;
    this.showConfirm = true;
  }

  eliminar(): void {
    this.svc.eliminar(this.placaParaEliminar).subscribe(() => {
      this.showConfirm = false;
      this.cargarDatos();
    });
  }

  // ================================
  // UTILS
  // ================================
  estadoClass(estado: EstadoVehiculo): string {
    return {
      OPERATIVO: 'badge-operativo',
      TALLER: 'badge-taller',
      INACTIVO: 'badge-inactivo'
    }[estado] || '';
  }

  get titulo(): string {
    return {
      crear: 'REGISTRAR UNIDAD',
      editar: 'EDITAR VEHÍCULO',
      ver: 'DETALLE VEHÍCULO'
    }[this.modalMode];
  }

  trackByPlaca(_: number, v: Vehiculo): string {
    return v.placa;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }


  formatDate(date?: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  isRequired(field: string): boolean {
    const control = this.form.get(field);
    if (!control) return false;

    const validator = control.validator?.({} as any);
    return validator?.['required'] === true;
  }

}