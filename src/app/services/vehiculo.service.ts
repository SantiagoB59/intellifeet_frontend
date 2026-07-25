import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FlotaStats, Vehiculo } from '../shared/models/vehiculo.model';
import { environment } from 'src/environment/environment';
import { Mantenimiento } from '../shared/models/mantenimiento.model';

export interface VehiculoResponse {
  count: number;
  data: Vehiculo[];
}

export interface VerificacionKmResponse {
  total: number;
}

@Injectable({ providedIn: 'root' })


export class VehiculoService {

  private readonly base = `${environment.apiUrl}/api/vehiculos`;
  private readonly mantenimientoBase = `${environment.apiUrl}/api/mantenimientos`;

  constructor(private http: HttpClient) { }

  // ─────────────────────────────────────────────
  // 📊 ESTADÍSTICAS
  // ─────────────────────────────────────────────
  getStats(): Observable<FlotaStats> {
    return this.http.get<FlotaStats>(`${this.base}/stats`);
  }


  getById(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.base}/${id}`);
  }



  // ─────────────────────────────────────────────
  // 🔥 NUEVO: CONFIGURACIONES POR TIPO
  // ─────────────────────────────────────────────
  getConfiguraciones(tipoId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/configuraciones?tipo_vehiculo_id=${tipoId}`
    );
  }

  // ─────────────────────────────────────────────
  // 🔧 MANTENIMIENTOS
  // ─────────────────────────────────────────────

  getMantenimientosByVehiculo(vehiculoId: number): Observable<any> {
    return this.http.get(
      `${this.mantenimientoBase}/vehiculo/${vehiculoId}`
    );
  }

  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.mantenimientoBase}`);
  }

  crearMantenimiento(data: any): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(`${this.mantenimientoBase}`, data);
  }


  getDocumentos(tipoId: number, configId?: number) {
    let params = new HttpParams()
      .set('tipo_vehiculo_id', tipoId.toString());

    if (configId) {
      params = params.set('configuracion_id', configId.toString());
    }

    return this.http.get<any[]>(`${this.base}/documentos`, { params });
  }



  // =========================
  // LISTAR
  // =========================
  listar(filters?: {
    estado?: string;
    tipo_vehiculo_id?: number;
    search?: string;
  }): Observable<Vehiculo[]> {

    let params = new HttpParams();

    if (filters?.estado) params = params.set('estado', filters.estado);

    if (filters?.tipo_vehiculo_id)
      params = params.set('tipo_vehiculo_id',filters.tipo_vehiculo_id.toString());

    if (filters?.search)
      params = params.set('search', filters.search);

    return this.http.get<Vehiculo[]>(`${this.base}/`, { params });
  }

  // =========================
  // OBTENER
  // =========================
  obtener(placa: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.base}/${placa}`);
  }

  // =========================
  // CREAR / EDITAR
  // =========================
  crear(data: FormData) {
    return this.http.post(`${this.base}/`, data);
  }

  actualizar(placa: string, data: FormData) {
    return this.http.put(`${this.base}/${placa}`, data);
  }

  eliminar(placa: string) {
    return this.http.delete(`${this.base}/${placa}`);
  }

  // =========================
  // TIPOS
  // =========================
  getTipos() {
    return this.http.get<any[]>(`${this.base}/tipos_vehiculo`);
  }

  // =========================
  // CAMPOS DINÁMICOS
  // =========================
  getCamposTipo(tipoId: number) {
    return this.http.get<any[]>(
      `${this.base}/tipos_vehiculo/${tipoId}/campos`
    );
  }

  // =========================
  // DOCUMENTOS
  // =========================
  getDocumentosTipo() {
    return this.http.get<any[]>(`${this.base}/documentos_tipo`);
  }


  actualizarKm(placa: string, km: number) {
    return this.http.patch(`${this.base}/${placa}/km`, null, {
      params: { km: km.toString() }
    });
  }

  getByPlaca(placa: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.base}/${placa}`);
  }



  obtenerPorId(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.base}/id/${id}`);
  }



  getVerificacionKmCount(): Observable<VerificacionKmResponse> {
  return this.http.get<VerificacionKmResponse>(
    `${this.base}/verificacion-km/count`
  );
}
getVehiculosVerificacionKm(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.base}/verificacion-km`
  );
}


}