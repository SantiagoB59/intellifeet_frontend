import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class MantenimientoPlanService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // =========================================
  // 🚗 PLAN VEHÍCULOS
  // =========================================

  getPlanVehiculo(vehicleId: number): Observable<any> {

    return this.http.get(
      `${this.api}/api/vehiculos/${vehicleId}/plan`
    );
  }

  crearPlan(vehicleId: number, data: any): Observable<any> {

    return this.http.post(
      `${this.api}/api/vehiculos/${vehicleId}/plan`,
      data
    );
  }

  completarPlan(id: number): Observable<any> {

    return this.http.put(
      `${this.api}/api/plan/${id}/completar`,
      {}
    );
  }

  // =========================================
  // 🏗️ PLAN MAQUINARIA
  // =========================================

  getPlanMaquinaria(maquinariaId: number): Observable<any> {

    return this.http.get(
      `${this.api}/api/maquinaria/${maquinariaId}/plan`
    );
  }

  crearPlanMaquinaria(
    maquinariaId: number,
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.api}/api/maquinaria/${maquinariaId}/plan`,
      data
    );
  }

  completarPlanMaquinaria(id: number): Observable<any> {

    return this.http.put(
      `${this.api}/api/maquinaria/plan/${id}/completar`,
      {}
    );
  }

  // =========================================
  // 📋 PLAN ITEMS
  // =========================================

  getPlanItems(): Observable<any> {

    return this.http.get(
      `${this.api}/api/plan-items`
    );
  }

  // =========================================
  // 🚨 ALERTAS VEHÍCULOS
  // =========================================

  alertas(): Observable<any> {

    return this.http.get(
      `${this.api}/api/mantenimientos/alertas`
    );
  }

  // =========================================
  // 🚨 ALERTAS MAQUINARIA
  // =========================================

  alertasMaquinaria(): Observable<any> {

    return this.http.get(
      `${this.api}/api/maquinaria/alertas`
    );
  }

  // =========================================
  // 🚗 LISTA VEHÍCULOS
  // =========================================

  getVehiculos(): Observable<any> {

    return this.http.get(
      `${this.api}/api/vehiculos`
    );
  }

  // =========================================
  // 🏗️ LISTA MAQUINARIA
  // =========================================

  getMaquinaria(): Observable<any> {

    return this.http.get(
      `${this.api}/api/maquinaria`
    );
  }
}