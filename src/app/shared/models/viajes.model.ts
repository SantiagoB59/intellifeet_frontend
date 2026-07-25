export interface Viaje {

  id?: number;

  vehiculo_id: number;
  remolque_id?: number;

  conductor: string;
  cc_conductor?: string;

  origen: string;
  destino: string;

  // Kilometraje del remolque
  km_inicio: number;
  km_fin?: number;
  km_recorrido?: number;

  estado: 'PROGRAMADO' | 'EN_RUTA' | 'FINALIZADO';

  observaciones?: string;

  created_at?: string;

}