function interact(){
  objAgent.globalPosX = mouseX;
  objAgent.globalPosY = mouseY;
}
function changeColor() {
  if (objetoCor == "#FF0000") {
    objetoCor = "#FFFFFF";
  } else {
    objetoCor = "#FF0000";
  }
}
function mousePos() {
  mouseX = event.offsetX - canvas.width/2;
  mouseY = event.offsetY - canvas.height/2;
}
function setup() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    canvas.addEventListener("mouseover",changeColor);
    canvas.addEventListener("click",interact);
    canvas.addEventListener("mousemove", mousePos);
    canvas.oncontextmenu = () => {
      alert("Right Click");
      event.preventDefault();
    }
    window.requestAnimationFrame(draw);
  } else {
    alert("Crash");
  } 
}
function update() {
  
}
function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var width = ctx.canvas.clientWidth;
  var height = ctx.canvas.clientHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
  ctx.fillStyle = objetoCor;
  ctx.fillRect(-30, -30, 10, 10);
  ctx.fillText(mouseX+"  "+mouseY, mouseX, mouseY);
  ctx.arc(objAgent.globalPosX, objAgent.globalPosY,5,0,Math.PI*2);
  ctx.fill();
  window.requestAnimationFrame(draw);
}
