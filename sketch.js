// Aqua Pendulum Clock - Interactive Graphics Project
// by Kanan Rahimli


// global vars
{
var mainBoxW = 105;
var mainBoxH = 200;
var mainBoxD = 50;

var clockR = 50;
var clockD = 5;
var clockX = 0;
var clockY = -47.3;

var pendulumW = 60;

var numW = 2;
var numH = 10;
var numD = 2;
var numbersZ = mainBoxD/2+5;

var rotate12 = 0;

var hourDegree = 0;
var minuteDegree = 0;

var rotX = 0;
var rotY = 0;;
var moveX = 0;
var moveY = -80;

var sca = 1.5;

// pendulum 1 vars
var p1Angle = 0;
var p1InitSpeed = 0.0225;
var p1Speed = p1InitSpeed;
var p1Dir = 1;
var p1Rot = -1;
var rotPenHead1TorL = 0;
var rotPenHead1TorM = 0;
var rotPenHead1TorS = 0;
var rotPenHead1TorDir = 1;
var rotPenHead1TorSp = 1;
// pendulum 2 vars
var p2Angle = 0
var p2InitSpeed = 0.0125;
var p2Speed = p2InitSpeed;
var p2Dir = 1;
var p2Rot = -1;
var rotPenHead2TorL = 0;
var rotPenHead2TorM = 0;
var rotPenHead2TorS = 0;
// pendulum 3 vars
var p3Angle = 0;
var p3InitSpeed = 0.015;
var p3Speed = p3InitSpeed;
var p3Dir = 1;
var p3Rot = -1;
var rotPenHead3TorL = 0;
var rotPenHead3TorM = 0;
var rotPenHead3TorS = 0;

// fish vars
var fish1, fish2, fish3;

var moveF1X = 0;
var moveF1Y = 55;
var moveF1Z = 0;
var rotF1Y;
var dirF1X = -1;
var speedF1 = 0.011;

var moveF2X = 8;
var moveF2Y = 50;
var moveF2Z = 0;
var rotF2Y;
var dirF2X = -1;
var speedF2 = 0.019;

var moveF3X = -7;
var moveF3Y = 35;
var moveF3Z = 0;
var rotF3Y;
var dirF3X = -1;
var speedF3 = 0.02;

// bubble vars
var bub = mainBoxH;
var dis = 255;
var ranX = 0;

// view, light, infoPanel vars
var isOrthoView = true;
var isPersView = false;

// bools
var isAmbLight = true;
var isDirLight = false;
var isPointLight = false;
var isPlay = true;
var isMuted = false;
var isPanelOn = true;

var infoPanel;
var amLigMode = "on";
var dirLigmode = "off";
var pointLigMode = "off";
var viewMode = "orthogonal";
var star = "*"; // just for fun
var mon = "Monitor:\nAmbient light is\nDirectional light is\nPoint light is\nView mode is";
var instr = "Instructions:\ni - toggle this window\no - activate Orthogonal View\np - activate Perspective View\nm - mute the Bubble Sound\n1 - toggle Ambient Light\n2 - toggle Directional Light\n3 - toggle Point Light\nspacebar - toggle Animation\nleft mouse button - rotate\nctrl+left mouse button - move\nmouse wheel - zoom in/out and volume up/down";
var textX = 300;
var textY = 0;

var fov;
var cameraZ;

var bubbleSound;

var penHead1TorL;
}

// textures, objects, sound, image
function preload() {
  fish1 = loadModel('assets/fish.obj');
  fish1T = loadImage('assets/fish1Texture.jpg');
  fish2 = loadModel('assets/fish.obj');
  fish2T = loadImage('assets/fish2Texture.jpg');
  fish3 = loadModel('assets/fish.obj');
  fish3T = loadImage('assets/fish3Texture.jpg');
  baseT = loadImage('assets/baseTexture.jpg');
  glassT = loadImage('assets/glassTexture.jpg');
  numberT = loadImage('assets/numberTexture.jpg');
  chainT = loadImage('assets/chainTexture.jpg');
  metalT = loadImage('assets/metalTexture.jpg');
  waterT = loadImage('assets/waterTexture.jpg');
  bubbleT = loadImage('assets/bubbleTexture.png');
  spongeT = loadImage('assets/spongeTexture.jpg');
  sapienzaT = loadImage('assets/sapienzaTexture.png');
  bubbleSound = loadSound('assets/bubbleSound.wav');
}

