import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { Alerta } from 'src/app/shared/models/alertas.model';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {

  // =====================================================
  // DATA
  // =====================================================
  alertas: Alerta[] = [];
  alertasPaginadas: Alerta[] = [];
  loading = false;
  ejecutandoMotor = false;

  // =====================================================
  // PESTAÑAS
  // =====================================================
  pestanaActiva: 'VERIFICAR' | 'HISTORICO' = 'VERIFICAR';

  // =====================================================
  // PAGINACIÓN
  // =====================================================
  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 1;

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================
  estadisticas = {
    total: 0,
    activas: 0,
    resueltas: 0,
    criticas: 0
  };

  // =====================================================
  // FILTROS
  // =====================================================
  filtros = {
    prioridad: '',
    tipo: ''
  };

  modalDocumento = false;
  alertaSeleccionada!: Alerta;
  nuevaFecha = '';
  archivoDocumento!: File;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================
  constructor(
    private alertasService: AlertasService,
    private router: Router
  ) { }

  // =====================================================
  // INIT
  // =====================================================
  ngOnInit(): void {
    this.cargarTodo();
  }

  // =====================================================
  // CARGAR TODO
  // =====================================================
  cargarTodo(): void {
    this.cargarAlertas();
    this.cargarEstadisticas();
  }

  // =====================================================
  // CARGAR ALERTAS (Filtrado Local por Pestaña)
  // =====================================================
  cargarAlertas(): void {

  this.loading = true;

  this.alertasService
    .listar(this.filtros)
    .subscribe({

      next: (resp) => {

        let alertas = [...resp];

        // Filtrar según la pestaña
        if (this.pestanaActiva === 'VERIFICAR') {

          alertas = alertas.filter(a =>
            a.estado === 'ACTIVA'
          );

        } else {

          alertas = alertas.filter(a =>
            a.estado === 'RESUELTA' ||
            a.estado === 'IGNORADA'
          );

        }

        // Filtrar prioridad
        if (this.filtros.prioridad) {

          alertas = alertas.filter(a =>
            a.prioridad === this.filtros.prioridad
          );

        }

        // Filtrar tipo
        if (this.filtros.tipo) {

          alertas = alertas.filter(a =>
            a.tipo === this.filtros.tipo
          );

        }

        // Ordenar
        alertas.sort(
          (a, b) =>
            this.getPesoPrioridad(b.prioridad) -
            this.getPesoPrioridad(a.prioridad)
        );

        this.alertas = alertas;

        this.paginaActual = 1;

        this.actualizarPaginacion();

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

}

  // =====================================================
  // GESTIÓN DE PESTAÑAS
  // =====================================================
  cambiarPestana(pestana: 'VERIFICAR' | 'HISTORICO'): void {

  this.pestanaActiva = pestana;

  this.cargarAlertas();

}

  // =====================================================
  // CARGAR ESTADÍSTICAS
  // =====================================================
  cargarEstadisticas(): void {
    this.alertasService
      .obtenerEstadisticas()
      .subscribe({
        next: (resp) => {
          this.estadisticas = resp;
        },
        error: (err) => {
          console.error('Error estadísticas:', err);
        }
      });
  }

  // =====================================================
  // FILTRAR Y LIMPIAR
  // =====================================================
  filtrar(): void {
    this.cargarAlertas();
  }

  limpiarFiltros(): void {

  this.filtros = {
    prioridad: '',
    tipo: ''
  };

  this.cargarAlertas();

}

  // =====================================================
  // ACCIONES (RESOLVER / IGNORAR)
  // =====================================================
  resolver(id: number): void {
    const confirmar = confirm('¿Deseas resolver esta alerta?');
    if (!confirmar) return;

    this.alertasService
      .resolver(id)
      .subscribe({
        next: () => {
          this.cargarTodo();
        },
        error: (err) => {
          console.error('Error resolviendo alerta:', err);
        }
      });
  }

  ignorar(id: number): void {
    const confirmar = confirm('¿Deseas ignorar esta alerta?');
    if (!confirmar) return;

    this.alertasService
      .ignorar(id)
      .subscribe({
        next: () => {
          this.cargarTodo();
        },
        error: (err) => {
          console.error('Error ignorando alerta:', err);
        }
      });
  }

  // =====================================================
  // MOTOR DE ALERTAS
  // =====================================================
  ejecutarMotor(): void {
    this.ejecutandoMotor = true;

    this.alertasService
      .ejecutarMotor()
      .subscribe({
        next: () => {
          this.ejecutandoMotor = false;
          this.cargarTodo();
          alert('Motor de alertas ejecutado correctamente');
        },
        error: (err) => {
          console.error('Error ejecutando motor:', err);
          this.ejecutandoMotor = false;
        }
      });
  }

  // =====================================================
  // LÓGICA DE PAGINACIÓN
  // =====================================================
  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.alertas.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.alertasPaginadas = this.alertas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;
    this.actualizarPaginacion();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  getFinPagina(): number {
    return Math.min(this.paginaActual * this.itemsPorPagina, this.alertas.length);
  }


  esMaquinaria(alerta: Alerta): boolean {
    return !!alerta.maquinaria_id;
  }

  esVehiculo(alerta: Alerta): boolean {
    return !!alerta.vehiculo_id;
  }
  // =====================================================
  // ASIGNACIÓN DE PESOS Y CLASES (ESTILOS)
  // =====================================================
  getPesoPrioridad(prioridad: string): number {
    switch (prioridad) {
      case 'CRITICA': return 4;
      case 'ALTA': return 3;
      case 'MEDIA': return 2;
      case 'BAJA': return 1;
      default: return 0;
    }
  }

  getClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'CRITICA':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'ALTA':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'BAJA':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  getClaseEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return 'bg-red-100 text-red-700';
      case 'RESUELTA': return 'bg-green-100 text-green-700';
      case 'IGNORADA': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getIconoAlerta(tipo: string): string {
    switch (tipo) {
      case 'DOCUMENTO': return '📄';
      case 'GPS': return '📍';
      case 'MANTENIMIENTO': return '🔧';
      default: return '🚨';
    }
  }

  trackByAlerta(index: number, alerta: Alerta): number {
    return alerta.id;
  }

  // =====================================================
  // FLUJO DE RESOLUCIÓN ESPECÍFICA
  // =====================================================
  abrirResolver(alerta: Alerta): void {
    if (alerta.tipo === 'DOCUMENTO') {
      this.alertaSeleccionada = alerta;
      this.modalDocumento = true;
      return;
    }

    if (alerta.tipo === 'MANTENIMIENTO') {

      if (alerta.vehiculo_id) {

        this.router.navigate([
          '/dashboard/mantenimientos'
        ]);

        return;

      }

      if (alerta.maquinaria_id) {

        this.router.navigate([
          '/dashboard/mantenimiento-maquinaria'
        ]);

        return;

      }

    }

    this.resolver(alerta.id);
  }

  onFileSelected(event: any): void {
    this.archivoDocumento = event.target.files[0];
  }

  resolverDocumento(): void {
    if (!this.nuevaFecha) {
      alert('Debes seleccionar fecha');
      return;
    }

    if (!this.archivoDocumento) {
      alert('Debes subir documento');
      return;
    }

    const formData = new FormData();
    formData.append('fecha_vencimiento', this.nuevaFecha);
    formData.append('archivo', this.archivoDocumento);
    if (this.alertaSeleccionada.vehiculo_id) {

      formData.append(
        'vehiculo_id',
        this.alertaSeleccionada.vehiculo_id.toString()
      );

    }

    if (this.alertaSeleccionada.maquinaria_id) {

      formData.append(
        'maquinaria_id',
        this.alertaSeleccionada.maquinaria_id.toString()
      );

    }
    formData.append('categoria', this.alertaSeleccionada.categoria);

    this.alertasService
      .resolverDocumento(this.alertaSeleccionada.id, formData)
      .subscribe({
        next: () => {
          this.modalDocumento = false;
          this.cargarTodo();
          alert('Documento actualizado correctamente');
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}