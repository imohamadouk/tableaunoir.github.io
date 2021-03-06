

window.onload = load;


let palette = new Palette();
let loaded = false;


/**
 * this function sets the document.body scrolls to 0
 * It solves some issues:
 * - on smartphones: that we can scroll the page itself
 * - when typing texts in magnet, it makes the screen not to scroll
 */
function installBodyNoScroll() {
	setInterval(() => {
		document.body.scrollLeft = 0;
		document.body.scrollTop = 0;
	}, 1000);
}


function load() {
	try {

		installBodyNoScroll();

		if (loaded)
			return;

		UserManager.init();

		document.getElementById("buttonNoBackground").onclick = () => { backgroundClear(); Menu.hide(); };
		document.getElementById("buttonMusicScore").onclick = () => { musicScore(); Menu.hide(); };

		Layout.init();

		Translation.init();
		ChalkCursor.init();
		LoadSave.init();
		BoardManager.init();
		Menu.init();
		Share.init();
		Toolbar.init();
		Discussion.init();



		let changeColor = () => {
			if (MagnetManager.getMagnetUnderCursor() == undefined) { //if no magnet under the cursor, change the color of the chalk
				//if (!isDrawing)
				palette.show({ x: UserManager.me.x, y: UserManager.me.y });
				palette.next();
			}
			else { // if there is a magnet change the background of the magnet
				let magnet = MagnetManager.getMagnetUnderCursor();
				magnet.style.backgroundColor = nextBackgroundColor(magnet.style.backgroundColor);
			}
		}

		let previousColor = () => {
			if (MagnetManager.getMagnetUnderCursor() == undefined) { //if no magnet under the cursor, change the color of the chalk
				UserManager.me.eraseMode = false;

				if (!UserManager.me.isDrawing)
					palette.show({ x: UserManager.me.x, y: UserManager.me.y });
				palette.previous();
			}
			else { // if there is a magnet change the background of the magnet
				let magnet = MagnetManager.getMagnetUnderCursor();
				magnet.style.backgroundColor = previousBackgroundColor(magnet.style.backgroundColor);
			}
		}

		let switchChalkEraser = () => {
			if (UserManager.me.eraseMode)
				Share.execute("switchChalk", [UserManager.me.userID]);
			else
				Share.execute("switchErase", [UserManager.me.userID]);


		}


		document.getElementById("buttonMenu").onclick = Menu.toggle;
		document.getElementById("buttonColors").onclick = changeColor;

		document.getElementById("buttonChalk").onclick = switchChalkEraser;
		document.getElementById("buttonEraser").onclick = switchChalkEraser;
		
		document.getElementById("buttonText").onclick = () => MagnetManager.addMagnetText(UserManager.me.x, UserManager.me.y);
		document.getElementById("buttonDivide").onclick = divideScreen;

		document.getElementById("buttonLeft").onclick = BoardManager.left;
		document.getElementById("buttonRight").onclick = BoardManager.right;
		document.getElementById("buttonCancel").onclick = BoardManager.cancel;
		document.getElementById("buttonRedo").onclick = BoardManager.redo;

		document.getElementById("buttonAskQuestion").onclick = Discussion.askQuestion;

		

		let buttons = document.getElementById("controls").children;

		for (let i = 0; i < buttons.length; i++)
			if(buttons[i] instanceof HTMLButtonElement)
				(<HTMLButtonElement> buttons[i]).onfocus = (<any> document.activeElement).blur; //to be improved

		Welcome.init();


		BlackVSWhiteBoard.init();

		palette.onchange = () => {
			Share.execute("switchChalk", [UserManager.me.userID]);
			Share.execute("setCurrentColor", [UserManager.me.userID, palette.getCurrentColor()]);
		}


		document.onkeydown = (evt) => {
			//console.log("ctrl: " + evt.ctrlKey + " shift:" + evt.shiftKey + "key: " + evt.key)
			if (evt.key == "Backspace")
				evt.preventDefault();

			if (evt.key == "Escape" || evt.key == "F1") {//escape => show menu
				if (Welcome.isShown())
					Welcome.hide();
				else if (palette.isShown())
					palette.hide();
				else
					Menu.toggle();
			}

			if (Menu.isShown() || Welcome.isShown())
				return;

			if (!evt.ctrlKey && !evt.shiftKey && evt.key == "c") // c => change color
				changeColor();
			else if (!evt.ctrlKey && evt.shiftKey && evt.key == "C")
				previousColor();
			else if (evt.key == "Enter" && palette.isShown())
				palette.hide();
			else if (evt.key == "ArrowLeft" && palette.isShown())
				palette.previous();
			else if (evt.key == "ArrowRight" && palette.isShown())
				palette.next();
			else if (evt.key == "Enter") {
				MagnetManager.addMagnetText(UserManager.me.x, UserManager.me.y);
				evt.preventDefault(); //so that it will not add "new line" in the text element
			}
			else if (evt.key == "ArrowLeft") {
				BoardManager.left();
			}
			else if (evt.key == "ArrowRight") {
				BoardManager.right();
			}
			else if (evt.key == "d")  //d = divide screen
				divideScreen();
			else if ((evt.ctrlKey && evt.shiftKey && evt.key == "Z") || (evt.ctrlKey && evt.key == "y")) { //ctrl + shift + z OR Ctrl + Y = redo
				BoardManager.redo();
				evt.preventDefault();
			}
			else if (evt.ctrlKey && evt.key == "z") {// ctrl + z = undo 
				BoardManager.cancel();
				evt.preventDefault();
			}

			else if (evt.key == "e")  //e = switch eraser and chalk
				switchChalkEraser();
			else if (evt.key == "h")
				Toolbar.toggle();
			else if (evt.ctrlKey && evt.key == 'x') {//Ctrl + x 
				palette.hide();
				if (UserManager.me.lastDelineation.containsPolygonToMagnetize())
					UserManager.me.lastDelineation.cutAndMagnetize();
			}
			else if (evt.ctrlKey && evt.key == 'c') {//Ctrl + c
				palette.hide();
				if (UserManager.me.lastDelineation.containsPolygonToMagnetize())
					UserManager.me.lastDelineation.copyAndMagnetize();
			}
			else if (evt.ctrlKey && evt.key == "v") { //Ctrl + v = print the current magnet
				palette.hide();
				MagnetManager.printCurrentMagnet();
			}
			else if (evt.key == "m") { //m = make new magnets
				palette.hide();
				if (UserManager.me.lastDelineation.containsPolygonToMagnetize())
					UserManager.me.lastDelineation.cutAndMagnetize();
				else {
					MagnetManager.printCurrentMagnet();
					MagnetManager.removeCurrentMagnet();
				}
			}
			else if (evt.key == "p") { //p = print the current magnet
				palette.hide();
				MagnetManager.printCurrentMagnet();
			}
			else if (evt.key == "Delete" || evt.key == "x" || evt.key == "Backspace") { //supr = delete the current magnet
				palette.hide();
				/*if (lastDelineation.containsPolygonToMagnetize())
					lastDelineation.erase();
				else*/
				MagnetManager.removeCurrentMagnet();
				evt.preventDefault();
			}

		};


		document.getElementById("canvas").onpointerdown = (evt) => {
			if (Welcome.isShown())
				Welcome.hide();
			evt.preventDefault();
			Share.execute("mousedown", [UserManager.me.userID, evt])
		};
		document.getElementById("canvasBackground").onpointermove = (evt) => { console.log("mousemove on the background should not occur") };
		document.getElementById("canvas").onpointermove = (evt) => { evt.preventDefault(); Share.execute("mousemove", [UserManager.me.userID, evt]) };
		document.getElementById("canvas").onpointerup = (evt) => { evt.preventDefault(); Share.execute("mouseup", [UserManager.me.userID, evt]) };
		//document.getElementById("canvas").onmousedown = mousedown;

		TouchScreen.addTouchEvents(document.getElementById("canvas"));




		//	document.getElementById("canvas").onmouseleave = function (evt) { isDrawing = false; }

		MagnetManager.init();
		loadMagnets();

		BoardManager.load();
		loaded = true;
	}
	catch (e) {
		ErrorMessage.show(e);
		loaded = false;
	}
}



