import { Component, OnInit } from '@angular/core';

import { MantenimientoService } from 'src/app/services/mantenimiento.service';

@Component({
  selector: 'app-mantenimientos-maquinaria',
  templateUrl: './mantenimientos-maquinaria.component.html',
  styleUrls: ['./mantenimientos-maquinaria.component.scss']
})
export class MantenimientosMaquinariaComponent implements OnInit {

  // =========================
  // LISTADO
  // =========================
  mantenimientos: any[] = [];
  loading = false;

  // =========================
  // FILTROS
  // =========================
  maquinaria_id?: number;
  tipo?: string;
  desde?: string;
  hasta?: string;

  // =========================
  // MODAL
  // =========================
  showModal = false;

  // =========================
  // DATA
  // =========================
  maquinarias: any[] = [];
  planItems: any[] = [];

  busquedaMaquinaria = '';
  busquedaPlan = '';

  maquinariaSeleccionada: any = null;
  planSeleccionado: any = null;

  // =========================
  // ARCHIVO
  // =========================
  archivoSeleccionado: File | null = null;

  // =========================
  // NUEVO
  // =========================
  nuevo: any = {
    maquinaria_id: null,
    maquinaria_plan_item_id: null,

    fecha: '',

    horas: null,

    tipo: 'PR',

    proveedor: '',

    costo: null,

    lugar: '',

    responsable: '',

    observaciones: ''
  };

  constructor(
    private mantenimientoService: MantenimientoService
  ) { }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.cargarDatos();

  }

  // =========================
  // CARGAR DATOS
  // =========================
  // =========================
  // CARGAR LISTADO
  // =========================
  cargarDatos(): void {

    this.loading = true;

    this.mantenimientoService.listarMaquinaria({

      maquinaria_id: this.maquinaria_id,

      tipo: this.tipo,

      desde: this.desde,

      hasta: this.hasta

    }).subscribe({

      next: (res: any) => {

        this.mantenimientos = res || [];

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  // =========================
  // FILTROS
  // =========================
  filtrar(): void {

    this.cargarDatos();

  }

  limpiar(): void {

    this.maquinaria_id = undefined;

    this.tipo = undefined;

    this.desde = undefined;

    this.hasta = undefined;

    this.cargarDatos();

  }

  // =========================
  // ABRIR MODAL
  // =========================
  abrirModal(): void {

    this.showModal = true;

    this.busquedaMaquinaria = '';

    this.busquedaPlan = '';

    this.maquinariaSeleccionada = null;

    this.planSeleccionado = null;

    this.archivoSeleccionado = null;

    this.mantenimientoService.getMaquinarias().subscribe({

      next: (res: any) => {

        this.maquinarias = res || [];

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  // =========================
  // CERRAR MODAL
  // =========================
  cerrarModal(): void {

    this.showModal = false;

    this.archivoSeleccionado = null;

    this.planItems = [];

    this.maquinariaSeleccionada = null;

    this.planSeleccionado = null;

    this.busquedaMaquinaria = '';

    this.busquedaPlan = '';

    this.nuevo = {

      maquinaria_id: null,

      maquinaria_plan_item_id: null,

      fecha: '',

      horas: null,

      tipo: 'PR',

      proveedor: '',

      costo: null,

      lugar: '',

      responsable: '',

      observaciones: ''

    };

  }

  // =========================
  // BADGES
  // =========================
  getTipoClass(tipo: string): string {

    switch (tipo) {

      case 'PR':
        return 'badge-operativo';

      case 'CR':
        return 'badge-inactivo';

      case 'I':
        return 'badge-info';

      case 'C':
        return 'badge-taller';

      default:
        return 'badge-default';

    }

  }

  getTipoTexto(tipo: string): string {

    switch (tipo) {

      case 'PR':
        return 'Preventivo';

      case 'CR':
        return 'Correctivo';

      case 'I':
        return 'Inspección';

      case 'C':
        return 'Cambio';

      default:
        return tipo;

    }

  }


  // =========================
  // FILTRAR MAQUINARIAS
  // =========================
  get maquinariasFiltradas(): any[] {

    return this.maquinarias.filter(m =>

      (m.codigo || '')
        .toLowerCase()
        .includes(this.busquedaMaquinaria.toLowerCase())

    );

  }

  // =========================
  // FILTRAR PLAN
  // =========================
  get planFiltrados(): any[] {

    return this.planItems.filter(p =>

      (
        p.plan_item?.nombre ||
        p.plan_item?.descripcion ||
        ''
      )
        .toLowerCase()
        .includes(this.busquedaPlan.toLowerCase())

    );

  }
  // =========================
  // SELECCIONAR MAQUINARIA
  // =========================
  seleccionarMaquinaria(m: any): void {

    this.maquinariaSeleccionada = m;

    this.nuevo.maquinaria_id = m.id;

    this.nuevo.horas = m.horometro_actual;

    this.busquedaMaquinaria = m.codigo;

    this.mantenimientoService
      .getPlanPorMaquinaria(m.id)
      .subscribe({

        next: (res) => {

          this.planItems = res || [];

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // =========================
  // LIMPIAR MAQUINARIA
  // =========================
  limpiarMaquinaria(): void {

    this.maquinariaSeleccionada = null;

    this.planItems = [];

    this.busquedaMaquinaria = '';

    this.nuevo.maquinaria_id = null;

    this.nuevo.maquinaria_plan_item_id = null;

  }

  // =========================
  // SELECCIONAR PLAN
  // =========================
seleccionarPlan(p: any): void {

  this.planSeleccionado = p;

  this.nuevo.maquinaria_plan_item_id =
    p.maquinaria_plan_item_id;

  const tipo =
    p.plan_item?.tipo_mantenimiento;

  switch (tipo) {

    case 'PREVENTIVO':
      this.nuevo.tipo = 'PR';
      break;

    case 'CORRECTIVO':
      this.nuevo.tipo = 'CR';
      break;

    case 'INSPECCION':
      this.nuevo.tipo = 'I';
      break;

    case 'CAMBIO':
      this.nuevo.tipo = 'C';
      break;

    default:
      this.nuevo.tipo = 'PR';

  }

}


  // =========================
  // LIMPIAR PLAN
  // =========================
  limpiarPlan(): void {

    this.planSeleccionado = null;

    this.nuevo.maquinaria_plan_item_id = null;

    this.busquedaPlan = '';

  }
  // =========================
  // ARCHIVO
  // =========================
  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (file) {

      this.archivoSeleccionado = file;

    }

  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {

    if (!this.nuevo.maquinaria_id) {

      return alert('Seleccione una maquinaria');

    }

    if (!this.nuevo.maquinaria_plan_item_id) {

      return alert('Seleccione un mantenimiento');

    }

    if (!this.nuevo.fecha) {

      return alert('Seleccione la fecha');

    }

    if (!this.nuevo.horas) {

      return alert('Ingrese las horas');

    }

    const formData = new FormData();

    Object.keys(this.nuevo).forEach(key => {

      formData.append(

        key,

        this.nuevo[key] ?? ''

      );

    });

    if (this.archivoSeleccionado) {

      formData.append(

        'soporte',

        this.archivoSeleccionado

      );

    }

    this.mantenimientoService
      .crearMaquinaria(formData)
      .subscribe({

        next: () => {

          this.cerrarModal();

          this.cargarDatos();

        },

        error: (err) => {

          console.error(err);

          alert(
            'Error guardando mantenimiento'
          );

        }

      });

  }
}
