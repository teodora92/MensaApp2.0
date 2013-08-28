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
			alert(thrownError);
		},
		jsonpCallback: 'callBackMensa'
		
	});
}



function parseJSON(data) {

	var i, id, label, adress, openTime, url, lat, lon, email, externalID;
	var mensa;
	
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
		alert('works?');
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
		
				//var detailScroll = 
			}
			else {
				$('#secondDetailContent').append(data.data);
				$('#secondDetailContent').append('<div class="zusatzDiv">Legende evtl. vorhandener Zusatzstoffe:<div class="zusatz">	1 = mit Farbstoff </div><div class="zusatz">    2 = mit Konservierungsstoff</div><div class="zusatz">    3 = mit Antioxidationsmittel</div><div class="zusatz">    4 = mit Geschmacksverstärker</div><div class="zusatz">    5 = geschwefelt</div><div class="zusatz">    6 = geschwärzt</div><div class="zusatz">    7 = gewachst</div><div class="zusatz">    8 = mit Phosphat</div><div class="zusatz">    9 = mit Süßstoff</div><div class="zusatz">    10 = enthält eine Phenylalaninquelle</div></div>');
		
			}
			
		},
		error: function(xhr, textStatus, thrownError) {
			alert(thrownError);
		},
		jsonpCallback: 'callback'
		
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
	
	
	currentMensaID = mensaID;
	
	window.localStorage.setItem('mensaSelected', 'true');
	window.localStorage.setItem('mensaID', currentMensaID);
		
	
	//document.getElementById('#infoDetailPage').setAttribute('class', 'detailPage');
	//alert('get here');
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
	
	//alert(currentMensaID);
	//alert(mensaID + " " + day);
	
	if(day == "heute") {
	
		$('#detailContent').empty();

		
		$('#btnNext').remove();
		$('#navIcon').remove();
		
		
		$('#header').append('<span id="btnNext">Morgen</span>');
		$('#header').append('<img id="navIcon" src="res/img/btnRight.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "morgen")
		});
		
	}
	else {
		$('#secondDetailContent').empty();

		$('#btnNext').remove();
		$('#navIcon').remove();
		
		$('#header').append('<span id="btnNext">Heute</span>');
		$('#header').append('<img id="navIcon" src="res/img/btnLeft.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "heute")
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
	$('#navIcon').remove();
		
		
	$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').append('<img id="navIcon" src="res/img/btnLeft.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
	});
	
	$('#thirdDetailContent').append('<h2 style="text-decoration: underline">Öffnungszeiten</h2>');
	$('#thirdDetailContent').append(mensa.openTime);
	
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
	
	var infoScroll = new iScroll('thirdDetailScroll', {zoom: true, hScrollbar: false, vScrollbar: false});

}

function renderMap() {
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
	$('#navIcon').remove();
		
		
	$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').append('<img id="navIcon" src="res/img/btnLeft.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
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
		infoWindow.open(map,marker);
	});

		//markerList.push(marker);
		
	
	
	
	//$('#thirdDetailContent').append('<h2>Öffnungszeiten</h2>');
	//$('#thirdDetailContent').append(mensa.openTime);
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
		
}

function displaySelectMenu() {

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
		var mensaID = $('#' + this.id).data('externalID');
		//alert(mensaID);
		
		
		displayMealPlan(mensaID, "heute");
		
	});
	
	
	mensaScroll = new iScroll('scroller',  {zoom: false, hScrollbar: false, vScrollbar: false} );
}

function bindEvents() {

	$('#btnMensaList').click(function() {
		$('#btnNext').remove();
		$('#navIcon').remove();
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
	
	var currentMensaID;
	var mensaScroll;
	var currentPage;
	var detailScroll;
	var secondDetailScroll;
	
	document.addEventListener("deviceready", function() {

			// check if android device
			if(navigator.userAgent.match(/Android/i)) {
			
			}

			document.addEventListener("backButton", function() {
				alert('back button pressed');
				//goLeft();
			}, false);
			document.addEventListener("menubutton", function() {
				alert("menu button pressed");
			}, false);
			
	}, false);

	$('#detailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "right") {
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
			}
		}
	});
	
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	
	document.addEventListener('DOMContentLoaded', function () { 
		detailScroll = new iScroll('detailScroll', {hScrollbar: false, vScrollbar: false});
		secondDetailScroll = new iScroll('secondDetailScroll', {hScrollbar: false, vScrollbar: false});
		loadData();
		bindEvents();
	}, false);

	
}

