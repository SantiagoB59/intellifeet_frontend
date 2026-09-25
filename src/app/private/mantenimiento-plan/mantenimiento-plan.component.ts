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

  // =========================
  // VEHÍCULO
  // =========================
  frecuencia_valor?: number;
  alerta_valor?: number;
  km_total?: number;
  programado?: any;
  restante?: number;
  ultimo_km?: number;

  // =========================
  // MAQUINARIA
  // =========================
  frecuencia_horas?: number;
  alerta_horas?: number;
  horas_base?: number;
  horas_programadas?: number;
  horas_restantes?: number;
  horometro_actual?: number;

  ultima_horas?: number;
  ultima_fecha?: string;

  estado: string;
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
  ) {}

  // =========================================================
  // INIT
  // =========================================================

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

      this.router.navigate([
        '/dashboard/flota'
      ]);

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

    // IMPORTANTE:
    // cargarPlanItems() NO se llama aquí.
    //
    // Se llama después de obtener el vehículo
    // o la maquinaria, porque necesitamos conocer
    // su tipo específico.
  }

  // =========================================================
  // VEHÍCULO
  // =========================================================

  cargarVehiculo(): void {

    this.vehiculoService
      .obtenerPorId(this.entityId)
      .subscribe({

        next: (res) => {

          this.vehiculo = res;

          console.log(
            'VEHÍCULO:',
            res
          );

          // Una vez tenemos el vehículo,
          // cargamos solamente los plan items
          // correspondientes a su tipo.
          this.cargarPlanItems();
        },

        error: (err) => {

          console.error(
            'Error cargando vehículo:',
            err
          );
        }
      });
  }

  // =========================================================
  // MAQUINARIA
  // =========================================================

  cargarMaquinaria(): void {

    this.maquinariaService
      .getById(this.entityId)
      .subscribe({

        next: (res) => {

          console.log(
            'MAQUINARIA:',
            res
          );

          this.maquinaria = res;

          // Una vez tenemos la maquinaria,
          // cargamos solamente los plan items
          // correspondientes a su tipo.
          this.cargarPlanItems();
        },

        error: (err) => {

          console.error(
            'Error cargando maquinaria:',
            err
          );
        }
      });
  }

  // =========================================================
  // PLANES VEHÍCULO
  // =========================================================

  cargarPlanesVehiculo(): void {

    this.service
      .getPlanVehiculo(this.entityId)
      .subscribe({

        next: (res) => {

          this.planes = res;
        },

        error: (err) => {

          console.error(
            'Error cargando planes del vehículo:',
            err
          );
        }
      });
  }

  // =========================================================
  // PLANES MAQUINARIA
  // =========================================================

  cargarPlanesMaquinaria(): void {

    this.service
      .getPlanMaquinaria(this.entityId)
      .subscribe({

        next: (res) => {

          this.planes = res;
        },

        error: (err) => {

          console.error(
            'Error cargando planes de maquinaria:',
            err
          );
        }
      });
  }

  // =========================================================
  // CATÁLOGO PLAN ITEMS
  // =========================================================

  cargarPlanItems(): void {

    // =======================================================
    // VEHÍCULO
    // =======================================================

    if (this.tipo === 'vehiculo') {

      if (!this.vehiculo) {

        console.error(
          'No existe información del vehículo.'
        );

        return;
      }

      // Intentamos obtener el ID directamente.
      //
      // Ejemplo:
      // tipo_vehiculo_id = 3
      //
      // También soportamos una respuesta anidada:
      // tipo_vehiculo: { id: 3 }
      const tipoVehiculoId =
        this.vehiculo.tipo_vehiculo_id ??
        this.vehiculo.tipo_vehiculo?.id;

      console.log(
        'TIPO VEHÍCULO ID:',
        tipoVehiculoId
      );

      this.service
        .getPlanItems(
          'VEHICULO',
          tipoVehiculoId
        )
        .subscribe({

          next: (res) => {

            this.planItems = res;

            console.log(
              'PLAN ITEMS VEHÍCULO:',
              res
            );
          },

          error: (err) => {

            console.error(
              'Error cargando plan items del vehículo:',
              err
            );
          }
        });

      return;
    }

    // =======================================================
    // MAQUINARIA
    // =======================================================

    if (this.tipo === 'maquinaria') {

      if (!this.maquinaria) {

        console.error(
          'No existe información de la maquinaria.'
        );

        return;
      }

      // Ejemplo:
      // tipo_maquinaria_id = 6
      //
      // También soportamos:
      // tipo_maquinaria: { id: 6 }
      const tipoMaquinariaId =
        this.maquinaria.tipo_maquinaria_id ??
        this.maquinaria.tipo_maquinaria?.id;

      console.log(
        'TIPO MAQUINARIA ID:',
        tipoMaquinariaId
      );

      this.service
        .getPlanItems(
          'MAQUINARIA',
          tipoMaquinariaId
        )
        .subscribe({

          next: (res) => {

            this.planItems = res;

            console.log(
              'PLAN ITEMS MAQUINARIA:',
              res
            );
          },

          error: (err) => {

            console.error(
              'Error cargando plan items de maquinaria:',
              err
            );
          }
        });
    }
  }

  // =========================================================
  // MODAL
  // =========================================================

  abrirModal(): void {

    this.resetForm();

    if (this.tipo === 'maquinaria') {

      this.tipo_control = 'HORAS';

    } else {

      this.tipo_control = 'KM';
    }

    this.showModal = true;
  }

  cerrarModal(): void {

    this.showModal = false;

    this.resetForm();
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  resetForm(): void {

    this.plan_item_id = 0;

    this.tipo_control =
      this.tipo === 'maquinaria'
        ? 'HORAS'
        : 'KM';

    this.frecuencia_valor = 0;

    this.alerta_valor = 0;

    this.notas = '';
  }

  // =========================================================
  // CAMBIO PLAN ITEM
  // =========================================================

  onPlanItemChange(): void {

    const plan = this.planItems.find(
      p => p.id == this.plan_item_id
    );

    if (!plan) {

      this.frecuencia_valor = 0;

      this.alerta_valor = 0;

      return;
    }

    // =========================
    // TIPO DE CONTROL
    // =========================

    if (this.tipo === 'maquinaria') {

      this.tipo_control = 'HORAS';

    } else {

      this.tipo_control =
        plan.tipo_control || 'KM';
    }

    // =========================
    // FRECUENCIA
    // =========================

    this.frecuencia_valor =
      plan.frecuencia_valor || 0;

    // =========================
    // ALERTA
    // =========================

    this.alerta_valor =
      plan.alerta_valor || 0;
  }

  // =========================================================
  // GUARDAR
  // =========================================================

  guardar(): void {

    // Validación básica
    if (!this.plan_item_id) {

      console.warn(
        'Debe seleccionar un mantenimiento.'
      );

      return;
    }

    // =======================================================
    // VEHÍCULO
    // =======================================================

    if (this.tipo === 'vehiculo') {

      const data = {

        plan_item_id:
          this.plan_item_id,

        tipo_control:
          this.tipo_control,

        frecuencia_valor:
          this.frecuencia_valor,

        alerta_valor:
          this.alerta_valor
      };

      console.log(
        'DATOS PLAN VEHÍCULO:',
        data
      );

      this.service
        .crearPlan(
          this.entityId,
          data
        )
        .subscribe({

          next: () => {

            this.cerrarModal();

            this.cargarPlanesVehiculo();
          },

          error: (err) => {

            console.error(
              'Error creando plan del vehículo:',
              err
            );
          }
        });
    }

    // =======================================================
    // MAQUINARIA
    // =======================================================

    if (this.tipo === 'maquinaria') {

      const data = {

        plan_item_id:
          this.plan_item_id,

        frecuencia_horas:
          this.frecuencia_valor,

        alerta_horas:
          this.alerta_valor
      };

      console.log(
        'DATOS PLAN MAQUINARIA:',
        data
      );

      this.service
        .crearPlanMaquinaria(
          this.entityId,
          data
        )
        .subscribe({

          next: () => {

            this.cerrarModal();

            this.cargarPlanesMaquinaria();
          },

          error: (err) => {

            console.error(
              'Error creando plan de maquinaria:',
              err
            );
          }
        });
    }
  }

  // =========================================================
  // COMPLETAR
  // =========================================================

  completar(id: number): void {

    // =======================================================
    // VEHÍCULO
    // =======================================================

    if (this.tipo === 'vehiculo') {

      this.service
        .completarPlan(id)
        .subscribe({

          next: () => {

            this.cargarPlanesVehiculo();
          },

          error: (err) => {

            console.error(
              'Error completando plan del vehículo:',
              err
            );
          }
        });
    }

    // =======================================================
    // MAQUINARIA
    // =======================================================

    if (this.tipo === 'maquinaria') {

      this.service
        .completarPlanMaquinaria(id)
        .subscribe({

          next: () => {

            this.cargarPlanesMaquinaria();
          },

          error: (err) => {

            console.error(
              'Error completando plan de maquinaria:',
              err
            );
          }
        });
    }
  }

  // =========================================================
  // BADGES
  // =========================================================

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

  // =========================================================
  // VOLVER
  // =========================================================

  volver(): void {

    this.router.navigate([
      '/dashboard/flota'
    ]);
  }
}