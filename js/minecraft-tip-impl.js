const tooltipField = document.getElementById("minecraft-text-input");
let tooltip;
new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
    tooltip = createTooltip(str, false);
    document.getElementById("tooltip-output").appendChild(tooltip);
});

tooltipField.addEventListener("input", (e) => {
    if (e.target.value === '') {
        new TranslatableText("minecrafttooltips-defaulttooltip").get().then(str => {
            setTooltipText(tooltip, str);
        });
    } else {
        setTooltipText(tooltip, e.target.value.replace(/\\n/g, "\n").replace(/\\\n/g, "\\n"));
    }
});

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