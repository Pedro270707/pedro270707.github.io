const settings = {
  wordSpacing: 8,
  firstLineIsHigher: true
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
  ctx.font = '16px Minecraft,"WenQuanYi Bitmap Song",SimSun,Unifont,NISC18030,Beijing,Courier,sans-serif';
  canvas.dataset.wordSpacing = settings.wordSpacing + "px";
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
  const ctx = canvas.getContext('2d');

  updateCanvasSize(canvas, textRenderer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(16,0,16,0.94)";
  // ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

  ctx.fillRect(0, 2, 4, canvas.height - 4);
  ctx.fillRect(canvas.width - 4, 2, canvas.width, canvas.height - 4);
  ctx.fillRect(2, 0, canvas.width - 4, 2);
  ctx.fillRect(4, 2, canvas.width - 8, 2);
  ctx.fillRect(2, canvas.height - 2, canvas.width - 4, 2);
  ctx.fillRect(4, canvas.height - 4, canvas.width - 8, 2);

  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(80,0,255,0.31)");
  gradient.addColorStop(1, "rgba(40,0,127,0.31)");
  ctx.fillStyle = gradient;
  ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
  ctx.clearRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.fillStyle = "rgba(16,0,16,0.94)";
  ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);

  setDefaultCanvasSettings(canvas);
  textRenderer.drawText(str, 8, 22, true);

  requestAnimationFrame(() => drawTooltip(canvas, textRenderer));
}

function updateCanvasSize(canvas, textRenderer, text = canvas.dataset.text) {
	setDefaultCanvasSettings(canvas);
  canvas.width = textRenderer.getWidth(text) + 16;
  canvas.height = textRenderer.getHeight(text) + 20 + (settings.firstLineIsHigher && text.split('\n').length > 1 ? 4 : 0);
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
      for (let charCode = 33; charCode <= 16384; charCode++) {
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
    let width = 0;

    const lines = string.split('\n');

    const textRenderingContext = new TextRenderingContext(null, this.canvas, formatting, -Infinity, -Infinity);
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
            lineWidth += parseFloat(textRenderingContext.canvas.dataset.wordSpacing.substring(0, textRenderingContext.canvas.dataset.wordSpacing.length - 2));
            ctx.restore();
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
            break;
        }
        cursor++;
      }
      if (lineWidth > width) {
        width = lineWidth;
      }
      textRenderingContext.formatting.reset(textRenderingContext);
    }

    return width;
  }

  getHeight(string) {
    return this.removeColorCodes(string).split('\n').length * (this.getLineHeight() + 6) - 8;
  }

  getLineHeight() {
    return parseInt(this.canvas.getContext('2d').font.match(/(?<value>\d+\.?\d*)/)) + 4;
  }

  removeColorCodes(string) {
    return string.replaceAll(/§./g, "");
  }

  drawText(string, x, y, shadow, formatting = new TextFormatting()) {
    const ctx = this.canvas.getContext('2d');

    let cursor = 0;

    let textRenderingContext = new TextRenderingContext(null, this.canvas, formatting, x, y, 0, 0, shadow);

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
      let red = Math.round((originalColor >> 16) * (41/168));
      let green = Math.round(((originalColor >> 8) & 0xFF) * (41/168));
      let blue = Math.round((originalColor & 0xFF) * (41/168));
      const textRenderingContextCopy = textRenderingContext.copy();
      textRenderingContextCopy.x += 2;
      textRenderingContextCopy.y += 2;
      textRenderingContextCopy.shadow = false;
      textRenderingContextCopy.formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, () => red << 16 | green << 8 | blue);
      this.drawChar(textRenderingContextCopy);
    }

    textRenderingContext.formatting.applyFormatting(textRenderingContext, this);
    
    // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
    if (textRenderingContext.char === ' ') {
      ctx.restore();
      return parseFloat(textRenderingContext.canvas.dataset.wordSpacing.substring(0, textRenderingContext.canvas.dataset.wordSpacing.length - 2));
    } else {
      ctx.fillText(textRenderingContext.char, textRenderingContext.x + textRenderingContext.left, textRenderingContext.y + (textRenderingContext.line * this.getLineHeight()) + (textRenderingContext.line > 0 && settings.firstLineIsHigher ? 4 : 0));
      const width = textRenderingContext.left - originalLeft + this.getWidth(textRenderingContext.char + ".") - this.getWidth(".");
      ctx.restore();
      return width;
    }
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
  constructor(char, canvas, formatting = new TextFormatting(), x = 0, y = 0, left = 0, line = 0, shadow = false) {
    this.char = char;
    this.canvas = canvas;
    this.formatting = formatting;
    this.x = x;
    this.y = y;
    this.left = left;
    this.line = line;
    this.shadow = shadow;
  }

  copy() {
    return new TextRenderingContext(this.char, this.canvas, this.formatting.copy(), this.x, this.y, this.left, this.line, this.shadow);
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
    r: {formatFunction: (textRenderingContext) => textRenderingContext.formatting.reset(textRenderingContext), type: TextFormatting.FormattingOptions.RESET}
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
        textRenderingContext.canvas.dataset.wordSpacing = (settings.wordSpacing + 2) + "px";
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
        ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - 2, (textRenderingContext.y + (textRenderingContext.line * textRenderer.getLineHeight()) + (textRenderingContext.line > 0 && settings.firstLineIsHigher ? 4 : 0)) + 2, textRenderer.getWidth(textRenderingContext.char) + 2, 2);
        ctx.fillStyle = originalFillStyle;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value) {
        let originalFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#" + ('000000' + this.getFormattingOption(TextFormatting.FormattingOptions.COLOR)().toString(16).toUpperCase()).slice(-6);
        ctx.fillRect((textRenderingContext.x + textRenderingContext.left) - 2, (textRenderingContext.y + (textRenderingContext.line * textRenderer.getLineHeight()) + (textRenderingContext.line > 0 && settings.firstLineIsHigher ? 4 : 0)) - 7, textRenderer.getWidth(textRenderingContext.char) + 2, 2);
        ctx.fillStyle = originalFillStyle;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.ITALIC, (textRenderingContext, textRenderer, value) => {
      const ctx = textRenderingContext.canvas.getContext('2d');
      if (value && !ctx.font.includes("italic")) {
        ctx.font = "italic " + ctx.font;
      }
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.RESET, (textRenderingContext, textRenderer, value) => {
      if (value) {
        this.reset(textRenderingContext);
      }
    }, false);
  }

  addFormattingOption(name, formatFunction, defaultValue, loopTime) {
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