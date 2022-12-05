const world = document.getElementById('world');
var tiles = '0,0,0;1,0,0;0,1,0;1,1,0;2,0,1';
var tilesSplit = tiles.split(';');
console.log(tilesSplit);

for (i = 0; i < tilesSplit.length; i++) {
	var tileSplit = tilesSplit[i].split(',');
	var img = document.createElement('img');
	img.width = img.height = 64;
	img.style.position = 'absolute';
	img.style.imageRendering = 'pixelated';
	img.style.left = tileSplit[0] * 64 + 'px';
	img.style.top = tileSplit[1] * 64 + 'px';
	console.log(tileSplit[2]);
	switch (tileSplit[2]) {
		case '1':
			img.src = '/assets/worldtest/andesite.png';
			break;
		case '2':
			img.src = '/assets/worldtest/diorite.png';
			break;
		case '3':
			img.src = '/assets/worldtest/granite.png';
			break;
		case '4':
			img.src = '/assets/worldtest/dirt.png';
			break;
		default:
			img.src = '/assets/worldtest/stone.png';
			break;
	}
	document.getElementById('world').appendChild(img);
}

var keyState = {};
document.addEventListener("keydown", function(event) {
	keyState[event.keyCode || event.which] = true;
}, true);
document.addEventListener("keyup", function(event) {
	keyState[event.keyCode || event.which] = false;
}, true);

function gameLoop() {
    if (keyState[37] || keyState[65]){
		world.style.left += 1
    }

    if (keyState[39] || keyState[68]){
		world.style.left -= 1
    }
	
	setTimeout(gameLoop, 10);
}

gameLoop();