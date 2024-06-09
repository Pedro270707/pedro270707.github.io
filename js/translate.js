const urlParams = new URLSearchParams(window.location.search);
switch (urlParams.get('lang')) {
	case 'en-us':
	case 'en-uk':
	case 'en':
		localStorage.language = 'en';
		break;
	case 'br':
	case 'pt-br':
	case 'pt':
		localStorage.language = 'pt';
		break;
	case 'sl':
		localStorage.language = 'sl';
		break;
}

if (localStorage.language == undefined) {
	localStorage.language = Translate.DEFAULT_LANGUAGE;
}

class Translate {
	static DEFAULT_LANGUAGE = 'pt';

	constructor(language) {
		this.language = language;
		this.changeListeners = [];
		this.loadFunctions = [];
		this.reloadLoc().then(file => {
			for (let loadFunction of this.loadFunctions) {
				loadFunction();
			}
		});
	}
	
	translateString(string, ...args) {
		let translatedString = string;

		if (this.file && this.file[string]) {
			translatedString = this.file[string];
		} else if (this.defaultFile && this.defaultFile[string]) {
			translatedString = this.defaultFile[string];
		}

		for (let i = 1; i <= args.length; i++) {
			const placeholder = '%' + i + '$s';
			if (!(args[i - 1] instanceof LiteralText || args[i - 1] instanceof TranslatableText)) args[i - 1] = new LiteralText(args[i - 1]);
			const str = args[i - 1].get();

			if (translatedString.includes(placeholder)) {
				translatedString = translatedString.replace(placeholder, str);
			} else {
				translatedString = translatedString.replace('%s', str);
			}
		}

		return translatedString;
	}

	addChangeListener(listener) {
		if (typeof listener !== 'function') throw new Error('translate.js change listener must be a function');
		this.changeListeners.push(listener);
	}

	whenLoaded(loadFunction) {
		if (typeof loadFunction !== 'function') throw new Error('translate.js load function must be a function');
		if (!this.file || !this.file.ok) {
			this.loadFunctions.push(loadFunction);
		} else {
			loadFunction();
		}
	}
	
	async reloadLoc() {
		this.file = await fetch('/language/' + (this.language || localStorage.language) + '.json');
		this.file = await this.file.clone().json();
		if ((this.language || localStorage.language) === Translate.DEFAULT_LANGUAGE) {
			this.defaultFile = this.file;
		} else {
			this.defaultFile = await fetch('/language/' + Translate.DEFAULT_LANGUAGE + '.json');
			this.defaultFile = await this.defaultFile.clone().json();
		}
		let allElements = document.getElementsByTagName('*');
		for (let currentElement of allElements) {
			const keyAttribute = currentElement.getAttribute('data-string');
			const placeholderKeyAttribute = currentElement.getAttribute('data-placeholder');
			const ariaLabelKeyAttribute = currentElement.getAttribute('data-aria-label');

			if (keyAttribute !== null) {
				currentElement.innerHTML = getTextFromJSON(keyAttribute).get();
			}

			if (placeholderKeyAttribute !== null) {
				currentElement.placeholder = getTextFromJSON(placeholderKeyAttribute).get();
			}

			if (ariaLabelKeyAttribute !== null) {
				currentElement.ariaLabel = getTextFromJSON(ariaLabelKeyAttribute).get();
			}
		}
		for (let listener of this.changeListeners) {
			listener();
		}
		return this.file;
	}
	
	getKeyWrapped(key, ...args) {
		return `<span data-string='${JSON.stringify(new TranslatableText(key, ...args))}'>${(this.translateString(key, ...args))}</span>`;
	}
}

var translate = new Translate();

function reloadLanguage() {
    translate.reloadLoc();
}
