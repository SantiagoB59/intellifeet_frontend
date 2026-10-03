import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ControlDiarioService,
  ActivoControl,
  ControlDiario,
  RespuestaControles
} from '../../services/control-diario.service';


@Component({
  selector: 'app-control-diario',
  templateUrl: './control-diario.component.html',
  styleUrls: ['./control-diario.component.scss']
})
export class ControlDiarioComponent implements OnInit {

  // ============================================================
  // DATOS
  // ============================================================

  activos: ActivoControl[] = [];

  controles: ControlDiario[] = [];


  // ============================================================
  // FORMULARIO
  // ============================================================

  fecha: string = '';

  activoSeleccionado: string = '';

  archivo: File | null = null;

  observaciones: string = '';


  // ============================================================
  // ESTADOS
  // ============================================================

  cargando: boolean = false;

  cargandoControles: boolean = false;

  mensaje: string = '';

  error: string = '';

  @ViewChild('videoCamara')
  videoCamara?: ElementRef<HTMLVideoElement>;

  mostrarCamara: boolean = false;

  private streamCamara: MediaStream | null = null;
  fotoPreview: string | null = null;
  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private controlDiarioService: ControlDiarioService
  ) { }


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.fecha =
      this.obtenerFechaActual();

    this.cargarActivos();

    this.cargarControles();
  }


  // ============================================================
  // FECHA ACTUAL
  // ============================================================

  private obtenerFechaActual(): string {

    const ahora = new Date();

    const year =
      ahora.getFullYear();

    const month =
      String(
        ahora.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        ahora.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  // ============================================================
  // CARGAR ACTIVOS DEL OPERADOR
  // ============================================================

  cargarActivos(): void {

    this.controlDiarioService
      .obtenerMisActivos()
      .subscribe({

        next: (data) => {

          console.log(
            'ACTIVOS DEL OPERADOR:',
            data
          );

          const activos: ActivoControl[] = [];

          // ========================================================
          // VEHÍCULOS
          // ========================================================

          if (
            Array.isArray(data?.vehiculos)
          ) {

            data.vehiculos.forEach(
              (vehiculo: any) => {

                activos.push({

                  tipo: 'VEHICULO',

                  id: vehiculo.id,

                  nombre:
                    vehiculo.placa ||
                    vehiculo.nombre ||
                    `Vehículo ${vehiculo.id}`,

                  placa:
                    vehiculo.placa

                });

              }
            );
          }


          // ========================================================
          // MAQUINARIA
          // ========================================================

          if (
            Array.isArray(data?.maquinarias)
          ) {

            data.maquinarias.forEach(
              (maquinaria: any) => {

                activos.push({

                  tipo: 'MAQUINARIA',

                  id: maquinaria.id,

                  nombre:
                    maquinaria.codigo ||
                    maquinaria.nombre ||
                    `Maquinaria ${maquinaria.id}`,

                  codigo:
                    maquinaria.codigo

                });

              }
            );
          }


          // ========================================================
          // GUARDAR ACTIVOS
          // ========================================================

          this.activos = activos;


          console.log(
            'ACTIVOS NORMALIZADOS PARA EL SELECT:',
            this.activos
          );

        },


        error: (error) => {

          console.error(
            'Error cargando activos:',
            error
          );

          this.activos = [];

          this.error =
            error?.error?.error ||
            'No fue posible cargar los activos asignados.';
        }

      });
  }

  // ============================================================
  // SELECCIONAR ARCHIVO
  // ============================================================

  seleccionarArchivo(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.archivo =
        input.files[0];

    } else {

      this.archivo = null;
    }
  }


  // ============================================================
  // CARGAR CONTROL
  // ============================================================

  cargarControl(): void {

    this.mensaje = '';

    this.error = '';


    // ----------------------------------------------------------
    // VALIDAR FECHA
    // ----------------------------------------------------------

    if (!this.fecha) {

      this.error =
        'Seleccione la fecha del control.';

      return;
    }


    // ----------------------------------------------------------
    // VALIDAR ACTIVO
    // ----------------------------------------------------------

    if (!this.activoSeleccionado) {

      this.error =
        'Seleccione el vehículo o maquinaria.';

      return;
    }


    // ----------------------------------------------------------
    // VALIDAR ARCHIVO
    // ----------------------------------------------------------

    if (!this.archivo) {

      this.error =
        'Seleccione la evidencia que desea cargar.';

      return;
    }


    // ----------------------------------------------------------
    // BUSCAR ACTIVO
    // ----------------------------------------------------------

    const activo =
      this.activos.find(
        item =>
          `${item.tipo}-${item.id}` ===
          this.activoSeleccionado
      );


    if (!activo) {

      this.error =
        'El activo seleccionado no es válido.';

      return;
    }


    // ----------------------------------------------------------
    // IDs
    // ----------------------------------------------------------

    let vehiculoId:
      number | null = null;

    let maquinariaId:
      number | null = null;


    if (
      activo.tipo === 'VEHICULO'
    ) {

      vehiculoId =
        activo.id;

    } else if (
      activo.tipo === 'MAQUINARIA'
    ) {

      maquinariaId =
        activo.id;
    }


    // ----------------------------------------------------------
    // CARGANDO
    // ----------------------------------------------------------

    this.cargando = true;


    // ----------------------------------------------------------
    // ENVIAR
    // ----------------------------------------------------------

    this.controlDiarioService
      .crearControl(
        this.fecha,
        vehiculoId,
        maquinariaId,
        this.archivo,
        this.observaciones
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Control creado:',
            respuesta
          );


          this.mensaje =
            'Control cargado correctamente.';


          // ----------------------------------------------------
          // LIMPIAR FORMULARIO
          // ----------------------------------------------------

          this.archivo = null;

          this.activoSeleccionado = '';

          this.observaciones = '';


          // ----------------------------------------------------
          // FINALIZAR CARGA
          // ----------------------------------------------------

          this.cargando = false;


          // ----------------------------------------------------
          // ACTUALIZAR HISTORIAL
          // ----------------------------------------------------

          this.cargarControles();
        },


        error: (error) => {

          console.error(
            'Error cargando control:',
            error
          );


          this.error =
            error?.error?.error ||
            'No fue posible cargar el control.';


          this.cargando = false;
        }

      });
  }


  // ============================================================
  // CARGAR HISTORIAL
  // ============================================================

  cargarControles(): void {

    this.cargandoControles = true;


    this.controlDiarioService
      .obtenerMisControles()
      .subscribe({

        next: (
          data:
            | ControlDiario[]
            | RespuestaControles
        ) => {

          console.log(
            'RESPUESTA MIS CONTROLES:',
            data
          );


          // ----------------------------------------------------
          // CASO 1
          //
          // Backend devuelve directamente:
          //
          // [
          //   {...},
          //   {...}
          // ]
          // ----------------------------------------------------

          if (Array.isArray(data)) {

            this.controles =
              data;

          }


          // ----------------------------------------------------
          // CASO 2
          //
          // Backend devuelve:
          //
          // {
          //   total: 10,
          //   controles: [...]
          // }
          // ----------------------------------------------------

          else {

            this.controles =
              Array.isArray(data.controles)
                ? data.controles
                : [];
          }


          // ----------------------------------------------------
          // SEGURIDAD
          // ----------------------------------------------------

          if (!Array.isArray(this.controles)) {

            this.controles = [];
          }


          console.log(
            'CONTROLES PARA EL HTML:',
            this.controles
          );


          this.cargandoControles = false;
        },


        error: (error) => {

          console.error(
            'Error cargando controles:',
            error
          );


          this.controles = [];


          this.cargandoControles = false;
        }

      });
  }


  // ============================================================
  // URL DEL ARCHIVO
  // ============================================================

  obtenerUrlArchivo(
    control: ControlDiario
  ): string {

    return (
      `${this.controlDiarioService['apiUrl']}`
        .replace('/api/control-diario', '')
      + `/uploads/${control.archivo_path}`
    );
  }


  // ============================================================
  // DETERMINAR SI ES PDF
  // ============================================================

  esPdf(
    control: ControlDiario
  ): boolean {

    return (
      control.archivo_tipo
        ?.toLowerCase() === 'pdf'
    );
  }


  // ============================================================
  // CLASE DEL ESTADO
  // ============================================================

  obtenerClaseEstado(
    estado: string
  ): string {

    switch (estado) {

      case 'VALIDADO':

        return 'estado-validado';


      case 'RECHAZADO':

        return 'estado-rechazado';


      case 'PENDIENTE':

      default:

        return 'estado-pendiente';
    }
  }



  async abrirCamara(): Promise<void> {

    this.error = '';

    try {

      this.mostrarCamara = true;

      this.streamCamara =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: 'environment'
            }
          },
          audio: false
        });

      // Esperar a que Angular renderice el video
      setTimeout(() => {

        if (this.videoCamara) {

          const video =
            this.videoCamara.nativeElement;

          video.srcObject =
            this.streamCamara;

          video.play().catch(
            error => {
              console.error(
                'Error reproduciendo cámara:',
                error
              );
            }
          );
        }

      }, 100);

    } catch (error) {

      console.error(
        'Error accediendo a la cámara:',
        error
      );

      this.mostrarCamara = false;

      this.error =
        'No fue posible acceder a la cámara. Verifique los permisos del navegador.';
    }
  }

  tomarFoto(): void {

    if (!this.videoCamara) {

      this.error =
        'La cámara todavía no está disponible.';

      return;
    }

    const video =
      this.videoCamara.nativeElement;

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {

      this.error =
        'La cámara todavía no está lista.';

      return;
    }

    const canvas =
      document.createElement('canvas');

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const contexto =
      canvas.getContext('2d');

    if (!contexto) {

      this.error =
        'No fue posible procesar la fotografía.';

      return;
    }

    contexto.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {

        if (!blob) {

          this.error =
            'No fue posible generar la fotografía.';

          return;
        }

        const nombre =
          `control-diario-${Date.now()}.jpg`;

        this.archivo =
          new File(
            [blob],
            nombre,
            {
              type: 'image/jpeg'
            }
          );

        // ========================================================
        // PREVISUALIZACIÓN
        // ========================================================

        if (this.fotoPreview) {

          URL.revokeObjectURL(
            this.fotoPreview
          );
        }

        this.fotoPreview =
          URL.createObjectURL(blob);


        // ========================================================
        // CERRAR CÁMARA
        // ========================================================

        this.cerrarCamara();

      },
      'image/jpeg',
      0.9
    );
  }

  cerrarCamara(): void {

    if (this.streamCamara) {

      this.streamCamara
        .getTracks()
        .forEach(
          track => track.stop()
        );

      this.streamCamara = null;
    }


    if (this.videoCamara) {

      this.videoCamara.nativeElement.srcObject =
        null;
    }


    this.mostrarCamara = false;
  }

  eliminarFoto(): void {

    this.archivo = null;

    if (this.fotoPreview) {

      URL.revokeObjectURL(
        this.fotoPreview
      );

      this.fotoPreview = null;
    }
  }
}