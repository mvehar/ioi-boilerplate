(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
var index = 0;
var dropIndex = 0;
var atomX = 300;
var atomY = 200;
var electronSize = 5;
var protonSize = 7;
var shellColors = ["#cd3bb0", "#11d414", "#d36e0b", "#ffdc1d", "#0cd6ff"]
elements = [new Atom("Mg", [2,8,2]),
            new Atom("K", [2,8,8,1]),
            new Atom("Fe", [2,8,14,2]),
            new Atom("Cu", [2,8,18,1]),
            new Atom("Zn", [2,8,18,2]),
            new Atom("Zr", [2,8,18,10,2]),
            new Atom("Ag", [2,8,18,18,1]),
            new Atom("Sn", [2,8,18,18,4]),
            new Atom("Sb", [2,8,18,18,5]),
]
function Atom(name, electronPositions, x, y){
    this.name = name;
    this.electronPositions = electronPositions;
    this.positions = [[],[],[]];
}

Atom.prototype.addPosition = function(electron, shell, x, y){
    this.positions[shell].push([x,y]);
};
Atom.prototype.middleElectron = function(shell){
    return this.positions[2].length/2;
};


var c = document.getElementById("canvas");
var c2 = document.getElementById("canvas2");
//var ctx2 = c2.getContext("2d")
var ctx = c.getContext("2d");
var centerX = 400;
var centerY = 200;
var shells = ["K", "L", "M", "N", "O", "P", "Q"];
var shellPaddingStart = 50;
var shellPadding = 30;
var atomIndex = 2;
var atom = elements[atomIndex];
var animateCircle = true;
var firstElectronPresent = true;
var secondElectronPresent = true;
var secondDropElectronPresent = true;
var firstDropElectronPresent = true;
var energyPresent = false;
var energy2Present = false;

var energyPositions1 = [];
var energyPositions2 = [];
var energyInfo = [["Kα","#11d414"], ["Kβ","#d36e0b"]];
var phase = 1;
var secondIndex = 0;
var storedTrailing = [];

drawing = new Image();
drawing.src = "wave.png";

function animate(current) {
    current = current || 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (energyPresent){
        persistEnergy(ctx);
    }
    ctx.beginPath();
    ctx.fillStyle = "grey"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1;
    ctx.arc(atomX, atomY, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black"
    ctx.font = "20px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(atom.name, atomX, atomY);
    ctx.stroke();
    for(var i = 0; i < atom.electronPositions.length; i++){
        ctx.fillText(shells[i], getSteps(- 0.15).x * (i) * (shellPadding - 7) + shellPaddingStart + atomX + 28,
                                getSteps(- 0.15).y * (i) * (shellPadding - 7) + shellPaddingStart + 200);
        ctx.strokeStyle = shellColors[i];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(atomX, atomY, (i+1) * shellPadding +  shellPaddingStart, 0, 2 * Math.PI);
        ctx.stroke();
    }
    for (var i = 0; i < atom.electronPositions.length; i++){
        for (var j = 0; j < atom.electronPositions[i]; j++){
            drawElectron(j, i, current, atom);
        }
    }
    
    requestAnimationFrame(function () {
        if (current < 359){
            animate((current + 1.2) % 360);
        } else if (animateCircle) {
            index += 1;
            animateCircle = false;
            drawMovingPoint(canvas.width, 0, atom.positions[dropIndex][0][0], atom.positions[dropIndex][0][1], 0, 1, ctx, "blue");
        }
    });
}


function drawMovingEnergy(startX, startY, endX, endY, lineCounter, speed, context){
    context.clearRect(0, 0, canvas.width, canvas.height);
    var name = "";
    var color = ""
    if (context.canvas.id == "canvas"){
        energyPresent = true;
        if (index < 7){
            name = energyInfo[0][0]
            color = energyInfo[0][1]
            firstElectronPresent = true;
            firstDropElectronPresent = false;
        } else {
            name = energyInfo[1][0]
            color = energyInfo[1][1]
            secondElectronPresent = true;
            secondDropElectronPresent = false;
        }
        animate(360);
    }
    else if (context.canvas.id == "canvas2"){
        if (secondIndex == 1){
            name = energyInfo[0][0]
            color = energyInfo[0][1]
        } else {
            name = energyInfo[1][0]
            color = energyInfo[1][1]
        }
        //drawLines(0, context);
    }
    var width = endX - startX;
    var height = endY - startY;
    var lineLength = Math.sqrt(height*height + width*width) / Math.sqrt(2);
    var angleRad = Math.atan2(height, width);
    var step = getSteps(angleRad - Math.PI/4);
    var x = lineCounter * step.x;
    var y = lineCounter * step.y;
    drawEnergy(startX + x, startY + y, name, color, context);
    lineCounter += 2 / speed;
    if (lineCounter < lineLength){
        requestAnimationFrame(function() {
            drawMovingEnergy(startX, startY, endX, endY, lineCounter, speed, context );
        });
    }
    else if (context.canvas.id == "canvas") {
        if (index < 7) {
            energyPresent = true;
            energyPositions1.push([50,50]);
            index += 1;
            drawMovingPoint(canvas.width, 0, atom.positions[0][dropIndex][0], atom.positions[0][dropIndex][1], 0, 1, context, "blue");
        } else {
            energyPositions1.push([50,80]);
            //phase = 2;
            //secondPhase(0);
        }
    } else if (context.canvas.id == "canvas2") {
        energy2Present = true;
        if (secondIndex == 1){
            energyPositions2.push([40,50]);
//            drawTrailingPoint(180,canvas.height - 250 - 2 * 50, 180,canvas.height - 250, 0, 4, context);
        } else if (secondIndex == 2){
            energyPositions2.push([40,80]);
        }
    }
}

function persistEnergy(context){
    if (context.canvas.id == "canvas") {
        positions = energyPositions1;
    }
    else {
        positions = energyPositions2;
    }
    for(var i = 0; i < positions.length; i++){
        drawEnergy(positions[i][0], positions[i][1], energyInfo[i][0], energyInfo[i][1], context)
    }
}

function drawMovingPoint(startX, startY, endX, endY, lineCounter, speed, context, color) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    animate(360);
    var width = endX - startX;
    var height = endY - startY;
    var lineLength = Math.sqrt(height*height + width*width) / Math.sqrt(2);
    var angleRad = Math.atan2(height, width);
    var step = getSteps(angleRad - Math.PI/4);
    var x = lineCounter * step.x;
    var y = lineCounter * step.y;
    drawGradientElectron(startX + x, startY + y, color);
    lineCounter += 2 / speed;
    if (lineCounter < lineLength){
        requestAnimationFrame(function() {
            drawMovingPoint(startX, startY, endX, endY, lineCounter, speed, context, color );
        });
    } else if (lineCounter >= lineLength && lineCounter < lineLength + 3) {
        ctx.beginPath();
        ctx.arc(startX + x, startY + y,5, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.fillStyle = "black";
        requestAnimationFrame(function() {
            drawMovingPoint(startX, startY, endX, endY, lineCounter, speed, context, color);
        });
    } else {
        if (context.canvas.id == "canvas"){
            console.log(index);
            if (index == 1){
                index += 1;
                ctx.clearRect(startX + x-5, startY + y-5, 10,10);
                ctx.beginPath();
                ctx.arc(atomX, atomY, 1 * shellPadding + shellPaddingStart, 0, 2 * Math.PI);
                ctx.stroke();
                firstElectronPresent = false;
                splitPoint(endX, endY, 0, true);  
            } else if (index == 3){

                index += 1;
                drawMovingEnergy(atom.positions[dropIndex-1][0][0], atom.positions[dropIndex-1][0][1], 50, 50, 0, 1, context);
            } else if (index == 5) {
                index += 1;
                ctx.clearRect(startX + x-5, startY + y-5, 10,10);
                ctx.beginPath();
                ctx.arc(atomX, atomY, 1 * shellPadding + shellPaddingStart, 0, 2 * Math.PI);
                ctx.stroke();
                secondElectronPresent = false;
                splitPoint(endX, endY, 0, false);  
            } else if (index == 7){
                index += 1;
                drawMovingEnergy(atom.positions[0][1][0], atom.positions[0][1][1], 50, 80, 0, 1, context);
            }
        } else if(context.canvas.id == "canvas2"){
            drawLines(0,ctx2);
        }
    }
}
function splitPoint(startX, startY, lineCounter, upward) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animate(360);
    var width = 50 - startX;
    var height = 200 - startY;
    var lineLength = Math.sqrt(height*height + width*width) / Math.sqrt(2);
    var angleRad = Math.atan2(height, width);
    var step = getSteps(angleRad - Math.PI/4);
    var x = lineCounter * step.x;
    var y = lineCounter * step.y;
    var y2 = lineCounter * (step.y * - 1.5) - 1;
    if(upward){
        drawGradientElectron(startX + x, startY + y, "blue");
        drawGradientElectron(startX + x, startY + y2, "orange");
    } else {
        drawGradientElectron(startX + x, startY + y, "orange");
        drawGradientElectron(startX + x, startY + y2, "blue");
    }
    
    lineCounter += 1;
    if (lineCounter < lineLength){
        requestAnimationFrame(function() {
           splitPoint(startX, startY, lineCounter + 1, upward);
        });
    } else if (index == 2){
        dropIndex += 1;
        index += 1;
        firstDropElectronPresent = false;
        //drawTrailingPoint(230,canvas.height - 250 - 1 * 50,230,canvas.height - 250, 0, 4, ctx2);
        console.log("First drop")
        event("drop1");
        drawMovingPoint(atom.positions[1][0][0], atom.positions[1][0][1], atom.positions[0][0][0], atom.positions[0][0][1] - 5, 0, 8, ctx, "orange");
    } else {
        index += 1;
        secondDropElectronPresent = false;
        console.log("Second drop");
        event("drop2");
        //drawTrailingPoint(180,canvas.height - 250 - 2 * 50, 180,canvas.height - 250, 0, 4, ctx2);
        drawMovingPoint(atom.positions[2][atom.middleElectron(2)][0], atom.positions[2][atom.middleElectron(2)][1], atom.positions[0][1][0], atom.positions[0][1][1] + 4, 0, 8, ctx, "orange");
    }
}

function getSteps(angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);
    return {
        x: cos - sin,
        y: sin + cos
    }
}

