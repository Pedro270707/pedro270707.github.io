const terrainCanvas = document.getElementById("terrain-canvas");
const terrainCanvasCtx = terrainCanvas.getContext("2d");

var textureWidth = textureHeight = 32;

terrainCanvas.width = textureWidth * 32;
terrainCanvas.height = textureHeight * 32;

const initialTerrainImage = new Image(textureWidth * 32, textureHeight * 32);
initialTerrainImage.src = "/assets/btapackconverter/default/terrain.png";
initialTerrainImage.style.imageRendering = "pixelated";

initialTerrainImage.onload = function() {
	terrainCanvasCtx.mozImageSmoothingEnabled = false;
	terrainCanvasCtx.webkitImageSmoothingEnabled = false;
	terrainCanvasCtx.msImageSmoothingEnabled = false;
	terrainCanvasCtx.imageSmoothingEnabled = false;
	terrainCanvasCtx.drawImage(initialTerrainImage, 0, 0, textureWidth * 32, textureHeight * 32);
}

const terrainPositionToName = new Map();

terrainPositionToName.set(0, "grass_block_top");
terrainPositionToName.set(1, "stone");
terrainPositionToName.set(2, "dirt");
terrainPositionToName.set(3, "grass_block_side");
terrainPositionToName.set(4, "oak_planks");
terrainPositionToName.set(5, "smooth_stone_slab_side");
terrainPositionToName.set(6, "smooth_stone");
terrainPositionToName.set(7, "bricks");
terrainPositionToName.set(8, "tnt_side");
terrainPositionToName.set(9, "tnt_top");
terrainPositionToName.set(10, "tnt_bottom");
terrainPositionToName.set(11, "cobweb");
terrainPositionToName.set(12, "poppy");
terrainPositionToName.set(13, "dandelion");
terrainPositionToName.set(16, "gold_ore");
terrainPositionToName.set(17, "iron_ore");
terrainPositionToName.set(18, "coal_ore");
terrainPositionToName.set(19, "lapis_ore");
terrainPositionToName.set(20, "diamond_ore");
terrainPositionToName.set(21, "redstone_ore");
terrainPositionToName.set(32, "cobblestone");
terrainPositionToName.set(33, "bedrock");
terrainPositionToName.set(34, "sand");
terrainPositionToName.set(35, "gravel");
terrainPositionToName.set(37, "smooth_stone");
terrainPositionToName.set(44, "red_mushroom");
terrainPositionToName.set(45, "brown_mushroom");
terrainPositionToName.set(67, "bookshelf");
terrainPositionToName.set(68, "mossy_cobblestone");
terrainPositionToName.set(69, "obsidian");
terrainPositionToName.set(70, "grass_block_side_overlay");
terrainPositionToName.set(71, "grass");
terrainPositionToName.set(72, "grass_block_top");
terrainPositionToName.set(75, "crafting_table_top");
terrainPositionToName.set(76, "furnace_front");
terrainPositionToName.set(77, "furnace_side");
terrainPositionToName.set(78, "dispenser_front");
terrainPositionToName.set(96, "sponge");
terrainPositionToName.set(97, "glass");
terrainPositionToName.set(103, "dead_bush");
terrainPositionToName.set(104, "fern");
terrainPositionToName.set(107, "crafting_table_side");
terrainPositionToName.set(108, "crafting_table_front");
terrainPositionToName.set(109, "furnace_front_on");
terrainPositionToName.set(110, "furnace_top");
terrainPositionToName.set(129, "spawner");
terrainPositionToName.set(130, "snow");
terrainPositionToName.set(131, "ice");
terrainPositionToName.set(132, "grass_block_snow");
terrainPositionToName.set(133, "cactus_top");
terrainPositionToName.set(134, "cactus_side");
terrainPositionToName.set(135, "cactus_bottom");
terrainPositionToName.set(136, "clay");
terrainPositionToName.set(137, "sugar_cane");
terrainPositionToName.set(138, "jukebox_side");
terrainPositionToName.set(139, "jukebox_top");
terrainPositionToName.set(144, "iron_block");
terrainPositionToName.set(145, "gold_block");
terrainPositionToName.set(146, "diamond_block");
terrainPositionToName.set(160, "torch");
terrainPositionToName.set(161, "oak_door_top");
terrainPositionToName.set(162, "iron_door_top");
terrainPositionToName.set(163, "ladder");
terrainPositionToName.set(164, "oak_trapdoor");
// Pumpkin
terrainPositionToName.set(166, "farmland_moist");
terrainPositionToName.set(167, "farmland");
terrainPositionToName.set(168, "wheat_stage0");
terrainPositionToName.set(169, "wheat_stage1");
terrainPositionToName.set(170, "wheat_stage2");
terrainPositionToName.set(171, "wheat_stage3");
terrainPositionToName.set(172, "wheat_stage4");
terrainPositionToName.set(173, "wheat_stage5");
terrainPositionToName.set(174, "wheat_stage6");
terrainPositionToName.set(175, "wheat_stage7");
terrainPositionToName.set(176, "iron_block");
terrainPositionToName.set(177, "gold_block");
terrainPositionToName.set(178, "diamond_block");
terrainPositionToName.set(192, "lever");
terrainPositionToName.set(193, "oak_door_bottom");
terrainPositionToName.set(194, "iron_door_bottom");
terrainPositionToName.set(195, "redstone_torch");
terrainPositionToName.set(196, "dirt_path_top");
terrainPositionToName.set(197, "dirt_path_side");
terrainPositionToName.set(198, "pumpkin_top");
terrainPositionToName.set(199, "netherrack");
terrainPositionToName.set(200, "soul_sand");
terrainPositionToName.set(201, "glowstone");
terrainPositionToName.set(202, "piston_top_sticky");
terrainPositionToName.set(203, "piston_top");
terrainPositionToName.set(204, "piston_side");
terrainPositionToName.set(205, "piston_bottom");
terrainPositionToName.set(206, "piston_inner");
terrainPositionToName.set(208, "iron_block");
terrainPositionToName.set(209, "gold_block");
terrainPositionToName.set(210, "diamond_block");
terrainPositionToName.set(224, "rail_corner");
terrainPositionToName.set(227, "redstone_torch_off");
terrainPositionToName.set(228, "iron_trapdoor");
terrainPositionToName.set(230, "pumpkin_side");
terrainPositionToName.set(231, "carved_pumpkin");
terrainPositionToName.set(232, "jack_o_lantern");
terrainPositionToName.set(233, "cake_top");
terrainPositionToName.set(234, "cake_side");
terrainPositionToName.set(235, "cake_inner");
terrainPositionToName.set(236, "cake_bottom");
terrainPositionToName.set(237, "blast_furnace");
terrainPositionToName.set(256, "rail");
terrainPositionToName.set(259, "repeater");
terrainPositionToName.set(262, (zip) => { // Bed (feet, top)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(262);
			const pixelCoordinates = getPixelCoordinatesFromId(262);
			readAndDrawRotatedFileWithSize(file, 6, 28, 16, 16, pixelCoordinates[0], pixelCoordinates[1], 90);
		});
	}
});
terrainPositionToName.set(263, (zip) => { // Bed (head, top)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(263);
			const pixelCoordinates = getPixelCoordinatesFromId(263);
			readAndDrawRotatedFileWithSize(file, 6, 6, 16, 16, pixelCoordinates[0], pixelCoordinates[1], 90);
		});
	}
});
terrainPositionToName.set(266, "stone_bricks");
terrainPositionToName.set(267, "mossy_stone_bricks");
terrainPositionToName.set(288, "lapis_block");
terrainPositionToName.set(291, "repeater_on");
terrainPositionToName.set(293, (zip) => { // Bed (feet, front)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(293);
			const pixelCoordinates = getPixelCoordinatesFromId(293);
			readAndDrawRotatedFileWithSize(file, 22, 22, 16, 6, pixelCoordinates[0], pixelCoordinates[1] - 3 * textureHeight / 16, 180);
			readAndDrawFileWithSize(file, 53, 3, 3, 3, pixelCoordinates[0] - 8 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
			readAndDrawFileWithSize(file, 53, 3, -3, 3, pixelCoordinates[0] + 8 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
			
		});
	}
});
terrainPositionToName.set(294, (zip) => { // Bed (feet, side)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(294);
			const pixelCoordinates = getPixelCoordinatesFromId(294);
			readAndDrawRotatedFileWithSize(file, 22, 28, 6, 16, pixelCoordinates[0], pixelCoordinates[1] + 7 * textureHeight / 16, 90);
			readAndDrawFileWithSize(file, 50, 3, -3, 3, pixelCoordinates[0] - 5 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
		});
	}
});
terrainPositionToName.set(295, (zip) => { // Bed (head, side)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(295);
			const pixelCoordinates = getPixelCoordinatesFromId(295);
			readAndDrawRotatedFileWithSize(file, 22, 6, 6, 16, pixelCoordinates[0], pixelCoordinates[1] + 7 * textureHeight / 16, 90);
			readAndDrawFileWithSize(file, 50, 3, 3, 3, pixelCoordinates[0] + 5 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
		});
	}
});
terrainPositionToName.set(296, (zip) => { // Bed (head, back)
	const imgFile = zip.files["assets/minecraft/textures/entity/bed/red.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(296);
			const pixelCoordinates = getPixelCoordinatesFromId(296);
			readAndDrawRotatedFileWithSize(file, 6, 0, 16, 6, pixelCoordinates[0], pixelCoordinates[1] - 3 * textureHeight / 16, 180);
			readAndDrawFileWithSize(file, 53, 3, 3, 3, pixelCoordinates[0] - 8 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
			readAndDrawFileWithSize(file, 53, 3, -3, 3, pixelCoordinates[0] + 8 * textureWidth / 16, pixelCoordinates[1] + 5 * textureHeight / 16);
			
		});
	}
});
terrainPositionToName.set(299, "wet_sponge");
terrainPositionToName.set(320, "redstone_block");
terrainPositionToName.set(323, "powered_rail");
terrainPositionToName.set(324, (zip) => {
	const redstoneDustDot = zip.files["assets/minecraft/textures/block/redstone_dust_dot.png"];
	const redstoneDustLine = zip.files["assets/minecraft/textures/block/redstone_dust_line0.png"];
	if (redstoneDustDot && redstoneDustLine) {
		redstoneDustDot.async("blob").then(dotFile => {
			redstoneDustLine.async("blob").then(lineFile => {
				clearId(324);
				const pixelCoordinates = getPixelCoordinatesFromId(324);
				readAndDrawFile(lineFile, pixelCoordinates[0], pixelCoordinates[1]);
				readAndDrawRotatedFile(lineFile, pixelCoordinates[0], pixelCoordinates[1], -90);
				readAndDrawRotatedFile(dotFile, pixelCoordinates[0], pixelCoordinates[1]);
			});
		});
	}
});
terrainPositionToName.set(325, (zip) => {
	const imgFile = zip.files["assets/minecraft/textures/block/redstone_dust_line0.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			clearId(325);
			const pixelCoordinates = getPixelCoordinatesFromId(325);
			readAndDrawRotatedFile(file, pixelCoordinates[0], pixelCoordinates[1], -90);
		});
	}
}); // This is rotated 90°, so fix it later.
terrainPositionToName.set(352, "sandstone_top");
terrainPositionToName.set(355, "powered_rail_on");
terrainPositionToName.set(384, "sandstone_side");
terrainPositionToName.set(387, "detector_rail");
terrainPositionToName.set(396, "quartz_block_side");
terrainPositionToName.set(416, "sandstone_bottom");
terrainPositionToName.set(480, "destroy_stage_0");
terrainPositionToName.set(481, "destroy_stage_1");
terrainPositionToName.set(482, "destroy_stage_2");
terrainPositionToName.set(483, "destroy_stage_3");
terrainPositionToName.set(484, "destroy_stage_4");
terrainPositionToName.set(485, "destroy_stage_5");
terrainPositionToName.set(486, "destroy_stage_6");
terrainPositionToName.set(487, "destroy_stage_7");
terrainPositionToName.set(488, "destroy_stage_8");
terrainPositionToName.set(489, "destroy_stage_9");
terrainPositionToName.set(549, "black_wool");
terrainPositionToName.set(550, "gray_wool");
terrainPositionToName.set(581, "red_wool");
terrainPositionToName.set(582, "pink_wool");
terrainPositionToName.set(613, "green_wool");
terrainPositionToName.set(614, "lime_wool");
terrainPositionToName.set(640, "oak_log");
terrainPositionToName.set(641, "oak_log_top");
terrainPositionToName.set(642, "oak_leaves");
terrainPositionToName.set(643, (zip) => {
	const imgFile = zip.files["assets/minecraft/textures/block/oak_leaves.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			const pixelCoordinates = getPixelCoordinatesFromId(643);
			terrainCanvasCtx.fillStyle = "#2c2c2c";
			terrainCanvasCtx.fillRect(pixelCoordinates[0], pixelCoordinates[1], textureWidth, textureHeight);
			readAndDrawFile(file, pixelCoordinates[0], pixelCoordinates[1]);
		});
	}
});
terrainPositionToName.set(644, "oak_sapling");
terrainPositionToName.set(645, "brown_wool");
terrainPositionToName.set(646, "yellow_wool");
terrainPositionToName.set(677, "blue_wool");
terrainPositionToName.set(678, "light_blue_wool");
terrainPositionToName.set(709, "purple_wool");
terrainPositionToName.set(710, "magenta_wool");
terrainPositionToName.set(736, "spruce_log");
terrainPositionToName.set(737, "spruce_log_top");
terrainPositionToName.set(738, "spruce_leaves");
terrainPositionToName.set(739, (zip) => {
	const imgFile = zip.files["assets/minecraft/textures/block/spruce_leaves.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			const pixelCoordinates = getPixelCoordinatesFromId(739);
			terrainCanvasCtx.fillStyle = "#313131";
			terrainCanvasCtx.fillRect(pixelCoordinates[0], pixelCoordinates[1], textureWidth, textureHeight);
			readAndDrawFile(file, pixelCoordinates[0], pixelCoordinates[1]);
		});
	}
});
terrainPositionToName.set(740, "spruce_sapling");
terrainPositionToName.set(741, "cyan_wool");
terrainPositionToName.set(742, "orange_wool");
terrainPositionToName.set(768, "birch_log");
terrainPositionToName.set(769, "birch_log_top");
terrainPositionToName.set(770, "birch_leaves");
terrainPositionToName.set(771, (zip) => {
	const imgFile = zip.files["assets/minecraft/textures/block/birch_leaves.png"];
	if (imgFile) {
		imgFile.async("blob").then(file => {
			const pixelCoordinates = getPixelCoordinatesFromId(771);
			terrainCanvasCtx.fillStyle = "#2c2c2c";
			terrainCanvasCtx.fillRect(pixelCoordinates[0], pixelCoordinates[1], textureWidth, textureHeight);
			readAndDrawFile(file, pixelCoordinates[0], pixelCoordinates[1]);
		});
	}
});
terrainPositionToName.set(772, "birch_sapling");
terrainPositionToName.set(773, "light_gray_wool");
terrainPositionToName.set(774, "white_wool");

