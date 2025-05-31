let canvas = document.getElementById("canvas");

class Genotype {
    constructor(...allelePairs) {
        this.allelePairs = allelePairs;
    }

    breed(other) {
        if (!(other instanceof Genotype)) {
            throw new TypeError('Parameter \"other\" is not an instance of Genotype');
        }

        if (this.allelePairs.length !== other.allelePairs.length) {
            throw new Error('Genotypes must have the same number of allele pairs to breed');
        }

        const descendantPairs = this.allelePairs.map((pair, i) => {
            return new AllelePair(pair.randomAllele(), other.allelePairs[i].randomAllele());
        });

        return new Genotype(...descendantPairs);
    }

    getOffspringDistribution(other) {
        if (this.allelePairs.length !== other.allelePairs.length) {
            throw new Error('Genotypes must have the same number of allele pairs to breed');
        }
    
        const allelePairOptions = this.allelePairs.map((thisPair, i) => {
            const otherPair = other.allelePairs[i];
    
            const combos = [
                [thisPair.allele1, otherPair.allele1],
                [thisPair.allele1, otherPair.allele2],
                [thisPair.allele2, otherPair.allele1],
                [thisPair.allele2, otherPair.allele2]
            ];
    
            const counts = {};
            for (const [a1, a2] of combos) {
                const sortedPair = new AllelePair(a1, a2).toString();
                counts[sortedPair] = (counts[sortedPair] || 0) + 1;
            }
    
            return Object.entries(counts).map(([pairStr, count]) => ({
                pairStr,
                prob: count / 4
            }));
        });
    
        const genotypeProbabilities = new Map();
    
        function combine(index, currentGenotypeParts, currentProb) {
            if (index === allelePairOptions.length) {
                const genotypeStr = currentGenotypeParts.join('');
                genotypeProbabilities.set(
                    genotypeStr,
                    (genotypeProbabilities.get(genotypeStr) || 0) + currentProb
                );
                return;
            }
    
            for (const { pairStr, prob } of allelePairOptions[index]) {
                combine(index + 1, [...currentGenotypeParts, pairStr], currentProb * prob);
            }
        }
    
        combine(0, [], 1);
    
        return genotypeProbabilities;
    }

    toString() {
        return this.allelePairs
            .map(pair => pair.toString())
            .join('');
    }

    static parse(str) {
        if (str.length % 2 !== 0) {
            throw new Error('String must have pairs of characters to parse (use the constructor instead for allels with two or more characters)');
        }
        return new Genotype(...str.match(/.{2}/g).map(s => {
            return new AllelePair(new Allele(s[0], s[0] === s[0].toUpperCase()), new Allele(s[1], s[1] === s[1].toUpperCase()))
        }));
    }
}

class AllelePair {
    constructor(allele1, allele2) {
        if (!allele1.isDominant && allele2.isDominant) {
            this.allele1 = allele2;
            this.allele2 = allele1;
        } else {
            const shouldInvert = allele1.toString().localeCompare(allele2.toString()) <= 0;
            this.allele1 = shouldInvert ? allele2 : allele1;
            this.allele2 = shouldInvert ? allele1 : allele2;
        }
    }

    randomAllele() {
        return Math.random() < 0.5 ? this.allele1 : this.allele2;
    }

    toString() {
        return this.allele1.toString() + this.allele2.toString();
    }

    static parse(str) {
        if (str.length !== 2) {
            throw new Error('String must have two characters to parse (use the constructor instead for allels with two or more characters)');
        }
        return new AllelePair(new Allele(str[0], str[0] === str[0].toUpperCase()), new Allele(str[1], str[1] === str[1].toUpperCase()))
    }
}

class Allele {
    #str;
    #isDominant;

    constructor(str, isDominant) {
        this.#str = str;
        this.#isDominant = isDominant;
    }

    toString() {
        return this.#str;
    }

    get isDominant() {
        return this.#isDominant;
    }
}

class GeneInteractionScene extends Scene {
    constructor() {
        super();
        this.graph = this.addWidget(new GraphWidget({x: (widget) => this.getCanvas().width / 2 + 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2}, new TranslatableText("interacaogenica.graph.phenotype"), new TranslatableText("interacaogenica.graph.amount_of_individuals")))
        this.graph.addItem('black', new GraphItem('Preto', '#000000', 0));
        this.graph.addItem('dark_gray', new GraphItem('Cinza-escuro', '#666666', 0));
        this.graph.addItem('gray', new GraphItem('Cinza', '#aaaaaa', 0));
        this.graph.addItem('light_gray', new GraphItem('Cinza-claro', "#cccccc", 0));
        this.graph.addItem('white', new GraphItem('Branco', "#ffffff", 0));
    }