function drawGradientElectron(x,y, color){
    var size = 0;
    if (color == "blue"){
        size = protonSize;
    } else {
        size = electronSize;
    }
    var gradient = ctx.createRadialGradient(x,y, 0, x,y, size)
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
}

function drawTrailingElectron(x,y, startX, startY, color, context){
    var gradient = context.createRadialGradient(x,y, 0, x,y, electronSize)
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, color);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, electronSize, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = color;
    context.moveTo(x,y-4);
    context.lineTo(startX, startY);
    context.stroke();
}

function drawEnergy(x,y, name, color, context){
    context.fillStyle = color;
    context.font = "15px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(name, x-4, y);
    context.drawImage(drawing,x,y, 20, 20);
}

function drawElectron(electron, shell, step, atom){
    var radius = (shell + 1) * shellPadding + shellPaddingStart
    var angle = electron * 360/atom.electronPositions[shell] - step;
    angle = angle + 90;
    var x = atomX + radius * Math.cos(-angle*Math.PI/180);
    var y = atomY + radius * Math.sin(-angle*Math.PI/180);
    if (electron == 0 && shell == 0){
        if (firstElectronPresent){
            drawGradientElectron(x,y, "orange");
        }
    } else if (electron == 0 && shell == 1){
        if (firstDropElectronPresent){
            drawGradientElectron(x,y, "orange");
        }
    } else if (electron == 1 && shell == 0){
        if (secondElectronPresent){
            drawGradientElectron(x,y, "orange");
    
        }
    } else if (electron == atom.middleElectron(2) && shell == 2){
        if (secondDropElectronPresent){
            drawGradientElectron(x,y, "orange");
        }
    } else {
        drawGradientElectron(x,y, "orange");
    }
    if (step > 359 && shell < 3 && animateCircle){
        atom.addPosition(electron, shell, x, y)
    }
}

