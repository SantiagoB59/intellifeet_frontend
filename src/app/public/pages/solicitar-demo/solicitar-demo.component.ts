
import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitar-demo',
  templateUrl: './solicitar-demo.component.html',
  styleUrls: ['./solicitar-demo.component.scss']
})
export class SolicitarDemoComponent {

  enviando = false;

  formulario = {

    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    cantidad: null as number | null,
    tipoOperacion: '',
    mensaje: ''

  };


  enviarSolicitud(): void {

    if (this.enviando) {
      return;
    }

    this.enviando = true;


    /*
     * TEMPORAL
     *
     * Aquí posteriormente conectaremos
     * el formulario con el backend Flask.
     */

    console.log(
      'Solicitud de demostración:',
      this.formulario
    );


    setTimeout(() => {

      this.enviando = false;

      console.log(
        'Solicitud preparada correctamente.'
      );

    }, 1000);

  }

}