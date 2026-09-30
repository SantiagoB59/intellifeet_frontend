import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PreoperacionalService } from 'src/app/services/preoperacional.service';

@Component({
    selector: 'app-preoperacional',
    templateUrl: './preoperacional.component.html',
    styleUrls: ['./preoperacional.component.scss']
})
export class PreoperacionalComponent implements OnInit {
    porcentaje = 0;

    cargando = true;

    activo: any = null;

    plantilla: any = null;

    inspeccion: any = null;

    respuestas: any = {};

    finalizando = false;
    videoStream!: MediaStream;

    latitud!: number;
    longitud!: number;
    itemActual: any = null;

    mostrarCamara = false;
    yaRealizada = false;
    inspeccionHoy: any = null;
    mostrarModalAnomalia = false;
    seleccionado: any = null;
    anomalia = {
        titulo: '',
        descripcion: '',
        prioridad: 'MEDIA'
    };

    videoStreamAnomalia!: MediaStream;

    latitudAnomalia!: number;
    longitudAnomalia!: number;

    fotosAnomalia: any[] = [];

    mostrarCamaraAnomalia = false;

    // ==========================================
    // LECTURAS DE ODÓMETRO / HORÓMETRO
    // ==========================================

    requiereLectura = false;

    lecturaInicialRegistrada = false;
    lecturaFinalRegistrada = false;

    lecturaInicial = 0;
    lecturaFinal = 0;

    lecturaActual: number | null = null;
    lecturaInicialSugerida: number | null = null;

    fotoLecturaInicial: File | null = null;
    fotoLecturaFinal: File | null = null;

    previewLecturaInicial: string | null = null;
    previewLecturaFinal: string | null = null;

    mostrarModalLecturaInicial = false;
    mostrarModalLecturaFinal = false;

    mostrarCamaraLectura = false;

    tipoLecturaActual: 'INICIAL' | 'FINAL' | null = null;

    videoStreamLectura!: MediaStream;
    latitudLectura!: number;
    longitudLectura!: number;

    kilometrajeFinalPendiente = false;

    mostrarModalFirma = false;
    firmaCanvas!: HTMLCanvasElement;
    firmaCtx!: CanvasRenderingContext2D;
    firmando = false;
    firmaBase64: string | null = null;

    tratamientoDatosAceptado = false;
    confirmaFirma = false;




    constructor(
        private inspeccionService: PreoperacionalService
    ) { }

    ngOnInit(): void {
        console.log('==============================');
        console.log('PREOPERACIONAL INICIANDO');
        console.log('==============================');
        this.cargarPlantilla();

    }

    // ==========================================
    // CARGAR PLANTILLA DEL OPERADOR
    // ==========================================

    cargarPlantilla(): void {

        this.cargando = true;

        this.inspeccionService
            .obtenerMiPlantilla()
            .pipe(
                finalize(() => {
                    this.cargando = false;
                })
            )
            .subscribe({

                next: (resp: any) => {

                    // =====================================================
                    // INFORMACIÓN BASE
                    // =====================================================

                    this.activo = resp.activo;
                    this.plantilla = resp.plantilla;

                    this.yaRealizada = resp.ya_realizada;
                    this.inspeccionHoy = resp.inspeccion_hoy;

                    // =====================================================
                    // LECTURA ACTUAL DEL ACTIVO
                    // =====================================================

                    this.lecturaActual =
                        resp.lectura_actual ?? null;

                    this.lecturaInicialSugerida =
                        resp.lectura_inicial_sugerida ?? null;

                    // =====================================================
                    // NO HAY INSPECCIÓN HOY
                    // =====================================================

                    if (!this.inspeccionHoy) {

                        this.inspeccion = null;
                        this.respuestas = {};
                        this.porcentaje = 0;

                        this.lecturaInicialRegistrada = false;
                        this.lecturaFinalRegistrada = false;

                        this.kilometrajeFinalPendiente = false;

                        return;
                    }

                    console.log(
                        'ESTADO INSPECCIÓN HOY:',
                        this.inspeccionHoy.estado
                    );

                    // =====================================================
                    // INSPECCIÓN FINALIZADA
                    // =====================================================

                    if (
                        this.inspeccionHoy.estado === 'FINALIZADA'
                    ) {

                        this.inspeccion = null;
                        this.respuestas = {};
                        this.porcentaje = 100;

                        this.lecturaInicialRegistrada = true;
                        this.lecturaFinalRegistrada = true;

                        this.kilometrajeFinalPendiente = false;

                        return;
                    }

                    // =====================================================
                    // PENDIENTE DE CIERRE
                    // =====================================================

                    if (
                        this.inspeccionHoy.estado === 'PENDIENTE_CIERRE'
                    ) {

                        this.inspeccion = null;

                        this.kilometrajeFinalPendiente = true;

                        this.lecturaFinalRegistrada =
                            this.inspeccionHoy.contador_final != null;

                        this.lecturaInicialRegistrada = true;

                        return;
                    }

                    // =====================================================
                    // INSPECCIÓN EN PROCESO
                    // =====================================================

                    if (
                        this.inspeccionHoy.estado === 'EN_PROCESO'
                    ) {

                        console.log(
                            'Reanudando inspección:',
                            this.inspeccionHoy.id
                        );

                        this.cargarInspeccionEnProceso(
                            this.inspeccionHoy.id
                        );

                        return;
                    }

                },

                error: err => {

                    console.error(
                        'ERROR CARGANDO PLANTILLA:',
                        err
                    );

                    alert(
                        err.error?.message ||
                        'No fue posible cargar la plantilla.'
                    );

                }

            });

    }

