/*!
* Add to Homescreen v2.0.7 ~ Copyright (c) 2013 Matteo Spinelli, http://cubiq.org
* Released under MIT license, http://cubiq.org/license
*/
var addToHome = (function (w) {
var nav = w.navigator,
isIDevice = 'platform' in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
isIPad,
isRetina,
isSafari,
isStandalone,
OSVersion,
startX = 0,
startY = 0,
lastVisit = 0,
isExpired,
isSessionActive,
isReturningVisitor,
balloon,
overrideChecks,

positionInterval,
closeTimeout,

options = {
autostart: true,	// Automatically open the balloon
returningVisitor: false,	// Show the balloon to returning visitors only (setting this to true is HIGHLY RECCOMENDED)
animationIn: 'drop',	// drop || bubble || fade
animationOut: 'fade',	// drop || bubble || fade
startDelay: 2000,	// 2 seconds from page load before the balloon appears
lifespan: 15000,	// 15 seconds before it is automatically destroyed
bottomOffset: 14,	// Distance of the balloon from bottom
expire: 0,	// Minutes to wait before showing the popup again (0 = always displayed)
message: '',	// Customize your message or force a language ('' = automatic)
touchIcon: false,	// Display the touch icon
arrow: true,	// Display the balloon arrow
hookOnLoad: true,	// Should we hook to onload event? (really advanced usage)
closeButton: true,	// Let the user close the balloon
iterations: 100	// Internal/debug use
},

intl = {
ar: '<span dir="rtl">?? ?????? ??? ??????? ??? <span dir="ltr">%device:</span>????<span dir="ltr">%icon</span> ?<strong>?? ???? ??? ?????? ????????.</strong></span>',
ca_es: 'Per instal�lar aquesta aplicaci� al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
cs_cz: 'Pro instalaci aplikace na V� %device, stisknete %icon a v nab�dce <strong>Pridat na plochu</strong>.',
da_dk: 'Tilf�j denne side til din %device: tryk p� %icon og derefter <strong>F�j til hjemmesk�rm</strong>.',
de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
el_gr: '???atast?sete a?t?? t?? ?fa?�??? st?? s?s?e?? sa? %device: %icon �et? pat?te <strong>???s???? se ?fet???a</strong>.',
en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>A�adir a pantalla de inicio</strong>.',
fi_fi: 'Asenna t�m� web-sovellus laitteeseesi %device: paina %icon ja sen j�lkeen valitse <strong>Lis�� Koti-valikkoon</strong>.',
fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter � l\'�cran d\'accueil</strong>.',
he_il: '<span dir="rtl">???? ???????? ?? ?? ?-%device ???: ??? %icon ??? <strong>???? ???? ????</strong>.</span>',
hr_hr: 'Instaliraj ovu aplikaciju na svoj %device: klikni na %icon i odaberi <strong>Dodaj u pocetni zaslon</strong>.',
hu_hu: 'Telep�tse ezt a web-alkalmaz�st az �n %device-j�ra: nyomjon a %icon-ra majd a <strong>Fok�pernyoh�z ad�s</strong> gombra.',
it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
ja_jp: '?????????????%device???????????%icon??????<strong>????????</strong>?????????',
ko_kr: '%device? ??? ????? %icon? ?? ? "???? ??"? ?????',
nb_no: 'Installer denne appen p� din %device: trykk p� %icon og deretter <strong>Legg til p� Hjem-skjerm</strong>',
nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Voeg toe aan beginscherm</strong>.',
pl_pl: 'Aby zainstalowac te aplikacje na %device: nacisnij %icon a nastepnie <strong>Dodaj jako ikone</strong>.',
pt_br: 'Instale este aplicativo em seu %device: aperte %icon e selecione <strong>Adicionar � Tela Inicio</strong>.',
pt_pt: 'Para instalar esta aplica��o no seu %device, prima o %icon e depois o <strong>Adicionar ao ecr� principal</strong>.',
ru_ru: '?????????? ??? ???-?????????? ?? ??? %device: ??????? %icon, ????? <strong>???????? ? �?????�</strong>.',
sv_se: 'L�gg till denna webbapplikation p� din %device: tryck p� %icon och d�refter <strong>L�gg till p� hemsk�rmen</strong>.',
th_th: '??????????????? ????? %device ??????: ??? %icon ??? <strong>?????????????????</strong>',
tr_tr: 'Bu uygulamayi %device\'a eklemek i�in %icon simgesine sonrasinda <strong>Ana Ekrana Ekle</strong> d�gmesine basin.',
uk_ua: '?????????? ??? ??? ???? ?? ??? %device: ????????? %icon, ? ????? <strong>?? ?????????? ?????</strong>.',
zh_cn: '?????????????? %device ???? %icon ????<strong>??????</strong>?',
zh_tw: '?????????????? %device ???? %icon ????<strong>???????</strong>?'
};

function init () {
// Preliminary check, all further checks are performed on iDevices only
if ( !isIDevice ) return;

var now = Date.now(),
i;

// Merge local with global options
if ( w.addToHomeConfig ) {
for ( i in w.addToHomeConfig ) {
options[i] = w.addToHomeConfig[i];
}
}
if ( !options.autostart ) options.hookOnLoad = false;

isIPad = (/ipad/gi).test(nav.platform);
isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
isSafari = (/Safari/i).test(nav.appVersion) && !(/CriOS/i).test(nav.appVersion);
isStandalone = nav.standalone;
OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
OSVersion = OSVersion && OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;

lastVisit = +w.localStorage.getItem('addToHome');

isSessionActive = w.sessionStorage.getItem('addToHomeSession');
isReturningVisitor = options.returningVisitor ? lastVisit && lastVisit + 28*24*60*60*1000 > now : true;

if ( !lastVisit ) lastVisit = now;

// If it is expired we need to reissue a new balloon
isExpired = isReturningVisitor && lastVisit <= now;

if ( options.hookOnLoad ) w.addEventListener('load', loaded, false);
else if ( !options.hookOnLoad && options.autostart ) loaded();
}

function loaded () {
w.removeEventListener('load', loaded, false);

if ( !isReturningVisitor ) w.localStorage.setItem('addToHome', Date.now());
else if ( options.expire && isExpired ) w.localStorage.setItem('addToHome', Date.now() + options.expire * 60000);

if ( !overrideChecks && ( !isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor ) ) return;

var touchIcon = '',
platform = nav.platform.split(' ')[0],
language = nav.language.replace('-', '_');

balloon = document.createElement('div');
balloon.id = 'addToHomeScreen';
balloon.style.cssText += 'left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:' + (OSVersion < 5 ? 'absolute' : 'fixed');

// Localize message
if ( options.message in intl ) {	// You may force a language despite the user's locale
language = options.message;
options.message = '';
}
if ( options.message === '' ) {	// We look for a suitable language (defaulted to en_us)
options.message = language in intl ? intl[language] : intl['en_us'];
}

if ( options.touchIcon ) {
touchIcon = isRetina ?
document.querySelector('head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon]') :
document.querySelector('head link[rel^=apple-touch-icon][sizes="57x57"],head link[rel^=apple-touch-icon]');

if ( touchIcon ) {
touchIcon = '<span style="background-image:url(' + touchIcon.href + ')" class="addToHomeTouchIcon"></span>';
}
}

balloon.className = (isIPad ? 'addToHomeIpad' : 'addToHomeIphone') + (touchIcon ? ' addToHomeWide' : '');
balloon.innerHTML = touchIcon +
options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') +
(options.arrow ? '<span class="addToHomeArrow"></span>' : '') +
(options.closeButton ? '<span class="addToHomeClose">\u00D7</span>' : '');

document.body.appendChild(balloon);

// Add the close action
if ( options.closeButton ) balloon.addEventListener('click', clicked, false);

if ( !isIPad && OSVersion >= 6 ) window.addEventListener('orientationchange', orientationCheck, false);

setTimeout(show, options.startDelay);
}

function show () {
var duration,
iPadXShift = 208;

// Set the initial position
if ( isIPad ) {
if ( OSVersion < 5 ) {
startY = w.scrollY;
startX = w.scrollX;
} else if ( OSVersion < 6 ) {
iPadXShift = 160;
}

balloon.style.top = startY + options.bottomOffset + 'px';
balloon.style.left = startX + iPadXShift - Math.round(balloon.offsetWidth / 2) + 'px';

switch ( options.animationIn ) {
case 'drop':
duration = '0.6s';
balloon.style.webkitTransform = 'translate3d(0,' + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + 'px,0)';
break;
case 'bubble':
duration = '0.6s';
balloon.style.opacity = '0';
balloon.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
break;
default:
duration = '1s';
balloon.style.opacity = '0';
}
} else {
startY = w.innerHeight + w.scrollY;

if ( OSVersion < 5 ) {
startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
balloon.style.left = startX + 'px';
balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + 'px';
} else {
balloon.style.left = '50%';
balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 ? 40 : 0 ) + 'px';
balloon.style.bottom = options.bottomOffset + 'px';
}

switch (options.animationIn) {
case 'drop':
duration = '1s';
balloon.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
break;
case 'bubble':
duration = '0.6s';
balloon.style.webkitTransform = 'translate3d(0,' + (balloon.offsetHeight + options.bottomOffset + 50) + 'px,0)';
break;
default:
duration = '1s';
balloon.style.opacity = '0';
}
}

balloon.offsetHeight;	// repaint trick
balloon.style.webkitTransitionDuration = duration;
balloon.style.opacity = '1';
balloon.style.webkitTransform = 'translate3d(0,0,0)';
balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);

closeTimeout = setTimeout(close, options.lifespan);
}

