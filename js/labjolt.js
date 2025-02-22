let mousePos = {x: 0, y: 0};

class Scene {
    constructor() {
        this.widgets = [];
    }

    getCanvas() {
        return this.labjolt.getCanvas();
    }

    getCtx() {
        return this.getCanvas().getContext('2d');
    }

    addWidget(widget) {
        if (!(widget instanceof Widget)) throw new TypeError("Parameter \"widget\" (Scene.addWidget) is not an instance of Widget");
        this.widgets.push(widget);
        widget.parent = this;
    }

    removeWidget(widget) {
        if (widget instanceof Widget && widget.parent === this) delete widget.parent;
        const index = this.widgets.findIndex(obj => obj === widget);
        if (index !== -1) {
            this.widgets.splice(index, 1);
        }
    }

    resizeCanvas() {
        for (let widget of this.widgets) {
            widget.resizeCanvas();
        }
    }

    draw() {
        this.getCtx().fillStyle = "#1f1f1f";
        this.getCtx().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        for (let widget of this.widgets) {
            if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
                widget.onHover(mousePos.x, mousePos.y);
            }
            widget.draw();
        }
    }

    click(mouseX, mouseY) {
        for (let widget of this.widgets) {
            if (widget.isHoveredOver(mouseX, mouseY)) {
                widget.click(mouseX, mouseY);
                event.preventDefault();
            }
        }
    }
}

class Widget {
    constructor(pos) {
        this.pos = pos;
    }

    getCanvas() {
        return this.parent.getCanvas();
    }

    getCtx() {
        return this.parent.getCtx();
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

    resizeCanvas() {
    }

    onHover(mouseX, mouseY) {
    }

    isHoveredOver(mouseX, mouseY) {
        return mouseX >= this.getMinX() && mouseY >= this.getMinY() && mouseX < this.getMinX() + this.getMaxWidth() && mouseY < this.getMinY() + this.getMaxHeight();
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
        this.getCtx().save();
        
        this.getCtx().font = this.font(this);
        this.getCtx().textAlign = this.textAlign(this);
        this.getCtx().textBaseline = this.textBaseline(this);
        this.getCtx().fillStyle = this.fillStyle(this);

        const text = this.text(this).get();
        const measure = this.getCtx().measureText(text);
        this.width = measure.width;
        this.height = measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent;
        this.maxWidth = Math.max(this.maxWidth, this.width);
        this.maxHeight = Math.max(this.maxHeight , this.height);

        this.getCtx().fillText(text, this.getX(), this.getY());
        this.getCtx().restore();
    }
}

class LanguageWidget extends TextWidget {
    constructor(pos, language, settings = {}) {
        let text = LiteralText.EMPTY;
        translate.addChangeListener(() => text = new LiteralText(translate.getName(language)));
        super(pos, (widget) => text, settings);
        this.language = language;
    }

    onHover(mouseX, mouseY) {
        this.getCanvas().style.cursor = "pointer";
    }

    click(mouseX, mouseY) {
        changeLanguage(this.language);
    }
}

class LabJolt {
    #scene;
    #canvas;

    constructor(canvas) {
        this.#scene = undefined;
        this.#canvas = canvas;
        canvas.addEventListener('click', (event) => {
            event.preventDefault();
            this.#scene.click(mousePos.x, mousePos.y);
        }, false);

        window.addEventListener('resize', this.resizeCanvas);

        canvas.addEventListener("mousemove", (event) => {
            mousePos = getMousePos(event);
        });

        this.draw();
    }

    getCanvas() {
        return this.#canvas;
    }

    resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        this.getCanvas().width = container.clientWidth * ratio;
        this.getCanvas().height = container.clientHeight * ratio;
        this.getCanvas().style.width = `${window.innerWidth}px`;
        this.getCanvas().style.height = `${window.innerHeight}px`;
        if (this.#scene) this.#scene.resizeCanvas();
    }

    setScene(scene) {
        if (!(scene instanceof Scene)) throw new TypeError("Parameter \"scene\" (LabJolt) is not an instance of Scene");
        if (this.#scene && this.#scene.labjolt === this) delete this.#scene.labjolt;
        this.#scene = scene;
        this.#scene.labjolt = this;
        this.resizeCanvas();
    }

    getScene() {
        return this.#scene;
    }

    draw() {
        if (this.getCanvas()) this.getCanvas().style.cursor = "";
        
        if (this.#scene) this.#scene.draw();
    
        requestAnimationFrame(() => this.draw());
    }
}

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

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
}