function Mensa(mensaID, label, adress, openTime, url, lat, lon, email, externalID) {
	this.mensaID = mensaID;
	this.label = label;
	this.adress = adress;
	this.openTime = openTime;
	this.url = url;
	this.lat = lat;
	this.lon = lon;
	this.email = email;
	this.externalID = externalID;
}

function loadData() {

	function callBackMensa(data) {
		//alert('get here?');
	}

	$.ajax({
		type: 'GET',
		url: 'res/data/mensa.json',
		dataType: 'jsonp',
		success: function(data) {
			//alert('only get in success function');
			
			parseJSON(data);
	
			var mensaSelect = window.localStorage.getItem('mensaSelected');
	
			if(mensaSelect == "true") {
				currentMensaID = window.localStorage.getItem('mensaID');
				displayMealPlan(currentMensaID, "heute");
			}
			else {
				displaySelectMenu();
			}
		},
		error: function(xhr, textStatus, thrownError) {
			//alert(thrownError);
			if(textStatus == "timeout") {
				if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {	
					navigator.notification.alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
				else {
					alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
			}
		},
		jsonpCallback: 'callBackMensa',
		timeout: 10000
		
	});
}



function parseJSON(data) {

	var i, id, label, adress, openTime, url, lat, lon, email, externalID;
	var mensa;
	mensaArray = [];
	for(i = 0; i < data.length; ++i) {
		mensaID = data[i].mensaID;
		label = data[i].label;
		adress = data[i].adress;
		openTime = data[i].openTime;
		url = data[i].url;
		lat = data[i].lat;
		lon = data[i].lon;
		email = data[i].email;
		externalID = data[i].externalID;
		
		mensa = new Mensa(mensaID, label, adress, openTime, url, lat, lon, email, externalID);
		mensaArray.push(mensa);
	}
	
}




function proxyPost(mensaID, day) {

	var url = "http://gyoca.com/cloud/demos/mensa_app/res/php/getMenu/:"+mensaID+"/:"+day;
	url = String(url);
	
	function callback() {
		--alert('works?');
	}

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		contentType: "application/json; charset=windows-1252",
		success: function(data) {
			//alert('only get in success function');
			
			if(day == "heute") {
				$('#detailContent').append(data.data);
				$('#detailContent').append('<div class="zusatzDiv">Legende evtl. vorhandener Zusatzstoffe:<div class="zusatz">	1 = mit Farbstoff </div><div class="zusatz">    2 = mit Konservierungsstoff</div><div class="zusatz">    3 = mit Antioxidationsmittel</div><div class="zusatz">    4 = mit Geschmacksverstärker</div><div class="zusatz">    5 = geschwefelt</div><div class="zusatz">    6 = geschwärzt</div><div class="zusatz">    7 = gewachst</div><div class="zusatz">    8 = mit Phosphat</div><div class="zusatz">    9 = mit Süßstoff</div><div class="zusatz">    10 = enthält eine Phenylalaninquelle</div></div>');
				detailScroll.refresh();
				//var detailScroll = 
			}
			else {
				$('#secondDetailContent').append(data.data);
				$('#secondDetailContent').append('<div class="zusatzDiv">Legende evtl. vorhandener Zusatzstoffe:<div class="zusatz">	1 = mit Farbstoff </div><div class="zusatz">    2 = mit Konservierungsstoff</div><div class="zusatz">    3 = mit Antioxidationsmittel</div><div class="zusatz">    4 = mit Geschmacksverstärker</div><div class="zusatz">    5 = geschwefelt</div><div class="zusatz">    6 = geschwärzt</div><div class="zusatz">    7 = gewachst</div><div class="zusatz">    8 = mit Phosphat</div><div class="zusatz">    9 = mit Süßstoff</div><div class="zusatz">    10 = enthält eine Phenylalaninquelle</div></div>');
				secondDetailScroll.refresh();
			}
			document.getElementById('floatingCirclesG').style.display = 'none' ;
			
		},
		error: function(xhr, textStatus, thrownError) {
			if(thrownError == "Error: callback was not called") {
				//alert('hello');
			}
			else {
				//alert(thrownError);
			}
			if(textStatus == "timeout") {
				if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {	
					navigator.notification.alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
				else {
					alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
			}
			document.getElementById('floatingCirclesG').style.display = 'none' ;
			
		},
		jsonpCallback: 'callback',
		timeout: 10000
		
	});

}



function crossDomainPost(mensaID, day) {
  // Add the iframe with a unique name
  
  //alert(mensaID + " " + day);
  
  var previousFrame = document.getElementById("frame"+day);
  if(previousFrame != null) {
	previousFrame.remove();
  }
  
  var iframe = document.createElement("iframe");
  iframe.id = "frame" + day;
  //alert(iframe.id);
  var uniqueString = iframe.id;
  //document.body.appendChild(iframe);
  
  if(day == "heute") {
	$('#detailContent').append(iframe);
  }
  else {
	$('#secondDetailContent').append(iframe);
  }
  
  iframe.style.display = "inline";
  iframe.contentWindow.name = uniqueString;
  // construct a form with hidden inputs, targeting the iframe
  
  var prevForm = document.getElementById("form" + day);
  if(prevForm != null) {
	prevForm.remove();
  }
  
  var form = document.createElement("form");
  form.id = "form" + day;
  form.target=uniqueString;
  form.action = "http://www.kstw.de/handy/default.asp?act=show";
  form.method = "POST";

  // repeat for each parameter

  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "R1";
  input.value = day;
  form.appendChild(input);
  
  var mensaInput = document.createElement('input');
  mensaInput.type = "hidden";
  mensaInput.name = "mensa";
  mensaInput.value = mensaID;
  form.appendChild(mensaInput);

  //document.body.appendChild(form);
  
  if(day == "heute") {
	$('#detailContent').append(form);
	//var frameScroll = new iScroll('detailContent');
  }
  else {
	$('#secondDetailContent').append(form);
	//var frameScroll = new iScroll('secondDetailContent');
  }
  
  form.submit();
  
}

function displayMealPlan(mensaID, day) {
	
	document.getElementById('floatingCirclesG').style.display = 'inline';
	
	currentMensaID = mensaID;
	var title;
	window.localStorage.setItem('mensaSelected', 'true');
	window.localStorage.setItem('mensaID', currentMensaID);
		
	var index;
	for (index = 0; index < mensaArray.length; index++) {
		if(currentMensaID == mensaArray[index].externalID) {
			title = mensaArray[index].label;
			break;
		}
	}
		
		
	$('#header').text(title);
	$('#header').append('<img id="appIcon" src="res/img/ic_launcher48.png">');
		
	//document.getElementById('#infoDetailPage').setAttribute('class', 'detailPage');
	//alert('get here');
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
	
	//alert(currentMensaID);
	//alert(mensaID + " " + day);
	
	if(day == "heute") {
	
		$('#detailContent').empty();
		
		var today = new Date();
		var dd = today.getDate();
		var mm = monthArray[today.getMonth()];

		$('#detailContent').append('<h1>Menü für heute, den '+dd+'. '+mm+'</h1>');
		
		$('#btnNext').remove();
		
		
		
		//$('#header').append('<span id="btnNext">Morgen</span>');
		$('#header').after('<img id="btnNext" src="res/img/arrowRight3.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "morgen")
		});
		
		$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowRightLight.png');
		});
		$("#btnNext").mouseup(function(){
			$('#btnNext').attr('src', 'res/img/arrowRight3.png');
		});
		$("#btnNext").bind('touchstart', function(){
			$('#btnNext').attr('src', 'res/img/arrowRightLight.png');
		}).bind('touchend', function(){
			$('#btnNext').attr('src', 'res/img/arrowRight3.png');
		});
		
	}
	else {
		$('#secondDetailContent').empty();
		
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var dd = tomorrow.getDate();
		var mm = monthArray[tomorrow.getMonth()];

		$('#secondDetailContent').append('<h1>Menü für morgen, den '+dd+'. '+mm+'</h1>');
		$('#btnNext').remove();
		
		//$('#header').append('<span id="btnNext">Heute</span>');
		$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "heute")
		});
		
		$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
		});
		$("#btnNext").mouseup(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
		});
		
		$("#btnNext").bind('touchstart', function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
		}).bind('touchend', function(){
			$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
		});
	
	}
	
	
	
	//crossDomainPost(mensaID, day);
	proxyPost(mensaID, day);
	
	document.getElementById("footer").setAttribute('class', 'footerVis');
	if(day == "heute") {
		
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPage');
		document.getElementById("detailPage").setAttribute('class', 'detailPageVis');
		
		detailScroll.refresh();
		setTimeout(function() {
			detailScroll.refresh();
		}, 2000);
		setTimeout(function() {
			detailScroll.refresh();
		}, 5000);
	}
	else {
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPageVis');
		
		
		secondDetailScroll.refresh();
		setTimeout(function() {
			secondDetailScroll.refresh();
		}, 2000);
		setTimeout(function() {
			secondDetailScroll.refresh();
		}, 5000);
	}
	
}