// zoom in/out on scroll
function mouseWheel(event) {
	sca += event.delta/1000;
	if (sca <= 0){sca = 0.1;}
	if (sca >= 10){sca = 10;}
}

// bubble maker
function createBubble(bX, bY, bZ, bSize){
	fill(255, 255, 255, 0);
	texture(bubbleT);
	push();
	if (isPlay){
	translate(	bX+random(-0.5, 0.5)+ranX, 
				bub-bY+8+random(-0.5, 0.5), 
				bZ+random(-0.5, 0.5) );	
	}
	else{translate(	bX, bub-bY+8, bZ);}
	sphere(bSize);
	if (bub < 220){bub = mainBoxH;
		ranX = random(-3, 0);}
	bub -= 0.08/20;
	pop();
}

// keyboard - interaction
function keyTyped() {
  if (key == "i" || key == "I") {isPanelOn = !isPanelOn;}
  if (key == "o" || key == "O") {isOrthoView = true;isPersView=false;}
  if (key == "p" || key == "P") {isPersView = true;isOrthoView=false;}
  if (key == "m" || key == "M") {isMuted = !isMuted;}
  if (key == "1") {isAmbLight = !isAmbLight;}
  if (key == "2") {isDirLight = !isDirLight;}
  if (key == "3") {isPointLight = !isPointLight;}
  if (keyCode == "32") {isPlay = !isPlay;}
}

// runs once
function setup() {
	// cover the entire window
	createCanvas(innerWidth, innerHeight, WEBGL);	
	
	infoPanel = createGraphics(280, 280);
	
	rotF1Y = PI/2;
	rotF2Y = PI/2;
	rotF3Y = PI/2;
	
	fov = 60 / 180 * PI;
	cameraZ = height / 2.0 / tan(fov / 2.0);
}

