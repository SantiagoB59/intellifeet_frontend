export type EstadoVehiculo = 'OPERATIVO' | 'TALLER' | 'INACTIVO';

export interface Vehiculo {
  id: number;
  placa: string;
  tipo_vehiculo: string;
  tipo_vehiculo_id: number;

  marca?: string;
  modelo?: string;
  color?: string;

  propietario?: string;
  cc_propietario?: string;

  conductor?: string;
  cc_conductor?: string;

  servicio?: string;
  km_actual?: number;

  gps_id?: string;
  estado?: EstadoVehiculo;
  notas?: string;

  foto_url?: string;

  // 🔥 AGREGA ESTO
  documentos?: DocumentoForm[];
  campos_dinamicos?: {
    campo_id: number;
    nombre: string;
    tipo: string;
    valor: any;
  }[];
}

export interface FlotaStats {
  total: number;
  operativos: number;
  en_taller: number;
  inactivos: number;
}

// ==============================
// 📄 DOCUMENTOS
// ==============================
export interface DocumentoForm {
  documento_tipo_id: number;
  nombre: string;
  requiere_numero?: boolean;
  numero?: string;
  fecha_vencimiento?: string;
}