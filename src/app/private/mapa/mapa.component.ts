import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import {
  VehiculoTrackingService,
  VehiculoUbicacion
} from 'src/app/services/vehiculo-tracking.service';

import { AlertasService } from 'src/app/services/alertas.service';

import { Alerta } from 'src/app/shared/models/alertas.model';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent
  implements OnInit, OnDestroy, AfterViewInit {

  // =========================
  // VEHÍCULOS
  // =========================
  mostrarModalKm = false;
  totalKmPendientes = 0;
  vehiculos: VehiculoUbicacion[] = [];

  vehiculosFiltrados: VehiculoUbicacion[] = [];

  searchTerm: string = '';

  // =========================
  // ALERTAS
  // =========================

  alertas: Alerta[] = [];

  // =========================
  // INTERVALOS
  // =========================

  intervalo: any;

  // =========================
  // MAPA
  // =========================

  map!: L.Map;

  markersLayer: L.LayerGroup = L.layerGroup();

  markersMap: Map<string, L.Marker> = new Map();

  selectedGps: string | null = null;

  followMode: boolean = false;

  constructor(

    private trackingService: VehiculoTrackingService,
    private vehiculoService: VehiculoService,
    private alertasService: AlertasService

  ) { }

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
  }

  // =========================
  // AFTER VIEW
  // =========================

  ngAfterViewInit(): void {

    this.initMap();

    this.cargarDatos();

    this.cargarAlertas();

    this.verificarKm();
    // =========================
    // REFRESH AUTOMÁTICO
    // =========================

    this.intervalo = setInterval(() => {

      this.cargarDatos();

      this.cargarAlertas();


    }, 10000);

    // =========================
    // RESIZE
    // =========================

    window.addEventListener(
      'resize',
      this.onResizeMap
    );

    // =========================
    // FIX MÓVIL
    // =========================

    setTimeout(() => {

      if (this.map) {

        this.map.invalidateSize();
      }

    }, 600);
  }

  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    if (this.intervalo) {

      clearInterval(this.intervalo);
    }

    if (this.map) {

      this.map.remove();
    }

    window.removeEventListener(
      'resize',
      this.onResizeMap
    );
  }

  contarEncendidos(): number {
    return this.vehiculos.filter(
      v => this.getEstado(v.ignition) === 'Encendido'
    ).length;
  }

  // =========================
  // INIT MAPA
  // =========================

  private initMap(): void {

    this.map = L.map('map', {

      center: [4.6173, -72.9072],

      zoom: 13,

      zoomControl: true

    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.markersLayer.addTo(this.map);

    setTimeout(() => {

      this.map.invalidateSize();

    }, 500);
  }

  // =========================
  // CARGAR VEHÍCULOS
  // =========================

  cargarDatos(): void {

    this.trackingService
      .getUbicaciones()
      .subscribe({

        next: (data) => {

          this.vehiculos = data;

          this.filtrarVehiculos();

          this.actualizarMapa();
        },

        error: (err) => {

          console.error(
            'Error cargando ubicaciones:',
            err
          );
        }

      });
  }

  tieneAlertasCriticas(): boolean {

    return this.alertas.some(

      a => a.prioridad === 'CRITICA'

    );

  }


  verificarKm(): void {

    this.vehiculoService.getVerificacionKmCount().subscribe({
      next: (res: any) => {

        if (res.total > 0) {
          this.totalKmPendientes = res.total;
          this.mostrarModalKm = true;
        }

      },
      error: (err) => {
        console.error('Error verificando km:', err);
      }
    });

  }
  // =========================
  // CARGAR ALERTAS
  // =========================

  cargarAlertas(): void {

    this.alertasService
      .obtenerActivas()
      .subscribe({

        next: (data) => {

          this.alertas = data

            .sort((a, b) =>

              new Date(b.created_at).getTime()

              -

              new Date(a.created_at).getTime()

            )

            .slice(0, 15);
        },

        error: (err) => {

          console.error(
            'Error cargando alertas:',
            err
          );
        }

      });
  }

  // =========================
  // ACTUALIZAR MAPA
  // =========================

  actualizarMapa(): void {

    if (!this.map) return;

    this.markersLayer.clearLayers();

    this.markersMap.clear();

    let selectedMarker:
      | L.Marker
      | undefined;

    this.vehiculos.forEach(v => {

      const encendido =
        v.ignition === true ||
        v.ignition == 1;

      const icon = L.icon({

        iconUrl: encendido

          ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'

          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',

        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

        iconSize: [25, 41],

        iconAnchor: [12, 41],

        popupAnchor: [1, -34]

      });

      const marker = L.marker(
        [v.latitude, v.longitude],
        { icon }
      )

        .bindPopup(`

          <b>${v.gps_id}</b><br>

          ${v.ciudad}<br>

          ${v.direccion_texto}<br>

          Vel: ${v.speed} km/h

        `);

      this.markersLayer.addLayer(marker);

      this.markersMap.set(
        v.gps_id,
        marker
      );

      if (
        this.selectedGps === v.gps_id
      ) {

        selectedMarker = marker;
      }

    });

    // =========================
    // FOLLOW MODE
    // =========================

    if (
      this.followMode &&
      selectedMarker
    ) {

      const latLng =
        selectedMarker.getLatLng();

      this.map.flyTo(
        latLng,
        this.map.getZoom(),
        {
          animate: true,
          duration: 0.8
        }
      );

      selectedMarker.openPopup();
    }

    setTimeout(() => {

      this.map.invalidateSize();

    }, 200);
  }

  // =========================
  // IR A VEHÍCULO
  // =========================

  irAVehiculo(
    gps_id: string
  ): void {

    const marker =
      this.markersMap.get(gps_id);

    if (!marker) return;

    this.selectedGps = gps_id;

    this.followMode = true;

    const latLng =
      marker.getLatLng();

    this.map.flyTo(
      latLng,
      16,
      {
        animate: true,
        duration: 1
      }
    );

    marker.openPopup();
  }

  // =========================
  // DETENER FOLLOW
  // =========================

  detenerSeguimiento(): void {

    this.followMode = false;
  }

  // =========================
  // ESTADO MOTOR
  // =========================

  getEstado(
    ignition: any
  ): string {

    return (
      ignition === true ||
      ignition == 1
    )

      ? 'Encendido'

      : 'Apagado';
  }

  // =========================
  // CLASE ALERTA
  // =========================

  getClaseAlerta(
    prioridad?: string
  ): string {

    switch (prioridad) {

      case 'CRITICA':
        return 'critica';

      case 'ALTA':
        return 'preventiva';

      case 'MEDIA':
        return 'normal';

      case 'BAJA':
        return 'normal';

      default:
        return 'normal';
    }
  }

  // =========================
  // TRACK BY
  // =========================

  trackByGps(
    index: number,
    item: any
  ) {

    return item.gps_id;
  }

  // =========================
  // RESIZE MAP
  // =========================

  onResizeMap = () => {

    if (this.map) {

      setTimeout(() => {

        this.map.invalidateSize();

      }, 200);
    }
  };

  // =========================
  // FILTRAR
  // =========================

  filtrarVehiculos(): void {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!term) {

      this.vehiculosFiltrados = [
        ...this.vehiculos
      ];

      return;
    }

    this.vehiculosFiltrados =
      this.vehiculos.filter(v => {

        return (

          v.gps_id
            ?.toLowerCase()
            .includes(term)

          ||

          v.ciudad
            ?.toLowerCase()
            .includes(term)

          ||

          v.direccion_texto
            ?.toLowerCase()
            .includes(term)

        );

      });
  }

}