import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ControlDiarioService,
  ControlDiario
} from 'src/app/services/control-diario.service';

import {
  environment
} from 'src/environment/environment';


interface FiltroActivo {
  tipo: 'VEHICULO' | 'MAQUINARIA';
  id: number;
  nombre: string;
}


interface FiltroOperador {
  id: number;
  nombre: string;
}


@Component({
  selector: 'app-control-diario-admin',
  templateUrl: './control-diario-admin.component.html',
  styleUrls: ['./control-diario-admin.component.scss']
})
export class ControlDiarioAdminComponent implements OnInit {

  // ==========================================================
  // DATOS
  // ==========================================================

  controles: ControlDiario[] = [];

  controlesFiltrados: ControlDiario[] = [];

  activos: FiltroActivo[] = [];

  operadores: FiltroOperador[] = [];


  // ==========================================================
  // FILTROS
  // ==========================================================

  mes: string = '';

  anio: string = '';

  fechaDesde: string = '';

  fechaHasta: string = '';

  activoSeleccionado: string = '';

  operadorSeleccionado: string = '';

  estadoSeleccionado: string = '';


  // ==========================================================
  // ESTADOS
  // ==========================================================

  cargando: boolean = false;

  descargandoExcel: boolean = false;

  mensaje: string = '';

  error: string = '';


  // ==========================================================
  // MODAL
  // ==========================================================

  mostrarModal: boolean = false;

  controlSeleccionado: ControlDiario | null = null;


  // ==========================================================
  // VALIDACIÓN
  // ==========================================================

  observacionValidacion: string = '';

  procesandoValidacion: boolean = false;


  // ==========================================================
  // RECHAZO
  // ==========================================================

  mostrarRechazo: boolean = false;

  motivoRechazo: string = '';

  procesandoRechazo: boolean = false;


  // ==========================================================
  // URL API
  // ==========================================================

  private readonly apiUrl = environment.apiUrl;


  constructor(
    private controlDiarioService: ControlDiarioService
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.cargarControles();

  }


  // ==========================================================
  // CARGAR CONTROLES
  // ==========================================================

