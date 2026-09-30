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
export class UsuarioDocumentoService {

  private readonly base =
    `${environment.apiUrl}/api/usuarios`;

  constructor(
    private http: HttpClient
  ) { }


  // ─────────────────────────────────────────────
  // 📋 LISTAR DOCUMENTOS DE USUARIO
  // ─────────────────────────────────────────────

  listarDocumentos(
    usuarioId: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.base}/${usuarioId}/documentos`
    );

  }


  // ─────────────────────────────────────────────
  // ✏️ ACTUALIZAR DOCUMENTO
  // ─────────────────────────────────────────────

  actualizarDocumento(
    documentoId: number,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.base}/documentos/${documentoId}`,
      data
    );

  }

  listarOperadoresDocumentos(): Observable<any> {
  return this.http.get<any>(
    `${this.base}/documentos/operadores`
  );
}



  crearDocumento(
  usuarioId: number,
  data: any
): Observable<any> {

  return this.http.post<any>(
    `${this.base}/${usuarioId}/documentos`,
    data
  );
}
}