    init() {
        this.firstAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')]));
        this.secondAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')]));
        this.getCtx().font = '4em sans-serif';
        let breedTextMeasurement = TextMeasurementHelper.measureTextMemoized('x', this.getCtx());
        this.breedText = this.addWidget(new TextWidget({x: (widget) => 0, y: (widget) => 0}, new LiteralText('x'), breedTextMeasurement.width + 20, 0, breedTextMeasurement.width + 20, 0, {font: '4em sans-serif', textAlign: 'center', textBaseline: 'middle'}));
        this.thirdAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')]));
        this.fourthAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')]));
        this.hbox = this.addWidget(new HorizontalArrangementWidget({x: (widget) => 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, 'middle', this.firstAllelePair, this.secondAllelePair, this.breedText, this.thirdAllelePair, this.fourthAllelePair));
    
        this.reproduceButton = this.addWidget(new ButtonWidget({x: (widget) => 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2}, 200, 40, new TranslatableText('interacaogenica.graph.reproduce'), (button, mouseX, mouseY) => {
            for (let i = 0; i < 64; i++) {
                const child = this.getChild();
                switch (child.toString()) {
                    case 'AABB':
                        this.graph.getItem('black').value++;
                        break;
                    case 'AaBB':
                    case 'AABb':
                        this.graph.getItem('dark_gray').value++;
                        break;
                    case 'AaBb':
                    case 'AAbb':
                    case 'aaBB':
                        this.graph.getItem('gray').value++;
                        break;
                    case 'Aabb':
                    case 'aaBb':
                        this.graph.getItem('light_gray').value++;
                        break;
                    default:
                        this.graph.getItem('white').value++;
                        break;
                }
            }
        }));
    }

    getChild() {
        return new Genotype(this.firstAllelePair.validPairs[this.firstAllelePair.currentPair], this.secondAllelePair.validPairs[this.secondAllelePair.currentPair]).breed(new Genotype(this.thirdAllelePair.validPairs[this.thirdAllelePair.currentPair], this.fourthAllelePair.validPairs[this.fourthAllelePair.currentPair]));
    }

    draw(tickDelta) {
        super.draw(tickDelta);
    }
}

class AllelePairWidget extends Widget {
    #validPairs;
    static #boxHeight = 50;
    static #arrowSide = 50;

    constructor(pos, validPairs) {
        super(pos);
        this.#validPairs = validPairs;
        this.currentPair = 0;
    }

    get validPairs() {
        return this.#validPairs;
    }

    set validPairs(value) {
        this.#validPairs = value;
        this.currentPair = 0;
    }

    getWidth() {
        return 100;
    }

    getHeight() {
        return 175;
    }

