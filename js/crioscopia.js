let container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousePos = {x: 0, y: 0};

let containerWidth = 600;
let containerHeight = 600;

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    containerWidth = Math.min(600, container.clientWidth - 600);
    containerHeight = Math.min(600, container.clientHeight - 200);
}

let solvents = [
    {name: "water", cryoscopic_constant: 1.86, freezing_point: 273.15, boiling_point: 100.15, density: 1, solubility: 6.1, color: 0x5883d8},
    {name: "methanol", cryoscopic_constant: 1.98, freezing_point: 175.65, boiling_point: 337.85, density: 0.791, solubility: 5.5, color: 0xfed330},
    {name: "ethanol", cryoscopic_constant: 1.99, freezing_point: 158.65, boiling_point: 351.55, density: 0.789, solubility: 5, color: 0xff5733},
    {name: "propanone", cryoscopic_constant: 1.99, freezing_point: 178.35, boiling_point: 329.35, density: 0.791, solubility: 7.3, color: 0x9b59b6},
    {name: "ethanenitrile", cryoscopic_constant: 3.9, freezing_point: 227.15, boiling_point: 354.75, density: 0.786, solubility: 4.6, color: 0x3498db},
    {name: "methanamide", cryoscopic_constant: 3.79, freezing_point: 275.7, boiling_point: 483.15, density: 1.133, solubility: 5.5, color: 0xf39c12},
];

let currentSolvent = 0;
let temperatureKelvin = 273.15;

let solventVolumeLiters = 0;
let molesOfSalt = 0;

let solventTapOpen = false;
let soluteTapOpen = false;
let emptyTapOpen = false;

class TapWidget {
    constructor(img, pos) {
        this.img = img;
        this.pos = pos;
        this.open = false;
    }

    draw() {
        drawImage(ctx, this.img, this.pos.x(), this.pos.y());
    }

    isHoveredOver(mouseX, mouseY) {
        return mouseX >= this.pos.x() && mouseY >= this.pos.y() && mouseX < this.pos.x() + this.img.width && mouseY < this.pos.y() + this.img.height;
    }

    onHover(mouseX, mouseY) {
        canvas.style.cursor = "pointer";
    }

    click(mouseX, mouseY) {
        this.open = !this.open;
        return true;
    }

    allowsFreezing() {
        return true;
    }
}

class SolventTapWidget extends TapWidget {
    constructor(pos) {
        super((() => {
            const img = new Image(122, 100);
            img.src = "/assets/crioscopia/tap_bottom.png";
            return img;
        })(), pos);
    }

    draw() {
        ctx.save();
        ctx.translate(this.pos.x() + this.img.width / 2, this.pos.y() + this.img.height / 2);
        ctx.scale(-1, 1);
        ctx.translate(-this.pos.x() - this.img.width / 2, -this.pos.y() - this.img.height / 2);
        super.draw();
        ctx.restore();
        if (this.open && solventVolumeLiters < 35) {
            ctx.fillStyle = "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0");
            ctx.fillRect(this.pos.x() + 7, this.pos.y() + 68, 30, canvas.height - this.pos.y() - 68 - (canvas.height - containerHeight) / 2);
            addSolvent(0.0625);
        } else {
            this.open = false;
        }

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "1em sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(solventVolumeLiters.toFixed(5) + " L", this.pos.x() + this.img.width - 70, this.pos.y() + 20);
    }
}

class SoluteTapWidget extends TapWidget {
    constructor(pos) {
        super((() => {
            const img = new Image(122, 100);
            img.src = "/assets/crioscopia/tap_bottom.png";
            return img;
        })(), pos);
    }

    draw() {
        super.draw();
        if (this.open && !isTooSalty()) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.pos.x() + 93, this.pos.y() + 68, 14, canvas.height - this.pos.y() - 68 - (canvas.height - containerHeight) / 2);
            addSalt(0.03125);
        } else {
            this.open = false;
        }

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "1em sans-serif";
        ctx.fillText(molesOfSalt.toFixed(5) + " mol", this.pos.x() + 70, this.pos.y() + 20);
    }
}

