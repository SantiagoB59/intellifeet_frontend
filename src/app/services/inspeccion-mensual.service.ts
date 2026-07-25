import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InspeccionMensualService {

  private api = `${environment.apiUrl}/api/inspeccion_mensual`;

  constructor(
    private http: HttpClient
  ) { }

  //=========================================
  // VEHÍCULOS
  //=========================================

  listarVehiculo(id: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/vehiculo/${id}`
    );

  }

  crearVehiculo(
    id: number,
    formData: FormData
  ): Observable<any> {

    formData.append('vehiculo_id', id.toString());

    return this.http.post<any>(
      `${this.api}`,
      formData
    );

  }

  //=========================================
  // MAQUINARIA
  //=========================================

  listarMaquinaria(id: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/maquinaria/${id}`
    );

  }

  crearMaquinaria(
  id: number,
  formData: FormData
): Observable<any> {

  formData.append('maquinaria_id', id.toString());

  return this.http.post<any>(
    `${this.api}`,
    formData
  );

}

  //=========================================
  // ELIMINAR
  //=========================================

  eliminar(id: number): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

  //=========================================
  // DESCARGAR
  //=========================================

  descargar(id: number): Observable<Blob> {

    return this.http.get(
      `${this.api}/${id}/descargar`,
      {
        responseType: 'blob'
      }
    );

  }

}