function manualShow (override) {
if ( !isIDevice || balloon ) return;

overrideChecks = override;
loaded();
}

function close () {
clearInterval( positionInterval );
clearTimeout( closeTimeout );
closeTimeout = null;

// check if the popup is displayed and prevent errors
if ( !balloon ) return;

var posY = 0,
posX = 0,
opacity = '1',
duration = '0';

if ( options.closeButton ) balloon.removeEventListener('click', clicked, false);
if ( !isIPad && OSVersion >= 6 ) window.removeEventListener('orientationchange', orientationCheck, false);

if ( OSVersion < 5 ) {
posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth)/2) - startX;
}

balloon.style.webkitTransitionProperty = '-webkit-transform,opacity';

switch ( options.animationOut ) {
case 'drop':
if ( isIPad ) {
duration = '0.4s';
opacity = '0';
posY += 50;
} else {
duration = '0.6s';
posY += balloon.offsetHeight + options.bottomOffset + 50;
}
break;
case 'bubble':
if ( isIPad ) {
duration = '0.8s';
posY -= balloon.offsetHeight + options.bottomOffset + 50;
} else {
duration = '0.4s';
opacity = '0';
posY -= 50;
}
break;
default:
duration = '0.8s';
opacity = '0';
}

balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);
balloon.style.opacity = opacity;
balloon.style.webkitTransitionDuration = duration;
balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
}


function clicked () {
w.sessionStorage.setItem('addToHomeSession', '1');
isSessionActive = true;
close();
}

function transitionEnd () {
balloon.removeEventListener('webkitTransitionEnd', transitionEnd, false);

balloon.style.webkitTransitionProperty = '-webkit-transform';
balloon.style.webkitTransitionDuration = '0.2s';

// We reached the end!
if ( !closeTimeout ) {
balloon.parentNode.removeChild(balloon);
balloon = null;
return;
}

// On iOS 4 we start checking the element position
if ( OSVersion < 5 && closeTimeout ) positionInterval = setInterval(setPosition, options.iterations);
}

function setPosition () {
var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;

// Screen didn't move
if ( posY == matrix.m42 && posX == matrix.m41 ) return;

balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
}

// Clear local and session storages (this is useful primarily in development)
function reset () {
w.localStorage.removeItem('addToHome');
w.sessionStorage.removeItem('addToHomeSession');
}

function orientationCheck () {
balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 ? 40 : 0 ) + 'px';
}

// Bootstrap!
init();

return {
show: manualShow,
close: close,
reset: reset
};
})(window);