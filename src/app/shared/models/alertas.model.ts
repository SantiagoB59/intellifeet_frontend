export interface Alerta {

  id: number;

  tipo: string;

  categoria: string;

  titulo: string;

  mensaje: string;

  prioridad: string;

  estado: string;

  origen: string;

  created_at: string;

  fecha_evento: string;

  fecha_resolucion?: string;

  mantenimiento_id?: number;

  viaje_id?: number;

  vehiculo_id?: number;

  vehiculo_plan_item_id?: number;

  plan_item?: any;

  metadata?: any;

  // =========================================
  // VEHÍCULO
  // =========================================

  vehiculo?: {

    id: number;

    placa: string;

    marca: string;

  };

  // =========================================
  // VIAJE
  // =========================================

  viaje?: any;


maquinaria_id?: number;

maquinaria?: {
    id: number;
    codigo: string;
    marca: string;
}

}
