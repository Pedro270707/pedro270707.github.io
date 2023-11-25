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