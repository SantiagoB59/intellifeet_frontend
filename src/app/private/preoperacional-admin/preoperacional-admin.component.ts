import { Component, OnInit } from '@angular/core';

import { PreoperacionalService }
  from 'src/app/services/preoperacional.service';


@Component({
  selector: 'app-preoperacional-admin',
  templateUrl: './preoperacional-admin.component.html',
  styleUrls: ['./preoperacional-admin.component.scss']
})
export class PreoperacionalAdminComponent implements OnInit {


  // =====================================
  // VARIABLES
  // =====================================

  inspecciones: any[] = [];
  operadores: any[] = [];
  vehiculos: any[] = [];
  maquinarias: any[] = [];

  seleccionado: any = null;


  cargando: boolean = false;


  error: string = '';



  // =====================================
  // FILTROS
  // =====================================

  filtros: any = {

    fecha_inicio: '',
    fecha_fin: '',
    vehiculo_id: '',
    maquinaria_id: '',
    usuario_id: '',
    estado: ''

  };



  constructor(
    private preoperacionalService: PreoperacionalService
  ) { }



  ngOnInit(): void {

    this.listar();

  }





  // =====================================
  // LISTAR PREOPERACIONALES
  // =====================================


  listar() {

    this.cargando = true;
    this.error = '';

    this.preoperacionalService
      .listarInspeccionesAdmin(this.filtros)

      .subscribe({

        next: (resp) => {

          console.log('RESPUESTA ADMIN', resp);

          this.inspecciones = resp.data || [];

          // =====================================
          // CONSTRUIR OPCIONES DE FILTROS
          // =====================================

          this.operadores = this.obtenerOperadoresUnicos(
            this.inspecciones
          );

          this.vehiculos = this.obtenerVehiculosUnicos(
            this.inspecciones
          );

          this.maquinarias = this.obtenerMaquinariasUnicas(
            this.inspecciones
          );

          this.cargando = false;

        },

        error: (err) => {

          console.error('ERROR LISTANDO', err);

          this.error =
            err.error?.message ||
            'Error cargando inspecciones';

          this.cargando = false;

        }

      });

  }

  obtenerOperadoresUnicos(inspecciones: any[]): any[] {

    const mapa = new Map<number, any>();

    inspecciones.forEach(item => {

      if (item.usuario_id) {

        mapa.set(item.usuario_id, {
          id: item.usuario_id,
          nombre: item.usuario
        });

      }

    });

    return Array.from(mapa.values());

  }
  obtenerVehiculosUnicos(inspecciones: any[]): any[] {

    const mapa = new Map<number, any>();

    inspecciones.forEach(item => {

      if (item.vehiculo_id) {

        mapa.set(item.vehiculo_id, {
          id: item.vehiculo_id,
          placa: item.placa
        });

      }

    });

    return Array.from(mapa.values());

  }
  obtenerMaquinariasUnicas(inspecciones: any[]): any[] {

    const mapa = new Map<number, any>();

    inspecciones.forEach(item => {

      if (item.maquinaria_id) {

        mapa.set(item.maquinaria_id, {
          id: item.maquinaria_id,
          codigo_maquinaria: item.codigo_maquinaria,
          tipo_maquinaria: item.tipo_maquinaria
        });

      }

    });

    return Array.from(mapa.values());

  }






  // =====================================
  // LIMPIAR FILTROS
  // =====================================


  limpiarFiltros() {

    this.filtros = {

      fecha_inicio: '',
      fecha_fin: '',
      vehiculo_id: '',
      maquinaria_id: '',
      usuario_id: '',
      estado: ''

    };

    this.listar();

  }






  // =====================================
  // VER DETALLE
  // =====================================


  verDetalle(
    inspeccion: any
  ) {


    this.preoperacionalService
      .obtenerInspeccion(
        inspeccion.id
      )

      .subscribe({

        next: (resp) => {


          console.log(
            'DETALLE',
            resp
          );


          this.seleccionado =
            resp.data;


        },


        error: (err) => {

          console.error(err);

        }


      });



  }





  // =====================================
  // CERRAR MODAL
  // =====================================


  cerrarDetalle() {


    this.seleccionado = null;


  }







  // =====================================
  // DESCARGAR PDF
  // =====================================


  descargarPdf(
    inspeccion: any
  ) {



    this.preoperacionalService
      .descargarPDF(
        inspeccion.id
      )

      .subscribe({

        next: (blob) => {


          const url =
            window.URL.createObjectURL(blob);



          const link =
            document.createElement('a');



          link.href = url;



          link.download =
            `PREOPERACIONAL_${inspeccion.id}.pdf`;



          link.click();



          window.URL.revokeObjectURL(url);



        },


        error: (err) => {


          console.error(
            'Error descargando PDF',
            err
          );


        }


      });



  }






  // =====================================
  // COLORES ESTADO
  // =====================================


  claseEstado(
    estado: string
  ) {


    switch (estado) {


      case 'FINALIZADA':

        return 'bg-green-100 text-green-700';



      case 'BORRADOR':

        return 'bg-yellow-100 text-yellow-700';



      case 'ANULADA':

        return 'bg-red-100 text-red-700';



      default:

        return 'bg-gray-100 text-gray-700';


    }


  }


  obtenerRespuesta(itemId: number): any {

    return this.seleccionado?.respuestas?.find(
      (r: any) => r.item_id === itemId
    );

  }


}