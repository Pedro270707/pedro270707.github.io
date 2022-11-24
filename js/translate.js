const urlParams = new URLSearchParams(window.location.search);
switch (urlParams.get('lang')) {
	case 'en':
		localStorage.language = 'en';
		break;
	case 'br':
	case 'pt':
		localStorage.language = 'pt';
		break;
}

if (localStorage.language == undefined) {
	localStorage.language = 'pt';
}

function Translate() { 
    //initialization
    this.init =  function(attribute, placeholderAttribute, lng){
        this.attribute = attribute;
        this.lng = lng;    
		this.placeholderAttribute = placeholderAttribute;
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
                                 
                                if(key != null) {
                                    console.log(key);
                                    elem.innerHTML = LngObject[key]  ;
                                } else if(placeholderKey != null) {
									console.log(placeholderKey);
                                    elem.placeholder = LngObject[placeholderKey]  ;
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
                //load content data 
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

function reloadLanguage() {
	var translate = new Translate();
    var currentLng = localStorage.language;
    var attributeName = 'data-string';
	var placeholderAttributeName = 'data-placeholder';
    translate.init(attributeName, placeholderAttributeName, currentLng);
    translate.process(); 
}