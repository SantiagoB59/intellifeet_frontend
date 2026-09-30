import { Component, OnInit } from '@angular/core';
import { ReportesPreoperacionalesService } from 'src/app/services/reportes-preoperacionales.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { MaquinariaService } from 'src/app/services/maquinaria.service';

@Component({
  selector: 'app-reportes-preoperacionales',
  templateUrl: './reportes-preoperacionales.component.html',
  styleUrls: ['./reportes-preoperacionales.component.scss']
})
export class ReportesPreoperacionalesComponent implements OnInit {

  // =========================================================
  // ESTADO GENERAL
  // =========================================================

  cargando = false;
  mensajeError = '';
  mostrarError = false;

  // =========================================================
  // MODAL REPORTE SEMANAL
  // =========================================================

  mostrarModalSemanal = false;

  reporteSemanal = {
    tipo_activo: 'VEHICULO' as 'VEHICULO' | 'MAQUINARIA',
    activo_id: '',
    fecha: '',
    fechaInicio: '',
    fechaFin: ''
  };

  // =========================================================
  // ACTIVOS
  // =========================================================

  vehiculos: any[] = [];

  maquinarias: any[] = [];

  tipoActivoSeleccionado: 'VEHICULO' | 'MAQUINARIA' = 'VEHICULO';

  // =========================================================
  // FILTROS
  // =========================================================

  filtro = {
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    vehiculo_id: '',
    maquinaria_id: ''
  };

  // =========================================================
  // MESES
  // =========================================================

