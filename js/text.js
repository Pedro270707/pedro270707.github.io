class LiteralText {
    constructor(key, ...args) {
        this.key = key;
        for (const arg in args) {
            if (!(args[arg] instanceof LiteralText || args[arg] instanceof TranslatableText)) {
                args[arg] = new LiteralText(args[arg]);
            }
        }
        this.args = args;
    }

    toJSON() {
        if (this.args.length == 0) {
            return {
                text: this.key.toString()
            }
        }
        return {
            text: this.key,
            with: this.args
        };
    }

    get() {
        let key = this.key;
        const promises = [];
    
        for (let i = 1; i <= this.args.length; i++) {
            const placeholder = "%" + i + "$s";
            const str = this.args[i - 1].get();
    
            if (key.includes(placeholder)) {
                key = key.replace(placeholder, str);
            } else {
                key = key.replace("%s", str);
            }
        }
    
        return key;
    }
}

class TranslatableText {
    constructor(key, ...args) {
        this.key = key;
        for (const arg in args) {
            if (!(args[arg] instanceof LiteralText || args[arg] instanceof TranslatableText)) {
                args[arg] = new LiteralText(args[arg]);
            }
        }
        this.args = args;
    }

    toJSON() {
        if (this.args.length == 0) {
            return {
                translate: this.key
            }
        }
        return {
            translate: this.key,
            with: this.args,
        };
    }

    get() {
        return translate.translateString(this.key, ...this.args);
    }
}

function getTextFromJSON(jsonObject) {
    if (typeof jsonObject !== 'object') {
        try {
            jsonObject = JSON.parse(jsonObject);
        } catch (error) {
            console.log("Error when translating JSON to text: " + error.message + "\nPassed parameter: " + jsonObject);
            return new LiteralText(jsonObject);
        }
    }
    for (const key in jsonObject) {
        let arr = [];
        if (jsonObject.with) {
            if (!Array.isArray(jsonObject.with)) {
                console.log(jsonObject.with + " is not a JSON array");
            }
            for (const jsonObj of jsonObject.with) {
                arr.push(getTextFromJSON(jsonObj));
            }
        }
        if (key === 'text') {
            return new LiteralText(jsonObject[key], ...arr);
        } else if (key === 'translate') {
            return new TranslatableText(jsonObject[key], ...arr);
        } else {
            console.log('Invalid text type: ' + key);
        }
    }
}