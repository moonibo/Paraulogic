window.onload = inicialitza;
//Array amb paraules de cinc lletres
var paraules = ["ZOECI", "XORIC", "XICOT", "XICON", "XICOL", "SOMIC", "SOCIS", "SIBOC", "ROGIC", "RICOR", "QUICO", "PROCI", "PICOT", "PICOR", "ORINC", "OOECI", "OLEIC", "OFICI", "OCUPI", "OCCIT", "OCCIR", "OCAPI", "OBLIC", "NOCIU", "NICOL", "MICRO", "LICOR", "IODUC", "ICONA", "GISCO", "ECOIC", "DISCO", "DIOIC", "CUIRO", "COTIP", "COSTI", "COSSI", "COSIT", "COSIR", "CORRI", "CORNI", "COPIA", "COIXA", "COITS", "COIOT", "COFOI", "CODIS", "COBAI", "CAIXO", "CAIOT", "BONIC", "BOLIC", "BOCOI", "BITOC", "BICOL", "BEOCI", "AZOIC", "CRIOS", "ALCOI"];
//Funció que genera un array amb quatre números diferents del 0 al 9
function creaParaula() {
	//Agarem una paraula aleatòria
	let paraula = paraules[Math.floor(Math.random() * paraules.length)]
	//Retornem un array amb les diferents lletres
	return paraula.split('');
}

//Funció per posar l'scroll del div amb id 'board' baix
function ferScrollCapAvall() {
	let div = document.getElementById('board');
	div.scrollTop = div.scrollHeight - div.clientHeight;
}

//inicialització de variables
let pos = 0;
var fila = 1;
var paraula = creaParaula();
var lletres = [];
let game;
let boardContainer;
let board;
let filera;
let caselles;
let encerts;
let errors;
let intent = 0;


function inicialitza() {
	document.addEventListener('keydown', tecla);
	game = document.getElementById('game');
	boardContainer = game.firstElementChild.nextElementSibling;
	board = boardContainer.firstElementChild;
	filera = board.children;
	console.log(filera);
	caselles = board.firstElementChild.children;

	//Afegeix listener d'event tipus 'click' a una filera
	clicaFilera = function(){
		for (let i = 0; i < filera.length; i++) {
			filera[i].addEventListener('click', selecciona);
		}
	}

	//Afegeix listener d'event tipus 'click' al botó per mostrar estadístiques
	var menu = game.firstElementChild.children[1];
	var statistics_button = menu.firstElementChild;
	statistics_button.addEventListener('click', mostraEstadistiques);

	//Afegeix listeners a tots els botons del teclat virtual
	var teclatVirtual = document.getElementById("keyboard");
	var btn = teclatVirtual.getElementsByTagName('button');
	for (let i = 0; i < btn.length; i++) {
		btn[i].addEventListener('click', tecla);
		btn[i].addEventListener('mouseover', canviaColor);
		btn[i].addEventListener('mouseleave', canviaColor);
	}
};

function tecla(event) {
	if (event.type === 'keydown') {
		let key = event.key;
		validaTecla(key);
	}
	if (event.type === 'click') {
		let key = this.getAttribute('data-key');
		console.log(key.charCodeAt(0));
		if (key.charCodeAt(0) === 8629) { //Mirem amb unicode si la tecla clicada és enter o retrocés
			key = 'Enter';
		}

		if (key.charCodeAt(0) === 8592) {
			key = 'Backspace';
		}
		validaTecla(key);
	}
}

function validaTecla(key) {

	console.log("keyValue: " + key);
	if (key.length === 1) {
		if (/^[a-zA-ZçÇ]$/.test(key) && pos < 5) { //Mira si el caràcter és una lletra de l'alfabet i si ens trobem a la posició indicada
			caselles[pos].innerText = key;
			lletres.push(key.toUpperCase());
			for (let i = 0; i < caselles.length; i++) {
				caselles[i].createTextNode = key;
			}
			pos++;
			return true;
		} else {
			return false;
		}
	} else if (key === 'Backspace' && pos <= 5 && pos > 0) { //Mira si la tecla polsada és retrocés
		caselles[pos - 1].innerText = '';
		lletres.pop();
		pos--;
		return true;
	} else if (key === 'Delete') { //Esborra la fila que estigui seleccionada si n'hi ha alguna
		let fileraSel = selecFilera();
		let div = fileraSel[0];
		if (fileraSel != null) {
			board.removeChild(div);
			fila--;
		}
	} else if (key === 'ArrowUp') { //Mou una posició amunt la filera seleccionada
		let fileraSel = selecFilera();
		let div = fileraSel[0];
		let pos = fileraSel[1];
		if (fileraSel != null) {
			for (let i = 0; i < filera.length; i++) {
				if (i === pos) {
					if (pos != 0) {
						let divAMoure = filera[i];
						let divAnterior = divAMoure.previousElementSibling;
						divAnterior.after(divAMoure);
						divAMoure.after(divAnterior);
					}
				}
			}
		}
	} else if (key === 'ArrowDown') { //Mou una posició avall la filera seleccionada
		let fileraSel = selecFilera();
		let div = fileraSel[0];
		let pos = fileraSel[1];
		if (fileraSel != null) {
			for (let i = 0; i < filera.length; i++) {
				if (i === pos) {
					let divAMoure = filera[i];
					let divSeguent = divAMoure.nextElementSibling;
					if (divSeguent.getAttribute("estat") === "fet") {
						divAMoure.after(divSeguent);
						divSeguent.after(divAMoure);
					}
				}
			}
		}
	} else if (key === 'Enter') { //Mira si la tecla polsada és enter
		if (pos === 5) {
			if (encertaParaula()) {
				filera[fila-1].setAttribute("estat", "fet");
				filera[fila-1].setAttribute("correctes", encerts);
				filera[fila-1].setAttribute("incorrectes", errors);
				alert('Enhorabona, has guanyat el joc!!!');
			} else {
				if (confirm('Vols tornar-ho a provar?')) {
					filera[fila-1].setAttribute("estat", "fet");
					filera[fila-1].setAttribute("correctes", encerts);
					filera[fila-1].setAttribute("incorrectes", errors);
					nouIntent();
					ferScrollCapAvall();
					fila++;
					pos = 0;
					lletres = [];
					caselles = board.lastElementChild.children;
					return true;
				} else {
					alert('Fins aviat!');
					return false;
				}
			}
		}
	}
}

