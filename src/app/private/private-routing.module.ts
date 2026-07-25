import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { PrivateLayoutComponent } from './private-layout/private-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { MantenimientosComponent } from './mantenimientos/mantenimientos.component';
import { MantenimientoPlanComponent } from './mantenimiento-plan/mantenimiento-plan.component';
import { FlotaComponent } from './flota/flota.component';
import { MapaComponent } from './mapa/mapa.component';
import { MaquinariaComponent } from './maquinaria/maquinaria.component';
import { PlanItemComponent } from './plan-item/plan-item.component';
import { ViajesComponent } from './viajes/viajes.component';
import { AlertasComponent } from './alertas/alertas.component';
import { ReportesComponent } from './reportes/reportes.component';
import { InspeccionMensualComponent } from './inspeccion-mensual/inspeccion-mensual.component';
import { VerificacionKmModalComponent } from './verificacion-km-modal/verificacion-km-modal.component';
import { VerificacionKmComponent } from './verificacion-km/verificacion-km.component';
import { MantenimientosMaquinariaComponent } from './mantenimientos-maquinaria/mantenimientos-maquinaria.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],       // ← Guard solo aquí, se hereda a los hijos
    children: [

      { path: '', redirectTo: 'mapa', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vehiculos', component: VehiculosComponent },
      { path: 'maquinaria', component: MaquinariaComponent },
      { path: 'mantenimientos', component: MantenimientosComponent },
      { path: 'mantenimiento-plan/:vehiculoId', component: MantenimientoPlanComponent },
      { path: 'flota', component: FlotaComponent },
      { path: 'mapa', component: MapaComponent },
      { path: 'plan-items', component: PlanItemComponent },
      { path: 'mantenimiento-plan/:tipo/:id', component: MantenimientoPlanComponent },
      { path: 'viajes', component: ViajesComponent },
      { path: 'alertas', component: AlertasComponent },
      { path: 'reportes', component: ReportesComponent },
      {path: 'inspeccion-mensual/:tipo/:id',component: InspeccionMensualComponent},
      { path: 'verificacion-km', component: VerificacionKmComponent },
      { path: 'mantenimiento-maquinaria', component: MantenimientosMaquinariaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }