window.onload = function(){
	init();
}

var first = 1;
let fillColor;
var isMouseDown = false; 
var allInputs = document.querySelectorAll("input[type='text']");
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");


function init(){
	const canvas = document.getElementById("canvas1");
	canvas.addEventListener("mousedown", drawTrue, false);
	canvas.addEventListener("mouseup", drawFalse, false);
	canvas.addEventListener("mouseout", drawFalse, false);
	canvas.addEventListener("mousemove", draw, false);
}


function colorSelect() {
  colors = document.getElementsByName("colors");
  for(i = 0; i < colors.length; i++) {
    colors[i].addEventListener("click", function(){
      Brush.color = this.style.background;
    }, false);
  }
}

var Brush = {
  size : 10,
  number : 10,
  color : colorSelect()
};

function drawTrue() {
  isMouseDown = true;
}

function drawFalse() {
  first = 1;
  isMouseDown = false;
}

var BrushType = {
  selectBrushBefore: function() {
    if(document.getElementById("circle").checked === true){
      return BrushType.circleBefore();
    }
    else if(document.getElementById("lowrate").checked === true){
      return BrushType.lowrateBefore();
    }
    else if(document.getElementById("rectangle").checked === true){
      return BrushType.rectangleBefore();
    }
    },
  selectBrushAfter: function() {
    if(document.getElementById("circle").checked === true){
      return BrushType.circleAfter();
    }
    else if(document.getElementById("lowrate").chcecked === true){
      return BrushType.lowrateAfter();
    }
    else if(document.getElementById("rectangle").checked === true){
      return BrushType.rectangleAfter();
    }
  },

  circleBefore: function() {   
    ctx.strokeStyle = Brush.color;
    ctx.beginPath();
    ctx.lineWidth = Brush.size;
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
  },
  circleAfter: function() {
    ctx.lineTo(x, y);
    ctx.stroke();
  },
  lowrateBefore: function() {
    if(Brush.size != 1) {
      ctx.fillStyle = Brush.color;
      ctx.beginPath();
      ctx.arc(x, y, Brush.size / 2, Math.PI * 2, 0, false);
      ctx.closePath();
      ctx.fill();
	}
    
    ctx.strokeStyle = Brush.color;
    ctx.beginPath();
    ctx.lineWidth = Brush.size;
    ctx.moveTo(x, y);
  },
  lowrateAfter: function() {
    ctx.lineTo(x, y);
    ctx.stroke();	
    
	if(Brush.size != 1) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(x, y, Brush.size / 4, Math.PI * 2, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = Brush.color;
      ctx.beginPath();
      ctx.arc(x, y, Brush.size / 2, Math.PI * 2, 0, false);
      ctx.closePath();
      ctx.fill();
	}
  },

  rectangleBefore: function() {   
    ctx.strokeStyle = Brush.color;
    ctx.beginPath();
    ctx.lineWidth = Brush.size;
    ctx.moveTo(x, y);
    ctx.lineCap = 'square';
  },
  rectangleAfter: function() {
    ctx.lineTo(x, y);
    ctx.stroke();
  },
};

function draw(ev) {
  if(isMouseDown){
    if(first == 1) {
      x = ev.clientX - canvas.offsetLeft;
      y = ev.clientY - canvas.offsetTop;
      first = 0;
    }
    else if(first === 0){
      BrushType.selectBrushBefore();
      x = ev.clientX - canvas.offsetLeft;
      y = ev.clientY - canvas.offsetTop;
      BrushType.selectBrushAfter();
    }
  }
}


document.getElementById("size_range").addEventListener("change", sizeSelectRange, false);
document.getElementById("size_value").addEventListener("keyup", sizeSelectText, false);

function sizeSelectRange() {
  document.getElementById("size_value").value = document.getElementById("size_range").value;
  Brush.size = document.getElementById("size_value").value;
}

function sizeSelectText() {
  document.getElementById("size_range").value = parseInt(document.getElementById("size_value").value, 10);
  Brush.size = document.getElementById("size_value").value;
}