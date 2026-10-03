import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface ActivoControl {
  tipo: 'VEHICULO' | 'MAQUINARIA';
  id: number;
  nombre: string;
  placa?: string;
  codigo?: string;
}

export interface RespuestaActivosControl {
  vehiculos: any[];
  maquinarias: any[];
}

export interface ControlDiario {
  id: number;
  fecha: string;

  usuario_id: number;
  usuario: string;

  vehiculo_id: number | null;
  maquinaria_id: number | null;

  tipo_activo: 'VEHICULO' | 'MAQUINARIA' | null;
  activo_id: number | null;
  activo_nombre: string | null;

  archivo_path: string;
  archivo_nombre: string;
  archivo_tipo: string | null;

  estado: 'PENDIENTE' | 'VALIDADO' | 'RECHAZADO';

  observaciones: string | null;

  validado_por: number | null;
  validador: string | null;
  validado_at: string | null;

  observacion_validacion: string | null;

  created_at: string;
  updated_at: string | null;
}


// ============================================================
// RESPUESTA DEL BACKEND - CONTROLES
// ============================================================

export interface RespuestaControles {
  total: number;
  controles: ControlDiario[];
}


@Injectable({
  providedIn: 'root'
})
export class ControlDiarioService {

  // ============================================================
  // URL BASE DEL MÓDULO CONTROL DIARIO
  // ============================================================

  private apiUrl =
    `${environment.apiUrl}/api/control-diario`;


  constructor(
    private http: HttpClient
  ) { }


  // ============================================================
  // ACTIVOS DEL OPERADOR
  // ============================================================

  obtenerMisActivos(): Observable<RespuestaActivosControl> {
    return this.http.get<RespuestaActivosControl>(
      `${this.apiUrl}/mis-activos`
    );
  }


  // ============================================================
  // CREAR CONTROL
  // ============================================================

  crearControl(
    fecha: string,
    vehiculoId: number | null,
    maquinariaId: number | null,
    archivo: File,
    observaciones?: string
  ): Observable<any> {

    const formData = new FormData();


    // ----------------------------------------------------------
    // FECHA
    // ----------------------------------------------------------

    formData.append(
      'fecha',
      fecha
    );


    // ----------------------------------------------------------
    // VEHÍCULO
    // ----------------------------------------------------------

    if (vehiculoId !== null) {

      formData.append(
        'vehiculo_id',
        vehiculoId.toString()
      );
    }


    // ----------------------------------------------------------
    // MAQUINARIA
    // ----------------------------------------------------------

    if (maquinariaId !== null) {

      formData.append(
        'maquinaria_id',
        maquinariaId.toString()
      );
    }


    // ----------------------------------------------------------
    // ARCHIVO
    // ----------------------------------------------------------

    formData.append(
      'archivo',
      archivo
    );


    // ----------------------------------------------------------
    // OBSERVACIONES
    // ----------------------------------------------------------

    if (observaciones) {

      formData.append(
        'observaciones',
        observaciones
      );
    }


    return this.http.post(
      this.apiUrl,
      formData
    );
  }


  // ============================================================
  // CONTROLES DEL OPERADOR
  // ============================================================

  obtenerMisControles(
    fechaDesde?: string,
    fechaHasta?: string
  ): Observable<
    ControlDiario[] | RespuestaControles
  > {

    let params = new HttpParams();


    // ----------------------------------------------------------
    // FECHA DESDE
    // ----------------------------------------------------------

    if (fechaDesde) {

      params = params.set(
        'fecha_desde',
        fechaDesde
      );
    }


    // ----------------------------------------------------------
    // FECHA HASTA
    // ----------------------------------------------------------

    if (fechaHasta) {

      params = params.set(
        'fecha_hasta',
        fechaHasta
      );
    }


    return this.http.get<
      ControlDiario[] | RespuestaControles
    >(
      `${this.apiUrl}/mis-controles`,
      {
        params
      }
    );
  }


  // ============================================================
  // CONTROL INDIVIDUAL
  // ============================================================

  obtenerControl(
    id: number
  ): Observable<ControlDiario> {

    return this.http.get<ControlDiario>(
      `${this.apiUrl}/${id}`
    );
  }


  // ============================================================
  // ADMIN - LISTAR CONTROLES
  // ============================================================

  obtenerControlesAdmin(
    filtros: {
      mes?: number | string;
      anio?: number | string;
      vehiculo_id?: number | string;
      maquinaria_id?: number | string;
      usuario_id?: number | string;
      estado?: string;
      fecha_desde?: string;
      fecha_hasta?: string;
    }
  ): Observable<any> {

    let params = new HttpParams();


    Object.entries(filtros).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {

          params = params.set(
            key,
            value.toString()
          );
        }

      }
    );


    return this.http.get(
      this.apiUrl,
      {
        params
      }
    );
  }


  // ============================================================
  // VALIDAR
  // ============================================================

  validarControl(
    id: number,
    observacion?: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/validar`,
      {
        observacion:
          observacion || null
      }
    );
  }


  // ============================================================
  // RECHAZAR
  // ============================================================

  rechazarControl(
    id: number,
    observacion: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/rechazar`,
      {
        observacion
      }
    );
  }


  descargarExcel(
    filtros: {
      mes?: number | string;
      anio?: number | string;
      vehiculo_id?: number | string;
      maquinaria_id?: number | string;
      usuario_id?: number | string;
      estado?: string;
      fecha_desde?: string;
      fecha_hasta?: string;
    }
  ): Observable<Blob> {

    let params = new HttpParams();

    Object.entries(filtros).forEach(([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        params = params.set(
          key,
          value.toString()
        );
      }

    });

    return this.http.get(
      `${this.apiUrl}/exportar-excel`,
      {
        params,
        responseType: 'blob'
      }
    );
  }
}