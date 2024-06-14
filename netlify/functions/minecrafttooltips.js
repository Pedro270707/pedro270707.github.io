import { createCanvas } from 'canvas';
import { TextRenderer, drawTooltip } from '../../modules/minecraft-tip';

const generateTooltipImage = (req, res) => {
    const canvas = createCanvas(16, 16);
    canvas.dataset = [];
    for (const key in req.query) {
        if (Object.hasOwnProperty.call(req.query, key)) {
            const value = req.query[key];
            
            if (key === 'text') {
                canvas.dataset.text = value;
            } else {
                canvas.dataset["setting" + (key ? key[0].toUpperCase() + key.slice(1) : "")] = value;
            }
        }
    }

    drawTooltip(canvas, new TextRenderer(canvas), false);

    const canvasData = canvas.toDataURL();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');

    res.send(canvasData);
};

export default generateTooltipImage;