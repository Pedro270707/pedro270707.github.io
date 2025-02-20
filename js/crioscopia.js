let container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousePos = {x: 0, y: 0};

let containerWidth = 600;
let containerHeight = 600;

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * ratio;
    canvas.height = container.clientHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    containerWidth = Math.max(325, Math.min(600, canvas.width - 300));
    containerHeight = Math.max(200, Math.min(600, canvas.height - 100));
}

let constantDensity = true;

// Cryoscopic constant: K · kg / mol
// Ebulioscopic constant: K · kg / mol
// Freezing point: K
// Boiling point: K
// Density: kg/L
// Solubility: Random Value™. Doesn't actually represent accurate solubility, but just how much solute can be added.

let solvents = [
    {name: "water", cryoscopic_constant: 1.86, ebulioscopic_constant: 0.52, freezing_point: 273.15, boiling_point: 373.13, density: [
        { temperature: 273.15, density: 0.96188791 },
        { temperature: 277.133035, density: 0.99997495 },
        { temperature: 298.15, density: 0.99704702 },
        { temperature: 368.15, density: 0.96188791 },
    ], solubility: 5, color: 0x5883d8},
    {name: "ethanol", cryoscopic_constant: 2, ebulioscopic_constant: 1.2, freezing_point: 158.65, boiling_point: 351.55, density: [
        { temperature: 293.15, density: 0.78945}
    ], solubility: 5, color: 0xff5733},
    {name: "benzene", cryoscopic_constant: 5.12, ebulioscopic_constant: 2.65, freezing_point: 278.68, boiling_point: 353.2, density: [
        { temperature: 273.15, density: 0.8765}
    ], solubility: 5, color: 0x050303},
    {name: "trichloromethane", cryoscopic_constant: 4.90, ebulioscopic_constant: 3.88, freezing_point: 209.7, boiling_point: 334.30, density: [
        { temperature: 253.15, density: 1.564 },
        { temperature: 298.15, density: 1.489 },
        { temperature: 333.15, density: 1.394 },
    ], solubility: 5, color: 0x3498db},
];

let solutes = [
    {name: "glucose", van_t_hoff_factor: 1, color: "#f7f0ff"},
    {name: "sodium_chloride", van_t_hoff_factor: 2, color: "#ffffff"},
    {name: "calcium_chloride", van_t_hoff_factor: 3, color: "#fffff0"},
    {name: "potassium_ferrocyanide", van_t_hoff_factor: 4, color: "dd0000"}
]

let temperatureKelvin = 273.15;

class Widget {
    constructor(pos) {
        this.pos = pos;
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

    getMinX() {
        return this.getX();
    }

    getMinY() {
        return this.getY();
    }

    getX() {
        return this.pos.x(this);
    }

    getY() {
        return this.pos.y(this);
    }

    draw() {
    }

    onHover(mouseX, mouseY) {
    }

    isHoveredOver(mouseX, mouseY) {
        return mouseX >= this.getMinX() && mouseY >= this.getMinY() && mouseX < this.getMinX() + this.getMaxWidth() && mouseY < this.getMinY() + this.getMaxHeight();
    }

    allowsFreezing() {
        return true;
    }
}

class TapWidget extends Widget {
    constructor(img, pos, container) {
        super(pos);
        this.img = img;
        this.open = false;
        this.container = container;
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
        drawImage(ctx, this.img, this.getX(), this.getY());
    }

    click(mouseX, mouseY) {
        this.open = !this.open;
        return true;
    }
}

class SolventTapWidget extends TapWidget {
    static name = new TranslatableText("crioscopia.tap.solvent");
    
    constructor(pos, container) {
        super((() => {
            const img = new Image(122, 100);
            img.src = "/assets/crioscopia/tap_bottom.png";
            return img;
        })(), pos, container);
    }

    draw() {
        ctx.save();
        ctx.translate(this.getX() + this.img.width / 2, this.getY() + this.img.height / 2);
        ctx.scale(-1, 1);
        ctx.translate(-this.getX() - this.img.width / 2, -this.getY() - this.img.height / 2);
        super.draw();
        ctx.restore();
        if (this.open && this.container.solventVolumeLiters < 35) {
            ctx.fillStyle = "#" + solvents[this.container.solventType].color.toString(16).padStart(6, "0");
            ctx.fillRect(this.getX() + 7, this.getY() + 68, 30, this.container.getHeight() + 32);
            this.container.addSolvent(0.0625);
        } else {
            this.open = false;
        }

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "1em sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(SolventTapWidget.name.get(), this.getX() + this.img.width - 70, this.getY() + 20);
        ctx.fillText(translate.translateString("crioscopia.tap.solvent.label", this.container.solventVolumeLiters.toFixed(5)), this.getX() + this.img.width - 70, this.getY() + 50);
    }
}

class SoluteTapWidget extends TapWidget {
    static name = new TranslatableText("crioscopia.tap.solute");

