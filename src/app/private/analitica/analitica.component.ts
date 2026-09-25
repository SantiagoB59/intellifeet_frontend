import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analitica',
  templateUrl: './analitica.component.html',
  styleUrls: ['./analitica.component.scss']
})
export class AnaliticaComponent implements OnInit {

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

  activos = [
    {
      id: 1,
      nombre: 'TRK-001'
    },
    {
      id: 2,
      nombre: 'TRK-002'
    },
    {
      id: 3,
      nombre: 'TRK-003'
    },
    {
      id: 4,
      nombre: 'VOL-001'
    },
    {
      id: 5,
      nombre: 'RET-001'
    },
    {
      id: 6,
      nombre: 'EXC-001'
    }
  ];


  // =========================================================
  // MÉTRICAS PRINCIPALES
  // =========================================================

  metricas = {

    totalActivos: 24,

    activosOperativos: 21,

    kmRecorridos: 48760,

    crecimientoKm: 8.4,

    consumoPromedio: 3.72,

    eficienciaCombustible: 6.8,

    costoMantenimiento: 18450000,

    mantenimientosPendientes: 7,

    disponibilidad: 91.8,

    alertasActivas: 12,

    alertasCriticas: 3

  };


  // =========================================================
  // CONSUMO DE COMBUSTIBLE
  // =========================================================

  consumoCombustible = [

    {
      nombre: 'TRK-001',
      consumo: 4.15,
      porcentaje: 92
    },

    {
      nombre: 'TRK-002',
      consumo: 3.98,
      porcentaje: 88
    },

    {
      nombre: 'TRK-003',
      consumo: 3.76,
      porcentaje: 83
    },

    {
      nombre: 'VOL-001',
      consumo: 3.45,
      porcentaje: 76
    },

    {
      nombre: 'RET-001',
      consumo: 3.21,
      porcentaje: 71
    }

  ];


  // =========================================================
  // RENDIMIENTO DE ACTIVOS
  // =========================================================

  rendimientoActivos = [

    {
      nombre: 'TRK-001',
      marca: 'Volvo FH',
      tipo: 'Vehículo',
      icono: '🚛',

      uso: 12580,
      unidad: 'km',

      consumo: 4.15,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 92,

      costoMantenimiento: 2850000,

      disponibilidad: 96,

      eficiencia: 94,

      estado: 'OPERATIVO'
    },

    {
      nombre: 'TRK-002',
      marca: 'Kenworth T800',
      tipo: 'Vehículo',
      icono: '🚛',

      uso: 10840,
      unidad: 'km',

      consumo: 3.98,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 88,

      costoMantenimiento: 3250000,

      disponibilidad: 91,

      eficiencia: 87,

      estado: 'OPERATIVO'
    },

    {
      nombre: 'TRK-003',
      marca: 'Freightliner',
      tipo: 'Vehículo',
      icono: '🚛',

      uso: 9840,
      unidad: 'km',

      consumo: 3.76,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 83,

      costoMantenimiento: 4100000,

      disponibilidad: 84,

      eficiencia: 79,

      estado: 'MANTENIMIENTO'
    },

    {
      nombre: 'VOL-001',
      marca: 'Volvo FMX',
      tipo: 'Vehículo',
      icono: '🚚',

      uso: 8650,
      unidad: 'km',

      consumo: 3.45,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 76,

      costoMantenimiento: 2150000,

      disponibilidad: 89,

      eficiencia: 75,

      estado: 'OPERATIVO'
    },

    {
      nombre: 'RET-001',
      marca: 'Caterpillar',
      tipo: 'Maquinaria',
      icono: '🚜',

      uso: 684,
      unidad: 'h',

      consumo: 3.21,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 71,

      costoMantenimiento: 4900000,

      disponibilidad: 72,

      eficiencia: 58,

      estado: 'MANTENIMIENTO'
    },

    {
      nombre: 'EXC-001',
      marca: 'Caterpillar 320',
      tipo: 'Maquinaria',
      icono: '🏗️',

      uso: 542,
      unidad: 'h',

      consumo: 2.95,
      unidadConsumo: 'km/L',
      consumoPorcentaje: 65,

      costoMantenimiento: 3800000,

      disponibilidad: 68,

      eficiencia: 52,

      estado: 'DETENIDO'
    }

  ];


  // =========================================================
  // COSTOS
  // =========================================================

  costos = {

    costoTotal: 48500000,

    combustible: 27800000,

    porcentajeCombustible: 57.3,

    mantenimiento: 18450000,

    porcentajeMantenimiento: 38.0,

    otros: 2250000,

    porcentajeOtros: 4.7

  };


  // =========================================================
  // MANTENIMIENTO
  // =========================================================

  mantenimiento = {

    porcentajeCumplimiento: 82,

    completados: 41,

    pendientes: 7,

    vencidos: 2

  };


  // =========================================================
  // ALERTAS DE MANTENIMIENTO
  // =========================================================