function getCanvas(): HTMLCanvasElement {
	return <HTMLCanvasElement> document.getElementById("canvas");
}


function getCanvasBackground(): HTMLCanvasElement {
	return <HTMLCanvasElement> document.getElementById("canvasBackground");
}



function getContainer() {
	return document.getElementById("container");
}

function drawLine(context, x1, y1, x2, y2, pressure = 1.0, color = UserManager.me.getCurrentColor()) {
	//console.log(pressure)
	context.beginPath();
	context.strokeStyle = color;
	context.globalCompositeOperation = "source-over";
	context.globalAlpha = 0.9 + 0.1 * pressure;
	context.lineWidth = 1.5 + 3 * pressure;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}


function drawDot(x, y, color) {
	const context = getCanvas().getContext("2d");
	context.beginPath();
	context.fillStyle = color;
	context.lineWidth = 2.5;
	context.arc(x, y, 2, 0, 2 * Math.PI);
	context.fill();
	context.closePath();
}


function clearLine(x1, y1, x2, y2, lineWidth = 10) {
	const context = getCanvas().getContext("2d");
	context.beginPath();
	//context.strokeStyle = BACKGROUND_COLOR;
	context.globalCompositeOperation = "destination-out";
	context.strokeStyle = "rgba(255,255,255,1)";

	context.lineWidth = lineWidth;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineCap = "round";
	context.stroke();
	context.closePath();
}



