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

let constantDensity = true;

// Cryoscopic constant: K · kg / mol
// Ebulioscopic constant: K · kg / mol
// Freezing point: K
// Boiling point: K
// Density: kg/L
// Solubility: Random Value™. Doesn't actually represent accurate solubility, but just how much salt can be added.

let currentSolvent = 0;
let temperatureKelvin = 273.15;

let solvents = [
    {name: "water", cryoscopic_constant: 1.86, ebulioscopic_constant: 0.52, van_t_hoff_factor: 1, freezing_point: 273.15, boiling_point: 373.13, density: [
        { temperature: 273.15, density: 0.96188791 },
        { temperature: 277.133035, density: 0.99997495 },
        { temperature: 298.15, density: 0.99704702 },
        { temperature: 368.15, density: 0.96188791 },
    ], solubility: 5, color: 0x5883d8},
    {name: "ethanol", cryoscopic_constant: 2, ebulioscopic_constant: 1.2, van_t_hoff_factor: 1, freezing_point: 158.65, boiling_point: 351.55, density: [
        { temperature: 293.15, density: 0.78945}
    ], solubility: 5, color: 0xff5733},
    {name: "benzene", cryoscopic_constant: 5.12, ebulioscopic_constant: 2.65, van_t_hoff_factor: 1, freezing_point: 278.68, boiling_point: 353.2, density: [
        { temperature: 273.15, density: 0.8765}
    ], solubility: 5, color: 0x050303},
    {name: "trichloromethane", cryoscopic_constant: 4.90, ebulioscopic_constant: 3.88, van_t_hoff_factor: 1, freezing_point: 209.7, boiling_point: 334.30, density: [
        { temperature: 253.15, density: 1.564 },
        { temperature: 298.15, density: 1.489 },
        { temperature: 333.15, density: 1.394 },
    ], solubility: 5, color: 0x3498db},
];

let solventVolumeLiters = 0;
let molesOfSalt = 0;

let solventTapOpen = false;
let soluteTapOpen = false;
let emptyTapOpen = false;

class Widget {
    constructor(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    getWidth() {
    }

    getHeight() {
    }

    getMaxWidth() {
        return this.getWidth();
    }

    getMaxHeight() {
        return this.getHeight();
    }

    draw() {
    }

    onHover(mouseX, mouseY) {
    }

    isHoveredOver(mouseX, mouseY) {
        return mouseX >= this.pos.x() && mouseY >= this.pos.y() && mouseX < this.pos.x() + this.getMaxWidth() && mouseY < this.pos.y() + this.getMaxHeight();
    }

    allowsFreezing() {
        return true;
    }
}

class TapWidget extends Widget {
    constructor(img, pos) {
        super(pos);
        this.img = img;
        this.open = false;
    }

    getWidth() {
        return this.img.width;
    }

    getHeight() {
        return this.img.height;
    }

    onHover(mouseX, mouseY) {
        canvas.style.cursor = "pointer";
    }

    draw() {
        drawImage(ctx, this.img, this.pos.x(), this.pos.y());
    }

