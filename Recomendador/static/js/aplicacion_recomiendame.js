/**
 * Created by camilortte on 11/11/13.
 */
/*
    Notas importante: Al parecer hay un Bug al momento de convertir de adrees String a longitud y latitud,
    En la funcion calcularRutaFinla() en geocoder.

    Mirar como se arregla
*/

var iconOrigin= 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var lugares = new Array();
var contador_menor;
//Posicion actual o seleccionada
var currentPosition;
//posicion mas cerca de nuestra ubicacion actual
var menor;
var data;


$(function() {
    Dajaxice.Principal.get_locals(my_callback);
    geolocalizar();
    map.removePolylines();
    map.removeMarkers();
});

$( "#seleccion" ).on('change', function() {
    Dajaxice.Principal.get_locals_filter(my_callback,{'tipoLocal':$('#seleccion').val()});

});
function geolocalizar(){
    GMaps.geolocate({
  success: function(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
        currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myMarker_oringe={
            icon: iconOrigin,
            animation: google.maps.Animation.DROP,
            color: '#FF0000',
            lat: currentPosition.lat(),
            lng: currentPosition.lng(),
            title: 'Origen',
            infoWindow: {
              content:  '<p>Origen</p>'
            }
        };
        map.addMarker(myMarker_oringe);
  },
  error: function(error) {
    alert('Geolocation failed: '+error.message);
  },
  not_supported: function() {
    alert("Your browser does not support geolocation");
  },
  always: function() {
    //DONE
   }
});
}


function my_callback(datas){
    data=datas;
    map.removePolylines();
    map.removeMarkers();
    lugares=new Array();
    try
    {
         var myMarker_oringe={
            icon: iconOrigin,
            animation: google.maps.Animation.DROP,
            color: '#FF0000',
            lat: currentPosition.lat(),
            lng: currentPosition.lng(),
            title: 'Origen',
            infoWindow: {
              content:  '<p>Origen</p>'
            }
        };
    map.addMarker(myMarker_oringe);
    }
    catch(err)
    {
    //Handle errors here
    }



    for (var i=0;i<datas.length;i++){
        lugares.push(new google.maps.LatLng(datas[i][1],datas[i][2] ));
        var myMarker_destino={
            animation: google.maps.Animation.DROP,
            lat: lugares[i].lat(),
            lng: lugares[i].lng(),
            title: datas[i][0],
            infoWindow: {
                content: '<b>'+datas[i][0]+'</b><p>'+datas[i][3]+'</p><p>Tipo: '+datas[i][5]+'</p><p>Direccion: '+datas[i][4]+'</p>'
            }
        };
        map.addMarker(myMarker_destino);
    }
}

//Creacion facil de nuestro mapa proporcionada por gmaps.js
var map = new GMaps({
  div: '#map',
  zoom: 11,
  lat: 4.579825820210706,
  lng: -74.08602476119995,
  //Cuando se de un clic se dispara el evento que obtiene las cordenadas en el click
  click: function(e) {
    var myLatLng = e.latLng;
    var lat = myLatLng.lat();
    var lng = myLatLng.lng();
    //Modificamos nuestra posicion actual
    currentPosition = new google.maps.LatLng(lat,lng);
    //Actualizamos las rutas de nuestra base de datos
    actualziarRutas();
  }
});

//Actualiza todas las rutas con markers
function actualziarRutas(){
    lugares=new Array();
    map.removePolylines();
    map.removeMarkers();
    var myMarker_oringe={
        icon: iconOrigin,
        animation: google.maps.Animation.DROP,
        color: '#FF0000',
        lat: currentPosition.lat(),
        lng: currentPosition.lng(),
        title: 'Origen',
        infoWindow: {
          content:  '<p>Origen</p>'
        }
    };
    map.addMarker(myMarker_oringe);
    for (var i=0;i<data.length;i++){
        lugares.push(new google.maps.LatLng(data[i][1],data[i][2] ));
        var myMarker_destino={
            animation: google.maps.Animation.DROP,
            lat: lugares[i].lat(),
            lng: lugares[i].lng(),
            title: data[i][0],
            infoWindow: {
                content: '<b>'+data[i][0]+'</b><p>'+data[i][3]+'</p><p>Tipo: '+data[i][5]+'</p><p>Direccion: '+data[i][4]+'</p>'
            }
        };
        map.addMarker(myMarker_destino);
    }
}

$('#botonRecomendacion').click(function(){
    obtenerDistanciaMasCorta();
})

//Obtenemos todas las distancias para calcular las mas corta
function obtenerDistanciaMasCorta(){
    //alert("DESTINO1: "+destino1);
    //alert("DESTINO: "+destino2);
    var medio=$('#seleccion_medio').val();
    //alert("MODE: "+medio);
    var servicio = new google.maps.DistanceMatrixService();
    servicio.getDistanceMatrix(
    {
      origins: [currentPosition],
      destinations: lugares,
      travelMode: google.maps.TravelMode[medio],
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}


//Esta funcion se llama cuando las distancias se calculan
function callback(response, status) {

    map.removePolylines();
    var count_menor=0;
    //alert(JSON.stringify(response));
    if (status == google.maps.DistanceMatrixStatus.OK) {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    menor_distencia=response.rows[0].elements[0];
    contador_menor=0;
    menor=destinations[0];

    try{
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          //addMarker(origins[i], false);
          for (var j = 0; j < results.length; j++) {
            //addMarker(destinations[j], true);
            var element = results[j];
            var distance = element.distance.text;
            var duration = element.duration.text;
            //alert("DISTANACIA: "+distance+"\nDuracion: "+duration);
            var from = origins[i];
            var to = destinations[j];
            //comprobamos si el resultado actual es menor al anterior
            if(menor_distencia.duration.value>element.duration.value){
                menor_distencia=element;
                contador_menor=j;
                menor=destinations[j];
                //alert(destinations[j]);
            }
          }
        }
        //calcularRutaFinal();
        map.drawRoute({
          origin: [currentPosition.lat(), currentPosition.lng()],
          destination: [lugares[contador_menor].lat(),lugares[contador_menor].lng()],
          travelMode: 'driving',
          strokeColor: '#FF0000',
          strokeOpacity: 0.4,
          strokeWeight: 6
        });
        onResult()
    }catch (error){
        $('#resultado').html("<h2>Ups no encontramos anda</h2>");
    }
  }else{
     alert('Error was: ' + status);
  }
}

function onResult(){
 //cambiamos el local
    var string1="<h2>Encontramos una buena solución:</h2>";
    try{
        $('#resultado').html('<b>'+string1+"<br>"+data[contador_menor][0]+
            '</b><p>'+data[contador_menor][3]+'</p><p>Tipo: '+data[contador_menor][5]+'</p><p>Direccion: '+data[contador_menor][4]+'</p>');
    }catch (err){
        alert("ERRO "+err);
    }
}