function displayTime() {
	currentPage = 'time';
	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#infoDetailPage').empty();
	$('#infoDetailPage').append('<div id="thirdDetailScroll"></div>');
	$('#thirdDetailScroll').append('<div id="thirdDetailContent"></div>');

	document.getElementById("infoDetailPage").style.backgroundColor = "#FFFFFF";

	$('#thirdDetailContent').empty();
	
	// add current time
	var i;
	var mensa;
	for(i = 0; i < mensaArray.length; ++i) {
		if(mensaArray[i].externalID == currentMensaID) {
			mensa = mensaArray[i];
			break;
		}
	}
	
	$('#btnNext').remove();
		
		
	//$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
	});
	$("#btnNext").mousedown(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
	});
	$("#btnNext").mouseup(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
	});
	
	$("#btnNext").bind('touchstart', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
    }).bind('touchend', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeft3.png');
    });
	
	$('#thirdDetailContent').append('<h2 style="text-decoration: underline">Öffnungszeiten</h2>');
	$('#thirdDetailContent').append(mensa.openTime);
	
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
	
	var infoScroll = new iScroll('thirdDetailScroll', {zoom: true, hScrollbar: false, vScrollbar: false});

}

function renderMap() {
	currentPage = 'map';
	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#thirdDetailContent').empty();
	
	// add current time
	var i;
	var mensa;
	for(i = 0; i < mensaArray.length; ++i) {
		if(mensaArray[i].externalID == currentMensaID) {
			mensa = mensaArray[i];
			break;
		}
	}
	
	$('#btnNext').remove();
		
		
	//$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
	});
	$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
	});
	$("#btnNext").mouseup(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
	});
	
	$("#btnNext").bind('touchstart', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
    }).bind('touchend', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeft3.png');
    });
	
	
	var mapProp;
	var lat, lon;
	lat = mensa.lat;
	lon = mensa.lon;
	//alert(lat + " " + lon);
	mapProp = {
		center:new google.maps.LatLng(lat, lon),
		zoom: 16,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var page = document.getElementById("infoDetailPage");
	//page.style.width = "98%";
	var map = new google.maps.Map(page, mapProp);
	
	myLatLong = new google.maps.LatLng(lat, lon);
	var marker =  new google.maps.Marker({
		position: myLatLong,
		map: map,
		title: mensa.label
	  
	});
	
	var content = '<h2>' + mensa.label + '</h2>' + '<div>' + mensa.adress + '</div>';
	
	var infoWindow = new google.maps.InfoWindow({
			content: content,
			maxWidth: 300,
			maxHeight: 300
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(marker.getMap(),marker);
	});

	google.maps.event.addListener(infoWindow,'closeclick',function(){
		//currentMark.setMap(null); //removes the marker
		// then, remove the infowindows name from the array
		alert('should close now');
	});
	google.maps.event.addListener(map,'click',function(){
		//currentMark.setMap(null); //removes the marker
		// then, remove the infowindows name from the array
		alert('Just clicked now');
	});
		//markerList.push(marker);
		
	
	
	
	//$('#thirdDetailContent').append('<h2>Öffnungszeiten</h2>');
	//$('#thirdDetailContent').append(mensa.openTime);
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
		
}