// main loop
function draw() {
	background(255);
			
	// info-interactive panel
	if (isPanelOn){
		push();
		infoPanel.background(137, 9, 45);
		infoPanel.textStyle(NORMAL);
		infoPanel.textSize(10);
		infoPanel.textFont('Georgia');
		infoPanel.fill(255);
		infoPanel.textAlign(LEFT);
		infoPanel.textLeading(15); // Set leading to 10
		infoPanel.text(mon, 20, 18);
		infoPanel.text(viewMode, 83, 78);
		infoPanel.text(instr, 20, 100);
		isAmbLight ? infoPanel.fill(0,255,0) : infoPanel.fill(255,0,0);
		infoPanel.text(amLigMode, 95, 33);
		isDirLight ? infoPanel.fill(0,255,0) : infoPanel.fill(255,0,0);
		infoPanel.text(dirLigmode, 107, 48);
		isPointLight ? infoPanel.fill(0,255,0) : infoPanel.fill(255,0,0);
		infoPanel.text(pointLigMode, 80, 63);
		for (var i=0;i<37;i++){infoPanel.fill(random(0,255),random(0,255),random(0,255));infoPanel.text(star, 20+i*6, 91);};
		normalMaterial(255);
		texture(infoPanel);
		translate(textX, textY);
		plane(400);
		pop();
	}
	
	// lights
	{
	var dirX = (mouseX / width - 0.5) * 2;
	var dirY = (mouseY / height - 0.5) * 2;
	var locX = mouseX - width / 2;
	var locY = mouseY - height / 2;
	if (isAmbLight){ambientLight(255);amLigMode = "on";}
	else{ambientLight(0);amLigMode = "off";}
	if (isDirLight){directionalLight(255, 255, 255, -dirX, -dirY, -0.2);dirLigmode = "on";}
	else{directionalLight(0,0,0, -dirX, -dirY, -0.2);dirLigmode = "off";}
	if (isPointLight){pointLight(255, 255, 255, locX, locY, 350);pointLigMode = "on";}
	else{pointLight(0,0,0, locX, locY, 350);pointLigMode = "off";}
	}

	// camera/view
	if (isOrthoView){ortho(-width/2, width/2, -height/2, height/2);viewMode = "orthogonal";}
	else if (isPersView){perspective(60 / 180 * PI, width / height, cameraZ * 0.1, cameraZ * 10);viewMode = "perspective";}
	
	// mouse control - drag, rotate and zoom
	if (keyIsDown(17) && mouseIsPressed){
		moveX += mouseX - pmouseX;
		moveY += mouseY - pmouseY;
	}
	translate(moveX, moveY, 0);
	scale(sca);
	if (mouseIsPressed && !keyIsDown(17)){
		rotX += mouseX - pmouseX;
		rotY += mouseY - pmouseY;
	}
	rotateX(PI*rotY/100);
	rotateY(PI*rotX/100);
	
	// clock object
	{
	// main box - mech box
	noStroke();
	push();
	specularMaterial(255, 255, 255);
	translate(clockX, clockY);
	texture(baseT);
	box(mainBoxW, mainBoxH/2 + 5, mainBoxD);
	pop();	
	// main box - aquarium
	push();
	fill(0, 0, 255, 50);
	translate(clockX, mainBoxH/2 + 5);
	texture(waterT);
	box(mainBoxW, mainBoxH, mainBoxD);
	pop();
	// main box - aquarium - bottom
	push();
	specularMaterial(255, 255, 255);
	translate(0, mainBoxH+7.5);
	texture(baseT);
	box(mainBoxW, 5, mainBoxD);
	pop();
	// aquarium - bubbler
	push();
	specularMaterial(255, 255, 255);
	texture(spongeT);
	translate(3, mainBoxH+6, 0);
	cylinder(6);
	pop();
	// clock base
	push();
	fill(0, 255, 0, 50);
	translate(clockX, clockY, 5);
	rotateX(PI/2);
	texture(glassT);
	cylinder(clockR, clockR);
	rotateX(PI/2);
	rotateY(PI);
	rotateZ(PI);
	translate(0, 0, 21);
	fill(0,0,0,50);
	texture(sapienzaT);
	plane(70);
	pop();
	// internal cylinder
	push();
	fill(120, 255, 0, 50);
	translate(clockX, clockY, mainBoxD/2-14);
	rotateX(PI/2);
	cylinder(clockR-15, clockR-15);
	pop();
	// minute clock
	push();
	specularMaterial(255, 255, 255);
	texture(glassT);
	translate(clockX, clockY);
	rotateZ(map(hourDegree, 0, 12, -PI, PI)+map(minuteDegree, 0, 60, 0, 2*PI/12));
	translate(clockX, 25, mainBoxD/2-3);
	rotateX(PI/2);
	cylinder(10, 10);
	// minute clock center
	push();
	specularMaterial(255, 255, 255);
	texture(baseT);
	translate(0, 5, 0);
	cylinder(2, 2);
	box(1,1,1);
	// minute hand
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	rotateY(map(minuteDegree, 0, 60, 0, PI*2)-map(hourDegree, 0, 12, -PI, PI)-map(minuteDegree, 0, 60, 0, 2*PI/12));
	translate(0, 0, 3);
	box(1, 1, 10);
	pop();
	pop();
	pop();
	}

	// pendulums
	{
	// pendulum hand -1 -middle -big
	{
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	rotateZ(p1Angle);
	translate(0, pendulumW/2+5, 0);
	texture(chainT);
	box(.5, pendulumW, .5);
	// pendulum head -1
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	translate(0, pendulumW/2+7);
	// rotateX(PI/2);
	texture(metalT);
	rotateY(rotPenHead1TorL);
	torus(7, .5);
	push();
	rotateX(rotPenHead1TorM);
	torus(5, .5);
	push();
	translate(-6, 0);
	box(2, .5, .5);
	translate(12, 0);
	box(2, .5, .5);
	pop();
	push();
	rotateY(rotPenHead1TorS);
	torus(3, .5);
	push();
	translate(0, -4);
	box(.5, 2, .5);
	translate(0, 8);
	box(.5, 2, .5);
	pop();
	pop();
	pop();
	pop();
	pop();
	}
	// pendulum hand -2 -front -small
	{
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	rotateZ(p2Angle);
	translate(0, pendulumW/2-4, mainBoxD/3);
	texture(chainT);
	box(.5, pendulumW*0.7, .5);
	// pendulum head -2
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	translate(0, pendulumW/2-2);
	// rotateX(PI/2);
	texture(metalT);
	rotateY(rotPenHead2TorL);
	torus(7, .5);
	push();
	rotateX(rotPenHead2TorM);
	torus(5, .5);
	push();
	translate(-6, 0);
	box(2, .5, .5);
	translate(12, 0);
	box(2, .5, .5);
	pop();
	push();
	rotateY(rotPenHead2TorS);
	torus(3, .5);
	push();
	translate(0, -4);
	box(.5, 2, .5);
	translate(0, 8);
	box(.5, 2, .5);
	pop();
	pop();
	pop();
	pop();
	pop();
	}
	// pendulum hand -3 -back -medium
	{
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	rotateZ(p3Angle);
	translate(0, pendulumW/2+14, -mainBoxD/3);
	texture(chainT);
	box(.5, pendulumW*1.3, .5);
	// pendulum head -3
	push();
	noStroke();
	specularMaterial(255, 255, 255);
	translate(0, pendulumW/2+16);
	// rotateX(PI/2);
	texture(metalT);
	rotateY(rotPenHead3TorL);
	torus(7, .5);
	push();
	rotateX(rotPenHead3TorM);
	torus(5, .5);
	push();
	translate(-6, 0);
	box(2, .5, .5);
	translate(12, 0);
	box(2, .5, .5);
	pop();
	push();
	rotateY(rotPenHead3TorS);
	torus(3, .5);
	push();
	translate(0, -4);
	box(.5, 2, .5);
	translate(0, 8);
	box(.5, 2, .5);
	pop();
	pop();
	pop();
	pop();
	pop();
	}
	}
	
	// numbers
	{
	// I
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX+clockR*.45, clockY-clockR*.7, numbersZ);
	scale(.5);
	// texture(carbonT);
	box(numW, numH, numD);
	pop();
	pop();

	// II
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX+clockR*.7, clockY-clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR*.7+numW, clockY-clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// III
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX+clockR-numW*2, clockY, numbersZ);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR-numW*4, clockY, numbersZ);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR-numW*6, clockY, numbersZ);
	box(numW, numH, numD);
	pop();
	pop();

	// IV
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX+clockR*.7+numW, clockY+clockR*.45, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR*.7, clockY+clockR*.45, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR*.7-numW*2, clockY+clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// V
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX+clockR*.45-numW, clockY+clockR*.7, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+clockR*.45-numW*2, clockY+clockR*.7, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// VI
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-numW, clockY+clockR-numH*.8, numbersZ);
	rotateZ(PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-numW*3, clockY+clockR-numH*.8, numbersZ);
	rotateZ(-PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+numW*2, clockY+clockR-numH*.8, numbersZ);
	box(numW, numH, numD);
	pop();
	pop();

	// VII
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-clockR*.45-numW*2, clockY+clockR*.7, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.45-numW*3, clockY+clockR*.7, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.45, clockY+clockR*.7, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.45+numW, clockY+clockR*.7, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// VIII
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-clockR*.7-numW*2, clockY+clockR*.45, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.7-numW*3, clockY+clockR*.45, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.7, clockY+clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.7+numW, clockY+clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.7+numW*2, clockY+clockR*.45, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// IX
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-clockR+numW*5, clockY, numbersZ);
	rotateZ(PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR+numW*5, clockY, numbersZ);
	rotateZ(-PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR+numW*2, clockY, numbersZ);
	box(numW, numH, numD);
	pop();
	pop();

	// X
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-clockR*.7, clockY-clockR*.45, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.7, clockY-clockR*.45, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// XI
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-clockR*.45-numW, clockY-clockR*.7, numbersZ);
	rotateZ(PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.45-numW, clockY-clockR*.7, numbersZ);
	rotateZ(-PI/6);
	scale(.5);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-clockR*.45+numW, clockY-clockR*.7, numbersZ);
	scale(.5);
	box(numW, numH, numD);
	pop();
	pop();

	// XII
	push();
	specularMaterial(255, 255, 255);
	texture(numberT);
	noStroke();
	push();
	translate(clockX-numW*3, clockY-clockR+numH*.8, numbersZ);
	rotateZ(PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX-numW*3, clockY-clockR+numH*.8, numbersZ);
	rotateZ(-PI/6);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX, clockY-clockR+numH*.8, numbersZ);
	box(numW, numH, numD);
	pop();
	push();
	translate(clockX+numW*2, clockY-clockR+numH*.8, numbersZ);
	box(numW, numH, numD);
	pop();
	pop();
	}

	// fish
	{
	push();
	scale(3.5);
	translate(moveF1X, moveF1Y, moveF1Z);
	rotateY(rotF1Y);
	rotateX(PI);
	texture(fish1T);
	model(fish1);
	pop();
	push();
	scale(3);
	translate(moveF2X, moveF2Y, moveF2Z);
	rotateY(rotF2Y);
	rotateX(PI);
	texture(fish2T);
	model(fish2);
	pop();
	push();
	scale(3.2);
	translate(moveF3X, moveF3Y, moveF3Z);
	rotateY(rotF3Y);
	rotateX(PI);
	texture(fish3T);
	model(fish3);
	pop();
	}
	
	// play/pause
	if (isPlay){
		
	//clock animation - real time
	{
	var hr = hour();
	var mn = minute();
	if (hr > 12){hr = hr - 12;}
	minuteDegree = mn;
	hourDegree = hr;
	}
	
	// pendulum animations
	{
	// swings
	if (p1Speed < 0){p1Dir = 1;p1Rot *= -1;}
	if (p1Speed > p1InitSpeed){p1Dir = -1;}
	p1Speed += p1Dir * 0.0005;
	p1Angle += p1Rot * p1Speed;
	if (p2Speed < 0){p2Dir = 1;p2Rot *= -1;}
	if (p2Speed > p2InitSpeed){p2Dir = -1;}
	p2Speed += p2Dir * 0.00025;
	p2Angle += p2Rot * p2Speed;
	if (p3Speed < 0){p3Dir = 1;p3Rot *= -1;}
	if (p3Speed > p3InitSpeed){p3Dir = -1;}
	p3Speed += p3Dir * 0.0005;
	p3Angle += p3Rot * p3Speed;
	// interconnected torus
	rotPenHead1TorL += 0.05;
	rotPenHead1TorS += 0.05;
	rotPenHead1TorM += 0.05;;
	rotPenHead2TorL += 0.05;
	rotPenHead2TorS += 0.05;
	rotPenHead2TorM += 0.05;
	rotPenHead3TorL += 0.05;
	rotPenHead3TorS += 0.05;
	rotPenHead3TorM += 0.05;
	}

	// fish animations
	{
	if (moveF1X >= 10){dirF1X = -1;rotF1Y = PI/2;}
	if (moveF1X <= -10){dirF1X = 1;rotF1Y = -PI/2;}
	moveF1X += dirF1X * speedF1;
	if (moveF2X >= 12){dirF2X = -1;rotF2Y = PI/2;}
	if (moveF2X <= -12){dirF2X = 1;rotF2Y = -PI/2;}
	moveF2X += dirF2X * speedF2;
	if (moveF3X >= 12){dirF3X = -1;rotF3Y = PI/2;}
	if (moveF3X <= -12){dirF3X = 1;rotF3Y = -PI/2;}
	moveF3X += dirF3X * speedF3;
	}
}
	
	// bubble animation
	{
	for (var i=0; i<20; i++){
		if(isPlay){
		createBubble(10, i*6+5+random(-1,1) ,0+random(-1,1), .5+random(0.1,1.5));
		createBubble(5, i*7+5+random(-1,1) ,-5+random(-1,1), .5+random(0.1,1.5));
		createBubble(5, i*8+5+random(-1,1) ,5+random(-1,1), .5+random(0.1,1.5));
		createBubble(0, i*6+5+random(-1,1) ,0+random(-1,1), .5+random(0.1,1.5));
		}
		else {
		createBubble(10, i*6+5 ,0, .5);
		createBubble(5, i*7+5 ,-5, .5);
		createBubble(5, i*8+5 ,5, .5);
		createBubble(0, i*6+5 ,0, .5);
		}
	}
	
	if (!bubbleSound.isPlaying()){bubbleSound.play();}
	if (isMuted || !isPlay){bubbleSound.setVolume(0.0);}
	else{bubbleSound.setVolume(map(sca, 0.1, 10, 0.0, 1.0));}
	}	
}