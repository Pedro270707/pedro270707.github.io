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
        return widget;
    }

    removeWidget(widget) {
        if (widget instanceof Widget && widget.parent === this) delete widget.parent;
        const index = this.widgets.findIndex(obj => obj === widget);
        if (index !== -1) {
            this.widgets.splice(index, 1);
        }
        return widget;
    }

    resizeCanvas() {
        for (let widget of this.widgets) {
            widget.resizeCanvas();
        }
    }

    init() {
    }

    draw(tickDelta) {
        this.getCtx().fillStyle = "#1f1f1f";
        this.getCtx().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        this.getCtx().fillStyle = "#ffffff";
        this.getCtx().strokeStyle = "#ffffff";
        this.getCtx().font = "1em sans-serif";
        for (let widget of this.widgets) {
            if (widget.isHoveredOver(mousePos.x, mousePos.y)) {
                widget.onHover(mousePos.x, mousePos.y);
            }
            this.getCtx().save();
            widget.draw(tickDelta);
            this.getCtx().restore();
        }
    }

    click(mouseX, mouseY) {
        for (let widget of this.widgets) {
            if (widget.isHoveredOver(mouseX, mouseY)) {
                widget.click(mouseX, mouseY);
            }
        }
    }

    mouseDown(mouseX, mouseY) {
        for (let widget of this.widgets) {
            widget.mouseDown(mouseX, mouseY);
        }
    }

    mouseUp(mouseX, mouseY) {
        for (let widget of this.widgets) {
            widget.mouseUp(mouseX, mouseY);
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
        return 0;
    }

    getHeight() {
        return 0;
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

    mouseDown(mouseX, mouseY) {
    }

    mouseUp(mouseX, mouseY) {
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
        if (this.textAlign === 'right') {
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
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.textAlign === 'center' ? this.getX() + this.getWidth() / 2 : this.getX(), this.getY());
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
        this.getCtx().fillText(text instanceof Text ? text.get() : text, this.getX(), this.getY() + this.getHeight() / 2);
        this.getCtx().restore();
    }
}

class ButtonWidget extends Widget {
    constructor(pos, width, height, text, pressAction) {
        super(pos);
        this.width = width;
        this.height = height;
        this.text = text instanceof Text ? text : new LiteralText(text.toString());
        this.pressAction = pressAction;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    draw(tickDelta) {
        DrawHelper.drawRoundedRectWithGradient(this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5, this.getCtx(), this.isHoveredOver(mousePos.x, mousePos.y) ? '#ffffff' : undefined);

        this.getCtx().textAlign = 'center';
        this.getCtx().textBaseline = 'middle';
        this.getCtx().fillText(this.text.get(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2);
    }

    onHover(mouseX, mouseY) {
        if (this.isHoveredOver(mouseX, mouseY)) {
            this.getCanvas().style.cursor = "pointer";
        }
    }

    click(mouseX, mouseY) {
        this.pressAction(this, mouseX, mouseY);
    }
}

class RadioButtonManager {
    #selected = -1;
    #changeListeners;

    constructor() {
        this.widgets = [];
        this.#changeListeners = [];
    }

    register(widget) {
        widget.manager = this;
        this.widgets.push(widget);
        if (this.widgets.length === 1) {
            this.selected = 0;
        }
        return widget;
    }

    get selected() {
        return this.#selected;
    }

    addChangeListener(listener) {
        this.#changeListeners.push(listener);
    }

    set selected(index) {
        const oldSelected = this.#selected;
        if (this.#selected >= 0 && this.#selected < this.widgets.length) {
            this.widgets[this.#selected].selected = false;
        }
        this.#selected = Math.max(0, Math.min(index, this.widgets.length - 1));
        this.widgets[this.#selected].selected = true;
        if (oldSelected !== this.#selected) {
            this.#changeListeners.forEach(listener => listener(this, oldSelected));
        }
    }

    getWidget() {
        return this.widgets[this.#selected];
    }

    changeToWidget(widget) {
        const index = this.widgets.indexOf(widget);
        if (index !== -1) this.selected = index;
    }
}

class RadioButtonWidget extends Widget {
    static #radius = 7;
    static #gap = 10;

    constructor(pos, text) {
        super(pos);
        this.selected = false;
        this.text = text instanceof Text ? text : new LiteralText(text);
        this.manager = null;
    }

    getHeight() {
        const measurement = TextMeasurementHelper.measureTextMemoized(this.text.get(), this.getCtx());
        return Math.max(RadioButtonWidget.#radius * 2, measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent);
    }

    getWidth() {
        return RadioButtonWidget.#radius * 2 + RadioButtonWidget.#gap + TextMeasurementHelper.measureTextMemoized(this.text.get(), this.getCtx()).width;
    }

    click(mouseX, mouseY) {
        if (this.manager) {
            this.manager.changeToWidget(this);
        }
    }

    draw(tickDelta) {
        const radius = RadioButtonWidget.#radius;
        this.getCtx().save();
        this.getCtx().strokeStyle = this.isHoveredOver(mousePos.x, mousePos.y) ? '#ffffff' : '#888888';
        this.getCtx().beginPath();
        this.getCtx().arc(this.getX() + radius, this.getY() + radius, radius, 0, 2 * Math.PI);
        this.getCtx().stroke();
        if (this.selected) {
            this.getCtx().fillStyle = '#ffffff';
            this.getCtx().beginPath();
            this.getCtx().arc(this.getX() + radius, this.getY() + radius, radius * 0.5, 0, 2 * Math.PI);
            this.getCtx().fill();
        }
        this.getCtx().restore();
        this.getCtx().textBaseline = 'middle';
        this.getCtx().fillText(this.text.get(), this.getX() + 2 * radius + RadioButtonWidget.#gap, this.getY() + radius);
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

class Draggable extends Widget {
    constructor(pos) {
        super(pos);
        this.dx = 0;
        this.dy = 0;
        this.isFollowingCursor = false;
    }

    getX() {
        return this.pos.x() + this.dx;
    }

    getY() {
        return this.pos.y() + this.dy;
    }

    mouseDown(mouseX, mouseY) {
        if (!this.isHoveredOver(mouseX, mouseY)) return;
        this.isFollowingCursor = true;
        this.oldMouseX = mouseX;
        this.oldMouseY = mouseY;
    }

    mouseUp(mouseX, mouseY) {
        this.isFollowingCursor = false;
        this.oldMouseX = 0;
        this.oldMouseY = 0;
        this.onRelease();
    }

    onRelease() {
    }

    draw(tickDelta) {
        if (this.isFollowingCursor) {
            this.dx += mousePos.x - this.oldMouseX;
            this.dy += mousePos.y - this.oldMouseY;
            this.oldMouseX = mousePos.x;
            this.oldMouseY = mousePos.y;
        }
    }
}

class HorizontalArrangementWidget extends Widget {
    constructor(pos, gap, alignItems = 'middle', ...elements) {
        super(pos);
        this.elements = elements;
        this.gap = gap;
        this.alignItems = alignItems;
    }

    getWidth() {
        let width = 0;
        for (let element of this.elements) {
            width += element.getWidth();
        }
        return width;
    }

    getHeight() {
        return Math.max(...this.elements.map(e => e.getHeight()));
    }

    getMaxWidth() {
        if (this.elements.length === 0) return 0;
        let width = 0;
        for (let element of this.elements) {
            width += element.getMaxWidth();
        }
        return width + (this.elements.length - 1) * this.gap;
    }

    getHeight() {
        return Math.max(...this.elements.map(e => e.getMaxHeight()));
    }

    draw(tickDelta) {
        let x = 0;
        for (let element of this.elements) {
            let elementX = x;
            switch (this.alignItems) {
                case 'top':
                    element.pos = {x: (widget) => this.getX() + elementX, y: (widget) => this.getY() + this.getHeight() / 2};
                    break;
                case 'middle':
                    element.pos = {x: (widget) => this.getX() + elementX, y: (widget) => this.getY() + (this.getHeight() - widget.getHeight()) / 2};
                    break;
                case 'bottom':
                    element.pos = {x: (widget) => this.getX() + elementX, y: (widget) => this.getY() + this.getHeight() - widget.getHeight()};
            }
            x += element.getMaxWidth();
        }
    }
}

class VerticalArrangementWidget extends Widget {
    constructor(pos, gap, alignItems = 'center', ...elements) {
        super(pos);
        this.elements = elements;
        this.gap = gap;
        this.alignItems = alignItems;
    }

    getWidth() {
        return Math.max(...this.elements.map(e => e.getWidth()));
    }

    getHeight() {
        let height = 0;
        for (let element of this.elements) {
            height += element.getHeight();
        }
        return height;
    }

    getMaxWidth() {
        return Math.max(...this.elements.map(e => e.getMaxWidth()));
    }

    getMaxHeight() {
        if (this.elements.length === 0) return 0;
        let height = 0;
        for (let element of this.elements) {
            height += element.getMaxHeight();
        }
        return height + (this.elements.length - 1) * this.gap;
    }

    draw(tickDelta) {
        let y = 0;
        for (let element of this.elements) {
            let elementY = y;
            switch (this.alignItems) {
                case 'left':
                    element.pos = {x: (widget) => this.getX() + this.getWidth() / 2, y: (widget) => this.getY() + elementY};
                    break;
                case 'center':
                    element.pos = {x: (widget) => this.getX() + (this.getWidth() - widget.getWidth()) / 2, y: (widget) => this.getY() + elementY};
                    break;
                case 'right':
                    element.pos = {x: (widget) => this.getX() + this.getWidth() - widget.getWidth(), y: (widget) => this.getY() + elementY};
            }
            y += element.getMaxHeight() + this.gap;
        }
    }
}

class GridWidget extends Widget {
    constructor(pos, width, height, columnCount, rowCount, justifyContent = 'center', alignItems = 'middle', ...elements) {
        super(pos);
        this.elements = elements;
        this.width = width;
        this.height = height;
        this.columnCount = columnCount;
        this.rowCount = rowCount;
        this.justifyContent = justifyContent;
        this.alignItems = alignItems;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    draw(tickDelta) {
        for (let i in this.elements) {
            let element = this.elements[i];
            let column = i % this.columnCount;
            let row = Math.floor(i / this.columnCount);
            let cellWidth = this.getWidth() / this.columnCount;
            let cellHeight = this.getHeight() / this.rowCount;
            switch (this.justifyContent) {
                case 'left':
                    element.pos.x = (widget) => this.getX() + column * cellWidth;
                    break;
                case 'center':
                    element.pos.x = (widget) => this.getX() + (cellWidth - widget.getWidth()) / 2 + column * cellWidth;
                    break;
                case 'right':
                    element.pos.x = (widget) => this.getX() + (column + 1) * cellWidth - widget.getWidth();
            }
            switch (this.alignItems) {
                case 'top':
                    element.pos.y = (widget) => this.getY() + row * cellHeight;
                    break;
                case 'middle':
                    element.pos.y = (widget) => this.getY() + (cellHeight - widget.getHeight()) / 2 + row * cellHeight;
                    break;
                case 'bottom':
                    element.pos.y = (widget) => this.getX() + (row + 1) * cellHeight - widget.getHeight();
            }
        }
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

        canvas.addEventListener('mousedown', (event) => {
            event.preventDefault();
            this.#scene.mouseDown(mousePos.x, mousePos.y);
        }, false);

        canvas.addEventListener('mouseup', (event) => {
            event.preventDefault();
            this.#scene.mouseUp(mousePos.x, mousePos.y);
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
        this.getCanvas().width = this.getCanvas().parentElement.clientWidth * ratio;
        this.getCanvas().height = this.getCanvas().parentElement.clientHeight * ratio;
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
        scene.init();
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

class DrawHelper {
    static drawRoundedRectWithGradient(x, y, width, height, radius, ctx, strokeColor = "#888888", middleColor = "#222222", endColor = "#444444") {
        const cx = x + width / 2;
        const cy = y + height / 2;
        const r = Math.max(width, height) / 2;
    
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, middleColor);
        gradient.addColorStop(1, endColor);
    
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    
        ctx.save();
        ctx.clip();
    
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
    
        ctx.restore();
    
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
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