function secondPhase(){
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    drawTrailingPoint(230,canvas.height - 250 - 1 * 50,230,canvas.height - 250, 0, 4, ctx2);
}

function drawLines(lineCounter, context){
    var linePadding = canvas.height - 250;
    for(var i = 0; i < atom.positions.length; i++){
        var y = linePadding - i * 50;
        context.beginPath();
        context.strokeStyle = shellColors[i];
        context.lineWidth = 3;
        context.moveTo(100, y);
        context.lineTo(300, y);
        context.stroke();
        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign="center";
        context.textBaseline="middle";
        context.fillText(shells[i], 80, y);
    }
    context.lineWidth = 1;
    if(secondIndex == 1){
        drawTrailingElectron(storedTrailing[0][0], storedTrailing[0][1], storedTrailing[0][2], storedTrailing[0][3], storedTrailing[0][4], context);
    } else if (secondIndex == 2){
        drawTrailingElectron(storedTrailing[0][0], storedTrailing[0][1], storedTrailing[0][2], storedTrailing[0][3], storedTrailing[0][4], context);
        drawTrailingElectron(storedTrailing[1][0], storedTrailing[1][1], storedTrailing[1][2], storedTrailing[1][3], storedTrailing[1][4], context);
    }
    if (energy2Present){
        persistEnergy(context);
    }
}

function drawTrailingPoint(startX, startY, endX, endY, lineCounter, speed, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLines(0,context);
    var width = endX - startX;
    var height = endY - startY;
    var lineLength = Math.sqrt(height*height + width*width) / Math.sqrt(2);
    var angleRad = Math.atan2(height, width);
    var step = getSteps(angleRad - Math.PI/4);
    var x = lineCounter * step.x;
    var y = lineCounter * step.y;
    drawTrailingElectron(startX + x, startY + y, startX, startY, shellColors[secondIndex + 1], context);
    lineCounter += 2 / speed;
    if (lineCounter < lineLength){
        requestAnimationFrame(function() {
            drawTrailingPoint(startX, startY, endX, endY, lineCounter, speed, context );
        });
    } else if (secondIndex == 0) {
        energyPositions = []
        secondIndex += 1;
        storedTrailing[0] = [startX + x, startY + y, startX, startY, shellColors[secondIndex]];
        drawMovingEnergy(endX, endY, 40, 50, 0, 1, context);
    } else if (secondIndex == 1){
        secondIndex += 1;
        storedTrailing[1] = [startX + x, startY + y, startX, startY, shellColors[secondIndex]];
        drawMovingEnergy(endX, endY, 40, 80, 0, 1, context);
    }
}

function event(event){
    var e = new Event(event);
    document.dispatchEvent(e);
}