document.getElementById("zip-upload").addEventListener('change', function(event) {
    const file = event.target.files[0];
	JSZip.loadAsync(file).then(function(zip) {
		for (let i = 0; i < 32; i++) {
			for (let j = 0; j < 32; j++) {
				const entry = terrainPositionToName.get(getIdFromCoordinates(i, j));
				if (entry !== undefined) {
					if (typeof entry == "function") {
						entry(zip);
					} else {
						const imgFile = zip.files["assets/minecraft/textures/block/" + entry + ".png"];
						if (imgFile) {
							imgFile.async("blob").then(file => {
								clearId(getIdFromCoordinates(i, j));
								readAndDrawFile(file, textureWidth * i, textureWidth * j);
							});
						}
					}
				}
			}
		}
	});
});

function getIdFromCoordinates(x, y) {
	return x + y * 32;
}

function getCoordinatesFromId(id) {
	return [(id % 32), ((id - (id % 32))/32)];
}

function getPixelCoordinatesFromId(id) {
	let coordinates = getCoordinatesFromId(id);
	return [coordinates[0] * textureWidth, coordinates[1] * textureHeight];
}

function clearId(id) {
	const pixelCoordinates = getPixelCoordinatesFromId(id);
	terrainCanvasCtx.clearRect(pixelCoordinates[0], pixelCoordinates[1], textureWidth, textureHeight);
}

