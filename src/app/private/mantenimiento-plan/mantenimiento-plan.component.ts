import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MantenimientoPlanService } from '../../services/mantenimiento-plan.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { MaquinariaService } from '../../services/maquinaria.service';

interface PlanVehiculo {

  id: number;

  vehiculo_id?: number;

  maquinaria_id?: number;

  plan_item: any;

  sistema: string;

  nombre: string;

  descripcion: string;

  tipo_mantenimiento: string;

  tipo_control: 'KM' | 'DIAS' | 'HORAS';

  frecuencia_valor: number;

  alerta_valor: number;

  ultimo_km?: number;

  ultima_horas?: number;

  ultima_fecha?: string;

  km_total?: number;

  programado: any;

  restante: number;

  estado: string;
  horometro_actual?: number;
}

@Component({
  selector: 'app-mantenimiento-plan',
  templateUrl: './mantenimiento-plan.component.html',
  styleUrls: ['./mantenimiento-plan.component.scss']
})
export class MantenimientoPlanComponent implements OnInit {

  // =========================
  // ROUTE PARAMS
  // =========================
  tipo!: 'vehiculo' | 'maquinaria';

  entityId!: number;

  // =========================
  // DATA
  // =========================
  vehiculo: any = null;

  maquinaria: any = null;

  planes: PlanVehiculo[] = [];

  planItems: any[] = [];

  // =========================
  // MODAL
  // =========================
  showModal = false;

  // =========================
  // FORM
  // =========================
  plan_item_id = 0;

  tipo_control: 'KM' | 'DIAS' | 'HORAS' = 'KM';

  frecuencia_valor = 0;

  alerta_valor = 0;

  notas = '';

  constructor(
    private service: MantenimientoPlanService,
    private vehiculoService: VehiculoService,
    private maquinariaService: MaquinariaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // =========================
    // PARAMS
    // =========================
    this.tipo = this.route.snapshot.paramMap.get(
      'tipo'
    ) as 'vehiculo' | 'maquinaria';

    this.entityId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    // =========================
    // VALIDAR
    // =========================
    if (!this.entityId || !this.tipo) {

      this.router.navigate(['/dashboard/flota']);

      return;
    }

    // =========================
    // VEHÍCULO
    // =========================
    if (this.tipo === 'vehiculo') {

      this.cargarVehiculo();

      this.cargarPlanesVehiculo();
    }

    // =========================
    // MAQUINARIA
    // =========================
    if (this.tipo === 'maquinaria') {

      this.cargarMaquinaria();

      this.cargarPlanesMaquinaria();
    }

    // =========================
    // CATÁLOGO PLAN ITEMS
    // =========================
    this.cargarPlanItems();
  }

  // =====================================
  // VEHÍCULO
  // =====================================
  cargarVehiculo(): void {

    this.vehiculoService
      .obtenerPorId(this.entityId)
      .subscribe({

        next: (res) => {
          this.vehiculo = res;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // =====================================
  // MAQUINARIA
  // =====================================
  cargarMaquinaria(): void {

  this.maquinariaService
    .getById(this.entityId)
    .subscribe({

      next: (res) => {

        console.log("MAQUINARIA:", res);

        this.maquinaria = res;

      },

      error: (err) => {
        console.error(err);
      }
    });
}

  // =====================================
  // PLANES VEHÍCULO
  // =====================================
  cargarPlanesVehiculo(): void {

    this.service
      .getPlanVehiculo(this.entityId)
      .subscribe({

        next: (res) => {
          this.planes = res;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // =====================================
  // PLANES MAQUINARIA
  // =====================================
  cargarPlanesMaquinaria(): void {

    this.service
      .getPlanMaquinaria(this.entityId)
      .subscribe({

        next: (res) => {
          this.planes = res;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // =====================================
  // PLAN ITEMS
  // =====================================
  cargarPlanItems(): void {

    this.service.getPlanItems()
      .subscribe({

        next: (res) => {
          this.planItems = res;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // =====================================
  // MODAL
  // =====================================
  abrirModal(): void {
    this.showModal = true;
  }

  cerrarModal(): void {

    this.showModal = false;

    this.resetForm();
  }

  // =====================================
  // RESET FORM
  // =====================================
  resetForm(): void {

    this.plan_item_id = 0;

    this.tipo_control = 'KM';

    this.frecuencia_valor = 0;

    this.alerta_valor = 0;

    this.notas = '';
  }

  // =====================================
  // CAMBIO PLAN ITEM
  // =====================================
  onPlanItemChange(): void {

    const plan = this.planItems.find(
      p => p.id == this.plan_item_id
    );

    if (plan) {

      this.tipo_control =
        plan.tipo_control || 'KM';

      this.frecuencia_valor =
        plan.frecuencia_valor || 0;

      this.alerta_valor =
        plan.alerta_valor || 0;
    }
  }

  // =====================================
  // GUARDAR
  // =====================================
  guardar(): void {

    // =========================
    // VEHÍCULO
    // =========================
    if (this.tipo === 'vehiculo') {

      const data = {

        plan_item_id: this.plan_item_id,

        tipo_control: this.tipo_control,

        frecuencia_valor: this.frecuencia_valor,

        alerta_valor: this.alerta_valor
      };

      this.service
        .crearPlan(this.entityId, data)
        .subscribe({

          next: () => {

            this.cerrarModal();

            this.cargarPlanesVehiculo();
          },

          error: (err) => {
            console.error(err);
          }
        });
    }

    // =========================
    // MAQUINARIA
    // =========================
    if (this.tipo === 'maquinaria') {

      const data = {

        plan_item_id: this.plan_item_id,

        frecuencia_horas: this.frecuencia_valor,

        alerta_horas: this.alerta_valor
      };

      this.service
        .crearPlanMaquinaria(this.entityId, data)
        .subscribe({

          next: () => {

            this.cerrarModal();

            this.cargarPlanesMaquinaria();
          },

          error: (err) => {
            console.error(err);
          }
        });
    }
  }

  // =====================================
  // COMPLETAR
  // =====================================
  completar(id: number): void {

    // =========================
    // VEHÍCULO
    // =========================
    if (this.tipo === 'vehiculo') {

      this.service
        .completarPlan(id)
        .subscribe({

          next: () => {
            this.cargarPlanesVehiculo();
          },

          error: (err) => {
            console.error(err);
          }
        });
    }

    // =========================
    // MAQUINARIA
    // =========================
    if (this.tipo === 'maquinaria') {

      this.service
        .completarPlanMaquinaria(id)
        .subscribe({

          next: () => {
            this.cargarPlanesMaquinaria();
          },

          error: (err) => {
            console.error(err);
          }
        });
    }
  }

  // =====================================
  // BADGES
  // =====================================
  estadoClass(estado: string): string {

    switch (estado) {

      case 'ACTIVO':
        return 'badge-operativo';

      case 'PENDIENTE':
        return 'badge-taller';

      case 'VENCIDO':
        return 'badge-inactivo';

      default:
        return 'badge-default';
    }
  }

  // =====================================
  // VOLVER
  // =====================================
  volver(): void {

    this.router.navigate(['/dashboard/flota']);
  }
}