class EmptyTapWidget extends TapWidget {
    constructor(pos) {
        super((() => {
            const img = new Image(122, 68);
            img.src = "/assets/crioscopia/tap_side.png";
            return img;
        })(), pos);
    }

    draw() {
        super.draw();
        if (this.open && solventVolumeLiters > 0) {
            ctx.fillStyle = "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0");
            ctx.fillRect(this.pos.x() + 85, this.pos.y() + 68, 30, canvas.height - this.pos.y() - 68);
            addSalt(-0.0625 * molesOfSalt / solventVolumeLiters);
            addSolvent(-0.0625);
        } else {
            this.open = false;
        }
    }

    allowsFreezing() {
        return !this.open;
    }
}

let widgets = [
    new SolventTapWidget({x: () => canvas.width / 2 + containerWidth / 2 - 122, y: () => canvas.height / 2 - containerHeight / 2 - 100}),
    new SoluteTapWidget({x: () => canvas.width / 2 - containerWidth / 2, y: () => canvas.height / 2 - containerHeight / 2 - 100}),
    new EmptyTapWidget({x: () => canvas.width / 2 + containerWidth / 2, y: () => canvas.height / 2 + containerHeight / 2 - 60})
];

(function draw() {
    canvas.style.cursor = ""; // TODO: may change this later
    if (currentSolvent > solvents.length - 1 || currentSolvent < 0) {
        changeSolvent(0);
    }

    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "2em sans-serif";
    ctx.fillText(translate.translateString('crioscopia.title'), 10, 10);

    for (let widget of widgets) {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            widget.onHover(mousePos.x, mousePos.y);
        }
        widget.draw();
    }

    ctx.fillStyle = "#" + addColors(solvents[currentSolvent].color, isFrozen() ? 0x777777 : 0).toString(16).padStart(6, "0");
    ctx.fillRect(canvas.width / 2 - containerWidth / 2, canvas.height / 2 + containerHeight / 2 - solventVolumeLiters * containerHeight / 35, containerWidth, solventVolumeLiters * containerHeight / 35);

    // Container outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(canvas.width / 2 - containerWidth / 2, canvas.height / 2 - containerHeight / 2, containerWidth, containerHeight);

    // Labels
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "1em sans-serif";
    ctx.fillText(`ΔTc = ${solvents[currentSolvent].cryoscopic_constant} · ${getMolality().toFixed(5)} = ${(solvents[currentSolvent].cryoscopic_constant * getMolality()).toFixed(5)} °C`, canvas.width / 2 + containerWidth / 2 + 10, canvas.height / 2 - containerHeight / 2);

    ctx.textAlign = "center";
    if (isTooSalty()) {
        ctx.fillStyle = "#ffffff";
        let text = translate.translateString('crioscopia.tooSalty');
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 - containerHeight / 2 - 40);
    }
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.min(solventVolumeLiters * 20, 36)}px sans-serif`;
    if (isFrozen()) {
        ctx.fillStyle = isDarkColor(addColors(solvents[currentSolvent].color, 0x777777)) ? "#ffffff" : "#000000";
        ctx.fillText(translate.translateString('crioscopia.frozen'), canvas.width / 2, canvas.height / 2 + containerHeight / 2 - solventVolumeLiters * containerHeight / 35 / 2);
    }

    requestAnimationFrame(draw);
})();

function drawImage(ctx, img, x, y) {
    if (!img.complete) {
        return;
    }

    if (img.naturalWidth === 0) {
        return;
    }

    ctx.drawImage(img, x, y);
}

function isFrozen() {
    if (temperatureKelvin <= getFreezingTemperature() && solventVolumeLiters > 0) {
        for (let widget of widgets) {
            if (!widget.allowsFreezing()) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function isTooSalty() {
    return molesOfSalt == getMaxSaltAmount() && solventVolumeLiters > 0;
}

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
    temperatureKelvin = Number.parseFloat(temperatureControl.value) + 273.15;
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

canvas.addEventListener('click', (event) => {
    for (let widget of widgets) {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            widget.click(mousePos.x, mousePos.y);
            event.preventDefault();
        }
    }
}, false);

canvas.onselectstart = function () { return false; }

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
}

canvas.addEventListener("mousemove", (event) => {
    mousePos = getMousePos(event);
});