//Comprova si la paraula introduïda és igual a la que s'ha d'endevinar
function encertaParaula() {
	encerts = 0;
	errors = 0;
	for (let i = 0; i < lletres.length; i++) {
		if (!paraula.includes(lletres[i])) {
			caselles[i].style.backgroundColor = "#787c7e";
			errors++;
		} else {
			if (lletres[i] !== paraula[i]) {
				caselles[i].style.backgroundColor = "#d69a29";
				errors++;
			} else {
				caselles[i].style.backgroundColor = "#3ca83f";
				encerts++;
			}
		}
	}

	if (encerts === 5) {
		return true;
	} else {
		return false;
	}
}

//Canvia el color de les lletres del teclatVirtual al passar-hi el ratolí per sobre
function canviaColor(event) {
	if (event.type === 'mouseover') {
		this.style.backgroundColor = "#888";
	}

	if (event.type === 'mouseleave') {
		this.style.backgroundColor = "#d3d6da";
	}
}

//Sel·lecciona una paraula si l'usuari clica sobre d'ella
function selecciona(event) {

	for (let i = 0; i < filera.length; i++) {
		if (filera[i].getAttribute("class") === "row seleccionat") {
			filera[i].setAttribute("class", "row");
		}
		if (this.getAttribute("estat") === "fet") {
			this.setAttribute("class", "row seleccionat");
		}
	}
	event.preventDefault();
}

//Crea una nova filera per tornar a provar d'encertar la paraula
function nouIntent() {
	let maxim = 0;
	let novaFila = document.createElement('div');
	novaFila.setAttribute("class", "row");
	novaFila.setAttribute("estat", "pendent");
	novaFila.setAttribute("correctes", "0");
	novaFila.setAttribute("incorrectes", "0");
	board.appendChild(novaFila);
	filera = board.children;
	clicaFilera(); //afegim l'event listener a la nova filera

	while (maxim < 5) { //afegim les caselles com a fills de la nova filera
		let novaCasella = document.createElement('div');
		novaCasella.setAttribute("class", "tile");
		novaFila.appendChild(novaCasella);
		maxim++;
	}
}

//Retorna la fila seleccionada que tingui l'atribut "row seleccionat"
function selecFilera() {
	for (let i = 0; i < filera.length; i++) {
		if (filera[i].getAttribute("class") === "row seleccionat") {
			return [filera[i], i];
		}
	}
	return null;
}

//Fa visible l'apartat d'estadistiques i n'omple les dades
function mostraEstadistiques() {
	var modal = document.querySelector('.overlay');
	modal.style.display = "flex";

	var keyboard = boardContainer.nextElementSibling;
	var overlay = keyboard.nextElementSibling;
	var content = overlay.firstElementChild;
	var container = content.firstElementChild;
	var close_icon = container.firstElementChild.children[1];

	close_icon.addEventListener('click', function(){
		modal.style.display = "none";
	});

	var statistics = close_icon.nextElementSibling;
	var num_jugades = statistics.firstElementChild.children[0];
	var exits = statistics.firstElementChild.nextElementSibling.children[0];
	var errors = statistics.firstElementChild.nextElementSibling.nextElementSibling.children[0];

	var dades = dadesEstadistiques();
	var cFetes = dades[0];
	var cExits = dades[1];
	var cErrors = dades[2];
	num_jugades.innerText = cFetes;
	exits.innerText = cExits;
	errors.innerText = cErrors;

}

//Recupera les dades que apareixeran a l'apartat d'estadistiques
function dadesEstadistiques() {
	var fetes = 0;
	var exits = 0;
	var errors= 0;
	for (let i = 0; i < filera.length; i++) {
		if (filera[i].getAttribute("estat") === "fet") {
			fetes++;
			exits = exits + parseFloat(filera[i].getAttribute("correctes"));
			errors = errors + parseFloat(filera[i].getAttribute("incorrectes"));
		}
	}
	exits = parseFloat((exits / (fetes*5))*100).toFixed(1);
	errors = parseFloat((errors / (fetes*5))*100).toFixed(1);
	
	return [fetes, exits, errors];
}



