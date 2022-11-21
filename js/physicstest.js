const circle = document.getElementById("circle");
var gravityStrength = 0.1;
var velocityX;
var velocityY;
var mouseX;
var mouseY;

document.onmousemove = function(event) {
	mouseX = event.pageX;
	mouseY = event.pageY;
}

var pullInterval = setInterval(function() {
	velocityX = (mouseX - parseInt(circle.style.left)) * gravityStrength;
	velocityY = (mouseY - parseInt(circle.style.top)) * gravityStrength;
	circle.style.left = parseInt(circle.style.left) + velocityX + "px";
	circle.style.top = parseInt(circle.style.top) + velocityY + "px";
}, 20);