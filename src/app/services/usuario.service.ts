import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly base =
    `${environment.apiUrl}/api/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  // ─────────────────────────────────────────────
  // 📋 LISTAR
  // ─────────────────────────────────────────────

  listar(): Observable<any> {

    return this.http.get<any>(
      `${this.base}/`
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
  // ➕ CREAR
  // ─────────────────────────────────────────────

  crear(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.base}/`,
      data
    );

  }

  // ─────────────────────────────────────────────
  // ✏️ ACTUALIZAR
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
  // 🗑️ ELIMINAR
  // ─────────────────────────────────────────────

  eliminar(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.base}/${id}`
    );

  }

  listarTiposOperador(): Observable<any> {

    return this.http.get(
      `${this.base}/tipos-operador`
    );

  }

  listarDocumentosTipoOperador(
    tipoOperadorId: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.base}/tipos-operador/${tipoOperadorId}/documentos`
    );

  }

}