  cargarControles(): void {

    this.cargando = true;

    this.error = '';
    this.mensaje = '';

    const filtros = this.obtenerFiltros();

    this.controlDiarioService
      .obtenerControlesAdmin(filtros)
      .subscribe({

        next: (data: any) => {

          console.log(
            'CONTROLES ADMIN:',
            data
          );

          if (Array.isArray(data)) {

            this.controles = data;

          } else {

            this.controles =
              data?.controles || [];

          }

          this.controlesFiltrados =
            [...this.controles];

          this.construirFiltros();

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error cargando controles administrativos:',
            error
          );

          this.controles = [];

          this.controlesFiltrados = [];

          this.cargando = false;

          this.error =
            error?.error?.error ||
            'No fue posible cargar los controles diarios.';

        }

      });

  }


  // ==========================================================
  // OBTENER FILTROS
  // ==========================================================

  obtenerFiltros(): any {

    const filtros: any = {};

    if (this.mes) {

      filtros.mes =
        Number(this.mes);

    }

    if (this.anio) {

      filtros.anio =
        Number(this.anio);

    }

    if (this.fechaDesde) {

      filtros.fecha_desde =
        this.fechaDesde;

    }

    if (this.fechaHasta) {

      filtros.fecha_hasta =
        this.fechaHasta;

    }

    if (this.estadoSeleccionado) {

      filtros.estado =
        this.estadoSeleccionado;

    }


    if (this.activoSeleccionado) {

      const partes =
        this.activoSeleccionado.split('-');

      const tipo =
        partes[0];

      const id =
        Number(partes[1]);

      if (tipo === 'VEHICULO') {

        filtros.vehiculo_id = id;

      }

      if (tipo === 'MAQUINARIA') {

        filtros.maquinaria_id = id;

      }

    }


    if (this.operadorSeleccionado) {

      filtros.usuario_id =
        Number(this.operadorSeleccionado);

    }


    return filtros;

  }


  // ==========================================================
  // CONSTRUIR FILTROS DESDE RESULTADOS
  // ==========================================================

  construirFiltros(): void {

    const activosMap =
      new Map<string, FiltroActivo>();

    const operadoresMap =
      new Map<number, FiltroOperador>();


    this.controles.forEach(
      (control) => {

        // ----------------------------------------------------
        // ACTIVO
        // ----------------------------------------------------

        if (
          control.tipo_activo &&
          control.activo_id &&
          control.activo_nombre
        ) {

          const key =
            `${control.tipo_activo}-${control.activo_id}`;

          if (!activosMap.has(key)) {

            activosMap.set(
              key,
              {
                tipo:
                  control.tipo_activo,

                id:
                  control.activo_id,

                nombre:
                  control.activo_nombre
              }
            );

          }

        }


        // ----------------------------------------------------
        // OPERADOR
        // ----------------------------------------------------

        if (
          control.usuario_id &&
          control.usuario
        ) {

          if (
            !operadoresMap.has(
              control.usuario_id
            )
          ) {

            operadoresMap.set(
              control.usuario_id,
              {
                id:
                  control.usuario_id,

                nombre:
                  control.usuario
              }
            );

          }

        }

      }
    );


    this.activos =
      Array.from(
        activosMap.values()
      ).sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
      );


    this.operadores =
      Array.from(
        operadoresMap.values()
      ).sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
      );

  }


  // ==========================================================
  // APLICAR FILTROS
  // ==========================================================

  aplicarFiltros(): void {

    this.cargarControles();

  }


  // ==========================================================
  // LIMPIAR FILTROS
  // ==========================================================

  limpiarFiltros(): void {

    this.mes = '';

    this.anio = '';

    this.fechaDesde = '';

    this.fechaHasta = '';

    this.activoSeleccionado = '';

    this.operadorSeleccionado = '';

    this.estadoSeleccionado = '';

    this.cargarControles();

  }


  // ==========================================================
  // MODAL
  // ==========================================================

  abrirDetalle(
    control: ControlDiario
  ): void {

    this.controlSeleccionado =
      control;

    this.observacionValidacion =
      control.observacion_validacion || '';

    this.motivoRechazo = '';

    this.mostrarRechazo = false;

    this.mostrarModal = true;

    document.body.style.overflow =
      'hidden';

  }


  cerrarDetalle(): void {

    this.mostrarModal = false;

    this.mostrarRechazo = false;

    this.controlSeleccionado =
      null;

    this.observacionValidacion =
      '';

    this.motivoRechazo = '';

    document.body.style.overflow =
      '';

  }


  // ==========================================================
  // URL EVIDENCIA
  // ==========================================================

  obtenerUrlArchivo(
    control: ControlDiario
  ): string {

    if (!control?.archivo_path) {

      return '';

    }

    return (
      `${this.apiUrl}/uploads/` +
      `${control.archivo_path}`
    );

  }


  // ==========================================================
  // TIPO DE ARCHIVO
  // ==========================================================

  esImagen(
    control: ControlDiario
  ): boolean {

    const tipo =
      (
        control?.archivo_tipo ||
        ''
      ).toLowerCase();

    return [
      'jpg',
      'jpeg',
      'png',
      'webp'
    ].includes(tipo);

  }


  esPdf(
    control: ControlDiario
  ): boolean {

    return (
      (
        control?.archivo_tipo ||
        ''
      ).toLowerCase() === 'pdf'
    );

  }


  // ==========================================================
  // ESTADO
  // ==========================================================

  obtenerClaseEstado(
    estado: string
  ): string {

    switch (
      (estado || '').toUpperCase()
    ) {

      case 'VALIDADO':
        return 'estado-validado';

      case 'RECHAZADO':
        return 'estado-rechazado';

      case 'PENDIENTE':
        return 'estado-pendiente';

      default:
        return '';

    }

  }


  // ==========================================================
  // CONTADORES
  // ==========================================================

  get totalControles(): number {

    return this.controles.length;

  }


  get totalPendientes(): number {

    return this.controles.filter(
      c =>
        c.estado === 'PENDIENTE'
    ).length;

  }


  get totalValidados(): number {

    return this.controles.filter(
      c =>
        c.estado === 'VALIDADO'
    ).length;

  }


  get totalRechazados(): number {

    return this.controles.filter(
      c =>
        c.estado === 'RECHAZADO'
    ).length;

  }


  get totalVehiculos(): number {

    return this.controles.filter(
      c =>
        c.tipo_activo === 'VEHICULO'
    ).length;

  }


  get totalMaquinarias(): number {

    return this.controles.filter(
      c =>
        c.tipo_activo === 'MAQUINARIA'
    ).length;

  }


  // ==========================================================
  // VALIDAR
  // ==========================================================

  validarControl(): void {

    if (
      !this.controlSeleccionado
    ) {

      return;

    }

    if (
      this.procesandoValidacion
    ) {

      return;

    }

    this.procesandoValidacion =
      true;

    this.error = '';

    this.controlDiarioService
      .validarControl(
        this.controlSeleccionado.id,
        this.observacionValidacion
      )
      .subscribe({

        next: (respuesta: any) => {

          console.log(
            'CONTROL VALIDADO:',
            respuesta
          );

          this.procesandoValidacion =
            false;

          this.mensaje =
            'Control validado correctamente.';

          this.actualizarControlLocal(
            respuesta?.control
          );

          this.cerrarDetalle();

        },

        error: (error) => {

          console.error(
            'Error validando control:',
            error
          );

          this.procesandoValidacion =
            false;

          this.error =
            error?.error?.error ||
            'No fue posible validar el control.';

        }

      });

  }


  // ==========================================================
  // ABRIR RECHAZO
  // ==========================================================

  abrirRechazo(): void {

    this.mostrarRechazo = true;

    this.motivoRechazo = '';

  }


  // ==========================================================
  // CANCELAR RECHAZO
  // ==========================================================

  cancelarRechazo(): void {

    this.mostrarRechazo = false;

    this.motivoRechazo = '';

  }


  // ==========================================================
  // RECHAZAR
  // ==========================================================

  rechazarControl(): void {

    if (
      !this.controlSeleccionado
    ) {

      return;

    }

    const motivo =
      this.motivoRechazo.trim();

    if (!motivo) {

      this.error =
        'Debe indicar el motivo del rechazo.';

      return;

    }

    if (
      this.procesandoRechazo
    ) {

      return;

    }

    this.procesandoRechazo =
      true;

    this.error = '';

    this.controlDiarioService
      .rechazarControl(
        this.controlSeleccionado.id,
        motivo
      )
      .subscribe({

        next: (respuesta: any) => {

          console.log(
            'CONTROL RECHAZADO:',
            respuesta
          );

          this.procesandoRechazo =
            false;

          this.mensaje =
            'Control rechazado correctamente.';

          this.actualizarControlLocal(
            respuesta?.control
          );

          this.cerrarDetalle();

        },

        error: (error) => {

          console.error(
            'Error rechazando control:',
            error
          );

          this.procesandoRechazo =
            false;

          this.error =
            error?.error?.error ||
            'No fue posible rechazar el control.';

        }

      });

  }


  // ==========================================================
  // ACTUALIZAR REGISTRO LOCAL
  // ==========================================================

  actualizarControlLocal(
    controlActualizado: ControlDiario | undefined
  ): void {

    if (!controlActualizado) {

      this.cargarControles();

      return;

    }

    const index =
      this.controles.findIndex(
        c =>
          c.id ===
          controlActualizado.id
      );

    if (index !== -1) {

      this.controles[index] =
        controlActualizado;

    }

    this.controlesFiltrados =
      [...this.controles];

  }


  // ==========================================================
  // DESCARGAR EXCEL
  // ==========================================================

  descargarExcel(): void {

    if (
      this.descargandoExcel
    ) {

      return;

    }

    this.descargandoExcel =
      true;

    this.error = '';

    const filtros =
      this.obtenerFiltros();

    this.controlDiarioService
      .descargarExcel(filtros)
      .subscribe({

        next: (blob: Blob) => {

          const url =
            window.URL.createObjectURL(
              blob
            );

          const enlace =
            document.createElement(
              'a'
            );

          enlace.href = url;

          enlace.download =
            this.obtenerNombreExcel();

          enlace.click();

          window.URL.revokeObjectURL(
            url
          );

          this.descargandoExcel =
            false;

        },

        error: async (error) => {

          console.error(
            'Error descargando Excel:',
            error
          );

          this.descargandoExcel =
            false;

          this.error =
            'No fue posible generar el Excel.';

        }

      });

  }


  // ==========================================================
  // NOMBRE EXCEL
  // ==========================================================

  obtenerNombreExcel(): string {

    if (
      this.mes &&
      this.anio
    ) {

      return (
        `CONTROL_DIARIO_` +
        `${this.anio}_` +
        `${String(this.mes).padStart(2, '0')}` +
        `.xlsx`
      );

    }

    if (this.anio) {

      return (
        `CONTROL_DIARIO_${this.anio}.xlsx`
      );

    }

    return (
      'CONTROL_DIARIO_CONSOLIDADO.xlsx'
    );

  }


  // ==========================================================
  // TRACKBY
  // ==========================================================

  trackById(
    index: number,
    item: any
  ): number {

    return item.id;

  }

}