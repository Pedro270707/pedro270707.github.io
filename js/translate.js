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

function Translate() { 
    //initialization
    this.init =  function(attribute, placeholderAttribute, ariaLabelAttribute, lng){
        this.attribute = attribute;
        this.lng = lng;    
		this.placeholderAttribute = placeholderAttribute;
		this.ariaLabelAttribute = ariaLabelAttribute;
    }
    //translate 
    this.process = function(){
                _self = this;
                var xrhFile = new XMLHttpRequest();
                //load content data 
                xrhFile.open("GET", "./language/"+this.lng+".json", false);
                xrhFile.onreadystatechange = function ()
                {
                    if(xrhFile.readyState === 4)
                    {
                        if(xrhFile.status === 200 || xrhFile.status == 0)
                        {
                            var LngObject = JSON.parse(xrhFile.responseText);
                            console.log(LngObject["name1"]);
                            var allDom = document.getElementsByTagName("*");
                            for(var i =0; i < allDom.length; i++){
                                var elem = allDom[i];
                                var key = elem.getAttribute(_self.attribute);
								var placeholderKey = elem.getAttribute(_self.placeholderAttribute);
								var ariaLabelKey = elem.getAttribute(_self.ariaLabelAttribute);
                                 
                                if(key != null) {
                                    console.log(key);
									if (LngObject[key] != undefined) {
										elem.innerHTML = LngObject[key]  ;
									} else {
										elem.innerHTML = key;
									}
                                }
								if(placeholderKey != null) {
									console.log(placeholderKey);
									if (LngObject[placeholderKey] != undefined) {
										elem.placeholder = LngObject[placeholderKey];
									} else {
										elem.placeholder = placeholderKey;
									}
								}
								if(ariaLabelKey != null) {
									console.log(ariaLabelKey);
									if (LngObject[ariaLabelKey] != undefined) {
										elem.ariaLabel = LngObject[ariaLabelKey]  ;
									} else {
										elem.ariaLabel = ariaLabelKey;
									}
								}
                            }
                     
                        }
                    }
                }
                xrhFile.send();
    }   

	this.getKey = function(key){
                var xrhFile = new XMLHttpRequest();
				var returnValue;
                xrhFile.open("GET", "./language/" + localStorage.language + ".json", false);
                xrhFile.onreadystatechange = function ()
                {
                    if(xrhFile.readyState === 4)
                    {
                        if(xrhFile.status === 200 || xrhFile.status == 0)
                        {
                            var LngObject = JSON.parse(xrhFile.responseText);
							returnValue = LngObject[key];
						}
					}
				}
				xrhFile.send();
				return returnValue;
	}
}

function getKeyWrapped(key) {
	return "<span data-string=\"" + key + "\">" + new Translate().getKey(key) + "</span>";
}

function reloadLanguage() {
	var translate = new Translate();
    var currentLng = localStorage.language;
    var attributeName = 'data-string';
	var placeholderAttributeName = 'data-placeholder';
	var ariaLabelAttributeName = 'data-aria-label';
    translate.init(attributeName, placeholderAttributeName, ariaLabelAttributeName, currentLng);
    translate.process(); 
}