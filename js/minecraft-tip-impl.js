const testText = "Text with spaces\nLine break\nnothing§lbold§rreset§r§lbold\nnothing §jjeb_ §lbold jeb_ §r§lbold\n§r§l§jnormal jeb_\n§pbouncy§r §qtext§r §sshaky§r\n§j§l§q§p§severything\nnothing\n§kobfuscated\n§m§kstrikethrough obfuscated\n§j§k§l§m§n§o§p§q§sa";

var apng2webp = window.apng2webp.default;

const downloadOverlay = document.getElementById("download-overlay");
const tooltipField = document.getElementById("minecraft-text-input");
let tooltip;
new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
    tooltip = createTooltip(str, false);
    document.getElementById("tooltip-output").appendChild(tooltip);
});

const followerTooltip = createTooltip("Follower tooltip", true);
followerTooltip.classList.add("hidden");
const minecraftItems = document.getElementsByClassName("minecraft-item");

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

setInterval(() => {
    if (tooltipField.value === '') {
        new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
            setTooltipText(tooltip, str);
        });
    } else {
        if (tooltipField.value.startsWith("style:") && styles[tooltipField.value.substring("style:".length)]) {
            settings.style = styles[tooltipField.value.substring("style:".length)];
        } else if (tooltipField.value.startsWith("scale:")) {
            const scale = parseFloat(tooltipField.value.substring("scale:".length));
            if (!Number.isNaN(scale) && scale >= 0) {
                settings.pixelScale = scale;
            }
        }
        const unescapedValue = tooltipField.value.replace(/\\n/g, "\n").replace(/\\\n/g, "\\n");
        setTooltipText(tooltip, unescapedValue);
    }
}, 50);

const recordingText = document.getElementById("recording-text");
const recordingPercentage = document.getElementById("recording-percentage");

function recordPNG(exporter, canvas = tooltip, length = getTooltipDuration()) {
    if (length === 0) {
        let encoder = new APNGencoder(canvas);
        encoder.start();
        encoder.addFrame();
        encoder.finish();
        let base64Out = bytesToBase64(encoder.stream().bin);
        exporter(base64Out);
    } else {
        recordingText.classList.remove("hidden");
        recordingPercentage.innerHTML = 0;
        downloadOverlay.classList.add("hidden");
        let encoder = new APNGencoder(canvas);
        encoder.setRepeat(0);
        encoder.setDispose(1);
        encoder.setDelay(5);
        encoder.start();

        let frame = 0;
        const amountOfFrames = Math.floor(length / 50) - 1;
        let interval = setInterval(() => {
            frame++;
            encoder.addFrame();
            recordingPercentage.innerHTML = (100 * frame / amountOfFrames).toFixed(1);
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            encoder.finish();
            let base64Out = bytesToBase64(encoder.stream().bin);
            exporter(base64Out);
            recordingText.classList.add("hidden");
        }, length);
    }
}

function exportFile(data) {
    const a = document.createElement('a');
    a.download = tooltip.dataset.text.replace(/ |\n/g, "_").replace(/§./, "") + '.png';
    a.href = "data:image/png;base64," + data;
    a.click();
}

function exportWebP(data) {
    apng2webp(Uint8Array.from(atob(data), (c) => c.charCodeAt(0)).buffer)
    .then(blob => {
        const a = document.createElement('a');
        a.download = tooltip.dataset.text.replace(/ |\n/g, "_").replace(/§./g, "") + '.webp';
        a.href = URL.createObjectURL(blob);
        a.click();
    })
    .catch(error => {
        console.error('Conversion failed:', error);
    });
}

function getTooltipDuration() {
    const form = document.getElementById("tooltip-duration");
    const custom = document.getElementById("download-tooltip-custom");
    const customInput = document.getElementById("download-tooltip-custom-input");

    for (const child of form.children) {
        if (child.tagName === 'LABEL') {
            const radio = child.querySelector('input[type="radio"]');
            if (radio.checked) {
                return radio === custom ? (customInput.value < 0 ? 0 : (customInput.value || 0)) * 1000 : parseInt(radio.value);
            }
        }
    }
    return 0;
}

