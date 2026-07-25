import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VehiculoService } from 'src/app/services/vehiculo.service';
import { MaquinariaService } from 'src/app/services/maquinaria.service';

@Component({
  selector: 'app-flota',
  templateUrl: './flota.component.html',
  styleUrls: ['./flota.component.scss']
})
export class FlotaComponent implements OnInit {

  flota: any[] = [];

  flotaFiltrada: any[] = [];

  loading = false;
  error = '';

  // =========================
  // FILTROS
  // =========================
  searchTerm = '';

  filtroTipo = '';

  filtroEstado = '';

  constructor(
    private vehiculoSvc: VehiculoService,
    private maquinariaSvc: MaquinariaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarFlota();
  }

  // =========================
  // CARGAR FLOTA
  // =========================
  cargarFlota(): void {

    this.loading = true;
    this.error = '';

    this.vehiculoSvc.listar({}).subscribe({

      next: (vehiculos) => {

        this.maquinariaSvc.listar({}).subscribe({

          next: (maquinaria) => {

            // VEHICULOS
            const vehiculosMap = vehiculos.map((v: any) => ({
              ...v,

              tipo_equipo: 'VEHICULO',

              identificador: v.placa,

              tipo_nombre: v.tipo_vehiculo,

              valor_control: v.km_estimado != null ? v.km_estimado : v.km_actual,

              unidad: 'KM'
            }));

            // MAQUINARIA
            const maquinariaMap = maquinaria.map((m: any) => ({
              ...m,

              tipo_equipo: 'MAQUINARIA',

              identificador: m.codigo,

              tipo_nombre: m.tipo,

              valor_control: m.horometro_actual,

              unidad: 'H'
            }));

            // UNIR
            this.flota = [
              ...vehiculosMap,
              ...maquinariaMap
            ];

            // FILTRAR
            this.aplicarFiltros();

            this.loading = false;
          },

          error: () => {

            this.error = 'Error cargando maquinaria';

            this.loading = false;
          }

        });

      },

      error: () => {

        this.error = 'Error cargando vehículos';

        this.loading = false;
      }

    });
  }

  // =========================
  // FILTRAR
  // =========================
  aplicarFiltros(): void {

    this.flotaFiltrada = this.flota.filter(item => {

      const matchSearch = !this.searchTerm ||

        item.identificador?.toLowerCase().includes(
          this.searchTerm.toLowerCase()
        ) ||

        item.tipo_nombre?.toLowerCase().includes(
          this.searchTerm.toLowerCase()
        );

      const matchTipo = !this.filtroTipo ||

        item.tipo_equipo === this.filtroTipo;

      const matchEstado = !this.filtroEstado ||

        item.estado === this.filtroEstado;

      return matchSearch
        && matchTipo
        && matchEstado;
    });
  }

  // =========================
  // LIMPIAR
  // =========================
  limpiarFiltros(): void {

    this.searchTerm = '';

    this.filtroTipo = '';

    this.filtroEstado = '';

    this.aplicarFiltros();
  }

  // =========================
  // VER PLAN
  // =========================
  verPlan(
    id: number,
    tipo: 'vehiculo' | 'maquinaria'
  ): void {

    this.router.navigate([
      '/dashboard/mantenimiento-plan',
      tipo,
      id
    ]);
  }

  // =========================
  // VER INSPECCIONES
  // =========================
  verInspecciones(
    id: number,
    tipo: 'vehiculo' | 'maquinaria'
  ): void {

    this.router.navigate([
      '/dashboard/inspeccion-mensual',
      tipo,
      id
    ]);

  }

  // =========================
  // BADGE ESTADO
  // =========================
  estadoClass(estado: string): string {

    return {
      OPERATIVO: 'bg-green-100 text-green-700',
      OPERATIVA: 'bg-green-100 text-green-700',

      TALLER: 'bg-yellow-100 text-yellow-700',

      INACTIVO: 'bg-red-100 text-red-700',
      INACTIVA: 'bg-red-100 text-red-700'
    }[estado] || 'bg-slate-100 text-slate-700';
  }

  // =========================
  // TRACKBY
  // =========================
  trackById(_: number, item: any): number {
    return item.id;
  }
}