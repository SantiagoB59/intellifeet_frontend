import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesPreoperacionalesService {

  private readonly api =
    `${environment.apiUrl}/api/inspecciones`;

  constructor(
    private http: HttpClient
  ) { }

  // ==========================================
  // LISTAR
  // ==========================================

  listar(filtros: any): Observable<any> {

    let params = new HttpParams();

    Object.keys(filtros).forEach(key => {

      if (
        filtros[key] !== null &&
        filtros[key] !== undefined &&
        filtros[key] !== ''
      ) {
        params = params.set(key, filtros[key]);
      }

    });

    return this.http.get(
      `${this.api}/admin/listar`,
      { params }
    );

  }

  // ==========================================
  // PDF INDIVIDUAL
  // ==========================================

  descargarPDF(id: number): Observable<Blob> {

    return this.http.get(
      `${this.api}/${id}/pdf`,
      {
        responseType: 'blob'
      }
    );

  }

  // ==========================================
  // RESUMEN PDF
  // ==========================================

  descargarResumenPDF(filtro: any): Observable<Blob> {

    let params = new HttpParams()
      .set('mes', filtro.mes)
      .set('anio', filtro.anio);

    if (filtro.vehiculo_id) {
      params = params.set('vehiculo_id', filtro.vehiculo_id);
    }

    if (filtro.maquinaria_id) {
      params = params.set('maquinaria_id', filtro.maquinaria_id);
    }

    return this.http.get(
      `${this.api}/reporte-preoperacionales/pdf`,
      {
        params,
        responseType: 'blob'
      }
    );

  }
  descargarReporteSemanal(datos: any) {

    return this.http.post(
      `${this.api}/reportes/preoperacionales/semanal`,
      datos,
      {
        responseType: 'blob'
      }
    );

  }

  // ==========================================
  // LIBRO PDF
  // ==========================================

  descargarDetallePDF(filtro: any): Observable<Blob> {

    let params = new HttpParams()
      .set('mes', filtro.mes)
      .set('anio', filtro.anio);

    if (filtro.vehiculo_id) {
      params = params.set('vehiculo_id', filtro.vehiculo_id);
    }

    return this.http.get(
      `${this.api}/reporte-preoperacionales-detalle/pdf`,
      {
        params,
        responseType: 'blob'
      }
    );

  }

  // ==========================================
  // EXCEL
  // ==========================================

  descargarExcel(filtro: any): Observable<Blob> {

    let params = new HttpParams()
      .set('mes', filtro.mes)
      .set('anio', filtro.anio);

    if (filtro.vehiculo_id) {
      params = params.set('vehiculo_id', filtro.vehiculo_id);
    }

    if (filtro.maquinaria_id) {
      params = params.set('maquinaria_id', filtro.maquinaria_id);
    }

    return this.http.get(
      `${this.api}/reporte-preoperacionales/excel`,
      {
        params,
        responseType: 'blob'
      }
    );

  }




}