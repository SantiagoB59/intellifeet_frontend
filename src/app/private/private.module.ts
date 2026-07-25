import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // 🔥 IMPORTANTE

import { GoogleMapsModule } from '@angular/google-maps';

// COMPONENTES
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MantenimientosComponent } from './mantenimientos/mantenimientos.component';
import { MantenimientoPlanComponent } from './mantenimiento-plan/mantenimiento-plan.component';
import { FlotaComponent } from './flota/flota.component';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';
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

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    VehiculosComponent,
    TopbarComponent,
    MantenimientosComponent,
    MantenimientoPlanComponent,
    FlotaComponent,
    PrivateLayoutComponent,
    MapaComponent,
    MaquinariaComponent,
    PlanItemComponent,
    ViajesComponent,
    AlertasComponent,
    ReportesComponent,
    InspeccionMensualComponent,
    VerificacionKmModalComponent,
    VerificacionKmComponent,
    MantenimientosMaquinariaComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class PrivateModule { }