    private cargarInspeccionEnProceso(
        inspeccionId: number
    ): void {

        this.inspeccionService
            .obtenerInspeccion(inspeccionId)
            .subscribe({

                next: (resp: any) => {

                    console.log(
                        'INSPECCIÓN RECUPERADA:',
                        resp.data
                    );

                    this.inspeccion = resp.data;

                    // =====================================================
                    // RECUPERAR RESPUESTAS
                    // =====================================================

                    this.respuestas = {};

                    if (
                        this.inspeccion.respuestas &&
                        Array.isArray(this.inspeccion.respuestas)
                    ) {

                        this.inspeccion.respuestas.forEach(
                            (respuesta: any) => {

                                this.respuestas[
                                    respuesta.item_id
                                ] = {

                                    valor:
                                        respuesta.valor ||
                                        respuesta.respuesta ||
                                        '',

                                    observacion:
                                        respuesta.observacion ||
                                        '',

                                    fotos:
                                        respuesta.fotos ||
                                        [],

                                    respuesta_id:
                                        respuesta.id ||
                                        respuesta.respuesta_id ||
                                        null

                                };

                            }
                        );

                    }

                    // =====================================================
                    // DETERMINAR SI YA EXISTE LECTURA INICIAL
                    // =====================================================

                    this.requiereLectura =
                        this.inspeccion?.tipo_medicion === 'KILOMETRAJE' ||
                        this.inspeccion?.tipo_medicion === 'HOROMETRO';

                    this.lecturaInicialRegistrada =
                        !this.requiereLectura ||
                        this.inspeccion.contador_inicial != null;

                    // =====================================================
                    // RECUPERAR LECTURA INICIAL
                    // =====================================================

                    if (
                        this.inspeccion.contador_inicial != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.inspeccion.contador_inicial
                            );

                    } else if (
                        this.lecturaInicialSugerida != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.lecturaInicialSugerida
                            );

                    } else if (
                        this.lecturaActual != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.lecturaActual
                            );

                    }

                    // =====================================================
                    // SI FALTA LA LECTURA INICIAL
                    // =====================================================

                    if (
                        this.requiereLectura &&
                        !this.lecturaInicialRegistrada
                    ) {

                        this.mostrarModalLecturaInicial = true;

                    } else {

                        this.mostrarModalLecturaInicial = false;

                    }

                    // =====================================================
                    // RECALCULAR PROGRESO
                    // =====================================================

                    this.calcularProgreso();

                    // =====================================================
                    // LIMPIAR ESTADOS DE CIERRE
                    // =====================================================

                    this.kilometrajeFinalPendiente = false;
                    this.lecturaFinalRegistrada = false;

                },

