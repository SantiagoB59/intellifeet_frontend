import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnaliticaService } from '../../services/analitica.service';

@Component({
  selector: 'app-analitica',
  templateUrl: './analitica.component.html',
  styleUrls: ['./analitica.component.scss']
})
export class AnaliticaComponent implements OnInit {

  // =========================================================
  // ESTADO
  // =========================================================

  cargando = false;
  error = '';

  // =========================================================
  // FILTROS
  // =========================================================

  periodoSeleccionado: string = '30';

  tipoActivo: 'TODOS' | 'VEHICULOS' | 'MAQUINARIA' = 'TODOS';

  activoSeleccionado: string = 'TODOS';

  rankingSeleccionado: string = 'EFICIENCIA';


  // =========================================================
  // ACTIVOS
  // =========================================================

  activos: any[] = [];


  // =========================================================
  // MÉTRICAS
  // =========================================================

  metricas = {
    totalActivos: 0,
    activosOperativos: 0,
    kmRecorridos: 0,
    crecimientoKm: 0,
    consumoPromedio: 0,
    eficienciaCombustible: 0,
    litrosCombustible: 0,
    costoCombustible: 0,
    costoMantenimiento: 0,
    mantenimientosPendientes: 0,
    disponibilidad: 0,
    alertasActivas: 0,
    alertasCriticas: 0
  };


  // =========================================================
  // COMBUSTIBLE
  // =========================================================

  consumoCombustible: any[] = [];


  // =========================================================
  // RENDIMIENTO
  // =========================================================

  rendimientoActivos: any[] = [];


  // =========================================================
  // COSTOS
  // =========================================================

  costos = {
    costoTotal: 0,
    combustible: 0,
    porcentajeCombustible: 0,
    mantenimiento: 0,
    porcentajeMantenimiento: 0,
    otros: 0,
    porcentajeOtros: 0
  };


  // =========================================================
  // MANTENIMIENTO
  // =========================================================

  mantenimiento = {
    porcentajeCumplimiento: 0,
    completados: 0,
    pendientes: 0,
    vencidos: 0
  };


  // =========================================================
  // ALERTAS MANTENIMIENTO
  // =========================================================

  alertasMantenimiento: any[] = [];


  // =========================================================
  // OPERACIÓN
  // =========================================================

  operacion = {
    utilizacion: 0,
    horasOperativas: 0,
    promedioHoras: 0,
    metaHoras: 0,
    viajes: 0,
    viajesFinalizados: 0,
    viajesCancelados: 0,
    cargaTransportada: 0
  };


  // =========================================================
  // RENTABILIDAD
  // =========================================================

  rentabilidad = {
    disponible: false,
    porcentaje: 0,
    ingresos: null as number | null,
    costos: 0,
    utilidad: null as number | null,
    porcentajeCostos: 0
  };


  // =========================================================
  // INSPECCIONES
  // =========================================================

  inspecciones = {
    total: 0,
    sinNovedades: 0,
    conAnomalias: 0,
    criticas: 0
  };


  // =========================================================
  // RANKINGS
  // =========================================================

  rankingMejores: any[] = [];

  rankingPeores: any[] = [];


  // =========================================================
  // ALERTAS
  // =========================================================

  ultimasAlertas: any[] = [];


  // =========================================================
  // GRÁFICA KM
  // =========================================================

  graficaKm: any[] = [];


  // =========================================================
  // FECHA ACTUALIZACIÓN
  // =========================================================

