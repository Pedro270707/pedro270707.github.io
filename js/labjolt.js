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

    draw(tickDelta) {
        this.getCtx().fillStyle = "#1f1f1f";
        this.getCtx().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        for (let widget of this.widgets) {
            if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
                widget.onHover(mousePos.x, mousePos.y);
            }
            widget.draw(tickDelta);
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

    draw(tickDelta) {
    }

    resizeCanvas() {
    }

    onHover(mouseX, mouseY) {
    }

    click(mouseX, mouseY) {
    }

    isHoveredOver(mouseX, mouseY) {
        return mouseX >= this.getMinX() && mouseY >= this.getMinY() && mouseX < this.getMinX() + this.getMaxWidth() && mouseY < this.getMinY() + this.getMaxHeight();
    }
}

class TextWidget extends Widget {
    constructor(pos, text, width, height, maxWidth, maxHeight, settings = {}) {
        super(pos);
        this.text = text;
        this.font = settings.font || "1em sans-serif";
        this.textAlign = settings.textAlign || "left";
        this.textBaseline = settings.textBaseline || "top";
        this.fillStyle = settings.fillStyle || "#ffffff";
        this.width = width || 0;
        this.height = height || 0;
        this.maxWidth = maxWidth || this.width;
        this.maxHeight = maxHeight || this.height;
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
        if (this.textAlign === "right") {
            return super.getMinX() - this.getMaxWidth();
        }
        return super.getMinX();
    }

    draw(tickDelta) {
        this.getCtx().save();
        
        this.getCtx().font = this.font;
        this.getCtx().textAlign = this.textAlign;
        this.getCtx().textBaseline = this.textBaseline;
        this.getCtx().fillStyle = this.fillStyle;

        const text = this.text;
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.getX(), this.getY());
        this.getCtx().restore();
    }
}

class HoverableTextWidget extends Widget {
    constructor(pos, text, hoverText, width, height, maxWidth, maxHeight, settings = {}) {
        super(pos);
        this.text = text;
        this.hoverText = hoverText;
        this.font = settings.font || "1em sans-serif";
        this.textAlign = settings.textAlign || "left";
        this.textBaseline = settings.textBaseline || "top";
        this.fillStyle = settings.fillStyle || "#ffffff";
        this.hoverFillStyle = settings.hoverFillStyle || "#ffff00";
        this.width = width || 0;
        this.height = height || 0;
        this.maxWidth = maxWidth || this.width;
        this.maxHeight = maxHeight || this.height;
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
        if (this.textAlign === "right") {
            return super.getMinX() - this.getMaxWidth();
        }
        return super.getMinX();
    }

    draw(tickDelta) {
        this.getCtx().save();
        
        this.getCtx().font = this.font;
        this.getCtx().textAlign = this.textAlign;
        this.getCtx().textBaseline = this.textBaseline;
        this.getCtx().fillStyle = this.isHoveredOver(mousePos.x, mousePos.y) ? this.hoverFillStyle : this.fillStyle;

        const text = this.isHoveredOver(mousePos.x, mousePos.y) ? this.hoverText : this.text;
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.getX(), this.getY());
        this.getCtx().restore();
    }
}

class VariableHoverableTextWidget extends Widget {
    constructor(pos, textFunction, hoverTextFunction, width, height, maxWidth, maxHeight, settings = {}) {
        super(pos);
        this.textFunction = textFunction;
        this.hoverTextFunction = hoverTextFunction;
        this.settings = settings;
        this.font = settings.font || "1em sans-serif";
        this.textAlign = settings.textAlign || "left";
        this.textBaseline = settings.textBaseline || "top";
        this.fillStyle = settings.fillStyle || "#ffffff";
        this.hoverFillStyle = settings.hoverFillStyle || "#ffff00";
        this.width = width || 0;
        this.height = height || 0;
        this.maxWidth = maxWidth || this.width;
        this.maxHeight = maxHeight || this.height;
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
        if (this.textAlign === "right") {
            return super.getMinX() - this.getMaxWidth();
        }
        return super.getMinX();
    }