    constructor(pos, container) {
        super((() => {
            const img = new Image(122, 100);
            img.src = "/assets/crioscopia/tap_bottom.png";
            return img;
        })(), pos, container);
    }

    draw() {
        super.draw();
        if (this.open && !this.container.hasTooMuchSolute()) {
            ctx.fillStyle = "#" + solutes[this.container.soluteType].color.toString(16).padStart(6, "0");
            ctx.fillRect(this.getX() + 93, this.getY() + 68, 14, this.container.getHeight() + 32);
            this.container.addSolute(0.03125);
        } else {
            this.open = false;
        }

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "1em sans-serif";
        ctx.fillText(SoluteTapWidget.name.get(), this.getX() + 70, this.getY() + 20);
        ctx.fillText(translate.translateString("crioscopia.tap.solute.label", this.container.soluteMoles.toFixed(5)), this.getX() + 70, this.getY() + 50);
    }
}

class EmptyTapWidget extends TapWidget {
    constructor(pos, container) {
        super((() => {
            const img = new Image(122, 68);
            img.src = "/assets/crioscopia/tap_side.png";
            return img;
        })(), pos, container);
    }

    draw() {
        super.draw();
        if (this.open && this.container.solventVolumeLiters > 0) {
            ctx.fillStyle = "#" + solvents[this.container.solventType].color.toString(16).padStart(6, "0");
            ctx.fillRect(this.getX() + 85, this.getY() + 68, 30, canvas.height - this.getY() - 68);
            this.container.addSolute(-0.0625 * this.container.soluteMoles / this.container.solventVolumeLiters);
            this.container.addSolvent(-0.0625);
        } else {
            this.open = false;
        }
    }

    allowsFreezing() {
        return !this.open;
    }
}

class TextWidget extends Widget {
    constructor(pos, text, settings = {}) {
        super(pos);
        this.text = text;
        this.font = settings.font || ((widget) => "1em sans-serif");
        this.textAlign = settings.textAlign || ((widget) => "left");
        this.textBaseline = settings.textBaseline || ((widget) => "top");
        this.fillStyle = settings.fillStyle || ((widget) => "#ffffff");
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

    getMinX() {
        if (this.textAlign(this) === "right") {
            return super.getMinX() - this.maxWidth;
        }
        return super.getMinX();
    }

    draw() {
        ctx.save();
        
        ctx.font = this.font(this);
        ctx.textAlign = this.textAlign(this);
        ctx.textBaseline = this.textBaseline(this);
        ctx.fillStyle = this.fillStyle(this);

        const text = this.text(this).get();
        const measure = ctx.measureText(text);
        this.width = measure.width;
        this.height = measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent;
        this.maxWidth = Math.max(this.maxWidth, this.width);
        this.maxHeight = Math.max(this.maxHeight , this.height);

        ctx.fillText(text, this.getX(), this.getY());
        ctx.restore();
    }
}

class SolutionContainerWidget extends Widget {
    constructor(pos, width, height) {
        super(pos)
        this.width = width;
        this.height = height;
        this.solventType = 0;
        this.soluteType = 0;
        this.solventVolumeLiters = 0;
        this.soluteMoles = 0;
    }

    getWidth() {
        return this.width(this);
    }

    getHeight() {
        return this.height(this);
    }

    setSolventType(type) {
        this.solventType = type;
        this.solventVolumeLiters = 0;
        this.soluteMoles = 0;
    }

    setSoluteType(type) {
        this.soluteType = type;
        this.solventVolumeLiters = 0;
        this.soluteMoles = 0;
    }

