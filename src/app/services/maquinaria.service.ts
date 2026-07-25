import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({ providedIn: 'root' })
export class MaquinariaService {

  private base = `${environment.apiUrl}/api/maquinaria`;

  constructor(private http: HttpClient) { }

  // =========================
  // LISTAR
  // =========================
  listar(filters?: {
    estado?: string;
    tipo_maquinaria_id?: number;
    search?: string;
  }): Observable<any[]> {

    let params = new HttpParams();

    if (filters?.estado) params = params.set('estado', filters.estado);
    if (filters?.tipo_maquinaria_id) params = params.set('tipo', filters.tipo_maquinaria_id);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<any[]>(`${this.base}/`, { params });
  }

  // =========================
  // STATS
  // =========================
  getStats(): Observable<any> {
    return this.http.get(`${this.base}/stats`);
  }

  // =========================
  // TIPOS
  // =========================
  getTipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/tipos`);
  }

  // =========================
  // CRUD
  // =========================
  getById(id: number): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: FormData) {
    return this.http.post(`${this.base}/`, data);
  }

  actualizar(id: number, data: FormData) {
    return this.http.put(`${this.base}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getCamposTipo(tipoId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/tipos-maquinaria/${tipoId}/campos`
    );
  }
  // =========================
  // KM / HORAS
  // =========================
  actualizarHoras(id: number, horas: number) {
    return this.http.patch(`${this.base}/${id}/horas`, { horas });
  }
}