function readAndDrawFile(file, x, y) {
	const fileReader = new FileReader();
	fileReader.onload = function(e) {
		const img = new Image();

		img.src = e.target.result;

		img.onload = function() {
			terrainCanvasCtx.drawImage(img, x, y, textureWidth, textureHeight);
		}
	}
	
	fileReader.readAsDataURL(file);
}

function readAndDrawFileWithSize(file, sx, sy, sWidth, sHeight, x, y) {
	const fileReader = new FileReader();
	fileReader.onload = function(e) {
		const img = new Image();

		img.src = e.target.result;

		img.onload = function() {
			terrainCanvasCtx.save();
			terrainCanvasCtx.translate(x + textureWidth / 2, y + textureHeight / 2);
			if (sWidth < 0) {
				terrainCanvasCtx.scale(-1, 1);
				sWidth = -sWidth;
			}
			if (sHeight < 0) {
				terrainCanvasCtx.scale(1, -1);
				sHeight = -sHeight;
			}
			terrainCanvasCtx.drawImage(img, sx * textureWidth / 16, sy * textureWidth / 16, sWidth * textureWidth / 16, sHeight * textureWidth / 16, 0, 0, sWidth * textureWidth / 16, sHeight * textureHeight / 16);
			terrainCanvasCtx.restore();
		}
	}
	
	fileReader.readAsDataURL(file);
}

