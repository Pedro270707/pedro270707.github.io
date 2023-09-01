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
		if (this.file.ok) {
			const fileJson = await this.file.clone().json();
			if (fileJson[string] != null) {
				translatedString =  fileJson[string];
			}

			for (let i = 1; i <= args.length; i++) {
				const placeholder = "%" + i + "$s";

				if (translatedString.includes(placeholder)) {
					translatedString = translatedString.replace(placeholder, args[i - 1]);
				} else {
					translatedString = translatedString.replace("%s", args[i - 1]);
				}
			}
		}
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
				currentElement.innerHTML = await this.translateString(keyAttribute);
			}

			if (placeholderKeyAttribute !== null) {
				currentElement.placeholder = await this.translateString(placeholderKeyAttribute);
			}

			if (ariaLabelKeyAttribute !== null) {
				currentElement.ariaLabel = await this.translateString(ariaLabelKeyAttribute);
			}
		}
	}
	
	async updateElementContent(content, key) {
		if (key != null) {
			return this.translateString(key);
		} else {
			return content;
		}
	}
	
	async getKeyWrapped(key, ...args) {
		return "<span data-string=\"" + key + "\">" + (await this.translateString(key, ...args)) + "</span>";
	}
}

var translate = new Translate();

function reloadLanguage() {
    translate.reloadLoc();
}