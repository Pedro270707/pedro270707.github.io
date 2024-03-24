class JavaTooltipStyle {
  constructor() {
    this.paddingLeft = 4;
    this.paddingRight = 4;
    this.paddingTop = 3;
    this.paddingBottom = 3;
    this.lineSpace = 2;
    this.fontSize = 8;
    this.wordSpacing = 4;
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

  getLineHeight(line) {
    return line == 1 ? this.fontSize + this.lineSpace + 2 : this.fontSize + this.lineSpace;
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
    this.font = 'Minecraft';
    this.shadow = true;
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(0,0,0,0.7529411765)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  getLineHeight(line) {
    return line == 1 ? this.fontSize + this.lineSpace + 2 : this.fontSize + this.lineSpace;
  }
}

class BedrockTooltipStyle {
  constructor() {
    this.paddingLeft = 4;
    this.paddingRight = 4;
    this.paddingTop = 3;
    this.paddingBottom = 3;
    this.lineSpace = 2;
    this.fontSize = 8;
    this.wordSpacing = 4;
    this.font = 'Minecraft';
    this.shadow = true;
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,0,0,0.5)";
  
    ctx.fillRect(0, settings.pixelScale, settings.pixelScale, canvas.height - (2 * settings.pixelScale));
    ctx.fillRect(settings.pixelScale, 0, canvas.width - (2 * settings.pixelScale), canvas.height);
    ctx.fillRect(canvas.width - settings.pixelScale, settings.pixelScale, settings.pixelScale, canvas.height - (2 * settings.pixelScale));
  }

  getLineHeight(line) {
    return line == 1 ? this.fontSize + this.lineSpace + 2 : this.fontSize + this.lineSpace;
  }
}

class UndertaleTooltipStyle {
  constructor() {
    this.paddingLeft = 13;
    this.paddingRight = 13;
    this.paddingTop = 9;
    this.paddingBottom = 13;
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
    ctx.fillRect(6 * settings.pixelScale, 6 * settings.pixelScale, canvas.width - (12 * settings.pixelScale), canvas.height - (12 * settings.pixelScale));
    ctx.fillRect(3 * settings.pixelScale, 0, canvas.width - 6 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(3 * settings.pixelScale, canvas.height - (3 * settings.pixelScale), canvas.width - 6 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(0, 0, 3 * settings.pixelScale, canvas.height);
    ctx.fillRect(canvas.width - (3 * settings.pixelScale), 0, 3 * settings.pixelScale, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(6 * settings.pixelScale, 3 * settings.pixelScale, canvas.width - 12 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(6 * settings.pixelScale, canvas.height - (6 * settings.pixelScale), canvas.width - 12 * settings.pixelScale, 3 * settings.pixelScale);
    ctx.fillRect(3 * settings.pixelScale, 3 * settings.pixelScale, 3 * settings.pixelScale, canvas.height - 6 * settings.pixelScale);
    ctx.fillRect(canvas.width - (6 * settings.pixelScale), 3 * settings.pixelScale, 3 * settings.pixelScale, canvas.height - 6 * settings.pixelScale);
  }

  getLineHeight(line) {
    return this.fontSize + this.lineSpace;
  }
}

const styles = Object.freeze({
  beta: new BetaTooltipStyle(),
  java: new JavaTooltipStyle(),
  bedrock: new BedrockTooltipStyle(),
  undertale: new UndertaleTooltipStyle()
});

const ColorCodeView = Object.freeze({
  NEVER: "never",
  LAST_CHAR: "last_char",
  ALWAYS: "always"
});

const AddressedOverflow = Object.freeze({
  NONE: Object.freeze({name: "none", top: false, right: false}),
  TOP: Object.freeze({name: "top", top: true, right: false}),
  RIGHT: Object.freeze({name: "right", top: false, right: true}),
  TOP_RIGHT: Object.freeze({name: "top_right", top: true, right: true})
});

const settings = {
  style: styles.java,
  pixelScale: 2,
  colorCodeChar: '§',
  colorCodeView: ColorCodeView.NEVER,
  addressedOverflow: AddressedOverflow.TOP_RIGHT
}

let mouseX = 0;
let mouseY = 0;

function updateFollowerPositions() {
  let cursorFollowers = document.getElementsByClassName('follow-cursor');
  for (let i = 0; i < cursorFollowers.length; i++) {
    cursorFollowers.item(i).style.left = cursorFollowers.item(i).style.right = cursorFollowers.item(i).style.top = cursorFollowers.item(i).style.bottom = null;
    if (mouseX + 10 + cursorFollowers.item(i).width > window.innerWidth && settings.addressedOverflow.right) {
      cursorFollowers.item(i).style.right = (window.innerWidth - (mouseX - 10)) + 'px';
    } else {
      cursorFollowers.item(i).style.left = (mouseX + 10) + 'px';
    }
    if (mouseY - 5 - cursorFollowers.item(i).height < 0 && settings.addressedOverflow.top) {
      cursorFollowers.item(i).style.top = (mouseY + 5) + 'px';
    } else {
      cursorFollowers.item(i).style.bottom = (window.innerHeight - (mouseY - 5)) + 'px';
    }
  }
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  updateFollowerPositions();
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
  textRenderer.drawText(str, settings.style.paddingLeft * settings.pixelScale, (settings.style.paddingTop + settings.style.fontSize) * settings.pixelScale, settings.style.shadow);

  requestAnimationFrame(() => drawTooltip(canvas, textRenderer));
}

function updateCanvasSize(canvas, textRenderer, text = canvas.dataset.text) {
	setDefaultCanvasSettings(canvas);
  canvas.width = (textRenderer.getWidth(text) + settings.style.paddingLeft + settings.style.paddingRight) * settings.pixelScale;
  canvas.height = (textRenderer.getHeight(text) + settings.style.paddingTop + settings.style.paddingBottom) * settings.pixelScale;
  updateFollowerPositions();
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

    let updateMap = function(textRenderer) {
      textRenderer.characterWidthsMap.clear();
      for (let charCode = 33; charCode <= 512; charCode++) {
        const char = String.fromCodePoint(charCode);
        const width = textRenderer.getWidth(char, false);
      
        if (!textRenderer.characterWidthsMap.has(width)) {
          textRenderer.characterWidthsMap.set(width, []);
        }
      
        textRenderer.characterWidthsMap.get(width).push(char);
      }
    }

    updateMap(this);
    document.fonts.ready.then(() => updateMap(this));
  }

  getWidth(string, shouldConsiderWeight = true, formatting = new TextFormatting()) {
    let scaledWidth = 0;

    const lines = string.split('\n');

    const textRenderingContext = new TextRenderingContext(null, 0, this.canvas, formatting, -Infinity, -Infinity);
    const ctx = textRenderingContext.canvas.getContext('2d');

    let charWidth = function(textRenderer, originalLeft) {
      ctx.save();
      if (shouldConsiderWeight) {
        textRenderingContext.formatting.applyFormatting(textRenderingContext, textRenderer);
        for (const renderFunction of textRenderingContext.setToRender) {
          renderFunction(textRenderingContext, textRenderer, false);
        }
      } else {
        setDefaultCanvasSettings(textRenderer.canvas);
      }
      const textMetrics = ctx.measureText(textRenderingContext.char);
      let width = textMetrics.width + (textRenderingContext.left - originalLeft);
      ctx.restore();
      textRenderingContext.setToRender = [];
      textRenderingContext.charIndex++;
      return width;
    }

    for (const line of lines) {
      let cursor = 0;
      let lineWidth = 0;

      while (cursor < line.length) {
        textRenderingContext.char = line[cursor];
        const originalLeft = textRenderingContext.left;
        switch (textRenderingContext.char) {
          case settings.colorCodeChar:
            if (cursor + 1 >= line.length) {
              if (settings.colorCodeView !== ColorCodeView.NEVER) {
                lineWidth += charWidth(this, originalLeft);
              }
              break;
            }
            if (settings.colorCodeView === ColorCodeView.ALWAYS) {
              lineWidth += charWidth(this, originalLeft);
            }
            cursor++;
            textRenderingContext.char = line[cursor];
            if (settings.colorCodeView === ColorCodeView.ALWAYS) {
              lineWidth += charWidth(this, originalLeft);
            }
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
              for (const renderFunction of textRenderingContext.setToRender) {
                renderFunction(textRenderingContext, this, false);
              }
            }
            lineWidth += parseFloat(textRenderingContext.canvas.dataset.wordSpacing) * settings.pixelScale + ((textRenderingContext.left - originalLeft));
            ctx.restore();
            textRenderingContext.charIndex++;
            break;
          default:
            lineWidth += charWidth(this, originalLeft);
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
    let height = 0;
    for (let i = 0; i < this.removeColorCodes(string).split('\n').length; i++) {
      height += settings.style.getLineHeight(i);
    }
    return height;
  }

  getLineHeight(line) {
    let height = -settings.style.getLineHeight(0);
    for (let i = 0; i <= line; i++) {
      height += settings.style.getLineHeight(i);
    }
    return height;
  }

  removeColorCodes(string) {
    return string.replaceAll(settings.colorCodeChar, "");
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
        case settings.colorCodeChar:
          if (cursor + 1 >= string.length) {
            if (settings.colorCodeView !== ColorCodeView.NEVER) this.drawChar(ctx, textRenderingContext);
            break;
          }
          if (settings.colorCodeView === ColorCodeView.ALWAYS) {
            this.drawChar(ctx, textRenderingContext);
          }
          cursor++;
          textRenderingContext.char = string[cursor];
          if (settings.colorCodeView === ColorCodeView.ALWAYS) {
            this.drawChar(ctx, textRenderingContext);
          }
          if (TextFormatting.formattingCodes[textRenderingContext.char]) {
            if (!textRenderingContext.formatting.isFormatting(TextFormatting.formattingCodes[textRenderingContext.char].type)) {
              textRenderingContext.formatting.reset(textRenderingContext);
            }
            TextFormatting.formattingCodes[textRenderingContext.char].formatFunction(textRenderingContext);
          }
          break;
        default:
          this.drawChar(ctx, textRenderingContext);
          break;
      }
      cursor++;
    }
  }

  drawChar(ctx, textRenderingContext) {
    ctx.save();
    textRenderingContext.formatting.applyFormatting(textRenderingContext, this);
    if (textRenderingContext.shadow) {
      const originalColor = textRenderingContext.formatting.getFormattingOption(TextFormatting.FormattingOptions.COLOR)();
      const red = Math.round((originalColor >> 16) * (41/168));
      const green = Math.round(((originalColor >> 8) & 0xFF) * (41/168));
      const blue = Math.round((originalColor & 0xFF) * (41/168));

      const textRenderingContextCopy = textRenderingContext.copy();
      textRenderingContextCopy.x += settings.pixelScale;
      textRenderingContextCopy.y += settings.pixelScale;
      this.drawCharInternal(textRenderingContextCopy, red << 16 | green << 8 | blue);
    }
    this.drawCharInternal(textRenderingContext);
    ctx.restore();
    textRenderingContext.left += this.getWidth(textRenderingContext.char, false, textRenderingContext.formatting.copy()) * settings.pixelScale;
    textRenderingContext.setToRender = [];
    textRenderingContext.charIndex++;
  }

  drawCharInternal(textRenderingContext, color = textRenderingContext.formatting.getFormattingOption(TextFormatting.FormattingOptions.COLOR)()) {
    const ctx = textRenderingContext.canvas.getContext('2d');

    ctx.save();
    ctx.fillStyle = "#" + color.toString(16).padStart(6, '0');
    for (const renderFunction of textRenderingContext.setToRender) {
      renderFunction(textRenderingContext, this, true);
    }
    // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
    if (textRenderingContext.char !== ' ') {
      ctx.fillText(textRenderingContext.char, textRenderingContext.x + textRenderingContext.left, textRenderingContext.y + this.getLineHeight(textRenderingContext.line) * settings.pixelScale);
    }
    ctx.restore();
  }

  getRandomTextFrom(originalText) {
    let newText = '';
    for (const char of originalText) {
      const width = this.getWidth(char, false);
      if (this.characterWidthsMap.has(width)) {
        const charactersWithSameWidth = this.characterWidthsMap.get(width);
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
    this.setToRender = [];
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
    g: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xDDD605), type: TextFormatting.FormattingOptions.COLOR},
    h: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xE3D4D1), type: TextFormatting.FormattingOptions.COLOR},
    i: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xCECACA), type: TextFormatting.FormattingOptions.COLOR},
    j: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x443A3B), type: TextFormatting.FormattingOptions.COLOR},
    k: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, true), type: TextFormatting.FormattingOptions.OBFUSCATED},
    l: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.BOLD, true), type: TextFormatting.FormattingOptions.BOLD},
    m: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, true), type: TextFormatting.FormattingOptions.STRIKETHROUGH},
    ḿ: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x971607), type: TextFormatting.FormattingOptions.COLOR}, // Bedrock M
    n: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, true), type: TextFormatting.FormattingOptions.UNDERLINE},
    ń: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xB4684D), type: TextFormatting.FormattingOptions.COLOR}, // Bedrock N
    o: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.ITALIC, true), type: TextFormatting.FormattingOptions.ITALIC},
    p: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0xDEB12D), type: TextFormatting.FormattingOptions.COLOR},
    q: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x47A036), type: TextFormatting.FormattingOptions.COLOR},
    r: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.RESET, true), type: TextFormatting.FormattingOptions.RESET},
    s: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x2CBAA8), type: TextFormatting.FormattingOptions.COLOR},
    t: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x21497B), type: TextFormatting.FormattingOptions.COLOR},
    u: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => 0x9A5CC6), type: TextFormatting.FormattingOptions.COLOR},
    v: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => {
      const time = performance.now() * 0.001;
      const r = (Math.sin(time) + 1) * 127.5;
      const g = (Math.sin(time + (Math.PI / 2)) + 1) * 127.5;
      const b = (Math.sin(time + Math.PI) + 1) * 127.5;

      return r << 16 | g << 8 | b;
    }), type: TextFormatting.FormattingOptions.COLOR},
    w: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.VERTICAL_BOBBING, true), type: TextFormatting.FormattingOptions.VERTICAL_BOBBING},
    x: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.HORIZONTAL_BOBBING, true), type: TextFormatting.FormattingOptions.HORIZONTAL_BOBBING},
    y: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.setFormattingOption(TextFormatting.FormattingOptions.RANDOM_BOBBING, true), type: TextFormatting.FormattingOptions.RANDOM_BOBBING}
  }

  constructor() {
    this.formattingOptions = {}

    this.addColorOption(TextFormatting.FormattingOptions.RESET, () => {}, false); // color options reset, so we do not want any code here
    this.addColorOption(TextFormatting.FormattingOptions.COLOR, () => {}, () => 0xFFFFFF);
    this.addFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, (textRenderingContext, textRenderer, value) => {
      if (value) {
        textRenderingContext.char = textRenderer.getRandomTextFrom(textRenderingContext.char);
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
    this.addFormattingOption(TextFormatting.FormattingOptions.BOLD, (textRenderingContext, textRenderer, value) => {
      if (value) {
        textRenderingContext.left += settings.pixelScale;
        textRenderingContext.setToRender.push((textRenderingContext, textRenderer, shouldDraw) => {
          const textRenderingContextCopy = textRenderingContext.copy();
          textRenderingContextCopy.left -= settings.pixelScale;
          textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.BOLD, false);
          textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, false);
          if (shouldDraw) textRenderer.drawCharInternal(textRenderingContextCopy);
        });
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, (textRenderingContext, textRenderer, value) => {
      if (value) {
        textRenderingContext.setToRender.push((textRenderingContext, textRenderer, shouldDraw) => {
          const ctx = textRenderingContext.canvas.getContext('2d');
          if (shouldDraw) ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - settings.pixelScale, (textRenderingContext.y + textRenderer.getLineHeight(textRenderingContext.line) * settings.pixelScale) + settings.pixelScale, textRenderer.getWidth(textRenderingContext.char) * settings.pixelScale + settings.pixelScale, settings.pixelScale);
        })
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        textRenderingContext.setToRender.push((textRenderingContext, textRenderer, shouldDraw) => {
          if (shouldDraw) ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - settings.pixelScale, (textRenderingContext.y + textRenderer.getLineHeight(textRenderingContext.line) * settings.pixelScale) - 3.5 * settings.pixelScale, textRenderer.getWidth(textRenderingContext.char) * settings.pixelScale + settings.pixelScale, settings.pixelScale);
        });
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.ITALIC, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        const verticalPosition = (textRenderingContext.y + textRenderer.getLineHeight(textRenderingContext.line) * settings.pixelScale) - 3.5 * settings.pixelScale;
        ctx.transform(1, 0, 0, 1, 0, verticalPosition);
        ctx.transform(1, 0, -0.2, 1, 0, 0);
        ctx.transform(1, 0, 0, 1, 0, -verticalPosition);
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

/*
Also put this in your CSS.
*/
// .tooltip {
// 	image-rendering: pixelated;
// 	z-index: 10;
// }
//
// .follow-cursor {
// 	position: fixed;
// 	z-index: 11;
// }
//
// .hidden {
//  display: none !important;
// }
