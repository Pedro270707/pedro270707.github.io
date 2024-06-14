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
		if (!this.file) {
			this.loadFunctions.push(loadFunction);
		} else {
			loadFunction();
		}
	}
	
	async reloadLoc() {
		this.defaultFile = await fetch('/language/' + Translate.DEFAULT_LANGUAGE + '.json');
		this.defaultFile = await this.defaultFile.clone().json();
		if ((this.language || localStorage.language) === Translate.DEFAULT_LANGUAGE) {
			this.file = this.defaultFile;
		} else {
			this.file = await fetch('/language/' + (this.language || localStorage.language) + '.json');
			this.file = await this.file.clone().json();
		}
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
		return this.file;
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
				element[attribute.name.substring("data-translate-".length)] = getTextFromJSON(attribute.value).get();
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
    translate.reloadLoc();
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