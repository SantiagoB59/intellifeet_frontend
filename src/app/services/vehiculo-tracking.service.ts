import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
// vehiculo-ubicacion.model.ts o dentro del componente
export interface VehiculoUbicacion {
  gps_id: string;
  ciudad: string;
  direccion: string;
  direccion_texto: string;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: boolean | number; // Soporta true/false o 1/0
  fecha_gps: string;
  vehiculo_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculoTrackingService {

  private API = environment.apiUrl; // ⚠️ cambia si usas otra IP

  constructor(private http: HttpClient) { }


  getUbicaciones(): Observable<VehiculoUbicacion[]> {
    return this.http.get<VehiculoUbicacion[]>(
      `${this.API}/api/vehiculos/ubicacion-actual`
    );
  }
}