    click(mouseX, mouseY) {
        this.open = !this.open;
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

class TextWidget extends Widget {
    constructor(pos, text, font = "1em sans-serif") {
        super(pos);
        this.text = text;
        this.font = font;
        this.width = 0;
        this.height = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getMaxWidth() {
        return this.maxWidth;
    }

    getMaxHeight() {
        return this.maxHeight;
    }

    draw() {
        ctx.save();
        ctx.font = this.font;
        const measure = ctx.measureText(this.text(this));
        this.width = measure.width;
        this.height = measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent;
        this.maxWidth = Math.max(this.maxWidth, this.width);
        this.maxHeight = Math.max(this.maxHeight , this.height);

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        if (this.isHoveredOver(mousePos.x, mousePos.y)) {
            ctx.fillStyle = "#ffff00";
        } else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.fillText(this.text(this), this.pos.x(), this.pos.y());
        ctx.restore();
    }
}

let widgets = [
    new SolventTapWidget({x: () => canvas.width / 2 + containerWidth / 2 - 122, y: () => canvas.height / 2 - containerHeight / 2 - 100}),
    new SoluteTapWidget({x: () => canvas.width / 2 - containerWidth / 2, y: () => canvas.height / 2 - containerHeight / 2 - 100}),
    new EmptyTapWidget({x: () => canvas.width / 2 + containerWidth / 2, y: () => canvas.height / 2 + containerHeight / 2 - 60}),
    new TextWidget({x: () => canvas.width / 2 + containerWidth / 2 + 10, y: () => canvas.height / 2 - containerHeight / 2}, ((widget) => {
        return widget.isHoveredOver(mousePos.x, mousePos.y) ? "ΔTc = Kc · W" : `ΔTc = ${solvents[currentSolvent].cryoscopic_constant} · ${getMolality().toFixed(5)} = ${(solvents[currentSolvent].cryoscopic_constant * getMolality()).toFixed(5)} °C`
    })),
    new TextWidget({x: () => canvas.width / 2 + containerWidth / 2 + 10, y: () => canvas.height / 2 - containerHeight / 2 + 30}, ((widget) => {
        return widget.isHoveredOver(mousePos.x, mousePos.y) ? "ΔTe = Ke · W" : `ΔTe = ${solvents[currentSolvent].ebulioscopic_constant} · ${getMolality().toFixed(5)} = ${(solvents[currentSolvent].ebulioscopic_constant * getMolality()).toFixed(5)} °C`
    }))
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
    if (temperatureKelvin > getBoilingTemperature() && solventVolumeLiters > 0) {
        addSolvent(-0.0625 * (temperatureKelvin - getBoilingTemperature()) / 200); // Simplification
        if (molesOfSalt > getMaxSaltAmount()) {
            molesOfSalt = getMaxSaltAmount();
        }
        const gradient = ctx.createLinearGradient(canvas.width / 2 - containerWidth / 2, canvas.height / 2 + containerHeight / 2 - solventVolumeLiters * containerHeight / 35 - 100, canvas.width / 2 - containerWidth / 2, canvas.height / 2 + containerHeight / 2 - solventVolumeLiters * containerHeight / 35);
        gradient.addColorStop(1, "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0"));
        gradient.addColorStop(0, "#" + solvents[currentSolvent].color.toString(16).padStart(6, "0") + "00");

        ctx.fillStyle = gradient;
        ctx.fillRect(canvas.width / 2 - containerWidth / 2, canvas.height / 2 + containerHeight / 2 - solventVolumeLiters * containerHeight / 35 - 100, containerWidth, 100)
    }

    // Container outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeRect(canvas.width / 2 - containerWidth / 2, canvas.height / 2 - containerHeight / 2, containerWidth, containerHeight);

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
    let densityData = solvents[currentSolvent].density;

    densityData.sort((a, b) => a.temperature - b.temperature);
    let density = getDensity(densityData);

    return density * solventVolumeLiters;
}

function getDensity(data) {
    if (data.length === 0) {
        return 0;
    } else if (data.length === 1) {
        return data[0].density;
    } else if (constantDensity) {
        return (data[0].density + data[data.length - 1].density) / 2
    } else if (temperatureKelvin <= data[0].temperature) {
        return data[0].density;
    } else if (temperatureKelvin >= data[data.length - 1].temperature) {
        return data[data.length - 1].density;
    } else {
        for (let i = 0; i < data.length - 1; i++) {
            if (temperatureKelvin >= data[i].temperature && temperatureKelvin <= data[i + 1].temperature) {
                const diff = temperatureKelvin - data[i].temperature;
                const slope = (data[i + 1].density - data[i].density) / (data[i + 1].temperature - data[i].temperature);
                return data[i].density + slope * diff;
            }
        }
    }
}

function getMolality() {
    return getSolventMass() == 0 ? 0 : molesOfSalt / getSolventMass();
}

function getFreezingTemperature() {
    return solvents[currentSolvent].freezing_point - solvents[currentSolvent].cryoscopic_constant * getMolality();
}

function getBoilingTemperature() {
    return solvents[currentSolvent].boiling_point + solvents[currentSolvent].ebulioscopic_constant * getMolality();
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
temperatureControl.max = 300;
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

// Constant density
let constantDensityContainer = document.createElement("div");
let constantDensityName = document.createElement("label");
constantDensityName.setAttribute("for", "constant-density");
translate.setAttribute(constantDensityName, "string", new TranslatableText("crioscopia.constantDensity"));
let constantDensityCheckbox = document.createElement("input");
constantDensityCheckbox.id = "constant-density";
constantDensityCheckbox.type = "checkbox";
constantDensityCheckbox.checked = true;
constantDensityCheckbox.addEventListener("change", (event) => {
    constantDensity = constantDensityCheckbox.checked;
});

temperatureControlContainer.appendChild(temperatureControlName);
temperatureControlContainer.appendChild(temperatureControl);
temperatureControlContainer.appendChild(defaultTemperatureBtn);
solventControlContainer.appendChild(solventControlName);
solventControlContainer.appendChild(solventControl);
constantDensityContainer.appendChild(constantDensityName);
constantDensityContainer.appendChild(constantDensityCheckbox);
controls.appendChild(temperatureControlContainer);
controls.appendChild(solventControlContainer);
controls.appendChild(constantDensityContainer);
document.body.appendChild(controls);

canvas.addEventListener('click', (event) => {
    for (let widget of widgets) {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            widget.click(mousePos.x, mousePos.y);
            event.preventDefault();
        }
    }
}, false);

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