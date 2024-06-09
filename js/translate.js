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
	localStorage.language = 'pt';
}

class Translate {
	constructor(language) {
		this.language = language;
		this.changeListeners = [];
		this.loadFunctions = [];
		fetch('/language/' + (this.language ? this.language : localStorage.language) + '.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch translation file');
                }
                return response.clone().json();
            })
			.then(json => {
				this.file = json;
				for (let listener of this.changeListeners) {
					listener(true);
				}
				for (let loadFunction of this.loadFunctions) {
					loadFunction(true);
				}
			})
            .catch(error => {
                console.error(error);
				for (let listener of this.changeListeners) {
					listener(false);
				}
				for (let loadFunction of this.loadFunctions) {
					loadFunction(false);
				}
            });
	}
	
	translateString(string, ...args) {
		if (!this.file) {
			return string;
		}
		let translatedString = string;

        const promises = [];

		const fileJson = this.file;
		if (fileJson[string] != null) {
			translatedString = fileJson[string];
		}

		for (let i = 1; i <= args.length; i++) {
			const placeholder = "%" + i + "$s";
			if (!(args[i - 1] instanceof LiteralText || args[i - 1] instanceof TranslatableText)) args[i - 1] = new LiteralText(args[i - 1]);
			const str = args[i - 1].get();

			if (translatedString.includes(placeholder)) {
				translatedString = translatedString.replace(placeholder, str);
			} else {
				translatedString = translatedString.replace("%s", str);
			}
		}

		return translatedString;
	}

	addChangeListener(listener) {
		if (typeof listener !== 'function') throw new Error("translate.js change listener must be a function");
		this.changeListeners.push(listener);
	}

	whenLoaded(loadFunction) {
		if (typeof loadFunction !== 'function') throw new Error("translate.js load function must be a function");
		if (!this.file || !this.file.ok) {
			this.loadFunctions.push(loadFunction);
		} else {
			loadFunction(true);
		}
	}
	
	async reloadLoc() {
		this.file = await fetch('/language/' + (this.language ? this.language : localStorage.language) + '.json');
		this.file = await this.file.clone().json();
		let allElements = document.getElementsByTagName("*");
		for (let currentElement of allElements) {
			const keyAttribute = currentElement.getAttribute("data-string");
			const placeholderKeyAttribute = currentElement.getAttribute("data-placeholder");
			const ariaLabelKeyAttribute = currentElement.getAttribute("data-aria-label");

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
			listener(true);
		}
	}
	
	getKeyWrapped(key, ...args) {
		return "<span data-string='" + JSON.stringify(new TranslatableText(key, ...args)) + "'>" + (this.translateString(key, ...args)) + "</span>";
	}
}

var translate = new Translate();

function reloadLanguage() {
    translate.reloadLoc();
}
