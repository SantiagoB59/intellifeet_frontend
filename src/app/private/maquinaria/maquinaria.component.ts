import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import Swal from 'sweetalert2';

import { environment } from 'src/environment/environment';
type ModalMode = 'crear' | 'editar' | 'ver';

@Component({
  selector: 'app-maquinaria',
  templateUrl: './maquinaria.component.html',
  styleUrls: ['./maquinaria.component.scss']
})
export class MaquinariaComponent implements OnInit {

  maquinaria: any[] = [];

  stats: any = {
    total: 0,
    operativos: 0,
    en_taller: 0,
    inactivos: 0
  };

  loading = false;
  saving = false;

  error = '';

  searchTerm = '';
  filtroEstado = '';
  filtroTipo: number | '' = '';

  showModal = false;
  showConfirm = false;

  modalMode: ModalMode = 'crear';

  maquinariaSeleccionada: any = null;
  idEliminar: number | null = null;

  form!: FormGroup;

  tipos: any[] = [];

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private svc: MaquinariaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarTipos();
    this.cargarDatos();
  }

  // =========================
  // FORM
  // =========================
  buildForm(): void {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      tipo_maquinaria_id: [null, Validators.required],

      marca: [''],
      modelo: [''],

      horometro_actual: [0, Validators.required],

      operador: [''],
      gps_id: [''],

      estado: ['OPERATIVA'],
      notas: ['']
    });
  }

  // =========================
  // DATA
  // =========================
  cargarDatos(): void {

    this.loading = true;
    this.error = '';

    this.svc.getStats().subscribe({
      next: s => this.stats = s,
      error: () => this.error = 'Error cargando estadísticas'
    });

    this.svc.listar({
      estado: this.filtroEstado || undefined,
      tipo_maquinaria_id: this.filtroTipo || undefined,
      search: this.searchTerm || undefined
    }).subscribe({
      next: res => {
        this.maquinaria = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando maquinaria';
        this.loading = false;
      }
    });
  }

  cargarTipos(): void {
    this.svc.getTipos().subscribe({
      next: t => this.tipos = t,
      error: () => this.tipos = []
    });
  }

  // =========================
  // MODAL
  // =========================
  abrirCrear(): void {

    this.modalMode = 'crear';
    this.maquinariaSeleccionada = null;

    this.form.reset({
      estado: 'OPERATIVA',
      horometro_actual: 0
    });

    this.previewUrl = null;
    this.selectedFile = null;

    this.showModal = true;
  }

  abrirEditar(m: any): void {

    this.modalMode = 'editar';

    this.svc.getById(m.id).subscribe(full => {

      this.maquinariaSeleccionada = full;

      this.form.patchValue({
        codigo: full.codigo,
        tipo_maquinaria_id: full.tipo_maquinaria_id,
        marca: full.marca,
        modelo: full.modelo,
        horometro_actual: full.horometro_actual,
        operador: full.operador,
        gps_id: full.gps_id,
        estado: full.estado,
        notas: full.notas
      });

      this.previewUrl = full.foto_url
        ? environment.apiUrl + full.foto_url
        : null;

      this.showModal = true;
    });
  }

  abrirVer(m: any): void {

    this.modalMode = 'ver';

    this.svc.getById(m.id).subscribe(full => {

      this.maquinariaSeleccionada = full;

      this.form.patchValue(full);
      this.form.disable();

      this.previewUrl = full.foto_url
        ? environment.apiUrl + full.foto_url
        : null;

      this.showModal = true;
    });
  }

  cerrarModal(): void {
    this.showModal = false;
    this.form.enable();
  }

  // =========================
  // FILE
  // =========================
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {

    if (this.form.invalid) {
      Swal.fire('Error', 'Completa los campos requeridos', 'warning');
      return;
    }

    this.saving = true;

    const formData = new FormData();
    const values = this.form.getRawValue();

    Object.keys(values).forEach(k => {
      if (values[k] !== null && values[k] !== undefined) {
        formData.append(k, values[k]);
      }
    });

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    const req = this.modalMode === 'crear'
      ? this.svc.crear(formData)
      : this.svc.actualizar(this.maquinariaSeleccionada.id, formData);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cerrarModal();
        this.cargarDatos();
        Swal.fire('OK', 'Maquinaria guardada', 'success');
      },
      error: () => {
        this.saving = false;
        Swal.fire('Error', 'No se pudo guardar', 'error');
      }
    });
  }

  // =========================
  // ELIMINAR
  // =========================
  confirmarEliminar(id: number): void {
    this.idEliminar = id;
    this.showConfirm = true;
  }

  eliminar(): void {

    if (!this.idEliminar) return;

    this.svc.eliminar(this.idEliminar).subscribe(() => {
      this.showConfirm = false;
      this.cargarDatos();
    });
  }

  // =========================
  // UTILS
  // =========================
  estadoClass(estado: string): string {
    return {
      OPERATIVA: 'badge-operativo',
      TALLER: 'badge-taller',
      INACTIVA: 'badge-inactivo'
    }[estado] || '';
  }

  get titulo(): string {
    return {
      crear: 'REGISTRAR MAQUINARIA',
      editar: 'EDITAR MAQUINARIA',
      ver: 'DETALLE MAQUINARIA'
    }[this.modalMode];
  }

  trackById(_: number, item: any): number {
    return item.id;
  }
}