  meses = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ];

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private reporteService: ReportesPreoperacionalesService,
    private vehiculoService: VehiculoService,
    private maquinariaService: MaquinariaService
  ) { }


  // =========================================================
  // MOSTRAR ERROR
  // =========================================================

  mostrarAlertaError(error: any, mensajePorDefecto: string): void {

    console.error(error);

    let mensaje = mensajePorDefecto;

    // -------------------------------------------------------
    // Intentar obtener mensaje enviado por Flask
    // -------------------------------------------------------

    if (error?.error?.message) {

      mensaje = error.error.message;

    } else if (error?.error?.error) {

      mensaje = error.error.error;

    } else if (error?.message) {

      mensaje = error.message;

    }

    this.mensajeError = mensaje;
    this.mostrarError = true;

    // -------------------------------------------------------
    // Ocultar automáticamente después de 8 segundos
    // -------------------------------------------------------

    setTimeout(() => {

      this.mostrarError = false;

    }, 8000);

  }


  // =========================================================
  // CERRAR ALERTA
  // =========================================================

  cerrarAlertaError(): void {

    this.mostrarError = false;

    this.mensajeError = '';

  }
  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.cargarVehiculos();

    this.cargarMaquinarias();

  }

  // =========================================================
  // CARGAR VEHÍCULOS
  // =========================================================

  cargarVehiculos(): void {

    this.vehiculoService.listar().subscribe({

      next: (resp: any) => {

        this.vehiculos = resp?.data || resp || [];

        console.log(
          'Vehículos cargados:',
          this.vehiculos
        );

      },

      error: (error) => {

        console.error(
          'Error cargando vehículos:',
          error
        );

        this.vehiculos = [];

      }

    });

  }

  // =========================================================
  // CARGAR MAQUINARIA
  // =========================================================

  cargarMaquinarias(): void {

    this.maquinariaService.listar().subscribe({

      next: (resp: any) => {

        this.maquinarias = resp?.data || resp || [];

        console.log(
          'Maquinaria cargada:',
          this.maquinarias
        );

      },

      error: (error) => {

        console.error(
          'Error cargando maquinaria:',
          error
        );

        this.maquinarias = [];

      }

    });

  }

  // =========================================================
  // CAMBIAR TIPO DE ACTIVO EN FILTROS
  // =========================================================

  cambiarTipoActivo(): void {

    this.filtro.vehiculo_id = '';

    this.filtro.maquinaria_id = '';

  }

  // =========================================================
  // NOMBRE DE MAQUINARIA
  // =========================================================

  obtenerNombreMaquinaria(maquinaria: any): string {

    if (!maquinaria) {

      return 'Maquinaria';

    }

    return (
      maquinaria.nombre ||
      maquinaria.codigo ||
      maquinaria.identificacion ||
      maquinaria.descripcion ||
      maquinaria.placa ||
      `Maquinaria ${maquinaria.id}`
    );

  }

  // =========================================================
  // OBTENER NOMBRE DEL ACTIVO SEMANAL
  // =========================================================

  obtenerNombreActivoSemanal(): string {

    const id =
      this.reporteSemanal.activo_id;

    // -------------------------------------------------------
    // VEHÍCULO
    // -------------------------------------------------------

    if (
      this.reporteSemanal.tipo_activo === 'VEHICULO'
    ) {

      const vehiculo = this.vehiculos.find(
        v => String(v.id) === String(id)
      );

      return vehiculo?.placa || 'vehiculo';

    }

    // -------------------------------------------------------
    // MAQUINARIA
    // -------------------------------------------------------

    const maquinaria = this.maquinarias.find(
      m => String(m.id) === String(id)
    );

    return this.obtenerNombreMaquinaria(
      maquinaria
    );

  }

  // =========================================================
  // RESUMEN PDF
  // =========================================================

  descargarResumenPDF(): void {

    this.cargando = true;

    this.reporteService
      .descargarResumenPDF(this.filtro)
      .subscribe({

        next: (blob) => {

          this.descargarArchivo(
            blob,
            `Resumen_Preoperacionales_${this.filtro.mes}_${this.filtro.anio}.pdf`
          );

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error descargando resumen PDF:',
            error
          );

          this.cargando = false;

        }

      });

  }

  // =========================================================
  // PDF DETALLADO
  // =========================================================

  descargarDetallePDF(): void {

    this.cargando = true;

    this.reporteService
      .descargarDetallePDF(this.filtro)
      .subscribe({

        next: (blob) => {

          this.descargarArchivo(
            blob,
            `Detalle_Preoperacionales_${this.filtro.mes}_${this.filtro.anio}.pdf`
          );

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error descargando PDF detallado:',
            error
          );

          this.cargando = false;

        }

      });

  }

  // =========================================================
  // EXCEL
  // =========================================================

  descargarExcel(): void {

    this.cargando = true;

    this.reporteService
      .descargarExcel(this.filtro)
      .subscribe({

        next: (blob) => {

          this.descargarArchivo(
            blob,
            `Libro_Preoperacionales_${this.filtro.mes}_${this.filtro.anio}.xlsx`
          );

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error descargando Excel:',
            error
          );

          this.cargando = false;

        }

      });

  }

  // =========================================================
  // DESCARGAR ARCHIVO
  // =========================================================

  descargarArchivo(
    blob: Blob,
    nombre: string
  ): void {

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download = nombre;

    a.click();

    window.URL.revokeObjectURL(url);

  }

  // =========================================================
  // ABRIR MODAL SEMANAL
  // =========================================================

  abrirModalSemanal(): void {

    this.mostrarModalSemanal = true;

    // -------------------------------------------------------
    // Tomar el tipo de activo seleccionado en los filtros
    // -------------------------------------------------------

    this.reporteSemanal.tipo_activo =
      this.tipoActivoSeleccionado;

    // -------------------------------------------------------
    // Tomar el activo seleccionado
    // -------------------------------------------------------

    if (
      this.tipoActivoSeleccionado === 'VEHICULO'
    ) {

      this.reporteSemanal.activo_id =
        this.filtro.vehiculo_id;

    } else {

      this.reporteSemanal.activo_id =
        this.filtro.maquinaria_id;

    }

    // -------------------------------------------------------
    // Fecha actual
    // -------------------------------------------------------

    const hoy = new Date();

    this.reporteSemanal.fecha =
      this.formatearFecha(hoy);

    // -------------------------------------------------------
    // Calcular semana
    // -------------------------------------------------------

    this.calcularSemana();

  }

  // =========================================================
  // CERRAR MODAL
  // =========================================================

  cerrarModalSemanal(): void {

    this.mostrarModalSemanal = false;

  }

  // =========================================================
  // CAMBIAR TIPO DE ACTIVO EN MODAL
  // =========================================================

  cambiarTipoActivoSemanal(): void {

    this.reporteSemanal.activo_id = '';

  }

  // =========================================================
  // CALCULAR SEMANA
  // =========================================================

  calcularSemana(): void {

    if (!this.reporteSemanal.fecha) {

      this.reporteSemanal.fechaInicio = '';

      this.reporteSemanal.fechaFin = '';

      return;

    }

    // -------------------------------------------------------
    // Crear fecha evitando problemas de timezone
    // -------------------------------------------------------

    const fecha = new Date(
      this.reporteSemanal.fecha + 'T00:00:00'
    );

    // -------------------------------------------------------
    // Obtener día de la semana
    //
    // Domingo = 0
    // Lunes   = 1
    // Martes  = 2
    // ...
    // Sábado  = 6
    // -------------------------------------------------------

    const diaSemana =
      fecha.getDay();

    // -------------------------------------------------------
    // Calcular diferencia hasta el lunes
    // -------------------------------------------------------

    const diferenciaLunes =
      diaSemana === 0
        ? -6
        : 1 - diaSemana;

    // -------------------------------------------------------
    // LUNES
    // -------------------------------------------------------

    const lunes =
      new Date(fecha);

    lunes.setDate(
      fecha.getDate() +
      diferenciaLunes
    );

    // -------------------------------------------------------
    // DOMINGO
    // -------------------------------------------------------

    const domingo =
      new Date(lunes);

    domingo.setDate(
      lunes.getDate() + 6
    );

    // -------------------------------------------------------
    // Guardar rango
    // -------------------------------------------------------

    this.reporteSemanal.fechaInicio =
      this.formatearFecha(lunes);

    this.reporteSemanal.fechaFin =
      this.formatearFecha(domingo);

  }

  // =========================================================
  // FORMATEAR FECHA YYYY-MM-DD
  // =========================================================

  formatearFecha(
    fecha: Date
  ): string {

    const anio =
      fecha.getFullYear();

    const mes =
      String(
        fecha.getMonth() + 1
      ).padStart(2, '0');

    const dia =
      String(
        fecha.getDate()
      ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;

  }

  // =========================================================
  // DETERMINAR SI ES LA SEMANA ACTUAL
  // =========================================================

  esSemanaActual(): boolean {

    if (
      !this.reporteSemanal.fechaInicio ||
      !this.reporteSemanal.fechaFin
    ) {

      return false;

    }

    const hoy =
      new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );

    const inicio =
      new Date(
        this.reporteSemanal.fechaInicio +
        'T00:00:00'
      );

    inicio.setHours(
      0,
      0,
      0,
      0
    );

    const fin =
      new Date(
        this.reporteSemanal.fechaFin +
        'T23:59:59'
      );

    fin.setHours(
      23,
      59,
      59,
      999
    );

    return (
      hoy >= inicio &&
      hoy <= fin
    );

  }

  // =========================================================
  // DESCARGAR REPORTE SEMANAL
  // =========================================================

  descargarReporteSemanal(): void {

    // -------------------------------------------------------
    // Validar activo
    // -------------------------------------------------------

    if (
      !this.reporteSemanal.activo_id
    ) {

      console.warn(
        'Debe seleccionar un activo.'
      );

      return;

    }

    // -------------------------------------------------------
    // Validar fecha
    // -------------------------------------------------------

    if (
      !this.reporteSemanal.fecha
    ) {

      console.warn(
        'Debe seleccionar una fecha.'
      );

      return;

    }

    // -------------------------------------------------------
    // Loading
    // -------------------------------------------------------

    this.cargando = true;

    // -------------------------------------------------------
    // Datos enviados al backend
    // -------------------------------------------------------

    const datos = {

      tipo_activo:
        this.reporteSemanal.tipo_activo,

      activo_id:
        this.reporteSemanal.activo_id,

      fecha:
        this.reporteSemanal.fecha

    };

    console.log(
      'Datos reporte semanal:',
      datos
    );

    // -------------------------------------------------------
    // Solicitud
    // -------------------------------------------------------

    this.reporteService
      .descargarReporteSemanal(datos)
      .subscribe({

        next: (blob) => {

          // -------------------------------------------------
          // Nombre del activo
          // -------------------------------------------------

          const nombreActivo =
            this.obtenerNombreActivoSemanal();

          // -------------------------------------------------
          // Nombre del archivo
          // -------------------------------------------------

          const nombreArchivo =
            `Reporte_Semanal_Preoperacional_${nombreActivo}_${this.reporteSemanal.fechaInicio}_${this.reporteSemanal.fechaFin}.pdf`;

          // -------------------------------------------------
          // Descargar
          // -------------------------------------------------

          this.descargarArchivo(
            blob,
            nombreArchivo
          );

          // -------------------------------------------------
          // Finalizar
          // -------------------------------------------------

          this.cargando = false;

          this.cerrarModalSemanal();

        },

        error: (error) => {

          console.error(
            'Error generando reporte semanal:',
            error
          );

          this.cargando = false;

        }

      });

  }

}