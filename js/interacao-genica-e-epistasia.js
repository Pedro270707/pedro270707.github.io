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

    fastReproduction(other, n) {
        const distribution = this.getOffspringDistribution(other);
        return Genotype.#multinomialSample(distribution, n)
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

    static #multinomialSample(distribution, n) {
        const genotypes = Array.from(distribution.keys());
        const probabilities = Array.from(distribution.values());
    
        const counts = new Array(genotypes.length).fill(0);
        let remaining = n;
    
        for (let i = 0; i < genotypes.length - 1; i++) {
            const p = probabilities[i] / probabilities.slice(i).reduce((a,b) => a + b, 0);
            counts[i] = Genotype.#binomialSample(remaining, p);
            remaining -= counts[i];
        }
        counts[genotypes.length - 1] = remaining;
    
        const genotypeCounts = new Map();
        for (let i = 0; i < genotypes.length; i++) {
            genotypeCounts.set(genotypes[i], counts[i]);
        }
    
        return genotypeCounts;
    }
    
    static #binomialSample(n, p) {
        let successes = 0;
        for (let i = 0; i < n; i++) {
            if (Math.random() < p) successes++;
        }
        return successes;
    }

    getGametes() {
        const alleleOptions = this.allelePairs.map(pair => [pair.allele1, pair.allele2]);
    
        function cartesianProduct(arr) {
            return arr.reduce((a, b) => a.flatMap(d => b.map(e => d.concat(e))), [[]]);
        }
    
        return cartesianProduct(alleleOptions).map(alleleList => alleleList.map(a => a.toString()).join(''));
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
    lastIndividuals = [];
    addToGenotypeFunction;

    constructor() {
        super();
    }

    // 🎵 I will refactor this later, you know I will refactor this later
    init() {
        this.graph = this.addWidget(new GraphWidget({x: (widget) => this.getCanvas().width / 2 + 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2}, new TranslatableText("interacaogenica.graph.phenotype"), new TranslatableText("interacaogenica.graph.amount_of_individuals")))

        this.firstAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')]));
        this.secondAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')]));
        this.getCtx().font = '4em sans-serif';
        let breedTextMeasurement = TextMeasurementHelper.measureTextMemoized('x', this.getCtx());
        this.breedText = this.addWidget(new TextWidget({x: (widget) => 0, y: (widget) => 0}, new LiteralText('x'), breedTextMeasurement.width + 20, 0, breedTextMeasurement.width + 20, 0, {font: '4em sans-serif', textAlign: 'center', textBaseline: 'middle'}));
        this.thirdAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')]));
        this.fourthAllelePair = this.addWidget(new AllelePairWidget({x: (widget) => this.getCanvas().width / 2 - 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')]));
        this.hbox = this.addWidget(new HorizontalArrangementWidget({x: (widget) => 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2 - 200}, 0, 'middle', this.firstAllelePair, this.secondAllelePair, this.breedText, this.thirdAllelePair, this.fourthAllelePair));

        this.reproduceButton = this.addWidget(new ButtonWidget({x: (widget) => 0, y: (widget) => 0}, 200, 40, new TranslatableText('interacaogenica.graph.reproduce'), (button, mouseX, mouseY) => {
            this.reproduce(1);
        }));
        this.reproduceTenTimesButton = this.addWidget(new ButtonWidget({x: (widget) => 0, y: (widget) => 0}, 200, 40, new TranslatableText('interacaogenica.graph.reproduce_ten_times'), (button, mouseX, mouseY) => {
            this.reproduce(10);
        }));
        this.reproduceHundredTimesButton = this.addWidget(new ButtonWidget({x: (widget) => 0, y: (widget) => 0}, 200, 40, new TranslatableText('interacaogenica.graph.reproduce_hundred_times'), (button, mouseX, mouseY) => {
            this.reproduce(100);
        }));
        this.reproduceTenThousandTimesButton = this.addWidget(new ButtonWidget({x: (widget) => 0, y: (widget) => 0}, 200, 40, new TranslatableText('interacaogenica.graph.reproduce_ten_thousand_times'), (button, mouseX, mouseY) => {
            this.reproduce(10000);
        }));
        this.buttonGrid = this.addWidget(new GridWidget({x: (widget) => 0, y: (widget) => 0}, this.hbox.getWidth(), 100, 2, 2, 'center', 'middle',
        this.reproduceButton,
        this.reproduceTenTimesButton,
        this.reproduceHundredTimesButton,
        this.reproduceTenThousandTimesButton));

        this.punnettSquare = this.addWidget(new PunnettSquareWidget({x: (widget) => 0, y: (widget) => 0}, Genotype.parse('AaBb'), Genotype.parse('CcDd')));
        const updatePunnettSquare = () => {
            this.punnettSquare.firstGenotype = this.getFirstGenotype();
            this.punnettSquare.secondGenotype = this.getSecondGenotype();
        };
        this.firstAllelePair.addChangeListener(updatePunnettSquare);
        this.secondAllelePair.addChangeListener(updatePunnettSquare);
        this.thirdAllelePair.addChangeListener(updatePunnettSquare);
        this.fourthAllelePair.addChangeListener(updatePunnettSquare);
        updatePunnettSquare();

        this.radioButtonManager = new RadioButtonManager();
        this.polygenicInheritance = this.radioButtonManager.register(this.addWidget(new RadioButtonWidget({x: (widget) => 0, y: (widget) => 0}, new TranslatableText('interacaogenica.options.polygenic_inheritance'))));
        this.collaborativeGenes = this.radioButtonManager.register(this.addWidget(new RadioButtonWidget({x: (widget) => 0, y: (widget) => 0}, new TranslatableText('interacaogenica.options.collaborative_genes'))));
        this.recessiveEpistasis = this.radioButtonManager.register(this.addWidget(new RadioButtonWidget({x: (widget) => 0, y: (widget) => 0}, new TranslatableText('interacaogenica.options.recessive_epistasis'))));
        this.dominantEpistasis = this.radioButtonManager.register(this.addWidget(new RadioButtonWidget({x: (widget) => 0, y: (widget) => 0}, new TranslatableText('interacaogenica.options.dominant_epistasis'))));

        this.radioButtonManager.addChangeListener(() => this.onRadioButtonChanged());
        this.onRadioButtonChanged();

        this.radioButtonGrid = this.addWidget(new GridWidget({x: (widget) => 0, y: (widget) => 0}, this.hbox.getWidth(), 100, 2, 2, 'left', 'middle',
        this.polygenicInheritance,
        this.collaborativeGenes,
        this.recessiveEpistasis,
        this.dominantEpistasis));

        this.vboxLeft = this.addWidget(new VerticalArrangementWidget({x: (widget) => 200, y: (widget) => (this.getCanvas().height - widget.getHeight()) / 2}, 20, 'center', this.hbox, this.buttonGrid, this.punnettSquare, this.radioButtonGrid));

        this.clearButton = this.addWidget(new ButtonWidget({x: (widget) => this.getCanvas().width / 2 + 200, y: (widget) => (this.getCanvas().height - this.graph.getHeight()) / 2 - widget.getHeight() - 50}, 70, 40, new TranslatableText('interacaogenica.graph.clear'), (button, mouseX, mouseY) => {
            
        }));

        const noIndividualsText = new TranslatableText('interacaogenica.graph.last_individual.none');
        this.lastIndividualText = this.addWidget(new VariableTextWidget({x: (widget) => this.getCanvas().width / 2 + 200, y: (widget) => (this.getCanvas().height + this.graph.getHeight()) / 2 + 100}, (widget) => this.lastIndividuals.length === 0 ? noIndividualsText : new TranslatableText('interacaogenica.graph.last_individual', this.lastIndividuals[this.lastIndividuals.length - 1])), 0, 0, 0, 0);

        const textHeight = 26;
        translate.whenLoaded(() => {
            let index = 0;
            for (let definition in Object.fromEntries(Object.entries(translate.definitions).reverse())) {
                let currentIndex = index;
                this.addWidget(new LanguageWidget({x: (widget) => this.getCanvas().width - 10, y: (widget) => this.getCanvas().height - widget.getHeight() - 10 - currentIndex * 30}, definition, 100, textHeight, undefined, undefined, {textAlign: "right"}));
                ++index;
            }
        });
    }

    onRadioButtonChanged() {
        this.graph.removeAll();
        this.lastIndividuals = [];
        switch (this.radioButtonManager.widgets[this.radioButtonManager.selected]) {
            case this.polygenicInheritance:
                this.firstAllelePair.validPairs = [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')];
                this.secondAllelePair.validPairs = [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')];
                this.thirdAllelePair.validPairs = [AllelePair.parse('AA'), AllelePair.parse('Aa'), AllelePair.parse('aa')];
                this.fourthAllelePair.validPairs = [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')];
                this.punnettSquare.colorMap = {
                    'AABB': 0x000000,
                    'AaBB': 0x666666,
                    'AABb': 0x666666,
                    'AaBb': 0xaaaaaa,
                    'AAbb': 0xaaaaaa,
                    'aaBB': 0xaaaaaa,
                    'Aabb': 0xcccccc,
                    'aaBb': 0xcccccc,
                    'aabb': 0xffffff
                };
                this.graph.addItem('black', new GraphItem('Preto', '#000000', 0));
                this.graph.addItem('dark_gray', new GraphItem('Cinza-escuro', '#666666', 0));
                this.graph.addItem('gray', new GraphItem('Cinza', '#aaaaaa', 0));
                this.graph.addItem('light_gray', new GraphItem('Cinza-claro', "#cccccc", 0));
                this.graph.addItem('white', new GraphItem('Branco', "#ffffff", 0));
                this.addToGenotypeFunction = (str, n) => {
                    switch (str) {
                        case 'AABB':
                            this.graph.getItem('black').value += n;
                            break;
                        case 'AaBB':
                        case 'AABb':
                            this.graph.getItem('dark_gray').value += n;
                            break;
                        case 'AaBb':
                        case 'AAbb':
                        case 'aaBB':
                            this.graph.getItem('gray').value += n;
                            break;
                        case 'Aabb':
                        case 'aaBb':
                            this.graph.getItem('light_gray').value += n;
                            break;
                        default:
                            this.graph.getItem('white').value += n;
                            break;
                    }
                }
                break;
            case this.collaborativeGenes:
                this.firstAllelePair.validPairs = [AllelePair.parse('RR'), AllelePair.parse('Rr'), AllelePair.parse('rr')];
                this.secondAllelePair.validPairs = [AllelePair.parse('EE'), AllelePair.parse('Ee'), AllelePair.parse('ee')];
                this.thirdAllelePair.validPairs = [AllelePair.parse('RR'), AllelePair.parse('Rr'), AllelePair.parse('rr')];
                this.fourthAllelePair.validPairs = [AllelePair.parse('EE'), AllelePair.parse('Ee'), AllelePair.parse('ee')];
                this.punnettSquare.colorMap = {
                    'RREE': 0xFFFFFF,
                    'RrEE': 0xFFFFFF,
                    'RREe': 0xFFFFFF,
                    'RrEe': 0xFFFFFF,
                    'RRee': 0xFF85d8,
                    'rrEE': 0xC64E00,
                    'Rree': 0xFF85d8,
                    'rrEe': 0xC64E00,
                    'rree': 0xC68800
                };
                this.graph.removeAll();
                this.graph.addItem('walnut', new GraphItem('Crista noz', '#FFFFFF', 0));
                this.graph.addItem('rose', new GraphItem('Crista rosa', '#FF85d8', 0));
                this.graph.addItem('pea', new GraphItem('Crista ervilha', '#C64E00', 0));
                this.graph.addItem('single', new GraphItem('Crista simples', "#C68800", 0));
                this.addToGenotypeFunction = (str, n) => {
                    switch (str) {
                        case 'RREE':
                        case 'RrEE':
                        case 'RREe':
                        case 'RrEe':
                            this.graph.getItem('walnut').value += n;
                            break;
                        case 'RRee':
                        case 'Rree':
                            this.graph.getItem('rose').value += n;
                            break;
                        case 'rrEe':
                        case 'rrEE':
                            this.graph.getItem('pea').value += n;
                            break;
                        default:
                            this.graph.getItem('single').value += n;
                            break;
                    }
                }
                break;
            case this.recessiveEpistasis:
                this.firstAllelePair.validPairs = [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')];
                this.secondAllelePair.validPairs = [AllelePair.parse('CC'), AllelePair.parse('Cc'), AllelePair.parse('cc')];
                this.thirdAllelePair.validPairs = [AllelePair.parse('BB'), AllelePair.parse('Bb'), AllelePair.parse('bb')];
                this.fourthAllelePair.validPairs = [AllelePair.parse('CC'), AllelePair.parse('Cc'), AllelePair.parse('cc')];
                this.punnettSquare.colorMap = {
                    'BBCC': 0x000000,
                    'BbCC': 0x000000,
                    'BBCc': 0x000000,
                    'BbCc': 0x000000,
                    'BBcc': 0xFFFFFF,
                    'bbCC': 0x492A2A,
                    'Bbcc': 0xFFFFFF,
                    'bbCc': 0x492A2A,
                    'bbcc': 0xFFFFFF
                };
                this.graph.removeAll();
                this.graph.addItem('black', new GraphItem('Preto', '#000000', 0));
                this.graph.addItem('brown', new GraphItem('Marrom', '#492A2A', 0));
                this.graph.addItem('albino', new GraphItem('Albino', '#FFFFFF', 0));
                this.addToGenotypeFunction = (str, n) => {
                    switch (str) {
                        case 'BBCC':
                        case 'BbCC':
                        case 'BBCc':
                        case 'BbCc':
                            this.graph.getItem('black').value += n;
                            break;
                        case 'bbCC':
                        case 'bbCc':
                            this.graph.getItem('brown').value += n;
                            break;
                        default:
                            this.graph.getItem('albino').value += n;
                            break;
                    }
                }
                break;
            case this.dominantEpistasis:
                this.firstAllelePair.validPairs = [AllelePair.parse('II'), AllelePair.parse('Ii'), AllelePair.parse('ii')];
                this.secondAllelePair.validPairs = [AllelePair.parse('CC'), AllelePair.parse('Cc'), AllelePair.parse('cc')];
                this.thirdAllelePair.validPairs = [AllelePair.parse('II'), AllelePair.parse('Ii'), AllelePair.parse('ii')];
                this.fourthAllelePair.validPairs = [AllelePair.parse('CC'), AllelePair.parse('Cc'), AllelePair.parse('cc')];
                this.punnettSquare.colorMap = {
                    'IICC': 0xFFFFFF,
                    'IiCC': 0xFFFFFF,
                    'IICc': 0xFFFFFF,
                    'IiCc': 0xFFFFFF,
                    'IIcc': 0xFFFFFF,
                    'iiCC': 0xC64E00,
                    'Iicc': 0xFFFFFF,
                    'iiCc': 0xC64E00,
                    'iicc': 0xFFFFFF
                };
                this.graph.removeAll();
                this.graph.addItem('white', new GraphItem('Branco', '#FFFFFF', 0));
                this.graph.addItem('colored', new GraphItem('Colorido', '#C64E00', 0));
                this.addToGenotypeFunction = (str, n) => {
                    switch (str) {
                        case 'IICC':
                        case 'IiCC':
                        case 'IICc':
                        case 'IiCc':
                        case 'IIcc':
                        case 'Iicc':
                        case 'iicc':
                            this.graph.getItem('white').value += n;
                            break;
                        default:
                            this.graph.getItem('colored').value += n;
                            break;
                    }
                }
                break;
        }
    }

    reproduce(n) {
        const first = this.getFirstGenotype();
        const second = this.getSecondGenotype();
        if (n <= 10) {
            for (let i = 0; i < n; i++) {
                this.addGenotype(first.breed(second));
            }
        } else {
            for (let [g, amount] of first.fastReproduction(second, n - 10)) {
                this.addToGenotype(g, amount);
            }
            for (let i = 0; i < 10; i++) {
                this.addGenotype(first.breed(second));
            }
        }
    }

    addToGenotype(str, n) {
        this.addToGenotypeFunction(str, n);
    }

    addGenotype(genotype) {
        this.addToGenotype(genotype.toString(), 1);
        this.lastIndividuals.push(genotype);
    }

    getFirstGenotype() {
        return new Genotype(this.firstAllelePair.validPairs[this.firstAllelePair.currentPair], this.secondAllelePair.validPairs[this.secondAllelePair.currentPair]);
    }

    getSecondGenotype() {
        return new Genotype(this.thirdAllelePair.validPairs[this.thirdAllelePair.currentPair], this.fourthAllelePair.validPairs[this.fourthAllelePair.currentPair]);
    }

    getChild() {
        return this.getFirstGenotype().breed(this.getSecondGenotype());
    }

    draw(tickDelta) {
        super.draw(tickDelta);
    }
}

class AllelePairWidget extends Widget {
    #validPairs;
    #changeListeners;
    static #boxHeight = 50;
    static #arrowSide = 50;

    constructor(pos, validPairs, onChange = (widget, direction, oldIndex) => {}) {
        super(pos);
        this.#validPairs = validPairs;
        this.currentPair = 0;
        this.#changeListeners = [];
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

    addChangeListener(listener) {
        this.#changeListeners.push(listener);
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
        let oldIndex = this.currentPair;
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
        if (this.currentPair != oldIndex) {
            this.#changeListeners.forEach(listener => listener(this, 1, oldIndex));
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

    clear() {
        for (let key of Object.keys(this.#items)) {
            this.#items[key].value = 0;
        }
    }

    removeAll() {
        this.#items = [];
    }

    get items() {
        return this.#items;
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

        let largestTickWidth = Math.max(0, ...ticks.map(tick => TextMeasurementHelper.measureTextMemoized(Math.abs(Math.round(tick) - tick) < 1e-14 ? Math.ceil(tick).toString() : parseFloat(tick).toFixed(1), this.getCtx()).width))

        let yLabelText = this.yLabel.get();
        this.getCtx().save();
        this.getCtx().translate(x - 15 - largestTickWidth, y + height / 2);
        this.getCtx().rotate(-Math.PI / 2);
        this.getCtx().fillText(yLabelText, 0, 0);
        this.getCtx().restore();
    }
}

class PunnettSquareWidget extends Widget {
    #tableData;
    #firstGenotype;
    #secondGenotype;
    gridSquareSide = 75

    constructor(pos, firstGenotype, secondGenotype, colorMap = {}) {
        super(pos);
        this.#firstGenotype = firstGenotype;
        this.#secondGenotype = secondGenotype;
        this.colorMap = colorMap;
        this.generateTable();
    }

    get firstGenotype() {
        return this.#firstGenotype;
    }

    set firstGenotype(value) {
        this.#firstGenotype = value;
        this.generateTable();
    }

    get secondGenotype() {
        return this.#secondGenotype;
    }

    set secondGenotype(value) {
        this.#secondGenotype = value;
        this.generateTable();
    }

    getWidth() {
        return (this.#tableData.columns.length + 1) * this.gridSquareSide;
    }

    getHeight() {
        return (this.#tableData.rows.length + 1) * this.gridSquareSide;
    }

    generateTable() {
        if (this.#firstGenotype.allelePairs.length !== this.#secondGenotype.allelePairs.length) {
            throw new Error('Genotypes must have the same number of allele pairs to breed');
        }
    
        const firstGametes = this.#firstGenotype.getGametes();
        const secondGametes = this.#secondGenotype.getGametes();
    
        const square = [];
    
        for (const g1 of firstGametes) {
            const row = [];
            for (const g2 of secondGametes) {
                const allelePairs = [];
    
                for (let i = 0; i < g1.length; i++) {
                    const a1 = new Allele(g1[i], g1[i] === g1[i].toUpperCase());
                    const a2 = new Allele(g2[i], g2[i] === g2[i].toUpperCase());
                    allelePairs.push(new AllelePair(a1, a2));
                }
    
                row.push(new Genotype(...allelePairs));
            }
            square.push(row);
        }
    
        this.#tableData = {
            rows: firstGametes,
            columns: secondGametes,
            grid: square
        };
    }

    draw(tickDelta) {
        this.getCtx().textAlign = 'center';
        this.getCtx().textBaseline = 'middle';

        let x = this.getX() + this.gridSquareSide * 0.5;
        let y = this.getY() + this.gridSquareSide * 1.5;
        for (let gamete of this.#tableData.rows) {
            this.getCtx().fillStyle = '#333333';
            this.getCtx().fillRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
            this.getCtx().fillStyle = '#ffffff';
            this.getCtx().fillText(gamete, x, y);
            this.getCtx().strokeRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
            y += this.gridSquareSide;
        }

        x = this.getX() + this.gridSquareSide * 1.5;
        y = this.getY() + this.gridSquareSide * 0.5;
        for (let gamete of this.#tableData.columns) {
            this.getCtx().fillStyle = '#333333';
            this.getCtx().fillRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
            this.getCtx().fillStyle = '#ffffff';
            this.getCtx().fillText(gamete, x, y);
            this.getCtx().strokeRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
            x += this.gridSquareSide;
        }

        x = this.getX() + this.gridSquareSide * 1.5;
        y = this.getY() + this.gridSquareSide * 1.5;
        for (let gridY in this.#tableData.grid) {
            for (let gamete of this.#tableData.grid[gridY]) {
                const color = this.colorMap[gamete.toString()] || 0;
                const red = ((color >> 16) & 0xFF) / 255
                const green = ((color >> 8) & 0xFF) / 255
                const blue = (color & 0xFF) / 255
                this.getCtx().fillStyle = '#' + color.toString(16).padStart(6, '0') || '#000000';
                this.getCtx().fillRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
                this.getCtx().fillStyle = 1.05/(0.2126 * red + 0.7152 * green + 0.0722 * blue) < 4.5 ? '#000000' : '#ffffff';
                this.getCtx().fillText(gamete, x, y);
                this.getCtx().strokeRect(x - this.gridSquareSide / 2, y - this.gridSquareSide / 2, this.gridSquareSide, this.gridSquareSide);
                x += this.gridSquareSide;
            }
            x = this.getX() + this.gridSquareSide * 1.5;
            y += this.gridSquareSide;
        }
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