                error: err => {

                    console.error(
                        'ERROR RECUPERANDO INSPECCIÓN:',
                        err
                    );

                    alert(
                        err.error?.message ||
                        'No fue posible recuperar la inspección en proceso.'
                    );

                }

            });

    }
    // ==========================================
    // INICIAR INSPECCIÓN
    // ==========================================

    iniciarInspeccion(): void {

        this.inspeccionService
            .iniciarInspeccion()
            .subscribe({

                next: (resp: any) => {

                    const inspeccion =
                        resp.data;

                    console.log(
                        'Respuesta iniciar inspección:',
                        inspeccion
                    );

                    // =====================================================
                    // SI YA EXISTÍA UNA INSPECCIÓN
                    // =====================================================

                    if (
                        inspeccion.estado === 'EN_PROCESO'
                    ) {

                        this.inspeccionHoy =
                            inspeccion;

                        this.cargarInspeccionEnProceso(
                            inspeccion.id
                        );

                        return;
                    }

                    // =====================================================
                    // SI ESTÁ PENDIENTE DE CIERRE
                    // =====================================================

                    if (
                        inspeccion.estado === 'PENDIENTE_CIERRE'
                    ) {

                        this.inspeccionHoy =
                            inspeccion;

                        this.inspeccion = null;

                        this.kilometrajeFinalPendiente = true;

                        return;
                    }

                    // =====================================================
                    // SI YA ESTÁ FINALIZADA
                    // =====================================================

                    if (
                        inspeccion.estado === 'FINALIZADA'
                    ) {

                        this.inspeccionHoy =
                            inspeccion;

                        this.inspeccion = null;

                        return;
                    }

                    // =====================================================
                    // NUEVA INSPECCIÓN
                    // =====================================================

                    this.inspeccion =
                        inspeccion;

                    console.log(
                        'Nueva inspección iniciada:',
                        this.inspeccion
                    );

                    // =====================================================
                    // DETERMINAR TIPO DE LECTURA
                    // =====================================================

                    this.requiereLectura =
                        this.inspeccion?.tipo_medicion === 'KILOMETRAJE' ||
                        this.inspeccion?.tipo_medicion === 'HOROMETRO';

                    // =====================================================
                    // PRELLENAR LECTURA ACTUAL
                    // =====================================================

                    if (
                        this.inspeccion.contador_inicial != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.inspeccion.contador_inicial
                            );

                    } else if (
                        this.lecturaInicialSugerida != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.lecturaInicialSugerida
                            );

                    } else if (
                        this.lecturaActual != null
                    ) {

                        this.lecturaInicial =
                            Number(
                                this.lecturaActual
                            );

                    }

                    // =====================================================
                    // MOSTRAR LECTURA
                    // =====================================================

                    if (this.requiereLectura) {

                        this.mostrarModalLecturaInicial =
                            true;

                        this.lecturaInicialRegistrada =
                            false;

                    } else {

                        this.lecturaInicialRegistrada =
                            true;

                    }

                },

                error: err => {

                    console.error(err);

                    alert(
                        err.error?.message ||
                        'No fue posible iniciar la inspección.'
                    );

                }

            });

    }

    // ==========================================
    // GUARDAR RESPUESTA
    // ==========================================
    responder(item: any, valor: string): void {

        if (!this.inspeccion) {
            return;
        }

        // ==========================================
        // ACTUALIZAR RESPUESTA
        // ==========================================

        this.respuestas[item.id] = {

            valor: valor,

            observacion:
                this.respuestas[item.id]?.observacion || '',

            fotos:
                this.respuestas[item.id]?.fotos || [],

            respuesta_id:
                this.respuestas[item.id]?.respuesta_id || null

        };

        // ==========================================
        // CALCULAR PROGRESO DESPUÉS DE RESPONDER
        // ==========================================

        this.calcularProgreso();

        // ==========================================
        // GUARDAR EN BACKEND
        // ==========================================

        this.inspeccionService.guardarRespuesta(

            this.inspeccion.id,

            {
                item_id: item.id,
                respuesta: valor,
                observacion: this.respuestas[item.id].observacion
            }

        ).subscribe({

            next: (resp: any) => {

                console.log(
                    'Respuesta guardada',
                    resp
                );

                this.respuestas[item.id].respuesta_id =
                    resp.data.id;

                if (resp.data.valor) {

                    this.respuestas[item.id].valor =
                        resp.data.valor;

                }

            },

            error: err => {

                console.error(
                    'Error guardando respuesta:',
                    err
                );

            }

        });

    }
    calcularProgreso() {

        if (!this.plantilla) return;

        let total = 0;
        let respondidas = 0;

        this.plantilla.categorias.forEach((c: any) => {

            c.items.forEach((i: any) => {

                total++;

                if (this.respuestas[i.id]) {
                    respondidas++;
                }

            });

        });

        this.porcentaje = Math.round(
            respondidas * 100 / total
        );

    }
    // ==========================================
    // OBSERVACIÓN
    // ==========================================

    verInspeccion() {

        this.inspeccionService
            .obtenerInspeccion(this.inspeccionHoy.id)
            .subscribe({

                next: (resp: any) => {

                    this.seleccionado = resp.data;

                },

                error: err => {

                    console.error(err);

                    alert(err.error?.message || 'No fue posible cargar la inspección');

                }

            });

    }
    cerrarDetalle() {

        this.seleccionado = null;

    }

    obtenerRespuesta(itemId: number) {

        if (!this.seleccionado?.respuestas) {
            return null;
        }

        return this.seleccionado.respuestas.find(
            (r: any) => r.item_id === itemId
        );

    }

    reportarAnomalia(): void {

        this.anomalia = {
            titulo: '',
            descripcion: '',
            prioridad: 'MEDIA'
        };

        this.fotosAnomalia = [];

        if (this.videoStreamAnomalia) {
            this.videoStreamAnomalia.getTracks().forEach(track => track.stop());
        }

        this.mostrarModalAnomalia = true;

    }

    guardarAnomalia() {

        this.inspeccionService

            .crearAnomalia({

                inspeccion_id: this.inspeccionHoy.id,

                titulo: this.anomalia.titulo,

                descripcion: this.anomalia.descripcion,

                prioridad: this.anomalia.prioridad

            })

            .subscribe({

                next: (resp: any) => {

                    const anomaliaId = resp.data.id;

                    //-----------------------------------
                    // Sin fotos
                    //-----------------------------------

                    if (this.fotosAnomalia.length === 0) {

                        alert("Anomalía registrada");

                        this.limpiarAnomalia();

                        this.mostrarModalAnomalia = false;

                        return;

                    }

                    //-----------------------------------
                    // Con fotos
                    //-----------------------------------

                    let subidas = 0;

                    this.fotosAnomalia.forEach(foto => {

                        this.inspeccionService

                            .subirFotoAnomalia(

                                anomaliaId,

                                foto.archivo

                            )

                            .subscribe({

                                next: () => {

                                    subidas++;

                                    if (subidas === this.fotosAnomalia.length) {

                                        alert("Anomalía registrada");

                                        this.limpiarAnomalia();

                                        this.mostrarModalAnomalia = false;

                                    }

                                },

                                error: err => {

                                    console.error(err);

                                }

                            });

                    });

                },

                error: err => {

                    alert(err.error.message);

                }

            });

    }



    guardarObservacion(item: any, texto: string): void {

        if (!this.inspeccion)
            return;

        this.inspeccionService.guardarRespuesta(

            this.inspeccion.id,

            {

                item_id: item.id,

                respuesta: this.respuestas[item.id].valor,

                observacion: texto

            }

        ).subscribe();

    }



    // ==========================================
    // FOTO
    // ==========================================

    subirFoto(

        respuestaId: number,

        event: any

    ): void {

        const archivo = event.target.files[0];

        if (!archivo)
            return;

        this.inspeccionService.subirFoto(

            respuestaId,

            archivo

        ).subscribe({

            next: () => {

                console.log('Foto subida');

            },

            error: err => {

                console.error(err);

            }

        });

    }


    // ==========================================
    // FINALIZAR INSPECCIÓN
    // ==========================================
    finalizar(): void {

        if (!this.inspeccion) {
            return;
        }

        this.calcularProgreso();

        if (this.porcentaje < 100) {

            alert(
                'Debes responder todos los ítems antes de guardar la inspección.'
            );

            return;
        }

        this.finalizando = true;

        this.inspeccionService
            .finalizarInspeccion(this.inspeccion.id)
            .pipe(
                finalize(() => {
                    this.finalizando = false;
                })
            )
            .subscribe({

                next: (resp: any) => {

                    console.log('Inspección guardada:', resp);

                    if (!resp.data.ok) {

                        alert(
                            resp.data.errores?.join('\n') ||
                            'No fue posible guardar la inspección.'
                        );

                        return;
                    }

                    // ==========================================
                    // QUEDA PENDIENTE DE CIERRE
                    // ==========================================

                    this.kilometrajeFinalPendiente = this.requiereLectura;

                    alert(
                        this.requiereLectura
                            ? 'Inspección guardada correctamente. Debes registrar la lectura final al terminar la jornada.'
                            : 'Inspección guardada correctamente.'
                    );

                    this.inspeccion = null;
                    this.respuestas = {};
                    this.porcentaje = 0;

                    this.cargarPlantilla();

                },

                error: (err) => {

                    console.error(err);

                    alert(
                        err.error?.message ||
                        'Ocurrió un error al guardar la inspección.'
                    );

                }

            });

    }


    registrarKilometrajeFinal(): void {

        // ==========================================
        // VALIDAR QUE EXISTA UNA INSPECCIÓN
        // ==========================================

        if (!this.inspeccionHoy) {
            alert('No hay una inspección pendiente de cierre.');
            return;
        }

        // ==========================================
        // VALIDAR ESTADO
        // ==========================================

        if (this.inspeccionHoy.estado !== 'PENDIENTE_CIERRE') {
            alert('La inspección no está pendiente de cierre.');
            return;
        }

        // ==========================================
        // REINICIAR DATOS DE LECTURA FINAL
        // ==========================================

        this.lecturaFinal = 0;
        this.fotoLecturaFinal = null;
        this.previewLecturaFinal = null;

        // ==========================================
        // ABRIR MODAL
        // ==========================================

        this.mostrarModalLecturaFinal = true;

    }


    async abrirCamaraLectura(
        tipo: 'INICIAL' | 'FINAL'
    ) {

        this.tipoLecturaActual = tipo;

        try {

            // ==========================================
            // OBTENER UBICACIÓN
            // ==========================================

            const pos = await new Promise<GeolocationPosition>(
                (resolve, reject) => {

                    navigator.geolocation.getCurrentPosition(

                        resolve,

                        reject,

                        {
                            enableHighAccuracy: true,
                            timeout: 10000
                        }

                    );

                }
            );

            this.latitudLectura =
                pos.coords.latitude;

            this.longitudLectura =
                pos.coords.longitude;


            // ==========================================
            // ABRIR CÁMARA
            // ==========================================

            this.videoStreamLectura =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: {
                            ideal: 'environment'
                        }

                    }

                });

            this.mostrarCamaraLectura = true;


            // Esperamos a que Angular cree el video

            setTimeout(async () => {

                const video =
                    document.getElementById(
                        'videoLectura'
                    ) as HTMLVideoElement | null;

                if (!video) {

                    console.error(
                        'No se encontró el video de lectura'
                    );

                    return;

                }

                video.srcObject =
                    this.videoStreamLectura;

                await video.play();

            }, 100);

        }

        catch (error: any) {

            console.error(error);

            alert(
                'No fue posible abrir la cámara o obtener la ubicación.'
            );

        }

    }

    capturarFotoLectura(): void {

        const video =
            document.getElementById(
                'videoLectura'
            ) as HTMLVideoElement;

        const canvas =
            document.getElementById(
                'canvasLectura'
            ) as HTMLCanvasElement;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        // ==========================================
        // DIBUJAR FOTO
        // ==========================================

        ctx.drawImage(
            video,
            0,
            0
        );


        // ==========================================
        // MARCA DE AGUA
        // ==========================================

        ctx.fillStyle =
            'rgba(0,0,0,0.65)';

        ctx.fillRect(

            0,

            canvas.height - 140,

            canvas.width,

            140

        );


        ctx.fillStyle =
            '#FFFFFF';

        ctx.font =
            '24px Arial';


        const fecha =
            new Date().toLocaleString();


        ctx.fillText(

            fecha,

            20,

            canvas.height - 100

        );


        ctx.fillText(

            `Lat: ${this.latitudLectura.toFixed(6)}`,

            20,

            canvas.height - 65

        );


        ctx.fillText(

            `Lng: ${this.longitudLectura.toFixed(6)}`,

            20,

            canvas.height - 30

        );


        // ==========================================
        // CONVERTIR A ARCHIVO
        // ==========================================

        canvas.toBlob(

            blob => {

                if (!blob) {
                    return;
                }


                const nombre =

                    this.tipoLecturaActual === 'INICIAL'

                        ? 'lectura_inicial.jpg'

                        : 'lectura_final.jpg';


                const archivo = new File(

                    [blob],

                    nombre,

                    {
                        type: 'image/jpeg'
                    }

                );


                // ======================================
                // GUARDAR SEGÚN EL TIPO
                // ======================================

                if (
                    this.tipoLecturaActual === 'INICIAL'
                ) {

                    this.fotoLecturaInicial =
                        archivo;

                    this.previewLecturaInicial =
                        URL.createObjectURL(blob);

                }


                if (
                    this.tipoLecturaActual === 'FINAL'
                ) {

                    this.fotoLecturaFinal =
                        archivo;

                    this.previewLecturaFinal =
                        URL.createObjectURL(blob);

                }


            },

            'image/jpeg',

            0.95

        );


        // ==========================================
        // CERRAR CÁMARA
        // ==========================================

        this.cerrarCamaraLectura();

    }
    cerrarCamaraLectura(): void {

        if (this.videoStreamLectura) {

            this.videoStreamLectura
                .getTracks()
                .forEach(track => track.stop());

        }

        this.mostrarCamaraLectura = false;

    }

    guardarLecturaInicial(): void {

        if (!this.inspeccion) {
            return;
        }

        // ==========================================
        // VALIDAR LECTURA
        // ==========================================

        if (
            this.lecturaInicial === null ||
            this.lecturaInicial === undefined ||
            this.lecturaInicial <= 0
        ) {

            alert(
                'Debes ingresar una lectura inicial válida.'
            );

            return;
        }

        // ==========================================
        // VALIDAR FOTO
        // ==========================================

        if (!this.fotoLecturaInicial) {

            alert(
                'Debes tomar una fotografía de la lectura inicial.'
            );

            return;
        }

        // ==========================================
        // GUARDAR EN BACKEND
        // ==========================================

        this.inspeccionService
            .guardarLecturaInicial(
                this.inspeccion.id,
                this.lecturaInicial,
                this.fotoLecturaInicial
            )
            .subscribe({

                next: (resp: any) => {

                    console.log(
                        'Lectura inicial registrada',
                        resp
                    );

                    // ==========================================
                    // SOLO AHORA SE HABILITAN LAS PREGUNTAS
                    // ==========================================

                    this.lecturaInicialRegistrada = true;

                    this.mostrarModalLecturaInicial = false;

                },

                error: err => {

                    console.error(
                        'ERROR LECTURA INICIAL:',
                        err
                    );

                    alert(
                        err.error?.message ||
                        'No fue posible guardar la lectura inicial.'
                    );

                }

            });

    }

    guardarLecturaFinal(): void {

        if (!this.inspeccionHoy) {
            return;
        }

        // =====================================================
        // VALIDAR LECTURA
        // =====================================================

        if (
            this.lecturaFinal === null ||
            this.lecturaFinal === undefined ||
            this.lecturaFinal <= 0
        ) {
            alert('Debes ingresar una lectura válida.');
            return;
        }

        // =====================================================
        // VALIDAR FOTO
        // =====================================================

        if (!this.fotoLecturaFinal) {
            alert('Debes tomar una fotografía de la lectura.');
            return;
        }

        // =====================================================
        // CERRAR MODAL DE LECTURA
        // Y ABRIR MODAL DE FIRMA
        // =====================================================

        this.mostrarModalLecturaFinal = false;

        // La lectura y la foto quedan guardadas
        // en lecturaFinal y fotoLecturaFinal
        // mientras el usuario realiza la firma.

        this.tratamientoDatosAceptado = false;
        this.confirmaFirma = false;
        this.firmaBase64 = null;

        this.abrirModalFirma();
    }


    async abrirCamara(item: any) {

        this.itemActual = item;

        //----------------------------------------
        // OBTENER UBICACIÓN
        //----------------------------------------

        try {

            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {

                navigator.geolocation.getCurrentPosition(

                    resolve,

                    reject,

                    {
                        enableHighAccuracy: true,
                        timeout: 10000
                    }

                );

            });

            this.latitud = pos.coords.latitude;
            this.longitud = pos.coords.longitude;

        } catch (err: any) {

            console.error("ERROR GPS:", err);

            alert(
                "No fue posible obtener la ubicación.\n\n" +
                err.message
            );

            return;

        }

        //----------------------------------------
        // ABRIR CÁMARA
        //----------------------------------------

        try {

            this.videoStream = await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                }

            });

            // Primero mostrar el modal
            this.mostrarCamara = true;

            // Esperar a que Angular renderice el <video>
            setTimeout(async () => {

                const video = document.getElementById("video") as HTMLVideoElement | null;

                if (!video) {

                    console.error("No encontró el elemento <video>");

                    alert("No se encontró el visor de la cámara.");

                    return;

                }

                video.srcObject = this.videoStream;

                await video.play();

            }, 100);

        } catch (err: any) {

            console.error("ERROR CAMARA:", err);

            alert(
                "No fue posible abrir la cámara.\n\n" +
                err.message
            );

        }

    }
    capturarFoto() {

        const video = document.getElementById("video") as HTMLVideoElement;

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        //------------------------------------
        // Fondo negro para la marca de agua
        //------------------------------------

        ctx.fillStyle = "rgba(0,0,0,0.6)";

        ctx.fillRect(
            0,
            canvas.height - 110,
            canvas.width,
            110
        );

        //------------------------------------
        // Texto blanco
        //------------------------------------

        ctx.fillStyle = "#FFFFFF";

        ctx.font = "24px Arial";

        const fecha = new Date().toLocaleString();

        ctx.fillText(
            fecha,
            20,
            canvas.height - 70
        );

        ctx.fillText(
            `Lat: ${this.latitud.toFixed(6)}`,
            20,
            canvas.height - 40
        );

        ctx.fillText(
            `Lng: ${this.longitud.toFixed(6)}`,
            20,
            canvas.height - 10
        );

        //------------------------------------
        // Convertir en archivo
        //------------------------------------

        canvas.toBlob(blob => {

            if (!blob) return;

            const archivo = new File(

                [blob],

                "evidencia.jpg",

                {

                    type: "image/jpeg"

                }

            );

            //--------------------------------
            // Subir al servidor
            //--------------------------------

            this.inspeccionService.subirFoto(
                this.respuestas[this.itemActual.id].respuesta_id,
                archivo
            ).subscribe({

                next: (resp: any) => {

                    console.log("RESPUESTA DEL BACKEND");
                    console.log(resp);

                    const itemId = this.itemActual.id;

                    this.respuestas[itemId] = {
                        ...this.respuestas[itemId],
                        fotos: [
                            ...this.respuestas[itemId].fotos,
                            resp.data
                        ]
                    };

                    console.log("ACTUALIZADO");
                    console.log(this.respuestas[itemId]);

                },

                error: err => {

                    console.error(err);

                }

            });

        }, "image/jpeg", 0.95);

        //------------------------------------
        // Apagar cámara
        //------------------------------------

        this.videoStream.getTracks().forEach(track => track.stop());

        this.mostrarCamara = false;

    }

    cerrarCamara(): void {

        if (this.videoStream) {

            this.videoStream.getTracks().forEach(track => track.stop());

        }

        this.mostrarCamara = false;

        this.itemActual = null;

    }


    async abrirCamaraAnomalia() {
        if (this.fotosAnomalia.length >= 3) {
            alert("Máximo 3 fotografías.");
            return;
        }

        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    { enableHighAccuracy: true }
                );
            });

            this.latitudAnomalia = pos.coords.latitude;
            this.longitudAnomalia = pos.coords.longitude;

            this.videoStreamAnomalia = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } }
            });

            // Ocultar modal de anomalía
            this.mostrarModalAnomalia = false;

            // Mostrar cámara
            this.mostrarCamaraAnomalia = true;

            setTimeout(async () => {
                const video = document.getElementById(
                    "videoAnomalia"
                ) as HTMLVideoElement | null;

                if (!video) {
                    console.error("No se encontró videoAnomalia");
                    return;
                }

                video.srcObject = this.videoStreamAnomalia;
                await video.play();
            }, 100);

        } catch (e) {
            console.error("Error al abrir cámara de anomalía:", e);
        }
    }
    capturarFotoAnomalia() {

        const video = document.getElementById("videoAnomalia") as HTMLVideoElement;

        const canvas = document.getElementById("canvasAnomalia") as HTMLCanvasElement;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        //--------------------------------
        // Marca de agua
        //--------------------------------

        ctx.fillStyle = "rgba(0,0,0,.6)";

        ctx.fillRect(

            0,

            canvas.height - 110,

            canvas.width,

            110

        );

        ctx.fillStyle = "#FFF";

        ctx.font = "24px Arial";

        ctx.fillText(

            new Date().toLocaleString(),

            20,

            canvas.height - 70

        );

        ctx.fillText(

            `Lat: ${this.latitudAnomalia.toFixed(6)}`,

            20,

            canvas.height - 40

        );

        ctx.fillText(

            `Lng: ${this.longitudAnomalia.toFixed(6)}`,

            20,

            canvas.height - 10

        );

        canvas.toBlob(blob => {

            if (!blob) return;

            const archivo = new File(

                [blob],

                "anomalia.jpg",

                {

                    type: "image/jpeg"

                }

            );

            this.fotosAnomalia.push({

                archivo,

                preview: URL.createObjectURL(blob)

            });

        }, "image/jpeg", 0.95);

        this.videoStreamAnomalia
            .getTracks()
            .forEach(t => t.stop());

        this.mostrarCamaraAnomalia = false;

        // Volver al modal de reportar anomalía
        this.mostrarModalAnomalia = true;

    }

    cerrarCamaraAnomalia() {

        if (this.videoStreamAnomalia) {
            this.videoStreamAnomalia
                .getTracks()
                .forEach(t => t.stop());
        }

        this.mostrarCamaraAnomalia = false;

        // Regresar al formulario de anomalía
        this.mostrarModalAnomalia = true;
    }

    eliminarFotoAnomalia(index: number) {

        this.fotosAnomalia.splice(index, 1);

    }
    limpiarAnomalia() {

        this.anomalia = {

            titulo: "",

            descripcion: "",

            prioridad: "MEDIA"

        };

        this.fotosAnomalia = [];

    }

    descargarPdf(inspeccion: any) {

        this.inspeccionService
            .descargarPDF(inspeccion.id)
            .subscribe({

                next: (blob) => {

                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');

                    a.href = url;

                    a.download = `INSPECCION_${inspeccion.id}.pdf`;

                    a.click();

                    window.URL.revokeObjectURL(url);

                }

            });

    }


    abrirModalFirma(): void {
        this.mostrarModalFirma = true;

        setTimeout(() => {
            const canvas = document.getElementById(
                'canvasFirma'
            ) as HTMLCanvasElement;

            if (!canvas) {
                return;
            }

            this.firmaCanvas = canvas;

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }

            this.firmaCtx = ctx;

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000000';

            this.configurarEventosFirma();
        });
    }

    iniciarFirma(event: MouseEvent | TouchEvent): void {
        event.preventDefault();

        this.firmando = true;

        const posicion = this.obtenerPosicionFirma(event);

        this.firmaCtx.beginPath();
        this.firmaCtx.moveTo(
            posicion.x,
            posicion.y
        );
    }

    dibujarFirma(event: MouseEvent | TouchEvent): void {
        if (!this.firmando) {
            return;
        }

        event.preventDefault();

        const posicion = this.obtenerPosicionFirma(event);

        this.firmaCtx.lineTo(
            posicion.x,
            posicion.y
        );

        this.firmaCtx.stroke();
    }

    terminarFirma(): void {
        this.firmando = false;
    }

    obtenerPosicionFirma(
        event: MouseEvent | TouchEvent
    ): { x: number; y: number } {

        const rect = this.firmaCanvas.getBoundingClientRect();

        let clientX: number;
        let clientY: number;

        if (event instanceof TouchEvent) {

            const touch = event.touches[0] || event.changedTouches[0];

            clientX = touch.clientX;
            clientY = touch.clientY;

        } else {

            clientX = event.clientX;
            clientY = event.clientY;
        }

        return {
            x: (
                clientX - rect.left
            ) * (
                    this.firmaCanvas.width / rect.width
                ),

            y: (
                clientY - rect.top
            ) * (
                    this.firmaCanvas.height / rect.height
                )
        };
    }
    configurarEventosFirma(): void {
        const canvas = this.firmaCanvas;

        canvas.onmousedown = (event) =>
            this.iniciarFirma(event);

        canvas.onmousemove = (event) =>
            this.dibujarFirma(event);

        canvas.onmouseup = () =>
            this.terminarFirma();

        canvas.onmouseleave = () =>
            this.terminarFirma();

        canvas.ontouchstart = (event) =>
            this.iniciarFirma(event);

        canvas.ontouchmove = (event) =>
            this.dibujarFirma(event);

        canvas.ontouchend = () =>
            this.terminarFirma();
    }

    limpiarFirma(): void {
        if (!this.firmaCtx) {
            return;
        }

        this.firmaCtx.clearRect(
            0,
            0,
            this.firmaCanvas.width,
            this.firmaCanvas.height
        );

        this.firmaBase64 = null;
    }

    obtenerFirma(): string | null {

        if (!this.firmaCanvas) {
            return null;
        }

        const canvas = this.firmaCanvas;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        const imagen = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        for (let i = 3; i < imagen.data.length; i += 4) {

            if (imagen.data[i] > 0) {
                return canvas.toDataURL('image/png');
            }
        }

        return null;
    }

    cerrarModalFirma(): void {

        this.mostrarModalFirma = false;

        this.firmando = false;

        this.tratamientoDatosAceptado = false;

        this.confirmaFirma = false;

        this.firmaBase64 = null;

        if (this.firmaCtx && this.firmaCanvas) {

            this.firmaCtx.clearRect(
                0,
                0,
                this.firmaCanvas.width,
                this.firmaCanvas.height
            );
        }
    }

    confirmarFirma(): void {

        // =====================================================
        // VALIDAR TRATAMIENTO DE DATOS
        // =====================================================

        if (!this.tratamientoDatosAceptado) {
            alert('Debe aceptar el tratamiento de datos.');
            return;
        }

        // =====================================================
        // VALIDAR CONFIRMACIÓN
        // =====================================================

        if (!this.confirmaFirma) {
            alert('Debe confirmar que está firmando la inspección.');
            return;
        }

        // =====================================================
        // OBTENER FIRMA
        // =====================================================

        const firmaBase64 = this.obtenerFirma();

        if (!firmaBase64) {
            alert('Debe realizar la firma antes de finalizar.');
            return;
        }

        // =====================================================
        // VALIDAR INSPECCIÓN
        // =====================================================

        if (!this.inspeccionHoy) {
            alert('No hay una inspección pendiente de cierre.');
            return;
        }

        // =====================================================
        // VALIDAR LECTURA Y FOTO
        // =====================================================

        if (
            this.lecturaFinal === null ||
            this.lecturaFinal === undefined ||
            this.lecturaFinal <= 0
        ) {
            alert('No se encontró una lectura final válida.');
            return;
        }

        if (!this.fotoLecturaFinal) {
            alert('No se encontró la fotografía de la lectura final.');
            return;
        }

        // =====================================================
        // CONVERTIR FIRMA A FILE
        // =====================================================

        const firmaFile = this.base64ToFile(
            firmaBase64,
            `firma_${this.inspeccionHoy.id}.png`
        );

        // =====================================================
        // GUARDAR
        // =====================================================

        this.finalizando = true;

        this.inspeccionService
            .guardarLecturaFinal(
                this.inspeccionHoy.id,
                this.lecturaFinal,
                this.fotoLecturaFinal,
                firmaFile,
                this.tratamientoDatosAceptado,
                this.confirmaFirma
            )
            .pipe(
                finalize(() => {
                    this.finalizando = false;
                })
            )
            .subscribe({

                next: (resp: any) => {

                    console.log(
                        'Inspección finalizada correctamente:',
                        resp
                    );

                    // Cerrar modal de firma
                    this.mostrarModalFirma = false;

                    // Limpiar firma
                    this.firmaBase64 = null;
                    this.tratamientoDatosAceptado = false;
                    this.confirmaFirma = false;

                    // Cerrar lectura final
                    this.mostrarModalLecturaFinal = false;

                    alert(
                        'Firma registrada. Inspección finalizada correctamente.'
                    );

                    // =================================================
                    // LIMPIAR ESTADO
                    // =================================================

                    this.inspeccion = null;
                    this.inspeccionHoy = null;
                    this.respuestas = {};
                    this.porcentaje = 0;

                    this.kilometrajeFinalPendiente = false;
                    this.lecturaFinalRegistrada = true;

                    // =================================================
                    // RECARGAR PLANTILLA
                    // =================================================

                    this.cargarPlantilla();

                },

                error: (err) => {

                    console.error(
                        'ERROR FINALIZANDO INSPECCIÓN:',
                        err
                    );

                    alert(
                        err.error?.message ||
                        'No fue posible finalizar la inspección.'
                    );

                }

            });
    }
    private base64ToFile(
        base64: string,
        filename: string
    ): File {

        const arr = base64.split(',');
        const mime = arr[0]
            .match(/:(.*?);/)?.[1] || 'image/png';

        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);

        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }

        return new File(
            [u8arr],
            filename,
            { type: mime }
        );
    }
}