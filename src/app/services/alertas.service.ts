import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment }
  from 'src/environment/environment';

import { Alerta } from '../shared/models/alertas.model';


export interface EstadisticasAlertas {

  total: number;
  activas: number;
  resueltas: number;
  criticas: number;
}


@Injectable({
  providedIn: 'root'
})

export class AlertasService {

  private readonly base =
    `${environment.apiUrl}/api/alertas`;

  constructor(
    private http: HttpClient
  ) { }


  // ─────────────────────────────────────────────
  // 📋 LISTAR TODAS
  // ─────────────────────────────────────────────

  listar(filters?: {

    estado?: string;

    prioridad?: string;

    tipo?: string;

    categoria?: string;

    vehiculo_id?: number;

  }): Observable<Alerta[]> {

    let params = new HttpParams();

    if (filters?.estado) {

      params = params.set(
        'estado',
        filters.estado
      );
    }

    if (filters?.prioridad) {

      params = params.set(
        'prioridad',
        filters.prioridad
      );
    }

    if (filters?.tipo) {

      params = params.set(
        'tipo',
        filters.tipo
      );
    }

    if (filters?.categoria) {

      params = params.set(
        'categoria',
        filters.categoria
      );
    }

    if (filters?.vehiculo_id) {

      params = params.set(
        'vehiculo_id',
        filters.vehiculo_id
      );
    }

    return this.http.get<Alerta[]>(
      `${this.base}/`,
      { params }
    );
  }


  // ─────────────────────────────────────────────
  // 🚨 ACTIVAS
  // ─────────────────────────────────────────────

  obtenerActivas():
    Observable<Alerta[]> {

    return this.http.get<Alerta[]>(
      `${this.base}/activas`
    );
  }


  // ─────────────────────────────────────────────
  // 📊 ESTADÍSTICAS
  // ─────────────────────────────────────────────

  obtenerEstadisticas():
    Observable<EstadisticasAlertas> {

    return this.http.get<EstadisticasAlertas>(
      `${this.base}/estadisticas`
    );
  }


  // ─────────────────────────────────────────────
  // ⚙️ EJECUTAR MOTOR
  // ─────────────────────────────────────────────

  ejecutarMotor() {

    return this.http.post(
      `${this.base}/ejecutar-motor`,
      {}
    );
  }


  // ─────────────────────────────────────────────
  // ✅ RESOLVER ALERTA
  // ─────────────────────────────────────────────

  resolver(id: number) {

    return this.http.put(
      `${this.base}/${id}/resolver`,
      {}
    );
  }


  // ─────────────────────────────────────────────
  // ❌ IGNORAR ALERTA
  // ─────────────────────────────────────────────

  ignorar(id: number) {

    return this.http.put(
      `${this.base}/${id}/ignorar`,
      {}
    );
  }


  // ─────────────────────────────────────────────
  // 🔎 OBTENER POR ID
  // ─────────────────────────────────────────────

  obtenerPorId(
    id: number
  ): Observable<Alerta> {

    return this.http.get<Alerta>(
      `${this.base}/${id}`
    );
  }


  // ─────────────────────────────────────────────
  // 📅 REPORTE POR RANGO
  // ─────────────────────────────────────────────

  obtenerReporteRango(

    fechaInicio: string,

    fechaFin: string

  ) {

    const params = new HttpParams()

      .set(
        'fecha_inicio',
        fechaInicio
      )

      .set(
        'fecha_fin',
        fechaFin
      );

    return this.http.get(
      `${this.base}/reportes/rango`,
      { params }
    );
  }


  // ─────────────────────────────────────────────
  // 📆 REPORTE DIARIO
  // ─────────────────────────────────────────────

  obtenerReporteDiario() {

    return this.http.get(
      `${this.base}/reportes/diario`
    );
  }


  // ─────────────────────────────────────────────
  // 📅 REPORTE SEMANAL
  // ─────────────────────────────────────────────

  obtenerReporteSemanal() {

    return this.http.get(
      `${this.base}/reportes/semanal`
    );
  }


  // ─────────────────────────────────────────────
  // 🗓️ REPORTE MENSUAL
  // ─────────────────────────────────────────────

  obtenerReporteMensual() {

    return this.http.get(
      `${this.base}/reportes/mensual`
    );
  }


  resolverDocumento(
  alertaId: number,
  data: FormData
) {

  return this.http.post(
    `${this.base}/${alertaId}/resolver-documento`,
    data
  );
}
}