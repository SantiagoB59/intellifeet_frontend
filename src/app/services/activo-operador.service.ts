import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment }
  from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})

export class ActivoOperadorService {

  private readonly base =
    `${environment.apiUrl}/api/activo-operador`;

  constructor(

    private http: HttpClient

  ) { }

  // ─────────────────────────────────────────────
  // 📋 LISTAR ASIGNACIONES
  // ─────────────────────────────────────────────

  listar(): Observable<any> {

    return this.http.get<any>(
      `${this.base}`
    );

  }

  // ─────────────────────────────────────────────
  // 🔎 OBTENER POR ID
  // ─────────────────────────────────────────────

  obtenerPorId(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.base}/${id}`
    );

  }

  // ─────────────────────────────────────────────
  // ➕ CREAR ASIGNACIÓN
  // ─────────────────────────────────────────────

  crear(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.base}`,
      data
    );

  }

  // ─────────────────────────────────────────────
  // ✏️ ACTUALIZAR ASIGNACIÓN
  // ─────────────────────────────────────────────

  actualizar(

    id: number,

    data: any

  ): Observable<any> {

    return this.http.put<any>(
      `${this.base}/${id}`,
      data
    );

  }

  // ─────────────────────────────────────────────
  // ❌ DESACTIVAR ASIGNACIÓN
  // ─────────────────────────────────────────────

  eliminar(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.base}/${id}`
    );

  }

}