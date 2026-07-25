import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { environment }
from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  private readonly base =
    `${environment.apiUrl}/api/reportes`;

  constructor(
    private http: HttpClient
  ) { }

  // =========================================
  // HELPER PARAMS
  // =========================================

  private buildParams(
    filters: any
  ): HttpParams {

    let params =
      new HttpParams();

    Object.keys(filters)
      .forEach(key => {

        if (

          filters[key] !== null &&

          filters[key] !== undefined &&

          filters[key] !== ''

        ) {

          params = params.set(
            key,
            filters[key]
          );
        }
      });

    return params;
  }

  // =========================================
  // VEHÍCULOS
  // =========================================

  getVehiculos() {

    return this.http.get<any[]>(

      `${environment.apiUrl}/api/vehiculos`
    );
  }

  // =========================================
  // ALERTAS
  // =========================================

  getAlertas(
    filters: any
  ) {

    return this.http.get<any[]>(

      `${this.base}/alertas`,

      {
        params:
          this.buildParams(filters)
      }
    );
  }

  // =========================================
  // SEMÁFORO ALERTAS
  // =========================================

  getSemaforo() {

    return this.http.get<any>(

      `${this.base}/semaforo-alertas`
    );
  }

  // =========================================
  // MANTENIMIENTOS
  // =========================================

  getMantenimientos(
    filters: any
  ) {

    return this.http.get<any[]>(

      `${this.base}/mantenimientos`,

      {
        params:
          this.buildParams(filters)
      }
    );
  }

  // =========================================
  // DESCARGAR EXCEL ALERTAS
  // =========================================

  descargarExcelAlertas(
    filters: any
  ) {

    return this.http.get(

      `${this.base}/alertas/excel`,

      {

        params:
          this.buildParams(filters),

        responseType: 'blob'
      }
    );
  }

  // =========================================
  // DESCARGAR FORMATO PROFESIONAL
  // =========================================

  descargarFormatoMantenimiento(
    vehiculoId: number
  ) {

    return this.http.get(

      `${this.base}/mantenimiento-formato/${vehiculoId}`,

      {
        responseType: 'blob'
      }
    );
  }


// =========================================
// DESCARGAR FORMATO PROFESIONAL ALERTAS
// =========================================

descargarFormatoAlertas(
  vehiculoId: number
) {

  return this.http.get(

    `${this.base}/alertas-formato/${vehiculoId}`,

    {
      responseType: 'blob'
    }
  );
}
}

