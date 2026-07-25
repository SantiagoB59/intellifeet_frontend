// =========================
// mantenimientos.component.ts (CORREGIDO)
// =========================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MantenimientoService } from 'src/app/services/mantenimiento.service';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.scss']
})
export class MantenimientosComponent implements OnInit {

  // =========================
  // LISTADO
  // =========================
  mantenimientos: any[] = [];
  loading = false;

  // =========================
  // FILTROS
  // =========================
  placa?: string ;
  tipo?: string;
  desde?: string;
  hasta?: string;

  // =========================
  // MODAL
  // =========================
  showModal = false;

  // =========================
  // DATA
  // =========================
  vehiculos: any[] = [];
  planItems: any[] = [];

  busquedaVehiculo = '';
  busquedaPlan = '';

  vehiculoSeleccionado: any = null;
  planSeleccionado: any = null;

  // =========================
  // ARCHIVO
  // =========================
  archivoSeleccionado: File | null = null;

  // =========================
  // NUEVO
  // =========================
  nuevo: any = {
    vehiculo_id: null,
    vehiculo_plan_item_id: null,
    fecha: '',
    km: null,
    tipo: 'PR',
    proveedor: '',
    observaciones: '',
    costo: null,
    lugar: '',
    responsable: ''
  };

  constructor(
    private mantenimientoService: MantenimientoService,
    private route: ActivatedRoute
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.route.params.subscribe(params => {

      if (params['id']) {
        this.placa = params['id'];
      }

      this.cargarDatos();
    });
  }

  // =========================
  // CARGAR LISTADO
  // =========================
  cargarDatos(): void {

    this.loading = true;

    this.mantenimientoService.listar({
      placa: this.placa,
      tipo: this.tipo,
      desde: this.desde,
      hasta: this.hasta
    }).subscribe({
      next: (res: any) => {
        this.mantenimientos = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // =========================
  // FILTROS
  // =========================
  filtrar(): void {
    this.cargarDatos();
  }

  limpiar(): void {
    this.placa = "";
    this.tipo = undefined;
    this.desde = undefined;
    this.hasta = undefined;
    this.cargarDatos();
  }

  // =========================
  // BADGES
  // =========================
  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'Preventivo': return 'badge-operativo';
      case 'Correctivo': return 'badge-inactivo';
      case 'Inspección': return 'badge-info';
      case 'Cambio': return 'badge-taller';
      default: return 'badge-default';
    }
  }

  getTipoTexto(tipo: string): string {
    switch (tipo) {
      case 'Preventivo': return 'Preventivo';
      case 'Correctivo': return 'Correctivo';
      case 'Inspección': return 'Inspección';
      case 'Cambio': return 'Cambio';
      default: return tipo;
    }
  }

  // =========================
  // MODAL
  // =========================
  abrirModal(): void {

    this.showModal = true;

    this.busquedaVehiculo = '';
    this.busquedaPlan = '';

    this.vehiculoSeleccionado = null;
    this.planSeleccionado = null;

    this.archivoSeleccionado = null;

    this.mantenimientoService.getVehiculos().subscribe({
      next: (res) => this.vehiculos = res || [],
      error: (err) => console.error(err)
    });
  }

  cerrarModal(): void {

    this.showModal = false;

    this.archivoSeleccionado = null;
    this.planItems = [];

    this.vehiculoSeleccionado = null;
    this.planSeleccionado = null;

    this.nuevo = {
      vehiculo_id: null,
      vehiculo_plan_item_id: null,
      fecha: '',
      km: null,
      tipo: 'PR',
      proveedor: '',
      observaciones: '',
      costo: null,
      lugar: '',
      responsable: ''
    };
  }

  // =========================
  // FILTROS VEHICULOS
  // =========================
  get vehiculosFiltrados(): any[] {
    return this.vehiculos.filter(v =>
      (v.placa || '').toLowerCase()
        .includes(this.busquedaVehiculo.toLowerCase())
    );
  }

  // =========================
  // FILTROS PLAN
  // =========================
  get planFiltrados(): any[] {
    return this.planItems.filter(p =>
      (p.plan_item?.nombre || p.plan_item?.descripcion || '')
        .toLowerCase()
        .includes(this.busquedaPlan.toLowerCase())
    );
  }

  // =========================
  // SELECCIONAR VEHICULO
  // =========================
  seleccionarVehiculo(v: any): void {

  this.vehiculoSeleccionado = v;
  this.nuevo.vehiculo_id = v.id;

  // Se llena automáticamente
  this.nuevo.km = v.km_estimado;

  this.busquedaVehiculo = v.placa;

  this.mantenimientoService.getPlanPorVehiculo(v.id).subscribe({
    next: (res) => this.planItems = res || [],
    error: (err) => console.error(err)
  });

}

  limpiarVehiculo(): void {

    this.vehiculoSeleccionado = null;
    this.planItems = [];

    this.nuevo.vehiculo_id = null;
    this.nuevo.vehiculo_plan_item_id = null;

    this.busquedaVehiculo = '';
  }

  // =========================
  // SELECCIONAR PLAN
  // =========================
  seleccionarPlan(p: any): void {

    this.planSeleccionado = p;

    this.nuevo.vehiculo_plan_item_id = p.vehiculo_plan_item_id;

    this.nuevo.tipo = p.plan_item?.tipo_mantenimiento || 'PR';

    this.busquedaPlan = p.plan_item?.nombre || p.plan_item?.descripcion || '';
  }

  limpiarPlan(): void {

    this.planSeleccionado = null;
    this.nuevo.vehiculo_plan_item_id = null;
    this.busquedaPlan = '';
  }

  // =========================
  // ARCHIVO
  // =========================
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.archivoSeleccionado = file;
  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {

    if (!this.nuevo.vehiculo_id) return alert('Seleccione vehículo');
    if (!this.nuevo.vehiculo_plan_item_id) return alert('Seleccione mantenimiento');
    if (!this.nuevo.fecha) return alert('Seleccione fecha');
    if (!this.nuevo.km) return alert('Ingrese kilometraje');

    const formData = new FormData();

    Object.keys(this.nuevo).forEach(key => {
      formData.append(key, this.nuevo[key] ?? '');
    });

    if (this.archivoSeleccionado) {
      formData.append('soporte', this.archivoSeleccionado);
    }

    this.mantenimientoService.crear(formData).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('Error guardando mantenimiento');
      }
    });
  }
}