    draw(tickDelta) {
        this.getCtx().save();
        
        this.getCtx().font = this.font;
        this.getCtx().textAlign = this.textAlign;
        this.getCtx().textBaseline = this.textBaseline;
        this.getCtx().fillStyle = this.isHoveredOver(mousePos.x, mousePos.y) ? this.hoverFillStyle : this.fillStyle;

        const text = this.isHoveredOver(mousePos.x, mousePos.y) ? this.hoverTextFunction(this) : this.textFunction(this);
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.getX(), this.getY());
        this.getCtx().restore();
    }
}

class VariableTextWidget extends Widget {
    constructor(pos, textFunction, width, height, maxWidth, maxHeight, settings = {}) {
        super(pos);
        this.textFunction = textFunction;
        this.font = settings.font || "1em sans-serif";
        this.textAlign = settings.textAlign || "left";
        this.textBaseline = settings.textBaseline || "top";
        this.fillStyle = settings.fillStyle || "#ffffff";
        this.width = width || 0;
        this.height = height || 0;
        this.maxWidth = maxWidth || this.width;
        this.maxHeight = maxHeight || this.height;
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
        if (this.textAlign === "right") {
            return super.getMinX() - this.getMaxWidth();
        }
        return super.getMinX();
    }

    draw(tickDelta) {
        this.getCtx().save();
        
        this.getCtx().font = this.font;
        this.getCtx().textAlign = this.textAlign;
        this.getCtx().textBaseline = this.textBaseline;
        this.getCtx().fillStyle = this.fillStyle;

        const text = this.textFunction(this);
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.getX(), this.getY());
        this.getCtx().restore();
    }
}

class LanguageWidget extends VariableTextWidget {
    constructor(pos, language, width, height, maxWidth, maxHeight, settings = {}) {
        let text = LiteralText.EMPTY;
        translate.whenLoaded(() => text = new LiteralText(translate.getName(language)));
        super(pos, (widget) => text, width, height, maxWidth, maxHeight, settings);
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
    #previousTime;
    #deltaTime = 0;

    constructor(canvas) {
        this.#scene = undefined;
        this.#canvas = canvas;
        canvas.addEventListener('click', (event) => {
            event.preventDefault();
            this.#scene.click(mousePos.x, mousePos.y);
        }, false);

        window.addEventListener('resize', () => this.resizeCanvas());

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
        if (!(scene instanceof Scene)) throw new TypeError("Parameter \"scene\" (LabJolt.setScene) is not an instance of Scene");
        if (this.#scene && this.#scene.labjolt === this) delete this.#scene.labjolt;
        this.#scene = scene;
        this.#scene.labjolt = this;
        this.resizeCanvas();
    }

    getScene() {
        return this.#scene;
    }

    draw() {
        const currentTime = performance.now();
    
        this.#deltaTime = currentTime - (this.#previousTime || currentTime);
        this.#previousTime = currentTime;
    
        const tickDelta = this.#deltaTime / 1000;

        if (this.getCanvas()) this.getCanvas().style.cursor = "";
        
        if (this.#scene) this.#scene.draw(tickDelta);
    
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

class ColorHelper {
    static isDarkColor(hex) {
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

    static addColors(first, second) {
        let red = (first >> 16) & 0xFF;
        let green = (first >> 8) & 0xFF;
        let blue = first & 0xFF;

        let red2 = (second >> 16) & 0xFF;
        let green2 = (second >> 8) & 0xFF;
        let blue2 = second & 0xFF;

        return Math.min(red + red2, 0xFF) << 16 | Math.min(green + green2, 0xFF) << 8 | Math.min(blue + blue2, 0xFF);
    }
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
}

class TextMeasurementHelper {
    static #textCache = {};
    
    static measureTextMemoized(text, ctx) {
        if (!this.#textCache[ctx.font]) this.#textCache[ctx.font] = {};
        if (!this.#textCache[ctx.font][text]) this.#textCache[ctx.font][text] = ctx.measureText(text);
        return this.#textCache[ctx.font][text];
    }
}