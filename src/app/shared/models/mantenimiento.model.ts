export interface VehiculoSimple {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
}

export interface PlanItem {
  id: number;
  descripcion: string;
  sistema: string;
}

export interface Mantenimiento {
  id: number;
  vehiculo_id: number;
  plan_item_id: number;
  fecha: string;
  km: number;
  tipo: string;
  proveedor: string;
  soporte?: string;
  observaciones?: string;
}