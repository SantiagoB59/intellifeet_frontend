import {
  Component,
  OnInit
} from '@angular/core';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import {
  ReportesService
} from 'src/app/services/reportes.service';

import {
  VehiculoService
} from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})

export class ReportesComponent
  implements OnInit {

  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  tab = 'alertas';

  // =====================================================
  // DATA
  // =====================================================

  alertas: any[] = [];

  mantenimientos: any[] = [];

  vehiculos: any[] = [];
  maquinarias: any[] = [];
  semaforo: any = {

    criticas: 0,

    altas: 0,

    medias: 0,

    bajas: 0
  };

  // =====================================================
  // FILTROS
  // =====================================================

  filtros = {

    tipo: 'mensual',

    categoria: '',

    tipo_activo: 'VEHICULO', // NUEVO

    vehiculo_id: '',

    maquinaria_id: '',

    fecha_inicio: '',

    fecha_fin: ''

  };



  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private reportesService:
      ReportesService,

    private vehiculoService:
      VehiculoService,
    private maquinariaService: MaquinariaService

  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.cargarVehiculos();
    this.cargarMaquinarias();
    this.cargarTodo();
  }

  // =====================================================
  // CARGAR TODO
  // =====================================================

  cargarTodo(): void {

  const filtros = this.obtenerFiltrosEnviar();

  this.cargarAlertas(filtros);

  this.cargarMantenimientos(filtros);

  this.cargarSemaforo();

}

  // =====================================================
  // VEHÍCULOS
  // =====================================================

  cargarVehiculos(): void {

    this.vehiculoService

      .listar({})

      .subscribe({

        next: (resp: any) => {

          this.vehiculos = resp;
        },

        error: (err) => {

          console.error(
            'Error vehículos:',
            err
          );
        }
      });
  }

  cargarMaquinarias(): void {

    this.maquinariaService
      .listar()
      .subscribe({

        next: (resp: any) => {

          this.maquinarias = resp;

        },

        error: err => console.error(err)

      });

  }

  cambiarTipoActivo(): void {

    if (this.filtros.tipo_activo === 'VEHICULO') {

      this.filtros.maquinaria_id = '';

    } else {

      this.filtros.vehiculo_id = '';

    }

  }

  // =====================================================
  // ALERTAS
  // =====================================================

  cargarAlertas(filtros: any = this.filtros): void {

    this.loading = true;

    this.reportesService
      .getAlertas(filtros)
      .subscribe({

        next: (resp: any) => {

          console.log('ALERTAS =>', resp);

          this.alertas = resp;

          this.loading = false;
        },

        error: (err) => {

          console.error(err);

          this.loading = false;
        }

      });

  }

  // =====================================================
  // MANTENIMIENTOS
  // =====================================================

  cargarMantenimientos(filtros: any = this.filtros): void {

    this.reportesService

      .getMantenimientos(filtros)

      .subscribe({

        next: (resp: any) => {

          this.mantenimientos = resp;

        },

        error: (err) => {

          console.error(
            'Error mantenimientos:',
            err
          );

        }

      });

  }

  // =====================================================
  // SEMÁFORO
  // =====================================================

  cargarSemaforo(): void {

    this.reportesService

      .getSemaforo()

      .subscribe({

        next: (resp: any) => {

          this.semaforo = resp;
        },

        error: (err) => {

          console.error(
            'Error semáforo:',
            err
          );
        }
      });
  }

  // =====================================================
  // FILTRAR
  // =====================================================


  aplicarFiltros(): void {

    const filtrosEnviar: any = {
      ...this.filtros,
      vehiculo_id: '',
      maquinaria_id: ''
    };

    if (this.filtros.vehiculo_id) {

      if (this.filtros.vehiculo_id.startsWith('V-')) {

        filtrosEnviar.tipo_activo = 'VEHICULO';
        filtrosEnviar.vehiculo_id =
          this.filtros.vehiculo_id.replace('V-', '');

      } else if (this.filtros.vehiculo_id.startsWith('M-')) {

        filtrosEnviar.tipo_activo = 'MAQUINARIA';
        filtrosEnviar.maquinaria_id =
          this.filtros.vehiculo_id.replace('M-', '');

      }

    }

    this.cargarAlertas(filtrosEnviar);
    this.cargarMantenimientos(filtrosEnviar);

  }
  // =====================================================
  // CAMBIAR TAB
  // =====================================================

  cambiarTab(
    tab: string
  ): void {

    this.tab = tab;
  }

  // =====================================================
  // CLASE PRIORIDAD
  // =====================================================

  getClasePrioridad(
    prioridad: string
  ): string {

    switch (prioridad) {

      case 'CRITICA':

        return `
          bg-red-100
          text-red-700
        `;

      case 'ALTA':

        return `
          bg-orange-100
          text-orange-700
        `;

      case 'MEDIA':

        return `
          bg-yellow-100
          text-yellow-700
        `;

      case 'BAJA':

        return `
          bg-green-100
          text-green-700
        `;

      default:

        return `
          bg-blue-100
          text-blue-700
        `;
    }
  }