  alertasMantenimiento = [

    {
      titulo: 'Cambio de aceite próximo',

      activo: 'TRK-003',

      prioridad: 'ALTA'

    },

    {
      titulo: 'Mantenimiento preventivo vencido',

      activo: 'RET-001',

      prioridad: 'CRITICA'

    },

    {
      titulo: 'Revisión de frenos',

      activo: 'EXC-001',

      prioridad: 'CRITICA'

    },

    {
      titulo: 'Cambio de filtros',

      activo: 'TRK-002',

      prioridad: 'MEDIA'

    },

    {
      titulo: 'Revisión sistema eléctrico',

      activo: 'VOL-001',

      prioridad: 'ALTA'

    }

  ];


  // =========================================================
  // OPERACIÓN
  // =========================================================

  operacion = {

    utilizacion: 87,

    horasOperativas: 4860,

    promedioHoras: 8.6,

    metaHoras: 10,

    viajes: 384,

    viajesFinalizados: 362,

    viajesCancelados: 22,

    cargaTransportada: 8450

  };


  // =========================================================
  // RENTABILIDAD
  // =========================================================

  rentabilidad = {

    porcentaje: 28.6,

    ingresos: 68000000,

    costos: 48500000,

    utilidad: 19500000,

    porcentajeCostos: 71.4

  };


  // =========================================================
  // INSPECCIONES
  // =========================================================

  inspecciones = {

    total: 286,

    sinNovedades: 231,

    conAnomalias: 42,

    criticas: 13

  };


  // =========================================================
  // RANKING - MEJORES
  // =========================================================

  rankingMejores = [

    {
      nombre: 'TRK-001',
      tipo: 'Vehículo',
      icono: '🚛',
      valor: 94
    },

    {
      nombre: 'TRK-002',
      tipo: 'Vehículo',
      icono: '🚛',
      valor: 87
    },

    {
      nombre: 'VOL-001',
      tipo: 'Vehículo',
      icono: '🚚',
      valor: 75
    },

    {
      nombre: 'TRK-003',
      tipo: 'Vehículo',
      icono: '🚛',
      valor: 79
    },

    {
      nombre: 'RET-001',
      tipo: 'Maquinaria',
      icono: '🚜',
      valor: 58
    }

  ];


  // =========================================================
  // RANKING - PEORES
  // =========================================================

  rankingPeores = [

    {
      nombre: 'EXC-001',
      tipo: 'Maquinaria',
      icono: '🏗️',
      valor: 52
    },

    {
      nombre: 'RET-001',
      tipo: 'Maquinaria',
      icono: '🚜',
      valor: 58
    },

    {
      nombre: 'VOL-001',
      tipo: 'Vehículo',
      icono: '🚚',
      valor: 75
    },

    {
      nombre: 'TRK-003',
      tipo: 'Vehículo',
      icono: '🚛',
      valor: 79
    },

    {
      nombre: 'TRK-002',
      tipo: 'Vehículo',
      icono: '🚛',
      valor: 87
    }

  ];


  // =========================================================
  // ÚLTIMAS ALERTAS
  // =========================================================

  ultimasAlertas = [

    {
      titulo: 'Mantenimiento preventivo vencido',

      descripcion:
        'El activo requiere mantenimiento preventivo inmediato.',

      activo: 'RET-001',

      fecha: '20 Ago 2026 - 10:32',

      prioridad: 'CRITICA'
    },

    {
      titulo: 'Revisión de frenos',

      descripcion:
        'Se requiere revisión del sistema de frenos.',

      activo: 'EXC-001',

      fecha: '20 Ago 2026 - 09:45',

      prioridad: 'CRITICA'
    },

    {
      titulo: 'Cambio de aceite próximo',

      descripcion:
        'El vehículo se encuentra próximo al kilometraje programado.',

      activo: 'TRK-003',

      fecha: '19 Ago 2026 - 16:20',

      prioridad: 'ALTA'
    },

    {
      titulo: 'Revisión sistema eléctrico',

      descripcion:
        'Se recomienda realizar inspección preventiva.',

      activo: 'VOL-001',

      fecha: '19 Ago 2026 - 11:15',

      prioridad: 'ALTA'
    },

    {
      titulo: 'Cambio de filtros',

      descripcion:
        'El mantenimiento está próximo a su fecha programada.',

      activo: 'TRK-002',

      fecha: '18 Ago 2026 - 15:40',

      prioridad: 'MEDIA'
    }

  ];


  // =========================================================
  // FECHA DE ACTUALIZACIÓN
  // =========================================================

  ultimaActualizacion: string = '20 Ago 2026 - 14:05';


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.actualizarDashboard();

  }


  // =========================================================
  // CAMBIAR TIPO DE ACTIVO
  // =========================================================

  cambiarTipoActivo(
    tipo: 'TODOS' | 'VEHICULOS' | 'MAQUINARIA'
  ): void {

    this.tipoActivo = tipo;

    console.log('Tipo de activo:', tipo);

  }


  // =========================================================
  // ACTUALIZAR DASHBOARD
  // =========================================================

  actualizarDashboard(): void {

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

    console.log('Dashboard actualizado');

  }

}