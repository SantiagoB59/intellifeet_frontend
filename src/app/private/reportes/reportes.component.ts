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
export class ReportesComponent implements OnInit {

  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  tab = 'reportes';
  subTabReporte = 'alertas';

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
  // INDICADOR HSEQ
  // =====================================================

  indicadorMantenimiento: any = {

    preventivo: {

      reportados: 0,

      ejecutados: 0,

      pendientes: 0,

      porcentaje: 0,

      meta: 90,

      cumple_meta: false

    },


    correctivo: {

      mantenimientos_reportados: 0,

      mantenimientos_cerrados: 0,

      porcentaje: 0,

      meta: 90,

      cumple_meta: false

    },


    inspecciones: {

      reportadas: 0,

      ejecutadas: 0,

      porcentaje: 0

    },


    vehiculos: {},

    maquinaria: {},


    periodo: {

      inicio: '',

      fin: ''

    }

  };

  // =====================================================
  // FILTROS
  // =====================================================

  filtros = {

    tipo: 'mensual',

    categoria: '',

    tipo_activo: 'VEHICULO',

    vehiculo_id: '',

    maquinaria_id: '',

    fecha_inicio: '',

    fecha_fin: ''

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private reportesService: ReportesService,

    private vehiculoService: VehiculoService,

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

    this.cargarIndicadorMantenimiento(filtros);

  }


  cambiarTab(tab: string): void {
    this.tab = tab;
  }