// =====================================================
// EXPORTAR ALERTAS
// =====================================================

exportarExcelAlertas(): void {

  const filtrosEnviar = this.obtenerFiltrosEnviar();

  this.reportesService

    .descargarExcelAlertas(
      filtrosEnviar
    )

    .subscribe({

      next: (blob: Blob) => {

        const url =
          window.URL
            .createObjectURL(
              blob
            );

        const a =
          document
            .createElement('a');

        a.href = url;

        a.download =
          `REPORTE_ALERTAS_${Date.now()}.xlsx`;

        a.click();

        window.URL
          .revokeObjectURL(
            url
          );

      },

      error: (err) => {

        console.error(
          'Error descargando Excel:',
          err
        );

      }

    });

}
// =====================================================
// OBTENER ACTIVO SELECCIONADO
// =====================================================


// =====================================================
// OBTENER FILTROS PARA ENVIAR AL BACKEND
// =====================================================

private obtenerFiltrosEnviar() {

  const filtrosEnviar: any = {
    ...this.filtros,
    vehiculo_id: '',
    maquinaria_id: ''
  };

  const activo = this.obtenerActivoSeleccionado();

  if (activo) {

    filtrosEnviar.tipo_activo = activo.tipo;

    if (activo.tipo === 'VEHICULO') {

      filtrosEnviar.vehiculo_id = activo.id;

    } else {

      filtrosEnviar.maquinaria_id = activo.id;

    }

  }

  return filtrosEnviar;

}

private obtenerActivoSeleccionado() {

  if (!this.filtros.vehiculo_id) {
    return null;
  }

  if (this.filtros.vehiculo_id.startsWith('V-')) {

    return {
      tipo: 'VEHICULO',
      id: Number(this.filtros.vehiculo_id.replace('V-', ''))
    };

  }

  if (this.filtros.vehiculo_id.startsWith('M-')) {

    return {
      tipo: 'MAQUINARIA',
      id: Number(this.filtros.vehiculo_id.replace('M-', ''))
    };

  }

  return null;

}


  exportarExcelMantenimientos(): void {

    if (!this.filtros.vehiculo_id) {

      alert('Debes seleccionar un activo');

      return;

    }

    // =========================================
    // VEHÍCULO
    // =========================================

    if (this.filtros.vehiculo_id.startsWith('V-')) {

      const vehiculoId = Number(
        this.filtros.vehiculo_id.replace('V-', '')
      );

      this.reportesService

        .descargarFormatoMantenimiento(
          vehiculoId
        )

        .subscribe({

          next: (blob: Blob) => {

            const url =
              window.URL.createObjectURL(blob);

            const a =
              document.createElement('a');

            a.href = url;

            a.download =
              `HOJA_VIDA_${vehiculoId}.xlsx`;

            a.click();

            window.URL.revokeObjectURL(url);

          },

          error: (err) => {

            console.error(
              'Error descargando mantenimiento:',
              err
            );

          }

        });

    }

    // =========================================
    // MAQUINARIA
    // =========================================

    else if (this.filtros.vehiculo_id.startsWith('M-')) {

      alert(
        'El formato de hoja de vida para maquinaria aún no está disponible.'
      );

    }

  }

  exportarExcelAlertasFormato(): void {

  const activo = this.obtenerActivoSeleccionado();

  if (!activo) {

    alert('Debes seleccionar un activo');

    return;

  }

  if (activo.tipo === 'VEHICULO') {

    this.reportesService

      .descargarFormatoAlertas(activo.id)

      .subscribe({

        next: (blob: Blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const a =
            document.createElement('a');

          a.href = url;

          a.download =
            `HOJA_ALERTAS_${activo.id}.xlsx`;

          a.click();

          window.URL.revokeObjectURL(url);

        },

        error: (err) => {

          console.error(err);

        }

      });

  } else {

    alert(
      'El formato de alertas para maquinaria aún no está disponible.'
    );

  }

}
}