function readAndDrawRotatedFile(file, x, y, angle) {
	const fileReader = new FileReader();
	fileReader.onload = function(e) {
		const img = new Image();

		img.src = e.target.result;

		img.onload = function() {
			terrainCanvasCtx.save();
			terrainCanvasCtx.translate(x + textureWidth / 2, y + textureHeight / 2);
			terrainCanvasCtx.rotate(angle * Math.PI / 180);
			terrainCanvasCtx.drawImage(img, -textureWidth / 2, -textureHeight / 2);
			terrainCanvasCtx.restore();
		}
	}
	
	fileReader.readAsDataURL(file);
}

function readAndDrawRotatedFileWithSize(file, sx, sy, sWidth, sHeight, x, y, angle) {
	const fileReader = new FileReader();
	fileReader.onload = function(e) {
		const img = new Image();

		img.src = e.target.result;

		img.onload = function() {
			terrainCanvasCtx.save();
			terrainCanvasCtx.translate(x + textureWidth / 2, y + textureHeight / 2);
			terrainCanvasCtx.rotate(angle * Math.PI / 180);
			if (sWidth < 0) {
				terrainCanvasCtx.scale(-1, 1);
				sWidth = -sWidth;
			}
			if (sHeight < 0) {
				terrainCanvasCtx.scale(1, -1);
				sHeight = -sHeight;
			}
			terrainCanvasCtx.drawImage(img, sx * textureWidth / 16, sy * textureWidth / 16, sWidth * textureWidth / 16, sHeight * textureWidth / 16, -textureWidth / 2, -textureHeight / 2, sWidth * textureWidth / 16, sHeight * textureHeight / 16);
			terrainCanvasCtx.restore();
		}
	}
	
	fileReader.readAsDataURL(file);
}