  ultimaActualizacion = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private analiticaService: AnaliticaService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.cargarDashboard();
  }


  // =========================================================
  // CAMBIAR TIPO DE ACTIVO
  // =========================================================

  cambiarTipoActivo(
    tipo: 'TODOS' | 'VEHICULOS' | 'MAQUINARIA'
  ): void {

    this.tipoActivo = tipo;

    // Cuando cambia el tipo, volvemos a mostrar todos
    // los activos de ese tipo.
    this.activoSeleccionado = 'TODOS';

    this.cargarDashboard();
  }


  // =========================================================
  // CAMBIAR PERIODO
  // =========================================================

  cambiarPeriodo(): void {
    this.cargarDashboard();
  }


  // =========================================================
  // CAMBIAR ACTIVO
  // =========================================================

  cambiarActivo(): void {
    this.cargarDashboard();
  }


  // =========================================================
  // ACTUALIZAR DASHBOARD
  // =========================================================

  actualizarDashboard(): void {
    this.cargarDashboard();
  }


  // =========================================================
  // CARGAR DASHBOARD
  // =========================================================

  cargarDashboard(): void {

    this.cargando = true;
    this.error = '';

    this.analiticaService
      .obtenerDashboard(
        this.periodoSeleccionado,
        this.tipoActivo,
        this.activoSeleccionado
      )
      .subscribe({

        next: (respuesta) => {

          console.log('Respuesta analítica:', respuesta);

          this.procesarRespuesta(respuesta);

          this.cargando = false;

          this.actualizarFecha();

        },

        error: (error) => {

          console.error(
            'Error cargando analítica:',
            error
          );

          this.error =
            error?.error?.message ||
            error?.error?.error ||
            'No fue posible cargar la información de analítica.';

          this.cargando = false;

        }

      });
  }


  // =========================================================
  // PROCESAR RESPUESTA
  // =========================================================

  private procesarRespuesta(respuesta: any): void {

    if (!respuesta) {
      return;
    }


    // =======================================================
    // ACTIVOS
    // =======================================================

    if (respuesta.activos) {
      this.activos = respuesta.activos;
    }


    // =======================================================
    // MÉTRICAS
    // =======================================================

    if (respuesta.metricas) {

      this.metricas = {
        ...this.metricas,
        ...respuesta.metricas
      };

    }


    // =======================================================
    // COMBUSTIBLE
    // =======================================================

    if (respuesta.consumoCombustible) {
      this.consumoCombustible =
        respuesta.consumoCombustible;
    }


    // =======================================================
    // RENDIMIENTO
    // =======================================================

    if (respuesta.rendimientoActivos) {
      this.rendimientoActivos =
        respuesta.rendimientoActivos;
    }


    // =======================================================
    // COSTOS
    // =======================================================

    if (respuesta.costos) {

      this.costos = {
        ...this.costos,
        ...respuesta.costos
      };

    }


    // =======================================================
    // MANTENIMIENTO
    // =======================================================

    if (respuesta.mantenimiento) {

      this.mantenimiento = {
        ...this.mantenimiento,
        ...respuesta.mantenimiento
      };

    }


    // =======================================================
    // ALERTAS DE MANTENIMIENTO
    // =======================================================

    if (respuesta.alertasMantenimiento) {

      this.alertasMantenimiento =
        respuesta.alertasMantenimiento;

    }


    // =======================================================
    // OPERACIÓN
    // =======================================================

    if (respuesta.operacion) {

      this.operacion = {
        ...this.operacion,
        ...respuesta.operacion
      };

    }


    // =======================================================
    // RENTABILIDAD
    // =======================================================

    if (respuesta.rentabilidad) {

      this.rentabilidad = {
        ...this.rentabilidad,
        ...respuesta.rentabilidad
      };

    }


    // =======================================================
    // INSPECCIONES
    // =======================================================

    if (respuesta.inspecciones) {

      this.inspecciones = {
        ...this.inspecciones,
        ...respuesta.inspecciones
      };

    }


    // =======================================================
    // RANKINGS
    // =======================================================

    if (respuesta.rankingMejores) {

      this.rankingMejores =
        respuesta.rankingMejores;

    }

    if (respuesta.rankingPeores) {

      this.rankingPeores =
        respuesta.rankingPeores;

    }


    // =======================================================
    // ÚLTIMAS ALERTAS
    // =======================================================

    if (respuesta.ultimasAlertas) {

      this.ultimasAlertas =
        respuesta.ultimasAlertas;

    }


    // =======================================================
    // GRÁFICA KM
    // =======================================================

    if (respuesta.graficaKm) {

      this.graficaKm =
        respuesta.graficaKm;

    }

  }


  // =========================================================
  // FECHA ACTUALIZACIÓN
  // =========================================================

  private actualizarFecha(): void {

    const ahora = new Date();

    this.ultimaActualizacion =
      ahora.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) +
      ' - ' +
      ahora.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
      });
  }

}