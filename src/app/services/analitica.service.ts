import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AnaliticaService {
private apiUrl = `${environment.apiUrl}/api/analitica`;

  constructor(private http: HttpClient) {}

  obtenerDashboard(
    periodo: string,
    tipoActivo: string,
    activoId: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('periodo', periodo)
      .set('tipo_activo', tipoActivo)
      .set('activo_id', activoId);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
