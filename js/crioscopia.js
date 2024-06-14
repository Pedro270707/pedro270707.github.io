let container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

let solvents = [
    {name: "water", cryoscopic_constant: 1.86, freezing_point: 273.15, density: 1, solubility: 6, color: 0x5883d8},
    {name: "methanol", cryoscopic_constant: 1.98, freezing_point: 175.65, density: 0.791, solubility: 5, color: 0xfed330},
    {name: "ethanol", cryoscopic_constant: 1.99, freezing_point: 158.65, density: 0.789, solubility: 5, color: 0xff5733},
    {name: "propanone", cryoscopic_constant: 1.99, freezing_point: 178.35, density: 0.791, solubility: 8, color: 0x9b59b6},
    {name: "ethanenitrile", cryoscopic_constant: 3.9, freezing_point: 227.15, density: 0.786, solubility: 4, color: 0x3498db},
    {name: "methanamide", cryoscopic_constant: 3.79, freezing_point: 275.7, density: 1.133, solubility: 10, color: 0xf39c12},
];

let currentSolvent = 0;
let temperatureKelvin = 273.15;

let solventVolumeLiters = 0;
let molesOfSalt = 0;

let solventTapOpen = false;
let soluteTapOpen = false;
let emptyTapOpen = false;

(function draw() {
    if (currentSolvent > solvents.length - 1 || currentSolvent < 0) {
        changeSolvent(0);
    }

    let frozen = temperatureKelvin <= getFreezingTemperature() && solventVolumeLiters > 0 && !emptyTapOpen;
    let tooSalty = molesOfSalt == getMaxSaltAmount() && solventVolumeLiters > 0;

    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "2em sans-serif";
    ctx.fillText(translate.translateString('crioscopia.title'), 10, 10);

    if (solventTapOpen && solventVolumeLiters < 35) {
        ctx.fillStyle = "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0");
        ctx.fillRect(canvas.width / 2 + 249, canvas.height / 2 - 371, 14, 718);
        addSolvent(0.0625);
    } else {
        solventTapOpen = false;
    }
    
    if (soluteTapOpen && !tooSalty) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(canvas.width / 2 - 261, canvas.height / 2 - 371, 10, 718);
        addSalt(0.03125);
    } else {
        soluteTapOpen = false;
    }

    if (emptyTapOpen && solventVolumeLiters > 0) {
        ctx.fillStyle = "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0");
        ctx.fillRect(canvas.width / 2 + 341, canvas.height / 2 + 370, 14, canvas.height / 2 - 370);
        addSalt(-0.0625 * molesOfSalt / solventVolumeLiters);
        addSolvent(-0.0625);
    } else {
        emptyTapOpen = false;
    }
    
    ctx.fillStyle = "#" + addColors(solvents[currentSolvent].color, frozen ? 0x777777 : 0).toString(16).padStart(6, "0");
    ctx.fillRect(canvas.width / 2 - 300, canvas.height / 2 - 350 + (700 - solventVolumeLiters * 20), 600, solventVolumeLiters * 20);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(canvas.width / 2 - 300, canvas.height / 2 - 350, 600, 700);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "1em sans-serif";
    ctx.fillText(molesOfSalt.toFixed(5) + " mol", canvas.width / 2 - 245, canvas.height / 2 - 385);
    ctx.textAlign = "right";
    ctx.fillText(solventVolumeLiters.toFixed(5) + " L", canvas.width / 2 + 245, canvas.height / 2 - 385);
    ctx.textAlign = "left";
    ctx.fillText(`ΔTc = ${solvents[currentSolvent].cryoscopic_constant} · ${getMolality().toFixed(5)} = ${(solvents[currentSolvent].cryoscopic_constant * getMolality()).toFixed(5)} °C`, canvas.width / 2 + 310, canvas.height / 2 - 385);

    ctx.textAlign = "center";
    if (tooSalty) {
        ctx.fillStyle = "#ffffff";
        let text = translate.translateString('crioscopia.tooSalty');
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 385);
    }
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.min(solventVolumeLiters * 20, 36)}px sans-serif`;
    if (frozen) {
        ctx.fillStyle = isDarkColor(addColors(solvents[currentSolvent].color, frozen ? 0x777777 : 0)) ? "#ffffff" : "#000000";
        ctx.fillText(translate.translateString('crioscopia.frozen'), canvas.width / 2, canvas.height / 2 + 350 - solventVolumeLiters * 10);
    }

    requestAnimationFrame(draw);
})();

function isDarkColor(hex) {
    function sRGBtoLinear(colorChannel) {
        const c = colorChannel / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    function getLuminance(hex) {
        let red = (hex >> 16) & 0xFF;
        let green = (hex >> 8) & 0xFF;
        let blue = hex & 0xFF;
        const R = sRGBtoLinear(red);
        const G = sRGBtoLinear(green);
        const B = sRGBtoLinear(blue);
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }

    const luminance = getLuminance(hex);
    return luminance < 0.5;
}

function addColors(first, second) {
    let red = (first >> 16) & 0xFF;
    let green = (first >> 8) & 0xFF;
    let blue = first & 0xFF;

    let red2 = (second >> 16) & 0xFF;
    let green2 = (second >> 8) & 0xFF;
    let blue2 = second & 0xFF;

    return Math.min(red + red2, 0xFF) << 16 | Math.min(green + green2, 0xFF) << 8 | Math.min(blue + blue2, 0xFF);
}

function changeSolvent(solvent) {
    currentSolvent = solvent;
    solventVolumeLiters = 0;
    molesOfSalt = 0;
}

function addSolvent(amount) {
    solventVolumeLiters += amount;
    if (solventVolumeLiters > 35) {
        solventVolumeLiters = 35;
    } else if (solventVolumeLiters < 0) {
        solventVolumeLiters = 0;
    }
}

function addSalt(amount) {
    molesOfSalt += amount;
    if (molesOfSalt > getMaxSaltAmount()) {
        molesOfSalt = getMaxSaltAmount();
    } else if (molesOfSalt < 0) {
        molesOfSalt = 0;
    }
}

function getSolventMass() {
    return solvents[currentSolvent].density * solventVolumeLiters;
}

function getMolality() {
    return getSolventMass() == 0 ? 0 : molesOfSalt / getSolventMass();
}

function getFreezingTemperature() {
    return solvents[currentSolvent].freezing_point - solvents[currentSolvent].cryoscopic_constant * getMolality();
}

function getMaxSaltAmount() {
    return solvents[currentSolvent].solubility * solventVolumeLiters;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let solventTap = document.createElement("div");
solventTap.classList.add("tap", "top-right");
solventTap.addEventListener("click", (event) => {
    solventTapOpen = !solventTapOpen;
});
container.appendChild(solventTap);
let soluteTap = document.createElement("div");
soluteTap.classList.add("tap", "top-left");
soluteTap.addEventListener("click", (event) => {
    soluteTapOpen = !soluteTapOpen;
});
container.appendChild(soluteTap);
let emptyTap = document.createElement("div");
emptyTap.classList.add("tap", "bottom-right");
emptyTap.addEventListener("click", (event) => {
    emptyTapOpen = !emptyTapOpen;
});
container.appendChild(emptyTap);

let controls = document.createElement("div");
controls.classList.add("controls");

// Temperature
let temperatureControlContainer = document.createElement("div");
let temperatureControlName = document.createElement("div");
translate.setAttribute(temperatureControlName, "string", new TranslatableText("crioscopia.temperatureControl", (temperatureKelvin - 273.15).toFixed(2)));
let temperatureControl = document.createElement("input");
temperatureControl.type = "range";
temperatureControl.min = -273.15;
temperatureControl.max = 20;
temperatureControl.value = 0;
temperatureControl.step = 0.05;
temperatureControl.addEventListener("input", (event) => {
    temperatureKelvin = Number.parseFloat(event.target.value) + 273.15;
    translate.setAttribute(temperatureControlName, "string", new TranslatableText("crioscopia.temperatureControl", (temperatureKelvin - 273.15).toFixed(2)));
});
let defaultTemperatureBtn = document.createElement("button");
defaultTemperatureBtn.addEventListener("click", (event) => {
    temperatureControl.value = 0;
    temperatureKelvin = temperatureControl.value + 273.15;
    translate.setAttribute(temperatureControlName, "string", new TranslatableText("crioscopia.temperatureControl", (temperatureKelvin - 273.15).toFixed(2)));
});
translate.setAttribute(defaultTemperatureBtn, "string", new TranslatableText("crioscopia.default"));

// Solvent
let solventControlContainer = document.createElement("div");
let solventControlName = document.createElement("label");
solventControlName.setAttribute("for", "solvent-control");
translate.setAttribute(solventControlName, "string", new TranslatableText("crioscopia.solventControl"));
let solventControl = document.createElement("select");
solventControl.id = "solvent-control";
for (let i in solvents) {
    let solventOption = document.createElement("option");
    solventOption.value = i.toString();
    translate.setAttribute(solventOption, "string", new TranslatableText("crioscopia.solvent." + solvents[i].name));
    solventControl.appendChild(solventOption);
}
solventControl.addEventListener("input", (event) => {
    changeSolvent(Number.parseFloat(event.target.value));
});

temperatureControlContainer.appendChild(temperatureControlName);
temperatureControlContainer.appendChild(temperatureControl);
temperatureControlContainer.appendChild(defaultTemperatureBtn);
solventControlContainer.appendChild(solventControlName);
solventControlContainer.appendChild(solventControl);
controls.appendChild(temperatureControlContainer);
controls.appendChild(solventControlContainer);
document.body.appendChild(controls);