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
  mostrarDocumentosOperadores = false;
  cargandoDocumentosOperadores = false;

  operadoresDocumentos: any[] = [];

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

      rol:
        typeof usuario.rol === 'object'
          ? usuario.rol?.nombre
          : usuario.rol,

      activo: usuario.activo,

      tipo_operador_id:
        usuario.tipo_operador_id || null
    };

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

    // =========================================================
    // VALIDAR TIPO DE OPERADOR
    // =========================================================

    if (this.esOperador() && !this.form.tipo_operador_id) {
      alert('Debe seleccionar el tipo de operador.');
      return;
    }

    this.guardando = true;

    // =========================================================
    // DATOS A ENVIAR
    // =========================================================

    const datos = {
      ...this.form,
      documentos: this.esOperador()
        ? this.documentos.map((documento: any) => ({
          documento_tipo_id: documento.documento_tipo_id,
          fecha_vencimiento: documento.fecha_vencimiento || null,
          archivo_url: documento.archivo_url || null,
          activo: documento.activo !== false
        }))
        : []
    };

    // =========================================================
    // CREAR / ACTUALIZAR
    // =========================================================

    const peticion = this.editando
      ? this.usuarioService.actualizar(this.form.id, datos)
      : this.usuarioService.crear(datos);

    peticion
      .pipe(
        finalize(() => {
          this.guardando = false;
        })
      )
      .subscribe({

        next: (resp: any) => {

          console.log('RESPUESTA USUARIO:', resp);

          // ===================================================
          // SI ESTAMOS EDITANDO
          // ===================================================

          if (this.editando) {

            if (
              this.esOperador() &&
              this.documentos.length > 0
            ) {
              this.guardarDocumentos();
              return;
            }

            this.finalizarGuardado(
              resp.message ?? 'Usuario actualizado correctamente.'
            );

            return;
          }

          // ===================================================
          // SI ESTAMOS CREANDO
          // ===================================================

          this.finalizarGuardado(
            resp.message ?? 'Usuario creado correctamente.'
          );
        },

        error: (err) => {

          console.error(
            'ERROR GUARDANDO USUARIO:',
            err
          );

          alert(
            err.error?.message ??
            'No fue posible guardar el usuario.'
          );
        }

      });
  }


  crearDocumentos(usuarioId: number): void {

    if (!this.documentos.length) {

      this.finalizarGuardado(
        'Usuario creado correctamente.'
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

          documento_tipo_id:
            documento.documento_tipo_id,

          fecha_vencimiento:
            documento.fecha_vencimiento || null,

          archivo_url:
            documento.archivo_url || null,

          activo:
            documento.activo !== false
        };

        this.usuarioDocumentoService
          .crearDocumento(
            usuarioId,
            data
          )
          .subscribe({

            next: (resp: any) => {

              console.log(
                'DOCUMENTO CREADO:',
                resp
              );

              pendientes--;

              if (pendientes === 0) {

                this.cargandoDocumentos =
                  false;

                this.finalizarGuardado(
                  huboError
                    ? 'Usuario creado, pero algunos documentos no pudieron guardarse.'
                    : 'Usuario y documentos creados correctamente.'
                );
              }
            },

            error: (err) => {

              console.error(
                'ERROR CREANDO DOCUMENTO:',
                err
              );

              huboError = true;

              pendientes--;

              if (pendientes === 0) {

                this.cargandoDocumentos =
                  false;

                this.finalizarGuardado(
                  'Usuario creado, pero algunos documentos no pudieron guardarse.'
                );
              }
            }
          });
      }
    );
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
  abrirDocumentosOperadores(): void {

    this.mostrarDocumentosOperadores = true;

    this.cargarDocumentosOperadores();

  }

  cargarDocumentosOperadores(): void {

    this.cargandoDocumentosOperadores = true;

    this.usuarioDocumentoService
      .listarOperadoresDocumentos()
      .pipe(
        finalize(() => {
          this.cargandoDocumentosOperadores = false;
        })
      )
      .subscribe({

        next: (resp: any) => {

          console.log(
            'DOCUMENTOS DE OPERADORES:',
            resp
          );

          this.operadoresDocumentos =
            resp.data || [];

        },

        error: (err) => {

          console.error(
            'ERROR CARGANDO DOCUMENTOS DE OPERADORES:',
            err
          );

          this.operadoresDocumentos = [];

          alert(
            err.error?.message ??
            'No fue posible cargar los documentos de los operadores.'
          );

        }

      });

  }
  cerrarDocumentosOperadores(): void {

    this.mostrarDocumentosOperadores = false;

  }

  diasRestantesDocumento(
    documento: any
  ): number | null {

    if (!documento?.fecha_vencimiento) {
      return null;
    }

    const hoy = new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );

    const vencimiento = new Date(
      documento.fecha_vencimiento + 'T00:00:00'
    );

    return Math.ceil(
      (
        vencimiento.getTime() -
        hoy.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );

  }


  obtenerDocumentoOperador(
  operador: any,
  documentoTipoId: number
): any {

  return operador.documentos?.find(
    (documento: any) =>
      documento.documento_tipo_id === documentoTipoId
  ) || null;

}

