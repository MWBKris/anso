var mainData = {
	url: 'http://www.iczo.be/mobile/',
	currentLat: '',
	currentLong: '',
};

var lang;
var labels;
var setLanguage = {
	init: function() {
		// get the client lang
		if (navigator.language) // non IE
			lang = navigator.language.substring(0, 2);
		else
			lang = "en";

		setLanguage.setLabels();
	},
	setLabels: function() {
		if (lang == 'nl') {
			labels = {
				'lblViewSite': 'Bekijk onze mobiele site',
				'lblRouteDescription': 'Routebeschrijving',
				'lblSendUsAPhoto': 'Stuur ons een foto',
				'lblBackToMainMenu': 'Terug naar het menu',
				'lblCalculateRoute': 'Bereken route',
				'lblYourName': 'Uw naam',
				'lblYourEmailAddress': 'E-mail adres',
				'lblPhoto': 'Foto',
				'lblRemarks': 'Opmerkingen',
				'lblSend': 'Versturen',
				'lblNoIternetConnection': 'Er is momenteel geen internet verbinding',
				'lblFormSubmitted': 'Bedankt, wij contacteren u spoedig',
				'lblPleaseFillInAllFielts': 'Gelieve alle verplichte velden in te vullen'
			};
		} else if (lang == 'fr') {
			labels = {
				'lblViewSite': 'Voir notre site mobile',
				'lblRouteDescription': 'Description de l\'itinéraire',
				'lblSendUsAPhoto': 'Envoyez-nous une photo',
				'lblBackToMainMenu': 'Retour au menu',
				'lblCalculateRoute': 'Calculer l\'itinéraire',
				'lblYourName': 'Votre nom',
				'lblYourEmailAddress': 'Adresse e-mail',
				'lblPhoto': 'Photo',
				'lblRemarks': 'Remarques',
				'lblSend': 'Envoyer',
				'lblNoIternetConnection': 'Vous n\'êtes pas connecté à Internet',
				'lblFormSubmitted': 'Merci, nous vous contacterons prochainement',
				'lblPleaseFillInAllFielts': 'S\'il vous plaît remplir tous les champs obligatoires'
			};
		} else {
			labels = {
				'lblNoIternetConnection': 'You are currently not connected to the internet',
				'lblFormSubmitted': 'Thank you, we will contact you shortly',
				'lblPleaseFillInAllFielts': 'Please fill in all required fields'
			};
		}

		if (Object.keys(labels).length) {
			$.each(labels, function(k, v) {
				$('.' + k).html(v);
				$('.' + k).val(v);
			});
		}
	}
};

var positionCalculator = {
	doFullMenu: function() {
		var totalHeight = $('#fullMenu').outerHeight();
		var menuHeight = $('#fullMenu > menu').outerHeight();
		$('#fullMenu > menu').css('margin-top', ((totalHeight - menuHeight) / 2) + 'px');

		window.setTimeout(function() {
			// compensate for slow logo loading
			var totalHeight = $('#fullMenu').outerHeight();
			var menuHeight = $('#fullMenu > menu').outerHeight();
			$('#fullMenu > menu').css('margin-top', ((totalHeight - menuHeight) / 2) + 'px');
		}, 1000);
	},
	bottomFiller: function() {
		var topPosition = $('.notMainWindow:visible .bottomFiller').position();
		var availableHeight = $('.notMainWindow:visible').outerHeight();
		$('.bottomFiller').height(availableHeight - $('.notMainWindow:visible .untriggerIframe').outerHeight());
	}
};

var onlineChecker = {
    init: function() {
        $('.checkOnline').click(function() {
            if (!navigator.onLine) {
                alert(labels.lblNoIternetConnection);
                return false;
            }
        });
    }
};

var endlocation = { 'center': '50.878251,3.656869,', 'zoom': 14 }; // Google maps
var start; // Google maps
var themap; // Google maps
var destination = "ICZO vzw, Mandenmakersstraat 15, 9700 Oudenaarde, Belgium"; // Google maps

