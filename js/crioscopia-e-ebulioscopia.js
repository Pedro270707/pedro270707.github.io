let container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas");

let constantDensity = true;

// Cryoscopic constant: K · kg / mol
// Ebullioscopic constant: K · kg / mol
// Freezing point: K
// Boiling point: K
// Density: kg/L
// Solubility: Random Value™. Doesn't actually represent accurate solubility, but just how much solute can be added.

let solvents = [
    {name: "water", cryoscopic_constant: 1.86, ebullioscopic_constant: 0.52, freezing_point: 273.15, boiling_point: 373.13, density: [
        { temperature: 273.15, density: 0.96188791 },
        { temperature: 277.133035, density: 0.99997495 },
        { temperature: 298.15, density: 0.99704702 },
        { temperature: 368.15, density: 0.96188791 },
    ], solubility: 5, color: 0x5883d8},
    {name: "ethanol", cryoscopic_constant: 2, ebullioscopic_constant: 1.2, freezing_point: 158.65, boiling_point: 351.55, density: [
        { temperature: 293.15, density: 0.78945}
    ], solubility: 5, color: 0xff5733},
    {name: "benzene", cryoscopic_constant: 5.12, ebullioscopic_constant: 2.65, freezing_point: 278.68, boiling_point: 353.2, density: [
        { temperature: 273.15, density: 0.8765}
    ], solubility: 5, color: 0x050303},
    {name: "trichloromethane", cryoscopic_constant: 4.90, ebullioscopic_constant: 3.88, freezing_point: 209.7, boiling_point: 334.30, density: [
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

class CryoscopyEbullioscopyScene extends Scene {
    constructor() {
        super();
        this.containerWidget = new SolutionContainerWidget({x: (widget) => this.getCanvas().width / 2 - (Math.max(325, Math.min(600, this.getCanvas().width - 300))) / 2, y: (widget) => this.getCanvas().height / 2 - (Math.max(200, Math.min(600, this.getCanvas().height - 100))) / 2}, (widget) => (Math.max(325, Math.min(600, this.getCanvas().width - 300))), (widget) => (Math.max(200, Math.min(600, this.getCanvas().height - 100))));

        const textHeight = 26;
        this.addWidget(new SolventTapWidget({x: (widget) => this.containerWidget.getX() + this.containerWidget.getWidth() - widget.getWidth(), y: (widget) => this.containerWidget.getY() - widget.getHeight()}, this.containerWidget));
        this.addWidget(new SoluteTapWidget({x: (widget) => this.containerWidget.getX(), y: (widget) => this.containerWidget.getY() - widget.getHeight()}, this.containerWidget));
        this.addWidget(new EmptyTapWidget({x: (widget) => this.containerWidget.getX() + this.containerWidget.getWidth(), y: (widget) => this.containerWidget.getY() + this.containerWidget.getHeight() - 60}, this.containerWidget));
        this.addWidget(new VariableHoverableTextWidget({x: (widget) => this.containerWidget.getX() + this.containerWidget.getWidth(), y: (widget) => this.containerWidget.getY() + this.containerWidget.getHeight() + 20}, ((widget) => {
            return `ΔTc = ${solvents[this.containerWidget.solventType].cryoscopic_constant} · ${this.containerWidget.getMolality().toFixed(5)} · ${solutes[this.containerWidget.soluteType].van_t_hoff_factor} = ${(solvents[this.containerWidget.solventType].cryoscopic_constant * this.containerWidget.getMolality() * solutes[this.containerWidget.soluteType].van_t_hoff_factor).toFixed(5)} °C`;
        }), ((widget) => {
            return "ΔTc = Kc · W · i";
        }), 310, textHeight, undefined, undefined, {textAlign: "right"}));
        this.addWidget(new VariableHoverableTextWidget({x: (widget) => this.containerWidget.getX() + this.containerWidget.getWidth(), y: (widget) => this.containerWidget.getY() + this.containerWidget.getHeight() + 50}, ((widget) => {
            return `ΔTe = ${solvents[this.containerWidget.solventType].ebullioscopic_constant} · ${this.containerWidget.getMolality().toFixed(5)} · ${solutes[this.containerWidget.soluteType].van_t_hoff_factor} = ${(solvents[this.containerWidget.solventType].ebullioscopic_constant * this.containerWidget.getMolality() * solutes[this.containerWidget.soluteType].van_t_hoff_factor).toFixed(5)} °C`;
        }), ((widget) => {
            return "ΔTe = Ke · W · i";
        }), 310, textHeight, undefined, undefined, {textAlign: "right"}));
        const title = new TranslatableText("crioscopia.title");
        this.addWidget(new TextWidget({x: (widget) => 10, y: (widget) => this.getCanvas().height - widget.getHeight() - 10}, title, 500, textHeight));
        translate.whenLoaded(() => {
            let index = 0;
            for (let definition in Object.fromEntries(Object.entries(translate.definitions).reverse())) {
                let currentIndex = index;
                this.addWidget(new LanguageWidget({x: (widget) => this.getCanvas().width - 10, y: (widget) => this.getCanvas().height - widget.getHeight() - 10 - currentIndex * 30}, definition, 100, textHeight, undefined, undefined, {textAlign: "right"}));
                ++index;
            }
        })
        this.addWidget(this.containerWidget);
    }
}

class CryoscopyEbullioscopyWidget extends Widget {
    constructor(pos) {
        super(pos);
    }

    allowsFreezing() {
        return true;
    }
}

class TapWidget extends CryoscopyEbullioscopyWidget {
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
        this.getCanvas().style.cursor = "pointer";
    }

    draw(tickDelta) {
        drawImage(this.getCtx(), this.img, this.getX(), this.getY());
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

    draw(tickDelta) {
        this.getCtx().save();
        this.getCtx().translate(this.getX() + this.img.width / 2, this.getY() + this.img.height / 2);
        this.getCtx().scale(-1, 1);
        this.getCtx().translate(-this.getX() - this.img.width / 2, -this.getY() - this.img.height / 2);
        super.draw(tickDelta);
        this.getCtx().restore();
        if (this.open && this.container.solventVolumeLiters < 35) {
            this.getCtx().fillStyle = "#" + solvents[this.container.solventType].color.toString(16).padStart(6, "0");
            this.getCtx().fillRect(this.getX() + 7, this.getY() + 68, 30, this.container.getHeight() + 32);
            this.container.addSolvent(2 * tickDelta);
        } else {
            this.open = false;
        }

        this.getCtx().fillStyle = "#ffffff";
        this.getCtx().textAlign = "left";
        this.getCtx().textBaseline = "top";
        this.getCtx().textAlign = "right";
        this.getCtx().fillText(SolventTapWidget.name.get(), this.getX() + this.img.width - 70, this.getY() + 20);
        this.getCtx().fillText(translate.translateString("crioscopia.tap.solvent.label", this.container.solventVolumeLiters.toFixed(5)), this.getX() + this.img.width - 70, this.getY() + 50);
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

    draw(tickDelta) {
        super.draw(tickDelta);
        if (this.open && !this.container.hasTooMuchSolute()) {
            this.getCtx().fillStyle = "#" + solutes[this.container.soluteType].color.toString(16).padStart(6, "0");
            this.getCtx().fillRect(this.getX() + 93, this.getY() + 68, 14, this.container.getHeight() + 32);
            this.container.addSolute(1 * tickDelta);
        } else {
            this.open = false;
        }

        this.getCtx().textAlign = "left";
        this.getCtx().textBaseline = "top";
        this.getCtx().fillText(SoluteTapWidget.name.get(), this.getX() + 70, this.getY() + 20);
        this.getCtx().fillText(translate.translateString("crioscopia.tap.solute.label", this.container.soluteMoles.toFixed(5)), this.getX() + 70, this.getY() + 50);
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

    draw(tickDelta) {
        super.draw(tickDelta);
        if (this.open && this.container.solventVolumeLiters > 0) {
            this.getCtx().fillStyle = "#" + solvents[this.container.solventType].color.toString(16).padStart(6, "0");
            this.getCtx().fillRect(this.getX() + 85, this.getY() + 68, 30, this.getCanvas().height - this.getY() - 68);
            this.container.addSolute(-2 * this.container.soluteMoles / this.container.solventVolumeLiters * tickDelta);
            this.container.addSolvent(-2 * tickDelta);
        } else {
            this.open = false;
        }
    }

    allowsFreezing() {
        return !this.open;
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
            if (!this.parent) return true;
            for (let widget of this.parent.widgets) {
                if (widget instanceof CryoscopyEbullioscopyWidget && !widget.allowsFreezing()) {
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
        return solvents[this.solventType].boiling_point + solvents[this.solventType].ebullioscopic_constant * this.getMolality() * solutes[this.soluteType].van_t_hoff_factor;
    }
    
    getMaxSoluteAmount() {
        return solvents[this.solventType].solubility * this.solventVolumeLiters;
    }

    draw(tickDelta) {
        if (this.solventType > solvents.length - 1 || this.solventType < 0) {
            this.setSolventType(0);
        }

        this.getCtx().fillStyle = "#" + ColorHelper.addColors(solvents[this.solventType].color, this.isFrozen() ? 0x777777 : 0).toString(16).padStart(6, "0");
        this.getCtx().fillRect(this.getX(), this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35, this.getWidth(), this.solventVolumeLiters * this.getHeight() / 35);
        if (temperatureKelvin > this.getBoilingTemperature() && this.solventVolumeLiters > 0) {
            this.addSolvent(-0.0625 * (temperatureKelvin - this.getBoilingTemperature()) / 200); // Simplification
            if (this.soluteMoles > this.getMaxSoluteAmount()) {
                this.soluteMoles = this.getMaxSoluteAmount();
            }
            const gradient = this.getCtx().createLinearGradient(this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 - 100, this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35);
            gradient.addColorStop(1, "#" + solvents[this.solventType].color.toString(16).padStart(6, "0"));
            gradient.addColorStop(0, "#" + solvents[this.solventType].color.toString(16).padStart(6, "0") + "00");

            this.getCtx().fillStyle = gradient;
            this.getCtx().fillRect(this.getX(), this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 - 100, this.getWidth(), 100);
        }

        // Container outline
        this.getCtx().strokeStyle = "#ffffff";
        this.getCtx().lineWidth = 6;
        this.getCtx().strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());

        this.getCtx().textAlign = "center";
        if (this.hasTooMuchSolute()) {
            this.getCtx().fillStyle = "#ffffff";
            let text = translate.translateString('crioscopia.tooMuchSolute');
            this.getCtx().fillText(text, this.getX() + this.getWidth() / 2, this.getY() - 40);
        }
        
        this.getCtx().textAlign = "center";
        this.getCtx().textBaseline = "middle";
        this.getCtx().font = `${Math.min(this.solventVolumeLiters * 20, 36)}px sans-serif`;
        if (this.isFrozen()) {
            this.getCtx().fillStyle = ColorHelper.isDarkColor(ColorHelper.addColors(solvents[this.solventType].color, 0x777777)) ? "#ffffff" : "#000000";
            this.getCtx().fillText(translate.translateString('crioscopia.frozen'), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - this.solventVolumeLiters * this.getHeight() / 35 / 2);
        }
    }
}

const labjolt = new LabJolt(canvas);
labjolt.setScene(new CryoscopyEbullioscopyScene());

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
    labjolt.getScene().containerWidget.setSolventType(Number.parseFloat(event.target.value));
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
    labjolt.getScene().containerWidget.setSoluteType(Number.parseFloat(event.target.value));
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