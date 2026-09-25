import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { PlanItemService } from 'src/app/services/plan-item.service';
import { SistemasService } from 'src/app/services/sistemas.service';

@Component({
  selector: 'app-plan-item',
  templateUrl: './plan-item.component.html',
  styleUrls: ['./plan-item.component.scss']
})
export class PlanItemComponent implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  planItems: any[] = [];
  filteredItems: any[] = [];

  sistemas: any[] = [];
  tiposVehiculo: any[] = [];
  tiposMaquinaria: any[] = [];

  // =====================================================
  // ESTADOS
  // =====================================================

  loading = false;
  saving = false;
  error = '';

  searchTerm = '';
  filtroSistema = '';
  filtroTipoControl = '';

  showModal = false;
  showConfirm = false;

  modalMode: 'crear' | 'editar' | 'ver' = 'crear';

  titulo = 'Nuevo mantenimiento';

  itemSeleccionado: any = null;
  itemEliminar: any = null;

  form!: FormGroup;

  // =====================================================
  // OPCIONES
  // =====================================================

  tiposMantenimiento = [
    'PREVENTIVO',
    'CORRECTIVO',
    'INSPECCION'
  ];

  tiposControl = [
    'KM',
    'DIAS',
    'HORAS',
    'OCASIONAL'
  ];

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private planItemService: PlanItemService,
    private sistemasService: SistemasService
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.initForm();

    this.cargarSistemas();

    this.cargarTiposVehiculo();

    this.cargarTiposMaquinaria();

    this.cargarDatos();

  }

  // =====================================================
  // FORM
  // =====================================================

  initForm(): void {

    this.form = this.fb.group({

      // ==========================================
      // TIPO DE ACTIVO
      // ==========================================

      tipo_vehiculo_id: [
        null
      ],

      tipo_maquinaria_id: [
        null
      ],
      tipo_activo: [
        'VEHICULO',
        Validators.required
      ],

      // ==========================================
      // INFORMACIÓN GENERAL
      // ==========================================

      sistema: [
        '',
        Validators.required
      ],

      nombre: [
        '',
        Validators.required
      ],

      descripcion: [
        ''
      ],

      tipo_mantenimiento: [
        'PREVENTIVO',
        Validators.required
      ],

      tipo_control: [
        'KM',
        Validators.required
      ],


      // ==========================================
      // PROGRAMACIÓN
      // ==========================================

      frecuencia_valor: [
        null
      ],

      alerta_valor: [
        null
      ],

      // ==========================================
      // CONFIGURACIÓN
      // ==========================================

      obligatorio: [
        true
      ],

      activo: [
        true
      ],

      // ==========================================
      // ACTIVIDADES
      // ==========================================

      actividades: this.fb.array([])

    });

    // ==========================================
    // CAMBIO VEHÍCULO / MAQUINARIA
    // ==========================================

    this.form.get('tipo_activo')?.valueChanges
      .subscribe(tipo => {

        const tipoControl =
          this.form.get('tipo_control');

        const frecuencia =
          this.form.get('frecuencia_valor');

        const alerta =
          this.form.get('alerta_valor');

        if (tipo === 'MAQUINARIA') {

          // ==========================================
          // LIMPIAR TIPO DE VEHÍCULO
          // ==========================================

          this.form.get(
            'tipo_vehiculo_id'
          )?.setValue(
            null,
            {
              emitEvent: false
            }
          );

          // ==========================================
          // MAQUINARIA
          // ==========================================

          tipoControl?.setValue(
            'HORAS',
            {
              emitEvent: false
            }
          );

          frecuencia?.setValidators([
            Validators.required,
            Validators.min(1)
          ]);

          alerta?.setValidators([
            Validators.required,
            Validators.min(0)
          ]);

        } else {

          // ==========================================
          // LIMPIAR TIPO DE MAQUINARIA
          // ==========================================

          this.form.get(
            'tipo_maquinaria_id'
          )?.setValue(
            null,
            {
              emitEvent: false
            }
          );

          // ==========================================
          // VEHÍCULO
          // ==========================================

          tipoControl?.setValue(
            'KM',
            {
              emitEvent: false
            }
          );

          frecuencia?.clearValidators();

          alerta?.clearValidators();

          frecuencia?.setValue(
            null,
            {
              emitEvent: false
            }
          );

          alerta?.setValue(
            null,
            {
              emitEvent: false
            }
          );

          this.actividades.clear();

        }

        frecuencia?.updateValueAndValidity();

        alerta?.updateValueAndValidity();

      });

  }

  // =====================================================
  // TIPOS DE VEHÍCULO
  // =====================================================

  cargarTiposVehiculo(): void {

    this.planItemService
      .listarTiposVehiculo()
      .subscribe({

        next: (resp) => {

          this.tiposVehiculo =
            resp || [];

          console.log(
            'TIPOS VEHÍCULO:',
            this.tiposVehiculo
          );

        },

        error: (err) => {

          console.error(
            'Error cargando tipos de vehículo:',
            err
          );

        }

      });

  }


  // =====================================================
  // TIPOS DE MAQUINARIA
  // =====================================================

  cargarTiposMaquinaria(): void {

    this.planItemService
      .listarTiposMaquinaria()
      .subscribe({

        next: (resp) => {

          this.tiposMaquinaria =
            resp || [];

          console.log(
            'TIPOS MAQUINARIA:',
            this.tiposMaquinaria
          );

        },

        error: (err) => {

          console.error(
            'Error cargando tipos de maquinaria:',
            err
          );

        }

      });

  }
  // =====================================================
  // FORM ARRAY
  // =====================================================

  get actividades(): FormArray {

    return this.form.get(
      'actividades'
    ) as FormArray;

  }

  // =====================================================
  // CREAR ACTIVIDAD
  // =====================================================

  agregarActividad(): void {

    this.actividades.push(

      this.fb.group({

        id: [
          null
        ],

        nombre: [
          '',
          Validators.required
        ],

        descripcion: [
          ''
        ],

        obligatorio: [
          true
        ],

        orden: [
          this.actividades.length + 1
        ],

        activo: [
          true
        ]

      })

    );

  }

  // =====================================================
  // ELIMINAR ACTIVIDAD
  // =====================================================

  eliminarActividad(index: number): void {

    this.actividades.removeAt(index);

    this.reordenarActividades();

  }

  // =====================================================
  // REORDENAR
  // =====================================================

  reordenarActividades(): void {

    this.actividades.controls.forEach(
      (control, index) => {

        control.get('orden')?.setValue(
          index + 1
        );

      }
    );

  }

  // =====================================================
  // DATA
  // =====================================================

  cargarDatos(): void {

    this.loading = true;

    this.planItemService
      .getAll()
      .subscribe({

        next: (resp) => {

          this.planItems = resp || [];

          this.filtrar();

          this.loading = false;

        },

        error: (err) => {

          console.error(
            'Error cargando mantenimientos:',
            err
          );

          this.error =
            'Error cargando plan de mantenimiento';

          this.loading = false;

        }

      });

  }

  // =====================================================
  // FILTROS
  // =====================================================

  filtrar(): void {

    this.filteredItems =
      this.planItems.filter(item => {

        const matchSearch =

          !this.searchTerm ||

          item.nombre
            ?.toLowerCase()
            .includes(
              this.searchTerm.toLowerCase()
            ) ||

          item.descripcion
            ?.toLowerCase()
            .includes(
              this.searchTerm.toLowerCase()
            );

        const matchSistema =

          !this.filtroSistema ||

          item.sistema === this.filtroSistema;

        const matchControl =

          !this.filtroTipoControl ||

          item.tipo_control ===
          this.filtroTipoControl;

        return (
          matchSearch &&
          matchSistema &&
          matchControl
        );

      });

  }

  // =====================================================
  // CREAR
  // =====================================================

  abrirCrear(): void {

    this.modalMode = 'crear';

    this.titulo = 'Nuevo mantenimiento';

    this.itemSeleccionado = null;

    this.actividades.clear();

    this.form.reset({

      tipo_activo: 'VEHICULO',

      tipo_vehiculo_id: null,

      tipo_maquinaria_id: null,

      sistema: '',

      nombre: '',

      descripcion: '',

      tipo_mantenimiento: 'PREVENTIVO',

      tipo_control: 'KM',

      frecuencia_valor: null,

      alerta_valor: null,

      obligatorio: true,

      activo: true

    });

    this.form.enable();

    this.showModal = true;

  }

  // =====================================================
  // EDITAR
  // =====================================================

  abrirEditar(item: any): void {

    this.modalMode = 'editar';

    this.titulo = 'Editar mantenimiento';

    this.itemSeleccionado = item;

    this.form.enable();

    this.form.patchValue({

      tipo_activo:
        item.tipo_activo ||
        (
          item.tipo_control === 'HORAS'
            ? 'MAQUINARIA'
            : 'VEHICULO'
        ),
      tipo_vehiculo_id:
        item.tipo_vehiculo_id ?? null,

      tipo_maquinaria_id:
        item.tipo_maquinaria_id ?? null,

      sistema:
        item.sistema || '',

      nombre:
        item.nombre || '',

      descripcion:
        item.descripcion || '',

      tipo_mantenimiento:
        item.tipo_mantenimiento ||
        'PREVENTIVO',

      tipo_control:
        item.tipo_control ||
        'KM',

      frecuencia_valor:
        item.frecuencia_valor ??
        null,

      alerta_valor:
        item.alerta_valor ??
        null,

      obligatorio:
        item.obligatorio ??
        true,

      activo:
        item.activo ??
        true

    });

    // ==========================================
    // CARGAR ACTIVIDADES
    // ==========================================

    this.actividades.clear();

    if (
      item.tipo_activo === 'MAQUINARIA' ||
      item.tipo_control === 'HORAS'
    ) {

      (item.actividades || [])
        .forEach(
          (actividad: any) => {

            this.actividades.push(

              this.fb.group({

                id: [
                  actividad.id || null
                ],

                nombre: [
                  actividad.nombre || '',
                  Validators.required
                ],

                descripcion: [
                  actividad.descripcion || ''
                ],

                obligatorio: [
                  actividad.obligatorio ??
                  true
                ],

                orden: [
                  actividad.orden ||
                  (
                    this.actividades.length + 1
                  )
                ],

                activo: [
                  actividad.activo ??
                  true
                ]

              })

            );

          }
        );

    }

    this.showModal = true;

  }

  // =====================================================
  // VER
  // =====================================================

  abrirVer(item: any): void {

    this.modalMode = 'ver';

    this.titulo = 'Detalle mantenimiento';

    this.itemSeleccionado = item;

    this.form.enable();

    this.form.patchValue({

      tipo_activo:
        item.tipo_activo ||
        (
          item.tipo_control === 'HORAS'
            ? 'MAQUINARIA'
            : 'VEHICULO'
        ),
        tipo_vehiculo_id:
  item.tipo_vehiculo_id ?? null,

tipo_maquinaria_id:
  item.tipo_maquinaria_id ?? null,

      sistema:
        item.sistema || '',

      nombre:
        item.nombre || '',

      descripcion:
        item.descripcion || '',

      tipo_mantenimiento:
        item.tipo_mantenimiento ||
        'PREVENTIVO',

      tipo_control:
        item.tipo_control ||
        'KM',

      frecuencia_valor:
        item.frecuencia_valor ??
        null,

      alerta_valor:
        item.alerta_valor ??
        null,

      obligatorio:
        item.obligatorio ??
        true,

      activo:
        item.activo ??
        true

    });

    this.actividades.clear();

    if (
      item.tipo_activo === 'MAQUINARIA' ||
      item.tipo_control === 'HORAS'
    ) {

      (item.actividades || [])
        .forEach(
          (actividad: any) => {

            this.actividades.push(

              this.fb.group({

                id: [
                  actividad.id
                ],

                nombre: [
                  actividad.nombre,
                  Validators.required
                ],

                descripcion: [
                  actividad.descripcion || ''
                ],

                obligatorio: [
                  actividad.obligatorio ??
                  true
                ],

                orden: [
                  actividad.orden
                ],

                activo: [
                  actividad.activo ??
                  true
                ]

              })

            );

          }
        );

    }

    this.form.disable();

    this.showModal = true;

  }

  // =====================================================
  // CERRAR
  // =====================================================

  cerrarModal(): void {

    this.showModal = false;

    this.form.enable();

    this.actividades.clear();

    this.form.reset();

  }

  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }



    const payload =
      this.form.getRawValue();
    console.log('PAYLOAD A ENVIAR:', payload);
    console.log('TIPO ACTIVO:', payload.tipo_activo);
    console.log('ACTIVIDADES:', payload.actividades);
    this.saving = true;
    // ==========================================
    // LIMPIAR ACTIVIDADES PARA VEHÍCULO
    // ==========================================

    if (
      payload.tipo_activo !== 'MAQUINARIA'
    ) {

      payload.actividades = [];

      payload.frecuencia_valor =
        payload.tipo_control === 'KM'
          ? payload.frecuencia_valor
          : null;

      payload.alerta_valor =
        payload.tipo_control === 'KM'
          ? payload.alerta_valor
          : null;

    }

    // ==========================================
    // CREAR
    // ==========================================

    if (
      this.modalMode === 'crear'
    ) {

      this.planItemService
        .create(payload)
        .subscribe({

          next: () => {

            this.saving = false;

            this.cerrarModal();

            this.cargarDatos();

          },

          error: (err) => {

            console.error(
              'Error creando mantenimiento:',
              err
            );

            this.error =
              err?.error?.error ||
              'Error creando mantenimiento';

            this.saving = false;

          }

        });

      return;

    }

    // ==========================================
    // EDITAR
    // ==========================================

    this.planItemService
      .update(
        this.itemSeleccionado.id,
        payload
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.cerrarModal();

          this.cargarDatos();

        },

        error: (err) => {

          console.error(
            'Error actualizando mantenimiento:',
            err
          );

          this.error =
            err?.error?.error ||
            'Error actualizando mantenimiento';

          this.saving = false;

        }

      });

  }

  // =====================================================
  // DELETE
  // =====================================================

  confirmarEliminar(item: any): void {

    this.itemEliminar = item;

    this.showConfirm = true;

  }

  eliminar(): void {

    if (!this.itemEliminar) {
      return;
    }

    this.planItemService
      .delete(
        this.itemEliminar.id
      )
      .subscribe({

        next: () => {

          this.showConfirm = false;

          this.itemEliminar = null;

          this.cargarDatos();

        },

        error: (err) => {

          console.error(
            'Error eliminando:',
            err
          );

          this.error =
            err?.error?.error ||
            'Error eliminando mantenimiento';

        }

      });

  }

  // =====================================================
  // HELPERS
  // =====================================================

  estadoClass(
    activo: boolean
  ): string {

    return activo
      ? 'badge-operativo'
      : 'badge-inactivo';

  }

  trackById(
    index: number,
    item: any
  ): number {

    return item.id;

  }

  // =====================================================
  // SISTEMAS
  // =====================================================

  cargarSistemas(): void {

    this.sistemasService
      .listar()
      .subscribe({

        next: (resp) => {

          this.sistemas =
            resp || [];

        },

        error: (err) => {

          console.error(
            'Error sistemas:',
            err
          );

        }

      });

  }

}