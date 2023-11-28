class VanillaTooltipStyle {
  constructor() {
    this.paddingLeft = 4;
    this.paddingRight = 4;
    this.paddingTop = 3;
    this.paddingBottom = 3;
    this.lineSpace = 2;
    this.fontSize = 8;
    this.wordSpacing = 4;
    this.firstLineIsHigher = true;
    this.font = 'Minecraft';
    this.shadow = true;
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(16,0,16,0.94)";
  
    ctx.fillRect(0, settings.pixelScale, 2 * settings.pixelScale, canvas.height - (2 * settings.pixelScale));
    ctx.fillRect(canvas.width - (2 * settings.pixelScale), settings.pixelScale, canvas.width, canvas.height - (2 * settings.pixelScale));
    ctx.fillRect(settings.pixelScale, 0, canvas.width - (2 * settings.pixelScale), settings.pixelScale);
    ctx.fillRect(2 * settings.pixelScale, settings.pixelScale, canvas.width - (4 * settings.pixelScale), settings.pixelScale);
    ctx.fillRect(settings.pixelScale, canvas.height - settings.pixelScale, canvas.width - (2 * settings.pixelScale), settings.pixelScale);
    ctx.fillRect(2 * settings.pixelScale, canvas.height - (2 * settings.pixelScale), canvas.width - (4 * settings.pixelScale), settings.pixelScale);
  
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(80,0,255,0.31)");
    gradient.addColorStop(1, "rgba(40,0,127,0.31)");
    ctx.fillStyle = gradient;
    ctx.fillRect(settings.pixelScale, settings.pixelScale, canvas.width - (2 * settings.pixelScale), canvas.height - (2 * settings.pixelScale));
    ctx.clearRect(2 * settings.pixelScale, 2 * settings.pixelScale, canvas.width - (4 * settings.pixelScale), canvas.height - (4 * settings.pixelScale));
  
    ctx.fillStyle = "rgba(16,0,16,0.94)";
    ctx.fillRect(2 * settings.pixelScale, 2 * settings.pixelScale, canvas.width - (4 * settings.pixelScale), canvas.height - (4 * settings.pixelScale));
  }
}