function divideScreen() {
	console.log("divide the screen")
	let x = document.getElementById("container").scrollLeft + Layout.getWindowWidth() / 2;
	drawLine(getCanvas().getContext("2d"), x, 0, x, Layout.getWindowHeight(), 1, BoardManager.getDefaultChalkColor());
	BoardManager.saveCurrentScreen();
}


function backgroundClear() {
	const canvasBackground = getCanvasBackground();
	canvasBackground.getContext("2d").clearRect(0, 0, canvasBackground.width, canvasBackground.height);
}


function musicScore() {
	backgroundClear();
	let COLORSTAFF = "rgb(128, 128, 255)";
	let fullHeight = Layout.getWindowHeight() - 32;
	const container = document.getElementById("container");
	const canvasBackground= getCanvasBackground();

	let x = container.scrollLeft;
	let x2 = container.scrollLeft + Layout.getWindowWidth();
	let ymiddleScreen = fullHeight / 2;
	let yshift = fullHeight / 7;
	let drawStaff = (ymiddle) => {
		let space = fullHeight / 30;

		for (let i = -2; i <= 2; i++) {
			let y = ymiddle + i * space;
			drawLine(canvasBackground.getContext("2d"), x, y, x2, y, 1.0, COLORSTAFF);
		}
	}


	drawStaff(ymiddleScreen - yshift);
	drawStaff(ymiddleScreen + yshift);

	BoardManager.saveCurrentScreen();
}


let magnetColors = ['', 'rgb(255, 128, 0)', 'rgb(0, 128, 0)', 'rgb(192, 0, 0)', 'rgb(0, 0, 255)'];

function nextBackgroundColor(color) {
	for (let i = 0; i < magnetColors.length; i++) {
		if (magnetColors[i] == color) {
			return magnetColors[(i + 1) % magnetColors.length];
		}
	}
	return magnetColors[0];
}


function previousBackgroundColor(color) {
	for (let i = 0; i < magnetColors.length; i++) {
		if (magnetColors[i] == color) {
			return magnetColors[(i - 1) % magnetColors.length];
		}
	}
	return magnetColors[0];
}