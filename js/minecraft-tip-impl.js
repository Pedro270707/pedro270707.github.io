const testText = "Text with spaces\nLine break\nnothing§lbold§rreset§r§lbold\nnothing §jjeb_ §lbold jeb_ §r§lbold\n§r§l§jnormal jeb_\n§pbouncy§r §qtext§r §sshaky§r\n§j§l§q§p§severything\nnothing";

var apng2webp = window.apng2webp.default;

const downloadOverlay = document.getElementById("download-overlay");
const tooltipField = document.getElementById("minecraft-text-input");
let tooltip;
new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
    tooltip = createTooltip(str, false);
    document.getElementById("tooltip-output").appendChild(tooltip);
});

const followerTooltip = document.body.appendChild(createTooltip("Follower tooltip", true));
followerTooltip.classList.add("hidden");
const minecraftItems = document.getElementsByClassName("minecraft-item");

for (let i = 0; i < minecraftItems.length; i++) {
    minecraftItems.item(i).addEventListener('mouseenter', (e) => {
        followerTooltip.classList.remove("hidden");
    });

    minecraftItems.item(i).addEventListener('mouseleave', (e) => {
        followerTooltip.classList.add("hidden");
    });
}

setInterval(() => {
    if (tooltipField.value === '') {
        new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
            setTooltipText(tooltip, str);
            setTooltipText(followerTooltip, str);
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
        setTooltipText(followerTooltip, unescapedValue);
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
