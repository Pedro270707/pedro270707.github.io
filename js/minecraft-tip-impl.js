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

function startRecording() {
  const chunks = [];
  const stream = tooltip.captureStream();
  const rec = new MediaRecorder(stream);
  
  rec.ondataavailable = e => chunks.push(e.data);

  rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));
  
  rec.start();
  setTimeout(()=>rec.stop(), Math.PI * 2000);
}

function exportVid(blob) {
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = URL.createObjectURL(blob);
  a.click();
}