    isFrozen() {
        if (temperatureKelvin <= this.getFreezingTemperature() && this.solventVolumeLiters > 0) {
            for (let widget of widgets) {
                if (!widget.allowsFreezing()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    
    hasTooMuchSolute() {
        return this.soluteMoles == this.getMaxSoluteAmount() && this.solventVolumeLiters > 0;
    }

    addSolvent(amount) {
        this.solventVolumeLiters += amount;
        if (this.solventVolumeLiters > 35) {
            this.solventVolumeLiters = 35;
        } else if (this.solventVolumeLiters < 0) {
            this.solventVolumeLiters = 0;
        }
    }
    
    addSolute(amount) {
        this.soluteMoles += amount;
        if (this.soluteMoles > this.getMaxSoluteAmount()) {
            this.soluteMoles = this.getMaxSoluteAmount();
        } else if (this.soluteMoles < 0) {
            this.soluteMoles = 0;
        }
    }
    
    getSolventMass() {
        let densityData = solvents[this.solventType].density;
    
        densityData.sort((a, b) => a.temperature - b.temperature);
        let density = this.getDensity(densityData);
    
        return density * this.solventVolumeLiters;
    }

    getDensity(data) {
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
    
    getMolality() {
        return this.getSolventMass() == 0 ? 0 : this.soluteMoles / this.getSolventMass();
    }
    
    getFreezingTemperature() {
        return solvents[this.solventType].freezing_point - solvents[this.solventType].cryoscopic_constant * this.getMolality() * solutes[this.soluteType].van_t_hoff_factor;
    }
    
    getBoilingTemperature() {
        return solvents[this.solventType].boiling_point + solvents[this.solventType].ebulioscopic_constant * this.getMolality() * solutes[this.soluteType].van_t_hoff_factor;
    }
    
    getMaxSoluteAmount() {
        return solvents[this.solventType].solubility * this.solventVolumeLiters;
    }

    draw() {
        if (this.solventType > solvents.length - 1 || this.solventType < 0) {
            this.setSolventType(0);
        }

        ctx.fillStyle = "#" + addColors(solvents[this.solventType].color, this.isFrozen() ? 0x777777 : 0).toString(16).padStart(6, "0");
        ctx.fillRect(this.getX(), this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35, this.getWidth(), this.solventVolumeLiters * this.getHeight() / 35);
        if (temperatureKelvin > this.getBoilingTemperature() && this.solventVolumeLiters > 0) {
            this.addSolvent(-0.0625 * (temperatureKelvin - this.getBoilingTemperature()) / 200); // Simplification
            if (this.soluteMoles > this.getMaxSoluteAmount()) {
                this.soluteMoles = this.getMaxSoluteAmount();
            }
            const gradient = ctx.createLinearGradient(this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 - 100, this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35);
            gradient.addColorStop(1, "#" + solvents[this.solventType].color.toString(16).padStart(6, "0"));
            gradient.addColorStop(0, "#" + solvents[this.solventType].color.toString(16).padStart(6, "0") + "00");

            ctx.fillStyle = gradient;
            ctx.fillRect(this.getX(), this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 - 100, this.getWidth(), 100);
        }

        // Container outline
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());

        ctx.textAlign = "center";
        if (this.hasTooMuchSolute()) {
            ctx.fillStyle = "#ffffff";
            let text = translate.translateString('crioscopia.tooMuchSolute');
            ctx.fillText(text, this.getX() + this.getWidth() / 2, this.getY() - 40);
        }
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${Math.min(this.solventVolumeLiters * 20, 36)}px sans-serif`;
        if (this.isFrozen()) {
            ctx.fillStyle = isDarkColor(addColors(solvents[this.solventType].color, 0x777777)) ? "#ffffff" : "#000000";
            ctx.fillText(translate.translateString('crioscopia.frozen'), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 / 2);
        }
    }
}

class LanguageWidget extends TextWidget {
    constructor(pos, language, settings = {}) {
        super(pos, (widget) => new LiteralText(translate.getName(language)), settings);
        this.language = language;
    }

    onHover(mouseX, mouseY) {
        canvas.style.cursor = "pointer";
    }

    click(mouseX, mouseY) {
        changeLanguage(this.language);
    }
}

const containerWidget = new SolutionContainerWidget({x: (widget) => canvas.width / 2 - containerWidth / 2, y: (widget) => canvas.height / 2 - containerHeight / 2}, (widget) => containerWidth, (widget) => containerHeight);
let widgets = [
    new SolventTapWidget({x: (widget) => containerWidget.getX() + containerWidget.getWidth() - widget.getWidth(), y: (widget) => containerWidget.getY() - widget.getHeight()}, containerWidget),
    new SoluteTapWidget({x: (widget) => containerWidget.getX(), y: (widget) => containerWidget.getY() - widget.getHeight()}, containerWidget),
    new EmptyTapWidget({x: (widget) => containerWidget.getX() + containerWidget.getWidth(), y: (widget) => containerWidget.getY() + containerWidget.getHeight() - 60}, containerWidget),
    new TextWidget({x: (widget) => containerWidget.getX() + containerWidget.getWidth(), y: (widget) => containerWidget.getY() + containerWidget.getHeight() + 20}, ((widget) => {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            return new LiteralText("ΔTc = Kc · W · i");
        }
        return new LiteralText(`ΔTc = ${solvents[containerWidget.solventType].cryoscopic_constant} · ${containerWidget.getMolality().toFixed(5)} · ${solutes[containerWidget.soluteType].van_t_hoff_factor} = ${(solvents[containerWidget.solventType].cryoscopic_constant * containerWidget.getMolality() * solutes[containerWidget.soluteType].van_t_hoff_factor).toFixed(5)} °C`);
    }), {fillStyle: (widget) => widget.isHoveredOver(mousePos.x, mousePos.y) ? "#ffff00" : "#ffffff", textAlign: (widget) => "right"}),
    new TextWidget({x: (widget) => containerWidget.getX() + containerWidget.getWidth(), y: (widget) => containerWidget.getY() + containerWidget.getHeight() + 50}, ((widget) => {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            return new LiteralText("ΔTe = Ke · W · i");
        }
        return new LiteralText(`ΔTe = ${solvents[containerWidget.solventType].ebulioscopic_constant} · ${containerWidget.getMolality().toFixed(5)} · ${solutes[containerWidget.soluteType].van_t_hoff_factor} = ${(solvents[containerWidget.solventType].ebulioscopic_constant * containerWidget.getMolality() * solutes[containerWidget.soluteType].van_t_hoff_factor).toFixed(5)} °C`);
    }), {fillStyle: (widget) => widget.isHoveredOver(mousePos.x, mousePos.y) ? "#ffff00" : "#ffffff", textAlign: (widget) => "right"}),
    new TextWidget({x: (widget) => 10, y: (widget) => canvas.height - widget.getHeight() - 10}, (widget) => new TranslatableText("crioscopia.title")),
    new LanguageWidget({x: (widget) => canvas.width - 10, y: (widget) => canvas.height - widget.getHeight() - 40}, "en", {textAlign: (widget) => "right"}),
    new LanguageWidget({x: (widget) => canvas.width - 10, y: (widget) => canvas.height - widget.getHeight() - 10}, "pt", {textAlign: (widget) => "right"}),
    containerWidget
];

(function draw() {
    canvas.style.cursor = "";
    
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let widget of widgets) {
        if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
            widget.onHover(mousePos.x, mousePos.y);
        }
        widget.draw();
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

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let controls = document.createElement("div");
controls.classList.add("controls");
let controlsContainer = document.createElement("div");
controlsContainer.classList.add("controls-container");

// Collapse controls checkbox
let collapseControlsCheckbox = document.createElement("input");
collapseControlsCheckbox.id = "collapse-controls";
collapseControlsCheckbox.type = "checkbox";
collapseControlsCheckbox.checked = false;
collapseControlsCheckbox.classList.add("collapse-controls");
let collapseControlsLabel = document.createElement("label");
collapseControlsLabel.setAttribute("for", "collapse-controls");
collapseControlsLabel.classList.add("collapse-controls-label");

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
    containerWidget.setSolventType(Number.parseFloat(event.target.value));
});

// Solute
let soluteControlContainer = document.createElement("div");
let soluteControlName = document.createElement("label");
soluteControlName.setAttribute("for", "solute-control");
translate.setAttribute(soluteControlName, "string", new TranslatableText("crioscopia.soluteControl"));
let soluteControl = document.createElement("select");
soluteControl.id = "solute-control";
for (let i in solutes) {
    let soluteOption = document.createElement("option");
    soluteOption.value = i.toString();
    translate.setAttribute(soluteOption, "string", new TranslatableText("crioscopia.solute." + solutes[i].name));
    soluteControl.appendChild(soluteOption);
}
soluteControl.addEventListener("input", (event) => {
    containerWidget.setSoluteType(Number.parseFloat(event.target.value));
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
soluteControlContainer.appendChild(soluteControlName);
soluteControlContainer.appendChild(soluteControl);
constantDensityContainer.appendChild(constantDensityName);
constantDensityContainer.appendChild(constantDensityCheckbox);
controls.appendChild(collapseControlsCheckbox);
controls.appendChild(collapseControlsLabel);
controlsContainer.appendChild(temperatureControlContainer);
controlsContainer.appendChild(solventControlContainer);
controlsContainer.appendChild(soluteControlContainer);
controlsContainer.appendChild(constantDensityContainer);
controls.appendChild(controlsContainer);
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