function displaySelectMenu() {

	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#wrapper').empty();
	
	$('#wrapper').append('<div id="scroller"></div>');
	$('#scroller').append('<ul id="thelist"></ul>');
	
	
	$('#wrapper').prepend('<h2>Wähle Deine Mensa</h2>');
	
	var i, id, label, adress, openTime, url, lat, lon, email, externalID;
	var mensa;
	
	for(i = 0; i < mensaArray.length; ++i) {
		mensa = mensaArray[i];
		mensaID = mensa.mensaID;
		label = mensa.label;
		adress = mensa.adress;
		openTime = mensa.openTime;
		url = mensa.url;
		lat = mensa.lat;
		lon = mensa.lon;
		email = mensa.email;
		externalID = mensa.externalID;
		
		$('#thelist').append('<li id="listItem'+mensaID+'" class="listItem"><span  class="listTitle">'+label+'</span><br/>'+adress+'</li>');
		$('#listItem'+mensaID).data('externalID', externalID);
	}
	
	$('.listItem').unbind('click');
	
	$('.listItem').click(function() {
		//alert(this.id);
		/*if(currentPage != "main") {
			return;
		}
		else {
			currentPage = "detail";
		}*/
		var mensaID = $('#' + this.id).data('externalID');
		//alert(mensaID);
		
		
		displayMealPlan(mensaID, "heute");
		
	});
	
	
	mensaScroll = new iScroll('scroller',  {zoom: false, hScrollbar: false, vScrollbar: false} );
}

