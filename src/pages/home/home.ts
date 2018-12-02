import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public loading:any;

  public flagTeatros:boolean = false;
  public teatros = Array();

  public flagDias:boolean = false;
  public diasLayout = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  public dias = ['LUNES', 'MARTES', 'MIERCOLES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'SÁBADO', 'DOMINGO'];

  public flagPelicula:boolean = false;
  public Pelicula = [ 
    { 
      "nombre": "LA MONJA", "foto":'https://cinemarkmedia.modyocdn.com/co/300x400/185656.jpg?version=1539468000000'  
    },
    { 
      "nombre": "VENOM", "foto":'https://cinemarkmedia.modyocdn.com/co/300x400/189859.jpg?version=1539468000000'  
    },
    { 
      "nombre": "EL DEPREDADOR", "foto":'https://cinemarkmedia.modyocdn.com/co/300x400/188314.jpg?version=1539468000000'  
    },
  ];

  public flagFormato:boolean = false;
  public Formato = ['2D', '3D'];

  public flagHora:boolean = false;
  public Hora = ['11 AM', '3 PM', '6 PM'];
  public HoraValidate = [ '11 AM', '3 PM', '6 PM', '11AM', '3PM', '6PM', '11 A M', '3 P M', '6 P M'];

  public flagValor:boolean = false;
  public cantidadBoletas= ['1', '2', '3', '4', '5'];

  public flagFactura:boolean = false;

  public respuestaCorrecta;

  public respuesta1;
  public respuesta2;
  public respuesta3;
  public respuesta4;
  public respuesta5;
  public respuesta6;
  public respuesta7;
  public respuesta8;
  public respuesta9;


  constructor(
              public  loadingCtrl: LoadingController,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private speechRecognition: SpeechRecognition,
              private tts: TextToSpeech
  ) {
    /*Opciones de ubicación */
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then((result: NativeGeocoderReverseResult[] ) => {
          this.loading.dismiss();
          this.Ubicacion(result[0]['locality']);
        }
      )
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  public reconocerVoz(){

    let options = {
      matches:1,
      showPopup: false
    }

    let promesa = new Promise((resolve)=>{
        this.speechRecognition.hasPermission()
        .then((hasPermission: boolean) => {
          console.log(hasPermission);
          if(hasPermission){
    
            this.speechRecognition.startListening(options)
            .subscribe(
              (matches: Array<string>) => {
                resolve(matches[0]);
              },
              (onerror) => {
                this.reconocerVoz();
              }
            );
    
          }else{
            this.speechRecognition.requestPermission()
            .then(
              (data) => {
                console.log(data);
              }
            )
          }
        })
    });

    return promesa;

  }

  public hablar(mensaje:string){

    let options = {
      text: mensaje,
      locale: 'es-Co',
      rate: 1
    }

    let promesa = new Promise((resolve)=>{
      this.tts.speak(options)
      .then(() => {
        resolve(true);
      })
    })
    return promesa;
  }

  public presentLoading() {

    this.loading = this.loadingCtrl.create({
      content: "Un momento...",
    })

    this.loading.present();
  }

  public Ubicacion(ciudad){
    this.hablar('Bienvenido a siri cinemark,                                                                                        te encuentras en '+ ciudad ).then(()=>{
      setTimeout(() => {

        if( ciudad == 'Bucaramanga'){

          this.teatros.push({ "nombre": "MEGAMALL", "foto":'https://cinemarkco.modyocdn.com/uploads/3d9c33e3-0613-43bf-8f4b-9dfff9a624ac/original/787-Megamall.jpg'  
          })

          this.flagTeatros = true;

          console.log(this.teatros);

        }else if( ciudad == 'Floridablanca'){

          this.teatros.push({ "nombre": "LA FLORIDA", "foto":'https://cinemarkco.modyocdn.com/uploads/df8dbe58-497c-4ccc-a0c0-8aad94b3cca6/original/789-La-Florida.jpg' });

          this.teatros.push({ "nombre": "PARQUE CARACOLI", "foto":'https://cinemarkco.modyocdn.com/uploads/4e26fa71-2c54-4dff-a7e8-4d8ac293e9e5/original/2408-Parque-Caracoli.jpg'} );

          this.flagTeatros = true;
        }

        this.pregunta1();

      }, 1500);
    })
  }

  public pregunta1(){
    this.respuestaCorrecta = false;
    this.hablar('        a cual teatro deseas ir, dime una opción de las mostradas en pantalla').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          ////////
          for (let index = 0; index < this.teatros.length; index++) {
            if(this.teatros[index].nombre == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta1 = data.toString().toUpperCase();
            this.flagTeatros = false;
            this.pregunta2();
          }else{
            setTimeout(() => {
              this.hablar('Opcion no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta1();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta2(){
    this.respuestaCorrecta = false;
    this.flagDias= true;
    this.hablar('Que dia de la semana quieres ir').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          console.log(data.toString().toUpperCase());
          ////////
          for (let index = 0; index < this.dias.length; index++) {
            if(this.dias[index] == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta2 = data.toString().toUpperCase();
            this.flagDias = false;
            this.pregunta3();
          }else{
            setTimeout(() => {
              this.hablar('Opcion no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta2();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta3(){
    this.respuestaCorrecta = false;
    this.flagPelicula = true;
    this.hablar('Que pelicula quieres ver').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          ////////
          for (let index = 0; index < this.Pelicula.length; index++) {
            if(this.Pelicula[index].nombre == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta3 = data.toString().toUpperCase();
            this.flagPelicula = false;
            this.pregunta4();
          }else{
            setTimeout(() => {
              this.hablar('Opcion no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta3();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta4(){
    this.respuestaCorrecta = false;
    this.flagFormato = true;
    this.hablar('En que formato quieres ver la pelicula').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          ////////
          for (let index = 0; index < this.Formato.length; index++) {
            if(this.Formato[index] == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta4 = data.toString().toUpperCase();
            this.flagFormato = false;
            this.pregunta5();
          }else{
            setTimeout(() => {
              this.hablar('Opcion no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta4();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta5(){
    this.respuestaCorrecta = false;
    this.flagHora = true;
    this.hablar('En que horario quieres ver la pelicula').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          console.log(data.toString().toUpperCase())
          ////////
          for (let index = 0; index < this.HoraValidate.length; index++) {
            if(this.HoraValidate[index] == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta5 = data.toString().toUpperCase();
            this.flagHora = false;
            this.pregunta6();
          }else{
            setTimeout(() => {
              this.hablar('Opcion no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta5();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta6(){
    this.respuestaCorrecta = false;
    this.flagValor = true;
    this.hablar('El valor de cada boleta es de ocho mil quinientos pesos, recuerda que como maximo puedes adquirir 5 boletas.                                              Dime cuantas boletas quieres.').then(()=>{
      setTimeout(() => {
        this.reconocerVoz().then((data)=>{
          ////////
          for (let index = 0; index < this.cantidadBoletas.length; index++) {
            if(this.cantidadBoletas[index] == data.toString().toUpperCase() ){
              this.respuestaCorrecta = true;
            }
          }
          ///////
          if(this.respuestaCorrecta){
            this.respuesta6 = data.toString().toUpperCase();
            this.flagValor = false;
            this.pregunta7();
          }else{
            setTimeout(() => {
              this.hablar('Cantidad de boletas no valida').then(()=>{
                setTimeout(() => {
                  this.pregunta6();
                }, 1500);
              })
            }, 1000);
          }
        })
      }, 1000);
    })
  }

  public pregunta7(){
    this.flagFactura = true;
    this.respuesta7 = ( parseInt(this.respuesta6) * 8500);
    this.hablar('En pantalla esta tu orden,   Gracias por usar siri cinemark,              Disfruta tu pelicula');
  }

}