documentosControl(): any[] {

  const mapa = new Map<number, any>();

  this.operadoresDocumentos.forEach(
    (operador: any) => {

      (operador.documentos || []).forEach(
        (documento: any) => {

          if (
            !mapa.has(
              documento.documento_tipo_id
            )
          ) {

            mapa.set(
              documento.documento_tipo_id,
              {
                id: documento.documento_tipo_id,
                nombre: documento.documento
              }
            );

          }

        }
      );

    }
  );

  return Array.from(
    mapa.values()
  );

}


// =====================================================
// CALCULAR DÍAS RESTANTES
// =====================================================

obtenerDiasDocumento(documento: any): number | null {

  if (!documento?.fecha_vencimiento) {
    return null;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fecha = String(documento.fecha_vencimiento).substring(0, 10);

  const fechaVencimiento = new Date(`${fecha}T00:00:00`);
  fechaVencimiento.setHours(0, 0, 0, 0);

  const diferencia =
    fechaVencimiento.getTime() - hoy.getTime();

  return Math.ceil(
    diferencia / (1000 * 60 * 60 * 24)
  );
}


// =====================================================
// TEXTO DEL ESTADO
// =====================================================

textoDiasDocumento(documento: any): string {

  const dias = this.obtenerDiasDocumento(documento);

  if (dias === null) {
    return 'SIN FECHA';
  }

  if (dias < 0) {

    const vencido = Math.abs(dias);

    return `VENCIDO HACE ${vencido} ${
      vencido === 1 ? 'DÍA' : 'DÍAS'
    }`;
  }

  if (dias === 0) {
    return 'VENCE HOY';
  }

  return `${dias} ${
    dias === 1 ? 'DÍA' : 'DÍAS'
  }`;
}


// =====================================================
// CLASE DEL ESTADO
// =====================================================

claseEstadoDocumento(documento: any): string {

  const dias = this.obtenerDiasDocumento(documento);

  if (dias === null) {
    return 'estado-sin-fecha';
  }

  if (dias < 0) {
    return 'estado-rojo';
  }

  if (dias <= 15) {
    return 'estado-amarillo';
  }

  return 'estado-verde';
}


// =====================================================
// COLOR DE FONDO
// =====================================================

colorFondoDocumento(documento: any): string {

  const dias = this.obtenerDiasDocumento(documento);

  // SIN FECHA
  if (dias === null) {
    return '#f1f5f9';
  }

  // VENCIDO
  if (dias < 0) {
    return '#fee2e2';
  }

  // 0 - 15 DÍAS
  if (dias <= 15) {
    return '#fef3c7';
  }

  // MÁS DE 15 DÍAS
  return '#dcfce7';
}


// =====================================================
// COLOR DEL TEXTO
// =====================================================

colorTextoDocumento(documento: any): string {

  const dias = this.obtenerDiasDocumento(documento);

  // SIN FECHA
  if (dias === null) {
    return '#64748b';
  }

  // VENCIDO
  if (dias < 0) {
    return '#991b1b';
  }

  // 0 - 15 DÍAS
  if (dias <= 15) {
    return '#92400e';
  }

  // MÁS DE 15 DÍAS
  return '#166534';
}


// =====================================================
// COLOR DEL BORDE
// =====================================================

colorBordeDocumento(documento: any): string {

  const dias = this.obtenerDiasDocumento(documento);

  // SIN FECHA
  if (dias === null) {
    return '#cbd5e1';
  }

  // VENCIDO
  if (dias < 0) {
    return '#fca5a5';
  }

  // 0 - 15 DÍAS
  if (dias <= 15) {
    return '#fcd34d';
  }

  // MÁS DE 15 DÍAS
  return '#86efac';
}



}