    draw(tickDelta) {
        DrawHelper.drawRoundedRectWithGradient(this.getX(), this.getY() + (this.getHeight() - AllelePairWidget.#boxHeight) / 2, this.getWidth(), AllelePairWidget.#boxHeight, 5, this.getCtx());
        this.getCtx().textAlign = "center";
        this.getCtx().textBaseline = "middle";
        this.getCtx().font = "1.8em sans-serif";
        this.getCtx().fillText(this.validPairs[this.currentPair].toString(), this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() / 2);

        DrawHelper.drawRoundedRectWithGradient(this.getX() + (this.getWidth() - AllelePairWidget.#arrowSide) / 2, this.getY(), AllelePairWidget.#arrowSide, AllelePairWidget.#arrowSide, 5, this.getCtx(), this.isInTopButton(mousePos.x, mousePos.y) ? '#ffffff' : undefined);
        this.getCtx().fillText('↑', this.getX() + this.getWidth() / 2, this.getY() + AllelePairWidget.#arrowSide / 2)
        
        DrawHelper.drawRoundedRectWithGradient(this.getX() + (this.getWidth() - AllelePairWidget.#arrowSide) / 2, this.getY() + this.getHeight() - AllelePairWidget.#arrowSide, AllelePairWidget.#arrowSide, AllelePairWidget.#arrowSide, 5, this.getCtx(), this.isInBottomButton(mousePos.x, mousePos.y) ? '#ffffff' : undefined);
        this.getCtx().fillText('↓', this.getX() + this.getWidth() / 2, this.getY() + this.getHeight() - AllelePairWidget.#arrowSide / 2)
    }

    isInTopButton(mouseX, mouseY) {
        return mouseX >= this.getX() + (this.getWidth() - AllelePairWidget.#arrowSide) / 2 && mouseX < this.getX() + (this.getWidth() + AllelePairWidget.#arrowSide) / 2 && mouseY >= this.getY() && mouseY < this.getY() + AllelePairWidget.#arrowSide;
    }

    isInBottomButton(mouseX, mouseY) {
        return mouseX >= this.getX() + (this.getWidth() - AllelePairWidget.#arrowSide) / 2 && mouseX < this.getX() + (this.getWidth() + AllelePairWidget.#arrowSide) / 2 && mouseY >= this.getY() + this.getHeight() - AllelePairWidget.#arrowSide && mouseY < this.getY() + this.getHeight();
    }

    mouseDown(mouseX, mouseY) {
        if (this.isInTopButton(mouseX, mouseY)) {
            this.currentPair--;
        } else if (this.isInBottomButton(mouseX, mouseY)) {
            this.currentPair++;
        }
        if (this.currentPair < 0) {
            this.currentPair = this.#validPairs.length - 1;
        } else if (this.currentPair >= this.#validPairs.length) {
            this.currentPair = 0;
        }
    }

    onHover(mouseX, mouseY) {
        if (this.isInTopButton(mouseX, mouseY) || this.isInBottomButton(mouseX, mouseY)) {
            this.getCanvas().style.cursor = "pointer";
        }
    }
}

class GraphWidget extends Widget {
    #items;
    itemWidth = 50;
    itemGap = 20;
    
    constructor(pos, xLabel, yLabel, items = {}) {
        super(pos);
        this.#items = items;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    addItem(id, item) {
        this.#items[id] = item;
    }

    getItem(id) {
        return this.#items[id];
    }

    removeItem(id) {
        delete this.#items[id];
    }

    getLargestItems() {
        let largest = [];
        for (let item of Object.values(this.#items)) {
            if (largest.length === 0) {
                largest[0] = item;
                continue;
            }
            if (item.value > largest[0].value) {
                largest = [item];
                continue;
            }
            if (item.value === largest[0].value) {
                largest.push(item);
            }
        }
        return largest;
    }

    getLargestValue() {
        return Math.max(...Object.values(this.#items).map(v => v.value));
    }

    getWidth() {
        return this.itemGap + Object.keys(this.#items).length * (this.itemWidth + this.itemGap);
    }

    getHeight() {
        return 400;
    }

    getTicks() {
        let largest = this.getLargestValue();
        let niceSteps = [1, 2, 5, 10];
        let rawStep = largest / 8;
        let magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        let step = magnitude * niceSteps[0];
        for (let s of niceSteps) {
            let candidate = magnitude * s;
            if (Math.abs(candidate - rawStep) < Math.abs(step - rawStep)) {
                step = candidate;
            }
        }
        let tickEnd = Math.min(largest, Math.ceil(largest / step) * step);
        let ticks = [];
        for (let t = 0; t <= tickEnd + 1e-9; t += step) {
            if (t !== 0) {
                ticks.push(t);
            }
        }
        return ticks;
    }

    draw(tickDelta) {
        let x = this.getX();
        let y = this.getY();
        let width = this.getWidth();
        let height = this.getHeight();
        let largest = this.getLargestValue();

        this.getCtx().font = "1em sans-serif";
        this.getCtx().textAlign = "center";
        this.getCtx().textBaseline = "bottom";

        let i = 0;
        for (let key in this.#items) {
            let item = this.#items[key];
            let itemX = this.itemGap + i * (this.itemWidth + this.itemGap);
            let itemHeight = item.value / largest * height;

            this.getCtx().fillStyle = item.color;
            this.getCtx().fillRect(x + itemX, y + height - itemHeight, this.itemWidth, itemHeight);

            this.getCtx().fillStyle = "#ffffff";
            this.getCtx().fillText(item.value, x + itemX + this.itemWidth / 2, y + height - itemHeight - 10);

            i++;
        }

        this.getCtx().strokeStyle = "#ffffff";
        this.getCtx().fillStyle = "#ffffff";
        this.getCtx().lineWidth = 2;

        this.getCtx().textAlign = "right";
        this.getCtx().textBaseline = "middle";
        
        let ticks = this.getTicks();
        for (let tick of ticks) {
            let tickHeight = tick / largest * height;
            this.getCtx().beginPath();
            this.getCtx().moveTo(x - 5, y + height - tickHeight);
            this.getCtx().lineTo(x, y + height - tickHeight);
            this.getCtx().stroke();
            this.getCtx().fillText(Math.abs(Math.round(tick) - tick) < 1e-14 ? Math.ceil(tick) : parseFloat(tick).toFixed(1), x - 10, y + height - tickHeight);
        }

        this.getCtx().textBaseline = "top";
        this.getCtx().fillText('0', x - 5, y + height);

        this.getCtx().beginPath();
        this.getCtx().moveTo(x, y);
        this.getCtx().lineTo(x, y + height);
        this.getCtx().lineTo(x + width, y + height);
        this.getCtx().stroke();

        this.getCtx().textAlign = "center";
        this.getCtx().textBaseline = "top";

        let xLabelText = this.xLabel.get();
        this.getCtx().fillText(xLabelText, x + width / 2, y + height + 35);

        this.getCtx().textBaseline = "bottom";

        let yLabelText = this.yLabel.get();
        this.getCtx().save();
        this.getCtx().translate(x - 15 - TextMeasurementHelper.measureTextMemoized(largest.toString(), this.getCtx()).width, y + height / 2);
        this.getCtx().rotate(-Math.PI / 2);
        this.getCtx().fillText(yLabelText, 0, 0);
        this.getCtx().restore();
    }
}

class GraphItem {
    constructor(name, color, value) {
        this.name = name instanceof Text ? name : new LiteralText(name.toString());
        this.color = color;
        this.value = value;
    }
}

const labjolt = new LabJolt(canvas);
labjolt.setScene(new GeneInteractionScene());