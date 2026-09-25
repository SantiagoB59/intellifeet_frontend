import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { ActivoOperadorService }
  from 'src/app/services/activo-operador.service';

@Component({
  selector: 'app-activo-operador',
  templateUrl: './activo-operador.component.html',
  styleUrls: ['./activo-operador.component.scss'],

})
export class ActivoOperadorComponent
  implements OnInit {

  cargando = false;

  dialogo = false;

  guardando = false;

  editando = false;

  asignaciones: any[] = [];

  usuarios: any[] = [];

  vehiculos: any[] = [];

  maquinarias: any[] = [];

  tipoActivo = 'vehiculo';

  filtro = '';

  form: any = {

    id: null,

    usuario_id: null,

    vehiculo_id: null,

    maquinaria_id: null,

    observaciones: ''

  };
  mostrarModal = false;

  mostrarEliminar = false;

  mensajeVisible = false;

  mensaje = '';

  eliminando = false;

  registroEliminar: any = null;

  constructor(

    private activoOperadorService:
      ActivoOperadorService,
    private router: Router,


  ) { }

  ngOnInit(): void {

    this.cargarDatos();

  }

  // ==========================================
  // CARGAR
  // ==========================================

  cargarDatos(): void {

    this.cargando = true;

    this.activoOperadorService

      .listar()

      .pipe(

        finalize(() => {

          this.cargando = false;

        })

      )

      .subscribe({

        next: (resp: any) => {

          this.asignaciones =
            resp.data.asignaciones;

          this.usuarios =
            resp.data.usuarios;

          this.vehiculos =
            resp.data.vehiculos;

          this.maquinarias =
            resp.data.maquinarias;

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

  // ==========================================
  // NUEVO
  // ==========================================

  nuevo(): void {

    this.editando = false;

    this.mostrarModal = true;

    this.tipoActivo = 'vehiculo';

    this.form = {

      id: null,

      usuario_id: null,

      vehiculo_id: null,

      maquinaria_id: null,

      observaciones: ''

    };

  }
  // ==========================================
  // EDITAR
  // ==========================================

  editar(item: any): void {

    this.editando = true;

    this.mostrarModal = true;

    this.tipoActivo =
      item.vehiculo
        ? 'vehiculo'
        : 'maquinaria';

    this.form = {

      id: item.id,

      usuario_id: item.usuario.id,

      vehiculo_id: item.vehiculo?.id,

      maquinaria_id: item.maquinaria?.id,

      observaciones: item.observaciones

    };

  }

  seleccionarTipo(tipo: string): void {

    this.tipoActivo = tipo;

    this.form.vehiculo_id = null;

    this.form.maquinaria_id = null;

  }

  // ==========================================
  // CAMBIAR TIPO
  // ==========================================

  cambiarTipo(): void {

    this.form.vehiculo_id = null;

    this.form.maquinaria_id = null;

  }

  // ==========================================
  // GUARDAR
  // ==========================================


  guardar(): void {

  this.guardando = true;

  const peticion = this.editando

    ? this.activoOperadorService.actualizar(

        this.form.id,

        this.form

      )

    : this.activoOperadorService.crear(

        this.form

      );

  peticion

    .pipe(

      finalize(() => {

        this.guardando = false;

      })

    )

    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.cargarDatos();

        this.mostrarMensaje(

          this.editando

            ? 'Asignación actualizada correctamente.'

            : 'Asignación creada correctamente.'

        );

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
  // ==========================================
  // ELIMINAR
  // ==========================================

eliminar(item: any): void {

  this.registroEliminar = item;

  this.mostrarEliminar = true;

}

confirmarEliminar(): void {

  if (!this.registroEliminar) {

    return;

  }

  this.eliminando = true;

  this.activoOperadorService

    .eliminar(

      this.registroEliminar.id

    )

    .pipe(

      finalize(() => {

        this.eliminando = false;

      })

    )

    .subscribe({

      next: () => {

        this.mostrarEliminar = false;

        this.registroEliminar = null;

        this.cargarDatos();

        this.mostrarMensaje(

          'Asignación eliminada correctamente.'

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

cerrarModal(): void {

  this.mostrarModal = false;

}

mostrarMensaje(texto: string): void {

  this.mensaje = texto;

  this.mensajeVisible = true;

  setTimeout(() => {

    this.mensajeVisible = false;

  }, 3000);

}

  // ==========================================
  // CERRAR
  // ==========================================

  cerrarDialogo(): void {

    this.dialogo = false;

  }

}