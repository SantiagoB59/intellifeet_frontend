import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './pages/landing/landing.component';
import { NavbarComponent } from './pages/landing/sections/navbar/navbar.component';
import { HeroComponent } from './pages/landing/sections/hero/hero.component';
import { FeaturesComponent } from './pages/landing/sections/features/features.component';
import { DashboardPreviewComponent } from './pages/landing/sections/dashboard-preview/dashboard-preview.component';
import { MaintenanceComponent } from './pages/landing/sections/maintenance/maintenance.component';
import { PreoperationalComponent } from './pages/landing/sections/preoperational/preoperational.component';
import { AlertsComponent } from './pages/landing/sections/alerts/alerts.component';
import { BenefitsComponent } from './pages/landing/sections/benefits/benefits.component';
import { FooterComponent } from './pages/landing/sections/footer/footer.component';
import { SolicitarDemoComponent } from './pages/solicitar-demo/solicitar-demo.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent,
    LandingComponent,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    DashboardPreviewComponent,
    MaintenanceComponent,
    PreoperationalComponent,
    AlertsComponent,
    BenefitsComponent,
    FooterComponent,
    SolicitarDemoComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class PublicModule { }
