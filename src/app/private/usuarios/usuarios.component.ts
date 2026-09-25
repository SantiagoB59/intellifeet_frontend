import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UsuarioDocumentoService } from 'src/app/services/usuario-documento.service';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  Math = Math;
  cargando = false;

  guardando = false;

  eliminando = false;

  cargandoDocumentos = false;

  mostrarModal = false;

  mostrarEliminar = false;

  mensajeVisible = false;

  mensaje = '';

  editando = false;

  usuarios: any[] = [];

  roles: any[] = [];

  tiposOperador: any[] = [];

  documentos: any[] = [];

  registroEliminar: any = null;

  form: any = {
    id: null,
    nombre: '',
    username: '',
    email: '',
    telefono: '',
    password: '',
    rol: '',
    activo: true,
    tipo_operador_id: null
  };


  constructor(
    private usuarioService: UsuarioService,
    private usuarioDocumentoService: UsuarioDocumentoService
  ) { }


  ngOnInit(): void {

    this.cargarDatos();

    this.cargarTiposOperador();

  }


  // =====================================================
  // CARGAR USUARIOS
  // =====================================================

  cargarDatos(): void {

    this.cargando = true;

    this.usuarioService

      .listar()

      .pipe(
        finalize(() => this.cargando = false)
      )

      .subscribe({

        next: (resp: any) => {

          this.usuarios =
            resp.data?.usuarios || [];

          this.roles =
            resp.data?.roles || [];

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ??
            'No fue posible cargar la información.'
          );

        }

      });

  }


  // =====================================================
  // CARGAR TIPOS DE OPERADOR
  // =====================================================

  cargarTiposOperador(): void {

    this.usuarioService
      .listarTiposOperador()
      .subscribe({

        next: (resp: any) => {

          this.tiposOperador =
            resp.data || [];

        },

        error: (err) => {

          console.error(
            'ERROR CARGANDO TIPOS DE OPERADOR',
            err
          );

        }

      });

  }


  // =====================================================
  // NUEVO
  // =====================================================

  nuevo(): void {

    this.editando = false;

    this.documentos = [];

    this.mostrarModal = true;

    this.form = {

      id: null,

      nombre: '',

      username: '',

      email: '',

      telefono: '',

      password: '',

      rol: '',

      activo: true,

      tipo_operador_id: null

    };

  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(usuario: any): void {

    this.editando = true;

    this.mostrarModal = true;

    this.form = {

      id: usuario.id,

      nombre: usuario.nombre,

      username: usuario.username,

      email: usuario.email,

      telefono: usuario.telefono,

      password: '',

      rol: usuario.rol,

      activo: usuario.activo,

      tipo_operador_id:
        usuario.tipo_operador_id || null

    };


    // ==========================================
    // SI ES OPERADOR
    // CARGAR DOCUMENTOS
    // ==========================================

    if (this.esOperador()) {

      this.cargarDocumentos(
        usuario.id
      );

    }

  }


  // =====================================================
  // ES OPERADOR
  // =====================================================

  esOperador(): boolean {

    return (
      this.form.rol === 'operador'
    );

  }


  // =====================================================
  // CAMBIO DE ROL
  // =====================================================

  cambioRol(): void {

    // Si deja de ser operador
    // limpiamos el tipo visualmente

    if (!this.esOperador()) {

      this.form.tipo_operador_id = null;

      this.documentos = [];

    }

  }


  // =====================================================
  // CARGAR DOCUMENTOS
  // =====================================================

  cargarDocumentos(
    usuarioId: number
  ): void {

    this.cargandoDocumentos = true;

    this.usuarioDocumentoService

      .listarDocumentos(usuarioId)

      .pipe(
        finalize(() => {
          this.cargandoDocumentos = false;
        })
      )

      .subscribe({

        next: (resp: any) => {

          console.log(
            'DOCUMENTOS DEL OPERADOR',
            resp
          );

          this.documentos =
            resp.data?.documentos || [];

          // Actualizar tipo operador
          if (
            resp.data?.usuario?.tipo_operador_id
          ) {

            this.form.tipo_operador_id =
              resp.data.usuario.tipo_operador_id;

          }

        },

        error: (err) => {

          console.error(
            'ERROR CARGANDO DOCUMENTOS',
            err
          );

        }

      });

  }


  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    // ==========================================
    // VALIDAR TIPO OPERADOR
    // ==========================================

    if (
      this.esOperador() &&
      !this.form.tipo_operador_id
    ) {

      alert(
        'Debe seleccionar el tipo de operador.'
      );

      return;

    }


    this.guardando = true;


    const peticion = this.editando

      ? this.usuarioService.actualizar(

        this.form.id,

        this.form

      )

      : this.usuarioService.crear(

        this.form

      );


    peticion

      .pipe(

        finalize(() => {

          this.guardando = false;

        })

      )

      .subscribe({

        next: (resp: any) => {

          // ==========================================
          // SI ES EDICIÓN Y ES OPERADOR
          // GUARDAR DOCUMENTOS
          // ==========================================

          if (
            this.editando &&
            this.esOperador()
          ) {

            this.guardarDocumentos();

          } else {

            this.finalizarGuardado(
              resp.message ??
              'Usuario guardado correctamente.'
            );

          }

        },

        error: (err) => {

          console.error(err);

          alert(

            err.error?.message ??

            'No fue posible guardar.'

          );

        }

      });

  }


  // =====================================================
  // GUARDAR DOCUMENTOS
  // =====================================================

  guardarDocumentos(): void {

    if (!this.documentos.length) {

      this.finalizarGuardado(
        'Usuario actualizado correctamente.'
      );

      return;

    }


    this.cargandoDocumentos = true;


    let pendientes =
      this.documentos.length;

    let huboError = false;


    this.documentos.forEach(
      (documento: any) => {

        const data = {

          fecha_vencimiento:
            documento.fecha_vencimiento || null,

          archivo_url:
            documento.archivo_url || null,

          activo:
            documento.activo !== false

        };


        this.usuarioDocumentoService

          .actualizarDocumento(
            documento.id,
            data
          )

          .subscribe({

            next: () => {

              pendientes--;

              if (pendientes === 0) {

                this.cargandoDocumentos = false;

                this.finalizarGuardado(
                  'Usuario y documentos actualizados correctamente.'
                );

              }

            },

            error: (err) => {

              console.error(
                'ERROR ACTUALIZANDO DOCUMENTO',
                err
              );

              huboError = true;

              pendientes--;

              if (pendientes === 0) {

                this.cargandoDocumentos = false;

                if (huboError) {

                  this.finalizarGuardado(
                    'Usuario actualizado, pero algunos documentos no pudieron guardarse.'
                  );

                } else {

                  this.finalizarGuardado(
                    'Usuario y documentos actualizados correctamente.'
                  );

                }

              }

            }

          });

      }

    );

  }


  // =====================================================
  // FINALIZAR GUARDADO
  // =====================================================

  finalizarGuardado(
    mensaje: string
  ): void {

    this.cerrarModal();

    this.cargarDatos();

    this.mostrarMensaje(
      mensaje
    );

  }


  // =====================================================
  // ESTADO DOCUMENTO
  // =====================================================

  obtenerEstadoDocumento(
    documento: any
  ): string {

    if (
      !documento.fecha_vencimiento
    ) {

      return 'SIN FECHA';

    }


    const hoy =
      new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );


    const vencimiento =
      new Date(
        documento.fecha_vencimiento +
        'T00:00:00'
      );


    const diferencia =
      vencimiento.getTime() -
      hoy.getTime();


    const dias =
      Math.ceil(
        diferencia /
        (1000 * 60 * 60 * 24)
      );


    if (dias < 0) {

      return 'VENCIDO';

    }


    if (dias === 0) {

      return 'VENCE HOY';

    }


    if (dias <= 15) {

      return 'POR VENCER';

    }


    return 'VIGENTE';

  }


  // =====================================================
  // DÍAS RESTANTES
  // =====================================================

  obtenerDiasDocumento(
    documento: any
  ): number | null {

    if (
      !documento.fecha_vencimiento
    ) {

      return null;

    }


    const hoy =
      new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );


    const vencimiento =
      new Date(
        documento.fecha_vencimiento +
        'T00:00:00'
      );


    return Math.ceil(

      (
        vencimiento.getTime() -
        hoy.getTime()
      ) /

      (1000 * 60 * 60 * 24)

    );

  }


  // =====================================================
  // CLASE DOCUMENTO
  // =====================================================

  claseDocumento(
    documento: any
  ): string {

    switch (
    this.obtenerEstadoDocumento(documento)
    ) {

      case 'VIGENTE':

        return 'bg-green-100 text-green-700';


      case 'POR VENCER':

      case 'VENCE HOY':

        return 'bg-yellow-100 text-yellow-700';


      case 'VENCIDO':

        return 'bg-red-100 text-red-700';


      default:

        return 'bg-slate-100 text-slate-600';

    }

  }


  // =====================================================
  // ICONO DOCUMENTO
  // =====================================================

  iconoDocumento(
    nombre: string
  ): string {

    if (
      nombre?.includes('LICENCIA')
    ) {

      return 'fa-id-card';

    }


    if (
      nombre?.includes('MEDICO')
    ) {

      return 'fa-user-doctor';

    }


    if (
      nombre?.includes('MANEJO')
    ) {

      return 'fa-car';

    }


    return 'fa-file-alt';

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(usuario: any): void {

    this.registroEliminar =
      usuario;

    this.mostrarEliminar =
      true;

  }


  confirmarEliminar(): void {

    if (
      !this.registroEliminar
    ) {

      return;

    }


    this.eliminando =
      true;


    this.usuarioService

      .eliminar(
        this.registroEliminar.id
      )

      .pipe(

        finalize(() => {

          this.eliminando =
            false;

        })

      )

      .subscribe({

        next: (resp: any) => {

          this.mostrarEliminar =
            false;

          this.registroEliminar =
            null;

          this.cargarDatos();

          this.mostrarMensaje(

            resp.message ??
            'Usuario desactivado correctamente.'

          );

        },

        error: (err) => {

          console.error(err);

          alert(

            err.error?.message ??

            'No fue posible eliminar.'

          );

        }

      });

  }


  // =====================================================
  // CERRAR MODAL
  // =====================================================

  cerrarModal(): void {

    this.mostrarModal =
      false;

    this.documentos = [];

  }


  // =====================================================
  // MENSAJE
  // =====================================================

  mostrarMensaje(
    texto: string
  ): void {

    this.mensaje =
      texto;

    this.mensajeVisible =
      true;


    setTimeout(() => {

      this.mensajeVisible =
        false;

    }, 2500);

  }



  cambioTipoOperador(): void {

    const tipoOperadorId =
      this.form.tipo_operador_id;

    // Limpiar documentos anteriores
    this.documentos = [];

    if (!tipoOperadorId) {
      return;
    }

    this.cargandoDocumentos = true;

    this.usuarioService
      .listarDocumentosTipoOperador(
        tipoOperadorId
      )
      .pipe(
        finalize(() => {
          this.cargandoDocumentos = false;
        })
      )
      .subscribe({

        next: (resp: any) => {

          const documentos =
            resp.data?.documentos || [];

          this.documentos =
            documentos.map(
              (documento: any) => ({

                id: null,

                documento_tipo_id:
                  documento.documento_tipo_id,

                documento:
                  documento.nombre,

                obligatorio:
                  documento.obligatorio,

                fecha_vencimiento:
                  null,

                archivo_url:
                  null,

                activo:
                  true

              })
            );

        },

        error: (err) => {

          console.error(
            'ERROR CARGANDO DOCUMENTOS',
            err
          );

          this.documentos = [];

          alert(
            err.error?.message ??
            'No fue posible cargar los documentos.'
          );

        }
      }

    );

  }


}