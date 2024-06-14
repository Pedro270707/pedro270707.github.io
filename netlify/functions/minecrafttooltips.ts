import { createCanvas } from 'canvas';

const generateTooltipImage = (req, res) => {
    const canvas = createCanvas(16, 16).getContext('2d').canvas;
    for (const key in req.query) {
        if (Object.hasOwnProperty.call(req.query, key)) {
            const value = req.query[key];
            
            if (key === 'text') {
                canvas.dataset.text = value;
            } else {
                canvas.setAttribute("data-setting-" + key, value);
            }
        }
    }

    drawTooltip(canvas, new TextRenderer(), false);

    const canvasData = canvas.toDataURL();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');

    res.send(canvasData);
};

export default generateTooltipImage;