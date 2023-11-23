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
  ctx.fillStyle = 'black';
  ctx.wordSpacing = "6px";
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
  ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(80,0,255,0.31)");
  gradient.addColorStop(1, "rgba(40,0,127,0.31)");
  ctx.fillStyle = gradient;
  ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

  ctx.fillStyle = "rgba(16,0,16,0.94)";
  ctx.fillRect(2, 0, canvas.width - 4, 2);
  ctx.fillRect(0, 2, 2, canvas.height - 4);
  ctx.fillRect(canvas.width - 2, 2, 2, canvas.height - 4);
  ctx.fillRect(2, canvas.height - 2, canvas.width - 4, 2);
  ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);

  setDefaultCanvasSettings(canvas);
  textRenderer.drawText(str, 10, 22, true);

  requestAnimationFrame(() => drawTooltip(canvas, textRenderer));
}

function updateCanvasSize(canvas, textRenderer, text = canvas.dataset.text) {
	setDefaultCanvasSettings(canvas);
  canvas.width = textRenderer.getWidth(text) + 22;
  canvas.height = textRenderer.getHeight(text) + 18;
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

    for (let charCode = 33; charCode <= 65535; charCode++) {
      const char = String.fromCodePoint(charCode);
      const width = this.getWidth(char);
    
      if (!this.characterWidthsMap.has(width)) {
        this.characterWidthsMap.set(width, []);
      }
    
      this.characterWidthsMap.get(width).push(char);
    }
  }

  getWidth(string, formatting = new TextFormatting()) {
    const ctx = this.canvas.getContext('2d');

    let width = 0;

    let lines = string.split('\n');
    
    for (const line of lines) {
      let cursor = 0;
      let lineWidth = 0;

      while (cursor < line.length) {
        let char = line[cursor];
        switch (char) {
          case '§':
            cursor++;
            char = line[cursor];
            if (TextFormatting.formattingCodes[char] && (formatting.isFormatting(TextFormatting.formattingCodes[char].type) || !formatting.isFormatted())) {
              TextFormatting.formattingCodes[char].formatFunction(formatting);
            }
            break;
          // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
          case ' ':
            lineWidth += parseFloat(ctx.wordSpacing.substring(0, ctx.wordSpacing.length - 2));
            break;
          default:
            ctx.save();
            char = formatting.applyFormatting(char, ctx, this);
            const lines = line.split('\n');
            const textMetrics = this.canvas.getContext('2d').measureText(char);
            lineWidth += textMetrics.width;
            ctx.restore();
            break;
        }
        cursor++;
      }
      if (lineWidth > width) {
        width = lineWidth;
      }
      formatting.reset();
    }

    return width;
  }

  getHeight(string) {
    return this.removeColorCodes(string).split('\n').length * (this.getLineHeight() + 6) - 8;
  }

  getLineHeight() {
    return parseInt(this.canvas.getContext('2d').font.match(/(?<value>\d+\.?\d*)/)) + 6;
  }

  removeColorCodes(string) {
    return string.replaceAll(/§./g, "");
  }

  drawText(string, x, y, shadow, formatting = new TextFormatting()) {
    const ctx = this.canvas.getContext('2d');

    let cursor = 0;
    let left = 0;
    let line = 0;

    while (cursor < string.length) {
      let char = string[cursor];
      switch (char) {
        case '\n':
          line++;
          left = 0;
          formatting.reset();
          break;
        case '§':
          cursor++;
          char = string[cursor];
          if (TextFormatting.formattingCodes[char] && (formatting.isFormatting(TextFormatting.formattingCodes[char].type) || !formatting.isFormatted())) {
            TextFormatting.formattingCodes[char].formatFunction(formatting);
          }
          break;
        // CanvasRenderingContext2D.wordSpacing doesn't seem to work on Chromium-based browsers, so we have a special condition for spaces
        case ' ':
          left += parseFloat(ctx.wordSpacing.substring(0, ctx.wordSpacing.length - 2));
          break;
        default:
          left += this.drawChar(char, x + left, y + (line * this.getLineHeight()), shadow, formatting);
          break;
      }
      cursor++;
    }
  }

  drawChar(char, x, y, shadow, formatting = new TextFormatting()) {
    const ctx = this.canvas.getContext('2d');
    ctx.save();

    char = formatting.applyFormatting(char, ctx, this);

    if (shadow) {
      ctx.save();
      const originalColor = formatting.getFormattingOption(TextFormatting.FormattingOptions.COLOR);
      let red = Math.round((originalColor >> 16) * (41/168));
      let green = Math.round(((originalColor >> 8) & 0xFF) * (41/168));
      let blue = Math.round((originalColor & 0xFF) * (41/168));
      this.drawChar(char, x + 2, y + 2, false, formatting.copy().withFormattingOption(TextFormatting.FormattingOptions.COLOR, red << 16 | green << 8 | blue).withFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, false));
      ctx.restore();
    }
    
    ctx.fillText(char, x, y);
    const width = this.getWidth(char + ".") - this.getWidth(".");
    ctx.restore();
    return width;
  }

  getRandomTextFrom(originalText) {
    let newText = '';
    for (const char of originalText) {
      const width = this.getWidth(char);
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
    0: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x000000), type: TextFormatting.FormattingOptions.COLOR},
    1: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x0000AA), type: TextFormatting.FormattingOptions.COLOR},
    2: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x00AA00), type: TextFormatting.FormattingOptions.COLOR},
    3: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x00AAAA), type: TextFormatting.FormattingOptions.COLOR},
    4: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xAA0000), type: TextFormatting.FormattingOptions.COLOR},
    5: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xAA00AA), type: TextFormatting.FormattingOptions.COLOR},
    6: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xFFAA00), type: TextFormatting.FormattingOptions.COLOR},
    7: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xAAAAAA), type: TextFormatting.FormattingOptions.COLOR},
    8: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x555555), type: TextFormatting.FormattingOptions.COLOR},
    9: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x5555FF), type: TextFormatting.FormattingOptions.COLOR},
    a: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x55FF55), type: TextFormatting.FormattingOptions.COLOR},
    b: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0x55FFFF), type: TextFormatting.FormattingOptions.COLOR},
    c: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xFF5555), type: TextFormatting.FormattingOptions.COLOR},
    d: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xFF55FF), type: TextFormatting.FormattingOptions.COLOR},
    e: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xFFFF55), type: TextFormatting.FormattingOptions.COLOR},
    f: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.COLOR, 0xFFFFFF), type: TextFormatting.FormattingOptions.COLOR},
    k: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, true), type: TextFormatting.FormattingOptions.OBFUSCATED},
    l: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.BOLD, true), type: TextFormatting.FormattingOptions.BOLD},
    m: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, true), type: TextFormatting.FormattingOptions.STRIKETHROUGH},
    n: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, true), type: TextFormatting.FormattingOptions.UNDERLINE},
    o: {formatFunction: (formatting) => formatting.setFormattingOption(TextFormatting.FormattingOptions.ITALIC, true), type: TextFormatting.FormattingOptions.ITALIC},
    r: {formatFunction: (formatting) => formatting.reset(), type: TextFormatting.FormattingOptions.RESET}
  }

  constructor() {
    this.formattingOptions = {}

    this.addColorOption(TextFormatting.FormattingOptions.COLOR, (text, ctx, textRenderer, value) => {
      ctx.fillStyle = "#" + ('000000' + value.toString(16).toUpperCase()).slice(-6);
      return text;
    }, 0xFFFFFF);
    this.addFormattingOption(TextFormatting.FormattingOptions.UNDERLINE, (text, ctx, textRenderer, value) => {
      if (value) {
        let originalFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#" + ('000000' + this.color.toString(16).toUpperCase()).slice(-6);
        ctx.fillRect(x - 2, y + 2, this.getWidth(char) + 2, 2);
        ctx.fillStyle = originalFillStyle;
      }
      return text;
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.STRIKETHROUGH, (text, ctx, textRenderer, value) => {
      if (value) {
        let originalFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#" + ('000000' + this.color.toString(16).toUpperCase()).slice(-6);
        ctx.fillRect(x - 2, y - 7, this.getWidth(char) + 2, 2);
        ctx.fillStyle = originalFillStyle;
      }
      return text;
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.ITALIC, (text, ctx, textRenderer, value) => {
      if (value && !ctx.font.includes("italic")) {
        ctx.font = "italic " + ctx.font;
      }
      return text;
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.BOLD, (text, ctx, textRenderer, value) => {
      if (value && !ctx.font.includes("bold")) {
        ctx.font = "bold " + ctx.font;
      }
      return text;
    }, false);
    this.addFormattingOption(TextFormatting.FormattingOptions.OBFUSCATED, (text, ctx, textRenderer, value) => {
      if (value) {
        text = textRenderer.getRandomTextFrom(text);
      }
      return text;
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

  applyFormatting(text, ctx, textRenderer) {
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      text = value.formatFunction(text, ctx, textRenderer, value.value);
    }
    return text;
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

  reset() {
    for (const [key, value] of Object.entries(this.formattingOptions)) {
      this.formattingOptions[key].value = value.default;
    }
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
let followerTooltip = createTooltip("Follower tooltip", true);
followerTooltip.classList.add("hidden");
let minecraftItems = document.getElementsByClassName("minecraft-item");

for (let i = 0; i < minecraftItems.length; i++) {
  minecraftItems.item(i).addEventListener('mouseenter', (e) => {
    if (!e.target.dataset.mctitle) return;
    followerTooltip.classList.remove("hidden");
    getTextFromJSON(e.target.dataset.mctitle).get().then(str => {
      setTooltipText(followerTooltip, str);
    });
  });

  minecraftItems.item(i).addEventListener('mouseleave', (e) => {
    followerTooltip.classList.add("hidden");
  });
}
document.body.appendChild(followerTooltip);