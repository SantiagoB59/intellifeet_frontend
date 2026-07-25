export interface Maquinaria {

  id: number;

  codigo: string;

  tipo: string;

  marca: string;
  modelo: string;

  horometro_actual: number; // 🔥 clave

  estado: string;

  activo: boolean;
}