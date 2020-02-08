var canvas,
  canvasColor,
  contextColor,
  context,
  canvasDiv = document.getElementById('test'),
  panelsDiv = document.getElementById('panel'),
  canvasWidth = canvasDiv.offsetWidth,
  canvasHeight = canvasDiv.offsetHeight,
  defaultColor = '#000000'
curColor = defaultColor,
  clickColor = new Array(),
  clickTool = new Array(),
  curTool = "pencil";

canvasColor = document.createElement('canvas');
canvasColor.setAttribute('width', '500');
canvasColor.setAttribute('height', '50');
canvasColor.setAttribute('id', 'color');
panelsDiv.appendChild(canvasColor);
if (typeof G_vmlCanvasManager != 'undefined') {
  canvasColor = G_vmlCanvasManager.initElement(canvasColor);
}
contextColor = canvasColor.getContext("2d");

drawGradients(contextColor);

canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas1');
canvasDiv.appendChild(canvas);
if (typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");


clearColors();

$('#color').mousemove(function (e) {
  var canvasOffset = $(canvasColor).offset();
  var canvasX = Math.floor(e.pageX - canvasOffset.left);
  var canvasY = Math.floor(e.pageY - canvasOffset.top);
  var imageData = contextColor.getImageData(canvasX, canvasY, 1, 1);
  var pixel = imageData.data;
  var R = pixel[0];
  var G = pixel[1];
  var B = pixel[2];
  var hex = rgbToHex(R, G, B);
  var pixelColor = '#' + hex;
  $('#preview').css('backgroundColor', pixelColor);
});

$('#color').click(function (e) {
  var canvasOffset = $(canvasColor).offset();
  var canvasX = Math.floor(e.pageX - canvasOffset.left);
  var canvasY = Math.floor(e.pageY - canvasOffset.top);

  var imageData = contextColor.getImageData(canvasX, canvasY, 1, 1);
  var pixel = imageData.data;
  var R = pixel[0];
  var G = pixel[1];
  var B = pixel[2];

  var hex = rgbToHex(R, G, B);
  curColor = '#' + hex;
  $('#preview').css('backgroundColor', curColor);
});

$('#color').mouseleave(function () {
  $('#preview').css('backgroundColor', curColor);
});

function drawGradients() {
  var grad = contextColor.createLinearGradient(20, 0, canvasColor.width - 20, 0);
  grad.addColorStop(0, 'black');
  grad.addColorStop(1 / 8, 'white');
  grad.addColorStop(2 / 8, 'red');
  grad.addColorStop(3 / 8, 'orange');
  grad.addColorStop(4 / 8, 'yellow');
  grad.addColorStop(5 / 8, 'green')
  grad.addColorStop(6 / 8, 'aqua');
  grad.addColorStop(7 / 8, 'blue');
  grad.addColorStop(1, 'purple');

  contextColor.fillStyle = grad;
  contextColor.fillRect(0, 0, canvasColor.width, canvasColor.height);

  grad = contextColor.createLinearGradient(0, 0, 0, canvasColor.height);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  grad.addColorStop(0.5, "rgba(0,     0,   0, 0)");
  grad.addColorStop(1, "rgba(0,     0,   0, 1)");
  contextColor.fillStyle = grad;
  contextColor.fillRect(0, 0, canvasColor.width, canvasColor.height);
}

function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }
function toHex(n) {
  n = parseInt(n, 10);
  if (isNaN(n)) return "00";
  n = Math.max(0, Math.min(n, 255)); return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
}

$('#canvas1').mousedown(function (e) {
  var parentOffset = $(this).parent().offset();
  var mouseX = e.pageX - parentOffset.left;
  var mouseY = e.pageY - parentOffset.top;
  paint = true;
  addClick(mouseX, mouseY);
  redraw();
});

$('#canvas1').mousemove(function (e) {
  if (paint) {
    var parentOffset = $(this).parent().offset();
    addClick(e.pageX - parentOffset.left, e.pageY - parentOffset.top, true);
    redraw();
  }
});

$('#canvas1').mouseup(function (e) {
  paint = false;
});

$('#canvas1').mouseleave(function (e) {
  paint = false;
});

var clickX = new Array(),
  clickY = new Array(),
  clickDrag = new Array(),
  paint;

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(curColor);
}



$('#clearCanvas').mousedown(function (e) {
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickColor = new Array();

  clearColors();
  clearCanvas();
});

$('#choosePencilTools').mousedown(function (e) {
  curTool = "pencil";
});

$('#chooseRectTools').mousedown(function (e) {
  curTool = "rect";
});

$('#chooseLineTools').mousedown(function (e) {
  curTool = "line";
});



function clearColors() {
  curColor = defaultColor;
  $('#preview').css('backgroundColor', curColor);
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  context.lineJoin = "round";
  context.lineWidth = 5;

  for (var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.strokeStyle = clickColor[i];
    context.stroke();
  }
}