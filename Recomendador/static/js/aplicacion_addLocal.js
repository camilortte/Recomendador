/*
    Notas importante: Al parecer hay un Bug al momento de convertir de adrees String a longitud y latitud,
    En la funcion calcularRutaFinla() en geocoder.

    Mirar como se arregla
*/

var iconOrigin= 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
//Posicion actual o seleccionada
var currentPosition;


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
    actualizarUbicacion();
  }
});


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
