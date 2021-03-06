/*
    Notas importante: Al parecer hay un Bug al momento de convertir de adrees String a longitud y latitud,
    En la funcion calcularRutaFinla() en geocoder.

    Mirar como se arregla
*/

var iconOrigin= 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var lugares = new Array();

//Posicion actual o seleccionada
var currentPosition;
//posicion mas cerca de nuestra ubicacion actual
var menor;


$(function() {
    Dajaxice.Principal.get_locals(my_callback);
    map.removePolylines();
    map.removeMarkers();
});

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

function my_callback(datas){
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
    //actualziarRutas();
     // actualizarUbicacion();
  }
});

//Actualiza todas las rutas con markers
function actualziarRutas(){

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
    for (var i = 0; i < lugares.length; i++) {
        var myMarker_destino={
            animation: google.maps.Animation.DROP,
            lat: lugares[i].lat(),
            lng: lugares[i].lng(),
            title: 'Destino '+i,
            infoWindow: {
                content: '<p>Destino '+i+' </p>'
            }
        };
        map.addMarker(myMarker_destino);
    }
}

//actualiza la ubicacin py pone el marker
function actualizarUbicacion(){
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
    $('[name="lan"]').val(currentPosition.lat());
    $('[name="lot"]').val(currentPosition.lng());
}