function bindEvents() {

	$("#btnMensaList").mousedown(function(){
		$('#btnMensaList img').attr('src', 'res/img/gearIconLight.png');
	});
	$("#btnMensaList").mouseup(function(){
		$('#btnMensaList img').attr('src', 'res/img/gearIcon4.png');
	});
	
	$("#btnMensaList").bind('touchstart', function(){
        $('#btnMensaList img').attr('src', 'res/img/gearIconLight.png');
    }).bind('touchend', function(){
        $('#btnMensaList img').attr('src', 'res/img/gearIcon4.png');
    });

	$("#btnOpenTime").mousedown(function(){
		$('#btnOpenTime img').attr('src', 'res/img/clockIconLight.png');
	});
	$("#btnOpenTime").mouseup(function(){
		$('#btnOpenTime img').attr('src', 'res/img/clockIcon8.png');
	});
	
	$("#btnOpenTime").bind('touchstart', function(){
        $('#btnOpenTime img').attr('src', 'res/img/clockIconLight.png');
    }).bind('touchend', function(){
		$('#btnOpenTime img').attr('src', 'res/img/clockIcon8.png');
    });
	
	$("#btnMap").mousedown(function(){
		$('#btnMap img').attr('src', 'res/img/mapIconLight.png');
	});
	$("#btnMap").mouseup(function(){
		$('#btnMap img').attr('src', 'res/img/mapIcon4.png');
	});
	
	
	$("#btnMap").bind('touchstart', function(){
		$('#btnMap img').attr('src', 'res/img/mapIconLight.png');
    }).bind('touchend', function(){
		$('#btnMap img').attr('src', 'res/img/mapIcon4.png');
    });
	
	
	
	$('#btnMensaList').click(function() {
		//currentPage = "main";
		$('#btnNext').remove();
		$('#header').text('MensaApp');
		$('#header').append('<img id="appIcon" src="res/img/ic_launcher48.png">');
		window.localStorage.setItem('mensaSelected', null);
	
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPage');
		document.getElementById("detailPage").setAttribute('class', 'detailPage');
		document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
		
		document.getElementById("footer").setAttribute('class', 'footerInv');
		displaySelectMenu();
	});
	
	$('#btnOpenTime').click(function() {
		displayTime();
	});
	
	$('#btnMap').click(function() {
		renderMap();
	});

}



// starting function
{

	var mensaArray = new Array();
	var monthArray = ["Januar", "Februar", "März", "April", "May", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	var currentMensaID;
	var mensaScroll;
	// currentPage can be ['mensaList', 'heute', 'morgen', 'time', 'map']
	var currentPage;
	var detailScroll;
	var secondDetailScroll;
	
	document.addEventListener("deviceready", function() {

			// check if android device
			if(navigator.userAgent.match(/Android/i)) {
			
			}

			document.addEventListener("backButton", function() {
				//alert('back button pressed');
				//goLeft();
				if(document.getElementById("infoDetailPage").getAttribute('class') == 'detailPageVis') {
					$('#btnNext').click();
				}
				else if(document.getElementById("secondDetailPage").getAttribute('class') == 'detailPageVis') {
					$('#btnNext').click();
				}
				else if(document.getElementById("detailPage").getAttribute('class') == 'detailPageVis') {
					device.exitApp();
				}
				else if(document.getElementById("detailPage").getAttribute('class') == 'detailPage') {
					device.exitApp();
				}
				
			}, false);
			document.addEventListener("menubutton", function() {
				//alert("menu button pressed");
			}, false);
			
	}, false);

	$('#detailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('go to tomorrow');
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
				$('#btnNext').click();
			}
			else if (direction =="right") {
				//alert('go to mensa list page');
				$('#btnMensaList').click();
				
			}
		}
	});
	
	$('#secondDetailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('do nothing');
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
			}
			else if (direction =="right") {
				//alert('go to today');
				$('#btnNext').click();
			}
		}
	});
	
	$('#infoDetailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('do nothing');
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
			}
			else if (direction =="right") {
				//alert('go to today');
				if(currentPage != 'map') {
					$('#btnNext').click();
				}
			}
		}
	});
	
	/*document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);*/
	
	document.addEventListener('DOMContentLoaded', function () { 
		detailScroll = new iScroll('detailScroll', {zoom: true, hScrollbar: false, vScrollbar: false});
		secondDetailScroll = new iScroll('secondDetailScroll', {zoom: true, hScrollbar: false, vScrollbar: false});
		loadData();
		bindEvents();
	}, false);

	document.addEventListener("resume", function() {
		// resuming mensa app - have to test on actual device
		//if(document.getElementById("detailPage").getAttribute('class') == 'detailPageVis') {
		loadData();
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPage');
		document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
		//}
		
	}, false);
}

