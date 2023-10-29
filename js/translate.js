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
	}
	
	async translateString(string, ...args) {
		if (!this.file) {
			this.file = await fetch('./language/' + (this.language ? this.language : localStorage.language) + '.json');
		}
		let translatedString = string;

        const promises = [];

		if (this.file.ok) {
			const fileJson = await this.file.clone().json();
			if (fileJson[string] != null) {
				translatedString =  fileJson[string];
			}

			for (let i = 1; i <= args.length; i++) {
				const placeholder = "%" + i + "$s";
				if (!(args[i - 1] instanceof LiteralText || args[i - 1] instanceof TranslatableText)) args[i - 1] = new LiteralText(args[i - 1]);
				const argPromise = args[i - 1].get();

				if (translatedString.includes(placeholder)) {
					argPromise.then(str => {
						translatedString = translatedString.replace(placeholder, str);
					});
				} else {
					argPromise.then(str => {
						translatedString = translatedString.replace("%s", str);
					});
				}

				promises.push(argPromise);
			}
		}

		await Promise.all(promises);

		return translatedString;
	}
	
	async reloadLoc() {
		this.file = await fetch('./language/' + (this.language ? this.language : localStorage.language) + '.json');
		let allElements = document.getElementsByTagName("*");
		for (let currentElement of allElements) {
			const keyAttribute = currentElement.getAttribute("data-string");
			const placeholderKeyAttribute = currentElement.getAttribute("data-placeholder");
			const ariaLabelKeyAttribute = currentElement.getAttribute("data-aria-label");

			if (keyAttribute !== null) {
				getTextFromJSON(keyAttribute).get().then(str => {
					currentElement.innerHTML = str;
				});
			}

			if (placeholderKeyAttribute !== null) {
				getTextFromJSON(placeholderKeyAttribute).get().then(str => {
					currentElement.placeholder = str;
				});
			}

			if (ariaLabelKeyAttribute !== null) {
				getTextFromJSON(ariaLabelKeyAttribute).get().then(str => {
					currentElement.ariaLabel = str;
				});
			}
		}
	}
	
	async getKeyWrapped(key, ...args) {
		return "<span data-string='" + JSON.stringify(new TranslatableText(key, ...args)) + "'>" + (await this.translateString(key, ...args)) + "</span>";
	}

	async setElementString(element, text) {
		if (text instanceof LiteralText || text instanceof TranslatableText) {
			text = JSON.stringify(text);
		}
		element.dataset.string = text;
		getTextFromJSON(text).get().then(str => {
			element.innerHTML = str;
		});
	}

	async setElementPlaceholder(element, text) {
		if (text instanceof LiteralText || text instanceof TranslatableText) {
			text = JSON.stringify(text);
		}
		element.dataset.placeholder = text;
		getTextFromJSON(text).get().then(str => {
			element.placeholder = str;
		});
	}

	async setElementAriaLabel(element, text) {
		if (text instanceof LiteralText || text instanceof TranslatableText) {
			text = JSON.stringify(text);
		}
		element.dataset.ariaLabel = text;
		getTextFromJSON(text).get().then(str => {
			element.ariaLabel = str;
		});
	}
}

var translate = new Translate();

function reloadLanguage() {
    translate.reloadLoc();
}