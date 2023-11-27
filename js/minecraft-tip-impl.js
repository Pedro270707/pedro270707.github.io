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
        const unescapedValue = tooltipField.value.replace(/\\n/g, "\n").replace(/\\\n/g, "\\n");
        setTooltipText(tooltip, unescapedValue);
        setTooltipText(followerTooltip, unescapedValue);
    }
}, 50);

const recordingText = document.getElementById("recording-text");

function recordPNG(exporter) {
    if (getTooltipTimeLength() === 0) {
        let encoder = new APNGencoder(tooltip);
        encoder.start();
        encoder.addFrame();
        encoder.finish();
        let base64Out = bytesToBase64(encoder.stream().bin);
        exporter(base64Out);
    } else {
        recordingText.classList.remove("hidden");
        downloadOverlay.classList.add("hidden");
        let encoder = new APNGencoder(tooltip);
        encoder.setRepeat(0);
        encoder.setDelay(5);
        encoder.start();

        let interval = setInterval(() => {
            encoder.addFrame();
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            encoder.finish();
            let base64Out = bytesToBase64(encoder.stream().bin);
            exporter(base64Out);
            recordingText.classList.add("hidden");
        }, Math.PI * 2000);
    }
}

function exportFile(data) {
    const a = document.createElement('a');
    a.download = tooltip.dataset.text.replace(/ /g, "_").replace(/§./, "") + '.png';
    a.href = "data:image/png;base64," + data;
    a.click();
}

function exportWebP(data) {
    apng2webp(Uint8Array.from(atob(data), (c) => c.charCodeAt(0)).buffer)
    .then(blob => {
        const a = document.createElement('a');
        a.download = tooltip.dataset.text.replace(/ /g, "_").replace(/§./, "") + '.png';
        a.href = URL.createObjectURL(blob);
        a.click();
    })
    .catch(error => {
        console.error('Conversion failed:', error);
    });
}

function getTooltipTimeLength() {
    const form = document.getElementById("tooltip-time-length");
    const custom = document.getElementById("download-tooltip-custom");
    const customInput = document.getElementById("download-tooltip-custom-input");

    for (const child of form.children) {
        if (child.checked) {
            if (child === custom) {
                console.log("Custom");
                console.log((customInput.value || 0) * 1000);
            } else {
                console.log(child);
                console.log(child.value);
            }
            return child === custom ? (customInput.value || 0) * 1000 : parseInt(child.value);
        }
    }
    return 0;
}