  cambiarTabReporte(tab: string): void {
    this.subTabReporte = tab;
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

  exportarIndicadorMantenimiento(): void {

    const filtrosEnviar = this.obtenerFiltrosEnviar();

    this.reportesService
      .exportarIndicadorMantenimiento(filtrosEnviar)
      .subscribe({
        next: (blob: Blob) => {

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = url;

          a.download = 'HSEQ-R-159-Indicadores-Mantenimiento.xlsx';

          a.click();

          window.URL.revokeObjectURL(url);

        },

        error: (err) => {
          console.error(
            'Error descargando indicador HSEQ:',
            err
          );
        }
      });

  }

  // =====================================================
  // MAQUINARIA
  // =====================================================

  cargarMaquinarias(): void {

    this.maquinariaService
      .listar()
      .subscribe({

        next: (resp: any) => {

          this.maquinarias = resp;

        },

        error: (err) => {

          console.error(
            'Error maquinaria:',
            err
          );

        }

      });

  }


  // =====================================================
  // CAMBIAR TIPO ACTIVO
  // =====================================================

  cambiarTipoActivo(): void {

    if (
      this.filtros.tipo_activo === 'VEHICULO'
    ) {

      this.filtros.maquinaria_id = '';

    }

    else {

      this.filtros.vehiculo_id = '';

    }

  }


  // =====================================================
  // ALERTAS
  // =====================================================

  cargarAlertas(
    filtros: any = this.obtenerFiltrosEnviar()
  ): void {

    this.loading = true;

    this.reportesService
      .getAlertas(filtros)
      .subscribe({

        next: (resp: any) => {

          console.log(
            'ALERTAS =>',
            resp
          );

          this.alertas = resp;

          this.loading = false;

        },

        error: (err) => {

          console.error(
            'Error alertas:',
            err
          );

          this.loading = false;

        }

      });

  }


  // =====================================================
  // MANTENIMIENTOS
  // =====================================================

  cargarMantenimientos(
    filtros: any = this.obtenerFiltrosEnviar()
  ): void {

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
  // APLICAR FILTROS
  // =====================================================

  aplicarFiltros(): void {

    const filtrosEnviar =
      this.obtenerFiltrosEnviar();


    console.log(
      'FILTROS ENVIADOS =>',
      filtrosEnviar
    );


    this.cargarAlertas(
      filtrosEnviar
    );


    this.cargarMantenimientos(
      filtrosEnviar
    );


    this.cargarIndicadorMantenimiento(
      filtrosEnviar
    );

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
  // OBTENER FILTROS PARA BACKEND
  // =====================================================

  private obtenerFiltrosEnviar(): any {

    const filtrosEnviar: any = {

      tipo: this.filtros.tipo,

      categoria: this.filtros.categoria,

      tipo_activo: this.filtros.tipo_activo,

      vehiculo_id: '',

      maquinaria_id: '',

      fecha_inicio: this.filtros.fecha_inicio,

      fecha_fin: this.filtros.fecha_fin

    };


    const activo =
      this.obtenerActivoSeleccionado();


    if (activo) {

      filtrosEnviar.tipo_activo =
        activo.tipo;


      if (
        activo.tipo === 'VEHICULO'
      ) {

        filtrosEnviar.vehiculo_id =
          activo.id;

      }

      else if (
        activo.tipo === 'MAQUINARIA'
      ) {

        filtrosEnviar.maquinaria_id =
          activo.id;

      }

    }


    return filtrosEnviar;

  }


  // =====================================================
  // OBTENER ACTIVO SELECCIONADO
  // =====================================================

  private obtenerActivoSeleccionado(): any {

    const valor =
      this.filtros.vehiculo_id;


    if (!valor) {

      return null;

    }


    if (
      valor.startsWith('V-')
    ) {

      return {

        tipo: 'VEHICULO',

        id: Number(
          valor.replace('V-', '')
        )

      };

    }


    if (
      valor.startsWith('M-')
    ) {

      return {

        tipo: 'MAQUINARIA',

        id: Number(
          valor.replace('M-', '')
        )

      };

    }


    return null;

  }


  // =====================================================
  // INDICADOR HSEQ
  // =====================================================

  cargarIndicadorMantenimiento(filtros: any = this.filtros): void {

    console.log('==============================');
    console.log('FILTROS INDICADOR:', filtros);
    console.log('==============================');

    this.reportesService.getIndicadorMantenimiento(filtros).subscribe({

      next: (resp: any) => {

        console.log('RESPUESTA INDICADOR:', resp);

        console.log(
          'PREVENTIVO:',
          resp?.indicadores?.preventivo
        );

        console.log(
          'CORRECTIVO:',
          resp?.indicadores?.correctivo
        );

        console.log(
          'INSPECCIONES:',
          resp?.indicadores?.inspecciones
        );

        console.log(
          'PERIODO:',
          resp?.periodo
        );


        // =================================================
        // MAPEAR RESPUESTA DEL BACKEND
        // =================================================

        this.indicadorMantenimiento = {

          // =================================================
          // PREVENTIVO
          // =================================================

          preventivo: {

            reportados:
              Number(
                resp?.indicadores?.preventivo?.reportados ?? 0
              ),

            ejecutados:
              Number(
                resp?.indicadores?.preventivo?.ejecutados ?? 0
              ),

            pendientes:
              Number(
                resp?.indicadores?.preventivo?.pendientes ?? 0
              ),

            porcentaje:
              Number(
                resp?.indicadores?.preventivo?.porcentaje ?? 0
              ),

            meta:
              Number(
                resp?.indicadores?.preventivo?.meta ?? 90
              ),

            cumple_meta:
              Boolean(
                resp?.indicadores?.preventivo?.cumple_meta ?? false
              )
          },


          // =================================================
          // CORRECTIVO
          // =================================================

          correctivo: {

            mantenimientos_reportados:
              Number(
                resp?.indicadores?.correctivo
                  ?.mantenimientos_reportados ?? 0
              ),

            mantenimientos_cerrados:
              Number(
                resp?.indicadores?.correctivo
                  ?.mantenimientos_cerrados ?? 0
              ),

            porcentaje:
              Number(
                resp?.indicadores?.correctivo?.porcentaje ?? 0
              ),

            meta:
              Number(
                resp?.indicadores?.correctivo?.meta ?? 90
              ),

            cumple_meta:
              Boolean(
                resp?.indicadores?.correctivo?.cumple_meta ?? false
              )
          },


          // =================================================
          // INSPECCIONES
          // =================================================

          inspecciones: {

            reportadas:
              Number(
                resp?.indicadores?.inspecciones?.reportadas ?? 0
              ),

            ejecutadas:
              Number(
                resp?.indicadores?.inspecciones?.resueltas ?? 0
              ),

            porcentaje:
              Number(
                resp?.indicadores?.inspecciones?.porcentaje ?? 0
              )
          },


          // =================================================
          // DETALLE
          // =================================================

          vehiculos:
            resp?.vehiculos ?? {},

          maquinaria:
            resp?.maquinaria ?? {},


          // =================================================
          // PERIODO
          // =================================================

          periodo: {

            inicio:
              resp?.periodo?.inicio ?? '',

            fin:
              resp?.periodo?.fin ?? ''

          }

        };


        console.log(
          'INDICADOR FINAL PARA HTML:',
          this.indicadorMantenimiento
        );

      },


      // =====================================================
      // ERROR
      // =====================================================

      error: (err) => {

        console.error(
          'ERROR INDICADOR MANTENIMIENTO:',
          err
        );


        this.indicadorMantenimiento = {

          preventivo: {

            reportados: 0,

            ejecutados: 0,

            pendientes: 0,

            porcentaje: 0,

            meta: 90,

            cumple_meta: false

          },


          correctivo: {

            mantenimientos_reportados: 0,

            mantenimientos_cerrados: 0,

            porcentaje: 0,

            meta: 90,

            cumple_meta: false

          },


          inspecciones: {

            reportadas: 0,

            ejecutadas: 0,

            porcentaje: 0

          },


          vehiculos: {},

          maquinaria: {},


          periodo: {

            inicio: '',

            fin: ''

          }

        };

      }

    });

  }



  exportarExcelAlertas(): void {

    const filtrosEnviar =
      this.obtenerFiltrosEnviar();


    this.reportesService
      .descargarExcelAlertas(
        filtrosEnviar
      )
      .subscribe({

        next: (blob: Blob) => {

          const url =
            window.URL.createObjectURL(
              blob
            );


          const a =
            document.createElement('a');


          a.href = url;


          a.download =
            `REPORTE_ALERTAS_${Date.now()}.xlsx`;


          a.click();


          window.URL.revokeObjectURL(
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
  // EXPORTAR MANTENIMIENTO
  // =====================================================

  exportarExcelMantenimientos(): void {

    const activo =
      this.obtenerActivoSeleccionado();


    if (!activo) {

      alert(
        'Debes seleccionar un activo'
      );

      return;

    }


    if (
      activo.tipo === 'VEHICULO'
    ) {

      this.reportesService

        .descargarFormatoMantenimiento(
          activo.id
        )

        .subscribe({

          next: (blob: Blob) => {

            const url =
              window.URL.createObjectURL(
                blob
              );


            const a =
              document.createElement('a');


            a.href = url;


            a.download =
              `HOJA_VIDA_${activo.id}.xlsx`;


            a.click();


            window.URL.revokeObjectURL(
              url
            );

          },

          error: (err) => {

            console.error(
              'Error descargando mantenimiento:',
              err
            );

          }

        });

    }


    else if (
      activo.tipo === 'MAQUINARIA'
    ) {

      alert(
        'El formato de hoja de vida para maquinaria aún no está disponible.'
      );

    }

  }


  // =====================================================
  // EXPORTAR ALERTAS POR ACTIVO
  // =====================================================

  exportarExcelAlertasFormato(): void {

    const activo =
      this.obtenerActivoSeleccionado();


    if (!activo) {

      alert(
        'Debes seleccionar un activo'
      );

      return;

    }


    if (
      activo.tipo === 'VEHICULO'
    ) {

      this.reportesService

        .descargarFormatoAlertas(
          activo.id
        )

        .subscribe({

          next: (blob: Blob) => {

            const url =
              window.URL.createObjectURL(
                blob
              );


            const a =
              document.createElement('a');


            a.href = url;


            a.download =
              `HOJA_ALERTAS_${activo.id}.xlsx`;


            a.click();


            window.URL.revokeObjectURL(
              url
            );

          },

          error: (err) => {

            console.error(
              'Error descargando alertas:',
              err
            );

          }

        });

    }


    else {

      alert(
        'El formato de alertas para maquinaria aún no está disponible.'
      );

    }

  }

}