class BetaTooltipStyle {
  constructor() {
    this.paddingLeft = 3;
    this.paddingRight = 3;
    this.paddingTop = 2;
    this.paddingBottom = 2;
    this.lineSpace = 2;
    this.fontSize = 8;
    this.wordSpacing = 4;
    this.firstLineIsHigher = true;
    this.font = 'Minecraft';
    this.shadow = true;
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(0,0,0,0.7529411765)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

class UndertaleTooltipStyle {
  constructor() {
    this.paddingLeft = 10;
    this.paddingRight = 10;
    this.paddingTop = 6;
    this.paddingBottom = 10;
    this.lineSpace = 2;
    this.fontSize = 16;
    this.wordSpacing = 8;
    this.firstLineIsHigher = false;
    this.font = 'Determination';
    this.shadow = false;
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(3 * settings.pixelScale, 3 * settings.pixelScale, canvas.width - (3 * settings.pixelScale), canvas.height - (3 * settings.pixelScale));
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3 * settings.pixelScale, 0, canvas.width - 6 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(3 * settings.pixelScale, canvas.height - (3 * settings.pixelScale), canvas.width - 6 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(0, 0, 3 * settings.pixelScale, canvas.height);
    ctx.fillRect(canvas.width - (3 * settings.pixelScale), 0, 3 * settings.pixelScale, canvas.height);
  }
}

const styles = Object.freeze({
  beta: new BetaTooltipStyle(),
  vanilla: new VanillaTooltipStyle(),
  undertale: new UndertaleTooltipStyle()
});

const settings = {
  style: styles.undertale,
  pixelScale: 2
}

document.addEventListener('mousemove', (e) => {
  let cursorFollowers = document.getElementsByClassName('follow-cursor');
  for (let i = 0; i < cursorFollowers.length; i++) {
    cursorFollowers.item(i).style.left = (e.clientX + 10) + 'px';
    cursorFollowers.item(i).style.top = (e.clientY - cursorFollowers.item(i).height - 5) + 'px';
  }
});

function setDefaultCanvasSettings(canvas) {
  let ctx = canvas.getContext('2d');
  ctx.font = settings.style.fontSize * settings.pixelScale + 'px ' + settings.style.font + ',"WenQuanYi Bitmap Song",SimSun,Unifont,NISC18030,Beijing,Courier,sans-serif';
  canvas.dataset.wordSpacing = settings.style.wordSpacing + "px";
}

function setTooltipText(canvas, str) {
  canvas.dataset.text = str;
}

function drawTooltip(canvas, textRenderer) {
  if (!textRenderer) {
    setDefaultCanvasSettings(canvas);
    textRenderer = new TextRenderer(canvas);
  }
  const str = canvas.dataset.text;

  updateCanvasSize(canvas, textRenderer);

  settings.style.render(canvas);

  setDefaultCanvasSettings(canvas);
  textRenderer.drawText(str, settings.style.paddingLeft * settings.pixelScale, (settings.style.paddingTop + textRenderer.getLineHeight(false)) * settings.pixelScale, settings.style.shadow);

  requestAnimationFrame(() => drawTooltip(canvas, textRenderer));
}

function updateCanvasSize(canvas, textRenderer, text = canvas.dataset.text) {
	setDefaultCanvasSettings(canvas);
  canvas.width = (textRenderer.getWidth(text) + settings.style.paddingLeft + settings.style.paddingRight) * settings.pixelScale;
  canvas.height = (textRenderer.getHeight(text) + settings.style.paddingTop + settings.style.paddingBottom) * settings.pixelScale + (settings.style.firstLineIsHigher && text.split('\n').length > 1 ? 2 * settings.pixelScale : 0);
}

function createTooltip(text = "", followCursor = false) {
  let tooltip = document.createElement("canvas");
  tooltip.classList.add("tooltip");
  setTooltipText(tooltip, text);
  if (followCursor) {
    tooltip.classList.add("follow-cursor");
  }
  drawTooltip(tooltip);
  return tooltip;
}

class TextRenderer {
  constructor(canvas) {
    this.canvas = canvas;

    this.characterWidthsMap = new Map();

    document.fonts.ready.then(() => {
      for (let charCode = 33; charCode <= 512; charCode++) {
        const char = String.fromCodePoint(charCode);
        const width = this.getWidth(char, false);
      
        if (!this.characterWidthsMap.has(width)) {
          this.characterWidthsMap.set(width, []);
        }
      
        this.characterWidthsMap.get(width).push(char);
      }
    });
  }

  getWidth(string, shouldConsiderWeight = true, formatting = new TextFormatting()) {
    let scaledWidth = 0;

    const lines = string.split('\n');

    const textRenderingContext = new TextRenderingContext(null, 0, this.canvas, formatting, -Infinity, -Infinity);
    const ctx = textRenderingContext.canvas.getContext('2d');

    for (const line of lines) {
      let cursor = 0;
      let lineWidth = 0;

      while (cursor < line.length) {
        textRenderingContext.char = line[cursor];
        switch (textRenderingContext.char) {
          case '§':
            cursor++;
            textRenderingContext.char = line[cursor];
            if (TextFormatting.formattingCodes[textRenderingContext.char]) {
              if (!textRenderingContext.formatting.isFormatting(TextFormatting.formattingCodes[textRenderingContext.char].type)) {
                textRenderingContext.formatting.reset(textRenderingContext);
              }
              TextFormatting.formattingCodes[textRenderingContext.char].formatFunction(textRenderingContext);
            }
            break;
          // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
          case ' ':
            ctx.save();
            if (shouldConsiderWeight) {
              textRenderingContext.formatting.applyFormatting(textRenderingContext, this);
            }
            lineWidth += parseFloat(textRenderingContext.canvas.dataset.wordSpacing) * settings.pixelScale;
            ctx.restore();
            textRenderingContext.charIndex++;
            break;
          default:
            ctx.save();
            const originalLeft = textRenderingContext.left;
            if (shouldConsiderWeight) {
              textRenderingContext.formatting.applyFormatting(textRenderingContext, this);
            } else {
              setDefaultCanvasSettings(this.canvas);
            }
            const textMetrics = ctx.measureText(textRenderingContext.char);
            lineWidth += textMetrics.width + (textRenderingContext.left - originalLeft);
            ctx.restore();
            textRenderingContext.charIndex++;
            break;
        }
        cursor++;
      }
      if (lineWidth > scaledWidth) {
        scaledWidth = lineWidth;
      }
      textRenderingContext.formatting.reset(textRenderingContext);
    }

    return scaledWidth / settings.pixelScale;
  }

  getHeight(string) {
    return this.removeColorCodes(string).split('\n').length * this.getLineHeight();
  }

  getLineHeight(withLineSpace = true) {
    return settings.style.fontSize + (withLineSpace ? settings.style.lineSpace : 0);
  }

  removeColorCodes(string) {
    return string.replaceAll(/§./g, "");
  }

  drawText(string, x, y, shadow, formatting = new TextFormatting()) {
    const ctx = this.canvas.getContext('2d');

    let cursor = 0;

    let textRenderingContext = new TextRenderingContext(null, 0, this.canvas, formatting, x, y, 0, 0, shadow);

    while (cursor < string.length) {
      textRenderingContext.char = string[cursor];
      switch (textRenderingContext.char) {
        case '\n':
          textRenderingContext.line++;
          textRenderingContext.left = 0;
          textRenderingContext.formatting.reset(textRenderingContext);
          break;
        case '§':
          cursor++;
          textRenderingContext.char = string[cursor];
          if (TextFormatting.formattingCodes[textRenderingContext.char]) {
            if (!textRenderingContext.formatting.isFormatting(TextFormatting.formattingCodes[textRenderingContext.char].type)) {
              textRenderingContext.formatting.reset(textRenderingContext);
            }
            TextFormatting.formattingCodes[textRenderingContext.char].formatFunction(textRenderingContext);
          }
          break;
        default:
          textRenderingContext.left += this.drawChar(textRenderingContext);
          textRenderingContext.charIndex++;
          break;
      }
      cursor++;
    }
  }

  drawChar(textRenderingContext) {
    const ctx = textRenderingContext.canvas.getContext('2d');
    ctx.save();

    const originalLeft = textRenderingContext.left;

    if (textRenderingContext.shadow) {
      const originalColor = textRenderingContext.formatting.getFormattingOption(TextFormatting.FormattingOptions.COLOR)();
      const red = Math.round((originalColor >> 16) * (41/168));
      const green = Math.round(((originalColor >> 8) & 0xFF) * (41/168));
      const blue = Math.round((originalColor & 0xFF) * (41/168));

      const textRenderingContextCopy = textRenderingContext.copy();
      textRenderingContextCopy.x += settings.pixelScale;
      textRenderingContextCopy.y += settings.pixelScale;
      textRenderingContextCopy.shadow = false;
      textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => red << 16 | green << 8 | blue);
      this.drawChar(textRenderingContextCopy);
    }

    textRenderingContext.formatting.applyFormatting(textRenderingContext, this);
    
    // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
    if (textRenderingContext.char === ' ') {
      ctx.restore();
      return parseFloat(textRenderingContext.canvas.dataset.wordSpacing) * settings.pixelScale;
    } else {
      ctx.fillText(textRenderingContext.char, textRenderingContext.x + textRenderingContext.left, textRenderingContext.y + (textRenderingContext.line * this.getLineHeight() * settings.pixelScale) + (textRenderingContext.line > 0 && settings.style.firstLineIsHigher ? 2 * settings.pixelScale : 0));
      const width = textRenderingContext.left - originalLeft + (this.getWidth(textRenderingContext.char + ".") - this.getWidth(".")) * settings.pixelScale;
      ctx.restore();
      return width;
    }
  }

  static hasLogged = false;

  getRandomTextFrom(originalText) {
    let newText = '';
    for (const char of originalText) {
      const width = this.getWidth(char, false);
      if (this.characterWidthsMap.has(width)) {
        const charactersWithSameWidth = this.characterWidthsMap.get(width);
        if (!TextRenderer.hasLogged && charactersWithSameWidth.length > 8000) {
          TextRenderer.hasLogged = true;
          console.log(charactersWithSameWidth);
        }
        newText += charactersWithSameWidth[Math.floor(Math.random() * charactersWithSameWidth.length)];
      } else {
        newText += originalText;
      }
    }
    return newText;
  }
}

class TextRenderingContext {
  constructor(char, charIndex, canvas, formatting = new TextFormatting(), x = 0, y = 0, left = 0, line = 0, shadow = false) {
    this.char = char;
    this.charIndex = charIndex;
    this.canvas = canvas;
    this.formatting = formatting;
    this.x = x;
    this.y = y;
    this.left = left;
    this.line = line;
    this.shadow = shadow;
  }

  copy() {
    return new TextRenderingContext(this.char, this.charIndex, this.canvas, this.formatting.copy(), this.x, this.y, this.left, this.line, this.shadow);
  }
}

class TextFormatting {
  static FormattingOptions = Object.freeze({
    COLOR: 'color',
    UNDERLINE: 'underline',
    STRIKETHROUGH: 'strikethrough',
    ITALIC: 'italic',
    BOLD: 'bold',
    OBFUSCATED: 'obfuscated',
    VERTICAL_BOBBING: 'vertical_bobbing',
    HORIZONTAL_BOBBING: 'horizontal_bobbing',
    RANDOM_BOBBING: 'random_bobbing',
    RESET: 'reset'
  });

  /*
  This is called every animation frame, so you can dynamically change properties based on time and such.
  NOT 20 TPS! It's actually as fast as it can be, and Minecraft does that too.
  Another thing to note is that formatting codes can only be one character in length. e.g. §g would work, but §rainbow would not.
  */
  static formattingCodes = {
    0: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x000000), type: TextFormatting.FormattingOptions.COLOR},
    1: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x0000AA), type: TextFormatting.FormattingOptions.COLOR},
    2: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x00AA00), type: TextFormatting.FormattingOptions.COLOR},
    3: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x00AAAA), type: TextFormatting.FormattingOptions.COLOR},
    4: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xAA0000), type: TextFormatting.FormattingOptions.COLOR},
    5: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xAA00AA), type: TextFormatting.FormattingOptions.COLOR},
    6: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xFFAA00), type: TextFormatting.FormattingOptions.COLOR},
    7: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xAAAAAA), type: TextFormatting.FormattingOptions.COLOR},
    8: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x555555), type: TextFormatting.FormattingOptions.COLOR},
    9: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x5555FF), type: TextFormatting.FormattingOptions.COLOR},
    a: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x55FF55), type: TextFormatting.FormattingOptions.COLOR},
    b: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x55FFFF), type: TextFormatting.FormattingOptions.COLOR},
    c: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xFF5555), type: TextFormatting.FormattingOptions.COLOR},
    d: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xFF55FF), type: TextFormatting.FormattingOptions.COLOR},
    e: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xFFFF55), type: TextFormatting.FormattingOptions.COLOR},
    f: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xFFFFFF), type: TextFormatting.FormattingOptions.COLOR},
    j: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => {
      const time = performance.now() * 0.001;
      const r = (Math.sin(time) + 1) * 127.5;
      const g = (Math.sin(time + (Math.PI / 2)) + 1) * 127.5;
      const b = (Math.sin(time + Math.PI) + 1) * 127.5;

      return r << 16 | g << 8 | b;
    }), type: TextFormatting.FormattingOptions.COLOR},
    k: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, true), type: TextFormatting.FormattingOptions.OBFUSCATED},
    l: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.BOLD, true), type: TextFormatting.FormattingOptions.BOLD},
    m: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, true), type: TextFormatting.FormattingOptions.STRIKETHROUGH},
    n: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, true), type: TextFormatting.FormattingOptions.UNDERLINE},
    o: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.ITALIC, true), type: TextFormatting.FormattingOptions.ITALIC},
    p: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.VERTICAL_BOBBING, true), type: TextFormatting.FormattingOptions.VERTICAL_BOBBING},
    q: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.HORIZONTAL_BOBBING, true), type: TextFormatting.FormattingOptions.HORIZONTAL_BOBBING},
    r: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.reset(textRenderingContext), type: TextFormatting.FormattingOptions.RESET},
    s: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.RANDOM_BOBBING, true), type: TextFormatting.FormattingOptions.RANDOM_BOBBING}
  }

  constructor() {
    this.formattingOptions = {}

    this.addColorOption(TextFormatting.FormattingOptions.COLOR, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      ctx.fillStyle = "#" + ('000000' + value().toString(16).toUpperCase()).slice(-6);
    }, () => 0xFFFFFF);
    this.addFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, (textRenderingContext, textRenderer, value) => {
      if (value) {
        textRenderingContext.char = textRenderer.getRandomTextFrom(textRenderingContext.char);
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.BOLD, (textRenderingContext, textRenderer, value) => {
      if (value) {
        textRenderingContext.canvas.dataset.wordSpacing = (settings.style.wordSpacing + settings.pixelScale) + "px";
        const textRenderingContextCopy = textRenderingContext.copy();
        textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.BOLD, false);
        textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, false);
        textRenderer.drawChar(textRenderingContextCopy);
        textRenderingContext.left += 2;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        let originalFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#" + ('000000' + this.getFormattingOption(TextFormatting.FormattingOptions.COLOR)().toString(16).toUpperCase()).slice(-6);
        ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - settings.pixelScale, (textRenderingContext.y + (textRenderingContext.line * textRenderer.getLineHeight() * settings.pixelScale) + (textRenderingContext.line > 0 && settings.style.firstLineIsHigher ? 2 * settings.pixelScale : 0)) + settings.pixelScale, textRenderer.getWidth(textRenderingContext.char) * settings.pixelScale + settings.pixelScale, settings.pixelScale);
        ctx.fillStyle = originalFillStyle;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        let originalFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#" + ('000000' + this.getFormattingOption(TextFormatting.FormattingOptions.COLOR)().toString(16).toUpperCase()).slice(-6);
        ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - settings.pixelScale, (textRenderingContext.y + (textRenderingContext.line * textRenderer.getLineHeight() * settings.pixelScale) + (textRenderingContext.line > 0 && settings.style.firstLineIsHigher ? 2 * settings.pixelScale : 0)) - 3.5 * settings.pixelScale, textRenderer.getWidth(textRenderingContext.char) * settings.pixelScale + settings.pixelScale, settings.pixelScale);
        ctx.fillStyle = originalFillStyle;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.ITALIC, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        const verticalPosition = (textRenderingContext.y + (textRenderingContext.line * textRenderer.getLineHeight() * settings.pixelScale) + (textRenderingContext.line > 0 && settings.style.firstLineIsHigher ? 2 * settings.pixelScale : 0)) - 3.5 * settings.pixelScale;
        ctx.transform(1, 0, 0, 1, 0, verticalPosition);
        ctx.transform(1, 0, -0.2, 1, 0, 0);
        ctx.transform(1, 0, 0, 1, 0, -verticalPosition);
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.VERTICAL_BOBBING, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        const time = performance.now() * 0.01;
        ctx.transform(1, 0, 0, 1, 0, Math.sin(time + textRenderingContext.charIndex) * settings.pixelScale);
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.HORIZONTAL_BOBBING, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        const time = performance.now() * 0.01;
        ctx.transform(1, 0, 0, 1, Math.cos(time + textRenderingContext.charIndex) * settings.pixelScale / 2, 0);
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.RANDOM_BOBBING, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        const time = performance.now() * 0.01;
        ctx.transform(1, 0, 0, 1, ((Math.random() * 2) - 1) * settings.pixelScale / 2, ((Math.random() * 2) - 1) * settings.pixelScale / 2);
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.RESET, (textRenderingContext, textRenderer, value) => {
      if (value) {
        this.reset(textRenderingContext);
      }
    }, false);
  }

  addFormattingOption(name, formatFunction, defaultValue) {
    this.formattingOptions[name] = {formatFunction: formatFunction, value: defaultValue, default: defaultValue, isFormatting: true};
  }

  addColorOption(name, colorFunction, defaultValue) {
    this.formattingOptions[name] = {formatFunction: colorFunction, value: defaultValue, default: defaultValue, isFormatting: false};
  }

  setFormattingOption(name, value) {
    if (this.formattingOptions[name]) {
      this.formattingOptions[name].value = value;
    } else {
      console.error("Formatting option '" + name + "' is not defined");
    }
  }

  withFormattingOption(name, value) {
    this.setFormattingOption(name, value);
    return this;
  }

  getFormattingOption(name) {
    return this.formattingOptions[name].value;
  }

  applyFormatting(textRenderingContext, textRenderer) {
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      value.formatFunction(textRenderingContext, textRenderer, value.value);
    }
  }

  copy() {
    const copy = new TextFormatting();
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      copy.setFormattingOption(key, value.value);
    }
    return copy;
  }

  isFormatted() {
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      if (value.value && value.isFormatting) {
        return true;
      }
    }
    return false;
  }

  isFormatting(key) {
    return this.formattingOptions[key] && this.formattingOptions[key].isFormatting;
  }

  reset(textRenderingContext) {
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      this.formattingOptions[key].value = value.default;
    }
    setDefaultCanvasSettings(textRenderingContext.canvas);
    return this;
  }
}

/*
Uncomment the following to automatically add a tooltip to the page
which follows the mouse and changes its contents if the element has
data-mctitle.
The tooltip appears when the mouse hovers over elements with the
class .minecraft-item and disappears otherwise.
*/
// const followerTooltip = createTooltip("Follower tooltip", true);
// followerTooltip.classList.add("hidden");
// const minecraftItems = document.getElementsByClassName("minecraft-item");

// for (let i = 0; i < minecraftItems.length; i++) {
//   minecraftItems.item(i).addEventListener('mouseenter', (e) => {
//     if (!e.target.dataset.mctitle) return;
//     followerTooltip.classList.remove("hidden");
//     getTextFromJSON(e.target.dataset.mctitle).get().then(str => {
//       setTooltipText(followerTooltip, str);
//     });
//   });

//   minecraftItems.item(i).addEventListener('mouseleave', (e) => {
//     followerTooltip.classList.add("hidden");
//   });
// }
// document.body.appendChild(followerTooltip);