var interfaceSwitcher = {
	init: function() {
		$('.triggerIframe').click(function() {
			$('.mainWindow').fadeOut();

			$('#iFrame').fadeIn(function () {
				positionCalculator.bottomFiller();
			});

			return false;
		});
		$('.untriggerIframe').click(function() {
			interfaceSwitcher.returnToMenu();

			return false;
        });
		$('#showRoute').click(function() {
			$('.mainWindow').fadeOut();

			$('#mapWrapper').fadeIn(function () {
				positionCalculator.bottomFiller();
			});


			$(document).ready(function() {
				$('#map').gmap({'center': endlocation.center, 'zoom': endlocation.zoom, 'disableDefaultUI': true, 'callback': function() {
					themap = this;

					if (navigator.geolocation) {
//						geoLocator.getCurrentLocation();
navigator.geolocation.getCurrentPosition(function(position) {
 mainData.currentLat = parseInt(position.coords.latitude * 10000, 10) / 10000;
 mainData.currentLong = parseInt(position.coords.longitude * 10000, 10) / 10000;
 start = new google.maps.LatLng(mainData.currentLat, mainData.currentLong);
 themap.get('map').panTo(start);
});
start = new google.maps.LatLng(mainData.currentLat, mainData.currentLong);
themap.get('map').panTo(start);

$('#getDirections').click(function() {
 themap.displayDirections(
    { 'origin': start, 'destination': destination, 'travelMode': google.maps.DirectionsTravelMode.DRIVING, 'unitSystem':google.maps.UnitSystem.METRIC },
    { 'panel': document.getElementById('directions')},
    function(response, status) {
       ( status === 'OK' ) ? $('#results').show() : $('#results').hide();
   }
   );
 return false;
});
} else {
  alert('Geolocation not supported on your device');
}
}});
});


return false;
});
$('#showPhotoForm').click(function() {
    $('.mainWindow').fadeOut();

    $('#photoForm').fadeIn();

    return false;
});
},
returnToMenu: function() {
  $('.mainWindow').fadeIn();

  $('.notMainWindow').fadeOut(function() {
     positionCalculator.doFullMenu();
 });
}
};

//function handleGeolocationQuery(position){
//	var lat = parseInt(position.coords.latitude * 10000, 10) / 10000;
//	var lon = parseInt(position.coords.longitude * 10000, 10) / 10000;
//	start = new google.maps.LatLng(lat, lon);
//	themap.get('map').panTo(start);
//}

//var geoLocator = {
//	getCurrentLocation: function() {
//		navigator.geolocation.getCurrentPosition(function(position) {
//			var latitude = position.coords.latitude;
//			var longitude = position.coords.longitude;
//			mainData.currentLat = latitude;
//			mainData.currentLong = longitude;
//		}, function() {
//			alert('Could not find location');
//		});
//	}
//};

var formSubmitter = {
	init: function() {
		$('input[type="submit"]').click(function() {
			$form = $(this).closest('form');

			var valid = true;
			$form.children().each(function() {
				if ($(this).attr('required') == 'required' && !$.trim($(this).val()).length) {
					$(this).addClass('formError');
					valid = false;
				} else {
					$(this).removeClass('formError');
				}
			});

			if (valid) {
              var formData = new FormData($('form')[0]);
              $('#photoForm').fadeOut();

              $.ajax({
			        url: 'http://www.my-websitebuilder.be/appFormReceiver.php',  //Server script to process data
			        type: 'POST',
			        xhr: function() {  // Custom XMLHttpRequest
                     var myXhr = $.ajaxSettings.xhr();
			            if(myXhr.upload){ // Check if upload property exists
			                myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
			            }
			            return myXhr;
			        },
			        //Ajax events
			        //beforeSend: beforeSendHandler,
			        success: function() {
			        	// success never happens because the call is made to a foreign domain
			        },
			        //error: errorHandler,
			        // Form data
			        data: formData,
			        //Options to tell jQuery not to process data or worry about content-type.
			        cache: false,
			        contentType: false,
			        processData: false
			    });

              $form.children().each(function() {
                 $(this).val('');
             });
              alert(labels.lblFormSubmitted);
              interfaceSwitcher.returnToMenu();
          } else {
             alert(labels.lblPleaseFillInAllFielts);
         }
         return false;
     });
}
};

function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
}

$(document).load(function() {
	positionCalculator.doFullMenu();
});

$(document).ready(function() {
	setLanguage.init();
    $.getJSON('http://www.anso-resto.be/mobile/nl/api/getButtons', function(json, textStatus) {
        $.each(json.buttons, function(index, val) {
            $('menu').append('<li><a href="'+$(this).url+'" class="button triggerIframe lblViewSite">'+$(this).title+'</a></li>')
        });

        positionCalculator.doFullMenu();
        onlineChecker.init();
        interfaceSwitcher.init();
        formSubmitter.init();
    });
});

$(window).resize(function() {
	positionCalculator.doFullMenu();
	positionCalculator.bottomFiller();
});

function var_dump(obj, name) {
  this.result = "[ " + name + " ]\n";
  this.indent = 0;

  this.dumpLayer = function(obj) {
    this.indent += 2;

    for (var i in obj) {
      if(typeof(obj[i]) == "object") {
        this.result += "\n" +
        "              ".substring(0,this.indent) + i +
        ": " + "\n";
        this.dumpLayer(obj[i]);
    } else {
        this.result +=
        "              ".substring(0,this.indent) + i +
        ": " + obj[i] + "\n";
    }
}

this.indent -= 2;
}

this.showResult = function() {
 console.log(this.result);
}

this.dumpLayer(obj);
this.showResult();
}
