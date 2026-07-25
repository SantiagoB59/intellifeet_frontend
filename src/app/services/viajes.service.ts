import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environment/environment';
import { Viaje } from '../shared/models/viajes.model';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  private readonly base = `${environment.apiUrl}/api/viajes`;

  constructor(private http: HttpClient) {}

  // =========================
  // 📊 LISTAR VIAJES
  // =========================
  listar(filters?: {
    estado?: string;
    vehiculo_id?: number;
    remolque_id?: number;
    search?: string;
  }): Observable<Viaje[]> {

    let params = new HttpParams();

    if (filters?.estado)
      params = params.set('estado', filters.estado);

    if (filters?.vehiculo_id)
      params = params.set('vehiculo_id', filters.vehiculo_id.toString());

    if (filters?.remolque_id)
      params = params.set('remolque_id', filters.remolque_id.toString());

    if (filters?.search)
      params = params.set('search', filters.search);

    return this.http.get<Viaje[]>(`${this.base}/`, { params });
  }

  // =========================
  // 🔍 OBTENER POR ID
  // =========================
  obtener(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.base}/${id}`);
  }

  // =========================
  // ➕ CREAR VIAJE
  // =========================
  crear(data: Viaje): Observable<Viaje> {
    return this.http.post<Viaje>(`${this.base}/`, data);
  }

  // =========================
  // ✏️ ACTUALIZAR VIAJE
  // =========================
  actualizar(id: number, data: Viaje): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.base}/${id}`, data);
  }

  // =========================
  // ❌ ELIMINAR
  // =========================
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  // =========================
  // ▶️ INICIAR VIAJE
  // =========================
  iniciar(id: number): Observable<Viaje> {
    return this.http.post<Viaje>(`${this.base}/${id}/iniciar`, {});
  }

  // =========================
  // 🏁 FINALIZAR VIAJE
  // =========================
  finalizar(id: number, data: { km_fin: number; observaciones?: string }): Observable<Viaje> {
    return this.http.post<Viaje>(`${this.base}/${id}/finalizar`, data);
  }
  // =========================
  // 🚛 FILTROS AUXILIARES
  // =========================
  listarPorVehiculo(vehiculoId: number): Observable<Viaje[]> {
    return this.listar({ vehiculo_id: vehiculoId });
  }

  listarPorRemolque(remolqueId: number): Observable<Viaje[]> {
    return this.listar({ remolque_id: remolqueId });
  }
}