const saveTooltipButton = document.getElementById("save-tooltip");
const savedTooltips = document.getElementById("saved-tooltips");

saveTooltipButton.addEventListener("click", (e) => {
    if (tooltipField.value === '') return;
    let json = localStorage.getItem("minecraft-saved-tooltips");
    if (json === null) {
        json = '{"values":["' + tooltipField.value + '"]}';
        localStorage.setItem("minecraft-saved-tooltips", json);
    } else {
        json = JSON.parse(json);
        json["values"].push(tooltipField.value);
        localStorage.setItem("minecraft-saved-tooltips", JSON.stringify(json))
    }
    updateSavedTooltips();
});

document.addEventListener("DOMContentLoaded", updateSavedTooltips);

function updateSavedTooltips() {
    savedTooltips.innerHTML = "";
    let json = localStorage.getItem("minecraft-saved-tooltips");
    if (json === null) {
        json = '{"values":["§00§11§22§33§44§55§66§77§88§99\n§aa§bb§cc§dd§ee§ff§jj\n§kk§r§ll§r§mm§r§nn§r§oo§r§pp§r§qq§r§ss"]}';
        localStorage.setItem("minecraft-saved-tooltips", json);
    }
    json = JSON.parse(json);
    json["values"].forEach(element => {
        let domElement = document.createElement("div");
        domElement.classList.add("saved-tooltip");
        let tooltipText = document.createElement("span");
        tooltipText.classList.add("saved-tooltip-text");
        tooltipText.classList.add("middle");
        let tooltipTextInner = document.createElement("span");
        tooltipTextInner.textContent = element;
        tooltipText.appendChild(tooltipTextInner);
        tooltipText.addEventListener("click", (e) => {
            tooltipField.value = tooltipTextInner.textContent;
        })
        tooltipText.dataset.mctitle = element.replace(/\\n/g, "\n").replace(/\\\n/g, "\\n");

        tooltipText.addEventListener('mouseenter', (e) => {
            if (!e.target.dataset.mctitle) return;
            followerTooltip.classList.remove("hidden");
            setTooltipText(followerTooltip, tooltipText.dataset.mctitle);
        });
        
        tooltipText.addEventListener('mouseleave', (e) => {
            followerTooltip.classList.add("hidden");
        });

        domElement.appendChild(tooltipText);
        let removeTooltip = document.createElement("button");
        removeTooltip.classList.add("icon-button");
        removeTooltip.classList.add("middle");
        removeTooltip.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 374.1 374.1" style="fill: currentColor; width: 15px;" xml:space="preserve"><g><path d="M349.2,349.2c-5.9,5.9-13.5,8.8-21.2,8.8c-7.7,0-15.4-2.9-21.2-8.8L185.6,228.1L65.2,348.5 c-5.9,5.8-13.5,8.8-21.2,8.8s-15.3-2.9-21.2-8.8c-11.7-11.7-11.7-30.7,0-42.4l120.4-120.4L24.9,67.4c-11.7-11.7-11.7-30.7,0-42.4 c11.7-11.7,30.7-11.7,42.4,0l118.3,118.3L304.6,24.3c11.7-11.7,30.7-11.7,42.4,0c11.7,11.7,11.7,30.7,0,42.4L228.1,185.6 l121.1,121.1C360.9,318.4,360.9,337.4,349.2,349.2z"></path></g></svg>';
        removeTooltip.addEventListener("click", (e) => {
            const index = Array.from(savedTooltips.children).indexOf(domElement);
            let json = localStorage.getItem("minecraft-saved-tooltips");
            if (json !== null) {
                json = JSON.parse(json);
                json["values"].splice(index, 1);
                localStorage.setItem("minecraft-saved-tooltips", JSON.stringify(json))
            }
            savedTooltips.removeChild(domElement);
        });
        domElement.appendChild(removeTooltip);
        savedTooltips.appendChild(domElement);
    });
}