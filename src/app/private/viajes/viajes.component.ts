import { Component, OnInit } from '@angular/core';

import { Viaje } from 'src/app/shared/models/viajes.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViajesService } from 'src/app/services/viajes.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

interface FiltrosViaje {
  estado: string;
  vehiculo_id?: number;
}

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})
export class ViajesComponent implements OnInit {

  viajes: Viaje[] = [];
  vehiculos: any[] = [];
  remolques: any[] = [];
  remolqueSeleccionado: any = null;
  loading = false;
  showModal = false;

  // 🔥 MODAL FINALIZACIÓN
  showFinalizarModal = false;
  viajeSeleccionado: number | null = null;
  showDeleteModal = false;
  viajeEliminar: number | null = null;

  kmFin: number = 0;
  observaciones: string = '';

  filtros: FiltrosViaje = {
    estado: '',
    vehiculo_id: undefined
  };

  form!: FormGroup;

  constructor(
    private viajesService: ViajesService,
    private vehiculoService: VehiculoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargar();
    this.cargarVehiculos();
  }

  // =========================
  // FORM CREAR VIAJE
  // =========================

  crearFormulario() {
    this.form = this.fb.group({
      vehiculo_id: [0, Validators.required],
      remolque_id: [null],
      conductor: ['', Validators.required],
      cc_conductor: ['', Validators.required],
      origen: ['', Validators.required],
      destino: ['', Validators.required],

      // NUEVO
      km_inicio: [null, [Validators.required, Validators.min(0)]],

      estado: ['PROGRAMADO']
    });
  }

  // =========================
  // DATA
  // =========================
  cargar() {
    this.loading = true;

    this.viajesService.listar(this.filtros).subscribe({
      next: (res) => {
        this.viajes = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.viajes = [];
        this.loading = false;
      }
    });
  }

  // =========================
  // CAMBIO DE REMOLQUE
  // =========================
  onRemolqueChange(event: Event): void {

    const id = Number((event.target as HTMLSelectElement).value);

    // Si seleccionó "Sin remolque"
    if (!id) {

      this.remolqueSeleccionado = null;

      this.form.patchValue({
        remolque_id: null,
        km_inicio: null
      });

      return;
    }

    const remolque = this.remolques.find(r => r.id === id);

    if (!remolque) {

      this.remolqueSeleccionado = null;

      this.form.patchValue({
        km_inicio: null
      });

      return;
    }

    // Guardar el remolque seleccionado
    this.remolqueSeleccionado = remolque;

    // Autocompletar el último kilometraje registrado
    this.form.patchValue({
      km_inicio: remolque.km_actual ?? 0
    });

  }

  cargarVehiculos() {

    this.vehiculoService.listar().subscribe(res => {

      const vehiculos = res ?? [];

      // =========================
      // TRACTOMULAS / CABEZOTES
      // =========================
      const tractomulaTipos = [
        'tractomula',
        'cabezote',
        'camion tracto',
        'tractocamion'
      ];

      this.vehiculos = vehiculos.filter(v =>
        tractomulaTipos.includes(
          (v.tipo_vehiculo || '').toLowerCase()
        )
      );

      // =========================
      // REMOLQUES
      // =========================
      const remolqueTipos = [
        'cama alta',
        'cama baja',
        'tanque',
        'remolque',
        'plataforma'
      ];

      this.remolques = vehiculos.filter(v =>
        remolqueTipos.includes(
          (v.tipo_vehiculo || '').toLowerCase()
        )
      );

    });

  }

  // =========================
  // MODAL CREAR
  // =========================
  abrirModal() {
    this.showModal = true;
    this.reset();
  }

  cerrarModal() {

    this.showModal = false;

    this.reset();

  }

  // =========================
  // CREAR VIAJE
  // =========================

  crear() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.viajesService.crear(this.form.value)
      .subscribe(() => {

        this.cargar();

        this.cerrarModal();

      });

  }

  // =========================
  // INICIAR VIAJE
  // =========================
  iniciar(id: number) {
    this.viajesService.iniciar(id).subscribe(() => this.cargar());
  }

  // =========================
  // FINALIZAR (ABRE MODAL)
  // =========================
  finalizar(id: number) {
    this.viajeSeleccionado = id;
    this.kmFin = 0;
    this.observaciones = '';
    this.showFinalizarModal = true;
  }

  // =========================
  // CONFIRMAR FINALIZACIÓN
  // =========================
  confirmarFinalizacion() {

    if (!this.viajeSeleccionado) return;

    if (!this.kmFin || this.kmFin <= 0) {
      alert('Debe ingresar un kilometraje válido.');
      return;
    }

    const payload = {
      km_fin: this.kmFin,
      observaciones: this.observaciones
    };

    this.viajesService.finalizar(this.viajeSeleccionado, payload)
      .subscribe(() => {

        this.cargar();

        this.showFinalizarModal = false;

        this.viajeSeleccionado = null;

      });

  }

  // ABRIR MODAL ELIMINAR
  // =========================
  eliminar(id: number) {

    this.viajeEliminar = id;
    this.showDeleteModal = true;

  }

  // =========================
  // CONFIRMAR DESACTIVACIÓN
  // =========================
  confirmarEliminar() {

    if (!this.viajeEliminar) return;

    this.viajesService.eliminar(this.viajeEliminar)
      .subscribe(() => {

        this.cargar();

        this.showDeleteModal = false;
        this.viajeEliminar = null;

      });

  }

  // =========================
  // FILTROS
  // =========================
  onEstadoFilterChange(value: string) {
    this.filtros.estado = value;
    this.cargar();
  }

  onVehiculoFilterChange(value: string) {
    this.filtros.vehiculo_id = value ? +value : undefined;
    this.cargar();
  }

  limpiarFiltros() {
    this.filtros = {
      estado: '',
      vehiculo_id: undefined
    };
    this.cargar();
  }

  // =========================
  // RESET FORM
  // =========================

  reset() {

  this.remolqueSeleccionado = null;

  this.form.reset({

    vehiculo_id: 0,
    remolque_id: null,

    conductor: '',
    cc_conductor: '',

    origen: '',
    destino: '',

    km_inicio: null,

    estado: 'PROGRAMADO'

  });

}
  // =========================
  // UI
  // =========================
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PROGRAMADO': return 'estado-programado';
      case 'EN_RUTA': return 'estado-curso';
      case 'FINALIZADO': return 'estado-finalizado';
      default: return '';
    }
  }
}