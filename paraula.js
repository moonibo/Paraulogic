// Array amb paraules de cinc lletres
paraules = ["ZOECI","XORIC","XICOT","XICON","XICOL","SOMIC","SOCIS","SIBOC","ROGIC","RICOR","QUICO","PROCI","PICOT","PICOR","ORINC","OOECI","OLEIC","OFICI","OCUPI","OCCIT","OCCIR","OCAPI","OBLIC","NOCIU","NICOL","MICRO","LICOR","IODUC","ICONA","GISCO","ECOIC","DISCO","DIOIC","CUIRO","COTIP","COSTI","COSSI","COSIT","COSIR","CORRI","CORNI","COPIA","COIXA","COITS","COIOT","COFOI","CODIS","COBAI","CAIXO","CAIOT","BONIC","BOLIC","BOCOI","BITOC","BICOL","BEOCI","AZOIC","CRIOS","ALCOI"];
// Funció que genera un array amb quatre números diferents del 0 al 9
function creaParaula(){
	// Agarem una paraula aleatòria
	let paraula = paraules[Math.floor(Math.random() * paraules.length)]
	// Retornem un array amb les diferents lletres
	return paraula.split('');
}

window.onload = function(){

	//Agafem el conjunt de caselles on s'han d'escriure les lletres
	var caselles = document.getElementsByClassName("tile");
	let posLletra = 0; // Posició actual on escriure la lletra dins la filera
	let filera = 0; // Filera actual
	
	//Creem la paraula a endevinar
	let paraulaEndevinar = creaParaula();

	// Tecles del teclat virtual
	let tecles = document.getElementsByTagName('button');

	// Creem el codi a executar quan es realitzen els diferents esdeveniments sobre les tecles
	// El primer element no el tenim en compte, ja que és el botó que surt a la part superior dreta del joc
	for(let i=1; i < tecles.length; i++){
		// Quan el ratolí entra en la tecla
		tecles[i].addEventListener('mouseover', function(e){
			this.style.backgroundColor = "#888";
		});

		// Quan el ratolí surt de la tecla
		tecles[i].addEventListener('mouseleave', function(e){ // mouseleave // mouseout
			this.style.backgroundColor = "#d3d6da";
		});
		
		// Quan fem clic sobre la tecla del teclat virtual
		tecles[i].addEventListener('click', comprovarTeclaVirtual)

	}

	function comprovarTeclaVirtual(e){
		// Mostrem la lletra clicada
		let teclaClicada = this.getAttribute('data-key');
		aplicarAccio(teclaClicada);
	};


	// Funció que fa una acció determinada segon el caràcter introduït
	//La primera comprovació de l'if és pel teclat virtual i el segon pel teclat real
	function aplicarAccio(tecla){
		//Creem un patró per veure si la tecla pressionada és un únic caràcter de 
		//l'alfabet català (és útil per al cas del teclat real)
		let patro = /^[A-ZÇ]{1}$/i;
		if(tecla == '↵' || tecla == 'Enter'){
			//Si ja s'han introduït 5 lletres, comprovarem la paraula
			if (posLletra == 5) {
				comprovarParaula();
			}		
		}else if(tecla == '←' || tecla == 'Backspace'){
			//Si hi ha alguna lletra escrita, l'esborrem
			if (posLletra > 0){
				esborrarLletra();
			}
		}else if(patro.test(tecla)){
			//Si encara no s'han introduït les 5 lletres, escriurem la nova
			if (posLletra < 5){
				escriureLletra(tecla);
			}	
		}
	}


	// Assignem la funció a l'esdeveniment de teclat 
	// (Utilitzem 'keydown' per obtenir també els caràcters sense representació gràfica)
	document.addEventListener('keydown', comprovarTeclaReal);

	// Funció per discernir la tecla de l'ordinador
	function comprovarTeclaReal(e){
		let tecla = event.key;
		aplicarAccio(tecla);
	}

	// Funció per escriure una lletra
	function escriureLletra(lletra){
			caselles[filera*5+posLletra].textContent = lletra.toUpperCase();
			posLletra++;
	}

	// Funció per esborrar la última una lletra
	function esborrarLletra(){
		posLletra--;
		caselles[filera*5+posLletra].textContent="";
	}

	// Comprovació del mot escrit
	function comprovarParaula(){
		let colorCasella;
		let bona = 0;

		//Obtenim la paraula que ha escrit l'usuari
		let paraulaEscrita = obtenirParaulaEscrita();
		//Comprovem les lletres introduïdes respecte a les que s'han d'endevinar
		for(let i=0; i < 5; i++){
			if(paraulaEscrita[i] == paraulaEndevinar[i]){ // Lletra correcta
				bona++;
				colorCasella = "#3ca83f";
			} else if (paraulaEndevinar.includes(paraulaEscrita[i])) {
				colorCasella = "#d69a29";
			} else {
				colorCasella = "#787c7e";
			}

			caselles[filera * 5 + i].style.backgroundColor = colorCasella;
		}
		
		// Si l'usuari ha encertat, guanya
		if (bona==5){
			alert("Enhorabona! Has encertat la paraula!");
			treureEsdeveniments();
		} else {
			//Si no hem encertat la paraula augmentem la filera mentre 
			//sigui menor de 6 i reiniciem la posició de la lletra dins la filera
			if (filera<5){
				posLletra=0;
				filera++;
			}
			//Si no, l'usuari perd
			else {
				alert("Ho sentim! No has aconseguit endevinar la paraula.");
				//Treiem els esdeveniments actius
				treureEsdeveniments();
			}
		}
		
	}
	
	//Obtenim la paraula que ha escrit l'usuari
	function obtenirParaulaEscrita(){
		let paraula = [];
		for(let i=0; i<5; i++){
			paraula.push(caselles[filera * 5 + i].textContent);
		}
		return paraula;
	}

	//Desactivem els esdeveniments assignats
	function treureEsdeveniments(){
		document.removeEventListener('keydown', comprovarTeclaReal);
		for(let i=1; i < tecles.length; i++){
			tecles[i].removeEventListener('click', comprovarTeclaVirtual)
		}
	}
}
