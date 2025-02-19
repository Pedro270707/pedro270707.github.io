class Translate {
	static DEFAULT_LANGUAGE = 'pt';

	constructor(language) {
		this.language = language;
		this.changeListeners = [];
		this.loadFunctions = [];
		this.definitions = [];
		this.cachedFiles = new Map();
		this.reloadFiles().then(file => {
			for (let loadFunction of this.loadFunctions) {
				loadFunction();
			}
		});
	}

	translateStringInLanguage(string, lang, ...args) {
		let translatedString = string;
		
		const file = this.cachedFiles.get(lang);
		if (file) {
			translatedString = file[translatedString] || translatedString;
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
	
	translateString(string, ...args) {
		return this.translateStringInLanguage(string, this.language || localStorage.language, ...args);
	}

	getDefinition(lang) {
		return this.definitions[lang];
	}

	getName(lang) {
		return !this.getDefinition(lang) ? "" : this.getDefinition(lang).name;
	}

	getAuthor(lang) {
		return !this.getDefinition(lang) ? "" : this.getDefinition(lang).author;
	}

	addChangeListener(listener) {
		if (typeof listener !== 'function') throw new Error('translate.js change listener must be a function');
		this.changeListeners.push(listener);
	}

	whenLoaded(loadFunction) {
		if (typeof loadFunction !== 'function') throw new Error('translate.js load function must be a function');
		if (!this.file) {
			this.loadFunctions.push(loadFunction);
		} else {
			loadFunction();
		}
	}

	async getOrLoadFile(url) {
		let file = await fetch(url);
		file = await file.clone().json();
		return file;
	}
	
	async reloadFiles() {
		const cachedFiles = new Map();
		this.definitions = await fetch('/language/language_definitions.json');
		this.definitions = await this.definitions.clone().json();

		for (let definition in this.definitions) {
			const file = await this.getOrLoadFile(this.definitions[definition].url);
			cachedFiles.set(definition, file);
		}

		this.cachedFiles = cachedFiles;
		
		this.onLanguageLoad();
	}

	onLanguageLoad() {
		let reloadElements = () => {
			let allElements = document.getElementsByTagName('*');
			for (let currentElement of allElements) {
				this.#updateElement(currentElement);
			}
		};
		if (document.readyState === 'loading') {
			document.addEventListener("DOMContentLoaded", reloadElements);
		} else {
			reloadElements();
		}
		for (let listener of this.changeListeners) {
			listener();
		}
	}
	
	getKeyWrapped(key, ...args) {
		return `<span data-translate-string='${JSON.stringify(new TranslatableText(key, ...args))}'>${(this.translateString(key, ...args))}</span>`;
	}

	setAttribute(element, attribute, text) {
		if (text instanceof LiteralText || text instanceof TranslatableText) {
			text = JSON.stringify(text);
		}
		element.setAttribute("data-translate-" + attribute, text);
		this.#updateElement(element);
	}

	#updateElement(element) {
		for (let attribute of element.attributes) {
			if (attribute.name === "data-translate-string") {
				element.innerHTML = getTextFromJSON(attribute.value).get();
			} else if (attribute.name.startsWith("data-translate-")) {
				element.setAttribute(attribute.name.substring("data-translate-".length), getTextFromJSON(attribute.value).get());
			}
		}
	}
}

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
	default:
		if (urlParams.get('lang')) {
			localStorage.language = urlParams.get('lang');
		}
		break;
}

if (localStorage.language === undefined) {
	localStorage.language = Translate.DEFAULT_LANGUAGE;
}

var translate = new Translate();

function reloadLanguage() {
    translate.onLanguageLoad();
}

function changeLanguage(language) {
	localStorage.language = language;
	reloadLanguage();
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    params.delete('lang');

    let newUrl = url.origin + url.pathname + (params.toString() ? '?' + params.toString() : '') + '#';

    if (new URL(newUrl).origin === window.location.origin) {
        window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
        console.error("The new URL's origin does not match the current origin");
    }
}