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
            }
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




		/*
			Notas importante: Al parecer hay un Bug al momento de convertir de adrees String a longitud y latitud,
			En la funcion calcularRutaFinla() en geocoder.

			Mirar como se arregla
		*/

		var menor2;
		var iconOrigin= 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
		var lugares = new Array();
		/*lugares[0] =   new google.maps.LatLng(4.612186883910265,-74.13780212402344);
		lugares[1] =   new google.maps.LatLng(4.622624242821189, -74.146728515625);
		lugares[2] =   new google.maps.LatLng(4.585684,-74.189537);
		lugares[3] =   new google.maps.LatLng(4.61526677627858, -74.12012100219727);
		lugares[4] =   new google.maps.LatLng(4.597659,-74.121517);
		lugares[5] =   new google.maps.LatLng(4.593598,-74.175168);
		lugares[6] =   new google.maps.LatLng(4.648631418433212, -74.10175323486328);*/

		//Posicion actual o seleccionada
		var currentPosition;
		//posicion mas cerca de nuestra ubicacion actual
		var menor;

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
             // actualizarUbicacion();
		  }
		});



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

		//Obtenemos todas las distancias para calcular las mas corta
		function obtenerDistanciaMasCorta(){
			//alert("DESTINO1: "+destino1);
			//alert("DESTINO: "+destino2);
			//var medio=$('#mode').val();
			//alert("MODE: "+medio);
			var servicio = new google.maps.DistanceMatrixService();
		 	servicio.getDistanceMatrix(
		    {
		      origins: [currentPosition],
		      destinations: lugares,
		      travelMode: google.maps.TravelMode['DRIVING'],
		      unitSystem: google.maps.UnitSystem.METRIC,
		      avoidHighways: false,
		      avoidTolls: false
		    }, callback);
		}

		//Esta funcion se llama cuando las distancias se calculan
		function callback(response, status) {

			var contador_menor;
			if (status == google.maps.DistanceMatrixStatus.OK) {
		    var origins = response.originAddresses;
		    var destinations = response.destinationAddresses;

		    menor_distencia=response.rows[0].elements[0];
		    contador_menor=0;
		    menor=destinations[0];

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

			calcularRutaFinal();

		  }else{
		  	 alert('Error was: ' + status);
		  }
		}

		//Obtiene el punto mas cercano y traza la ruta y los markers
		function calcularRutaFinal(){
			map.removePolylines();
			//map.removeMarkers();
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
			//map.addMarker(myMarker_oringe);

			var geocoder = new google.maps.Geocoder();
			 	geocoder.geocode( { 'address': menor}, function(results, status) {
		      	if (status == google.maps.GeocoderStatus.OK) {
		      		//menor=results[0].geometry.location;
		      		alert(menor+"  "+results[0].geometry.location);
		      		var myMarker_destino={
					  	animation: google.maps.Animation.DROP,
					  	lat: results[0].geometry.location.lat(),
					  	lng: results[0].geometry.location.lng(),
					  	title: 'Destino ',
					  	infoWindow: {
					  		content: '<p>Destino</p>'
					  	}
					};
					//map.addMarker(myMarker_destino);
		      	} else {
		        	alert("Geocode was not successful for the following reason: " + status);
		      	}
		    });

			//map.addMarker(myMarker_destino);
			map.drawRoute({
			  origin: [currentPosition.lat(), currentPosition.lng()],
			  destination: menor,
			  travelMode: 'driving',
			  strokeColor: '#FF0000',
			  strokeOpacity: 0.4,
			  strokeWeight: 6
			});


		}

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

				//creamos la ruta
				/*
				map.drawRoute({
				  origin: [currentPosition.lat(), currentPosition.lng()],
				  destination: [lugares[i].lat(), lugares[i].lng()],
				  travelMode: 'driving',
				  strokeColor: '#FF0000',
				  strokeOpacity: 0.4,
				  strokeWeight: 6
				});			    */
			}

		}

		//aniade un Marker del arreglo lugares I
		function addMyMarkers(i){
			console.log("Actualizando "+i);
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
			map.drawRoute({
			  origin: [currentPosition.lat(), currentPosition.lng()],
			  destination: [lugares[i].lat(), lugares[i].lng()],
			  travelMode: 'driving',
			  strokeColor: '#FF0000',
			  strokeOpacity: 0.4,
			  strokeWeight: 6
			});
		}

		//el evento al Click el boton para calcular el punto más sercano.
		$("#calculaRuta").click(function() {
		  obtenerDistanciaMasCorta();
		});
