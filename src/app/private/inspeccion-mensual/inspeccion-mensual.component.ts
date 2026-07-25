import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { VehiculoService } from '../../services/vehiculo.service';
import { MaquinariaService } from '../../services/maquinaria.service';
import { InspeccionMensualService } from 'src/app/services/inspeccion-mensual.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-inspeccion-mensual',
  templateUrl: './inspeccion-mensual.component.html',
  styleUrls: ['./inspeccion-mensual.component.scss']
})
export class InspeccionMensualComponent implements OnInit {

  //=====================================
  // PARAMETROS
  //=====================================

  tipo!: 'vehiculo' | 'maquinaria';

  entityId!: number;

  //=====================================
  // DATA
  //=====================================

  equipo: any = null;

  inspecciones: any[] = [];

  loading = false;

  //=====================================
  // MODAL
  //=====================================

  showModal = false;

  //=====================================
  // FORM
  //=====================================

  fecha = '';

  observaciones = '';

  archivo!: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: InspeccionMensualService,
    private vehiculoService: VehiculoService,
    private maquinariaService: MaquinariaService
  ) { }

  ngOnInit(): void {

    this.tipo = this.route.snapshot.paramMap.get(
      'tipo'
    ) as 'vehiculo' | 'maquinaria';

    this.entityId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.entityId) {

      this.router.navigate(['/dashboard/flota']);

      return;
    }

    this.cargarEquipo();

    this.cargarInspecciones();

  }

  //=====================================
  // CARGAR EQUIPO
  //=====================================

  cargarEquipo(): void {

    if (this.tipo === 'vehiculo') {

      this.vehiculoService
        .obtenerPorId(this.entityId)
        .subscribe(res => this.equipo = res);

    } else {

      this.maquinariaService
        .getById(this.entityId)
        .subscribe(res => this.equipo = res);

    }

  }

  //=====================================
  // LISTAR
  //=====================================

  cargarInspecciones(): void {

    this.loading = true;

    if (this.tipo === 'vehiculo') {

      this.service
        .listarVehiculo(this.entityId)
        .subscribe({

          next: (res: any) => {

            this.inspecciones = res;

            this.loading = false;

          },

          error: () => {

            this.loading = false;

          }

        });

    } else {

      this.service
        .listarMaquinaria(this.entityId)
        .subscribe({

          next: (res: any) => {

            this.inspecciones = res;

            this.loading = false;

          },

          error: () => {

            this.loading = false;

          }

        });

    }

  }

  //=====================================
  // MODAL
  //=====================================

  abrirModal(): void {

    this.fecha = new Date().toISOString().substring(0, 10);

    this.observaciones = '';

    this.archivo = undefined!;

    this.showModal = true;

  }

  cerrarModal(): void {

    this.showModal = false;

  }

  //=====================================
  // ARCHIVO
  //=====================================

  seleccionarArchivo(event: any): void {

    if (event.target.files.length) {

      this.archivo = event.target.files[0];

    }

  }

  //=====================================
  // GUARDAR
  //=====================================

  guardar(): void {

    if (!this.archivo) {

      Swal.fire(
        'Archivo requerido',
        'Seleccione un archivo.',
        'warning'
      );

      return;

    }

    const form = new FormData();

    form.append('fecha', this.fecha);

    form.append('observaciones', this.observaciones);

    form.append('archivo', this.archivo);

    const request = this.tipo === 'vehiculo'

      ? this.service.crearVehiculo(this.entityId, form)

      : this.service.crearMaquinaria(this.entityId, form);

    request.subscribe({

      next: () => {

        Swal.fire(
          'Correcto',
          'Inspección registrada.',
          'success'
        );

        this.cerrarModal();

        this.cargarInspecciones();

      },

      error: () => {

        Swal.fire(
          'Error',
          'No fue posible guardar.',
          'error'
        );

      }

    });

  }

  //=====================================
// DESCARGAR ARCHIVO
//=====================================

descargar(item: any): void {

  this.service.descargar(item.id).subscribe({

    next: (blob: Blob) => {

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.download = item.archivo.split('/').pop() || 'inspeccion';

      link.click();

      window.URL.revokeObjectURL(url);

    },

    error: () => {

      Swal.fire(
        'Error',
        'No fue posible descargar el archivo.',
        'error'
      );

    }

  });

}
  //=====================================
  // VER ARCHIVO
  //=====================================

abrir(item: any): void {

  if (!item.archivo) {
    return;
  }

  const url = `${environment.apiUrl}/${item.archivo}`;

  console.log(url);

  window.open(url, '_blank');

}

  //=====================================
  // ELIMINAR
  //=====================================

  eliminar(id: number): void {

    Swal.fire({

      title: '¿Eliminar?',

      text: 'Esta acción no podrá deshacerse.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }

      this.service
        .eliminar(id)
        .subscribe({

          next: () => {

            Swal.fire(
              'Eliminado',
              '',
              'success'
            );

            this.cargarInspecciones();

          }

        });

    });

  }

  //=====================================
  // VOLVER
  //=====================================

  volver(): void {

    this.router.navigate([
      '/dashboard/flota'
    ]);

  }

}