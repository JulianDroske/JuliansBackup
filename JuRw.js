// JuRt for network
// A SHORT version of JuRw project

// Nodejs v5.2.0
// Nice version right?
// For someone who i love
// forever

function XML(content){
	
	var c = content.toString();
	this.tago = [];
	
	// fix external codes
	// c = c.replace(new RegExp('<style>[\s\S]*?</style>','g'), '\n');
	// c = c.replace(new RegExp('<script[^>]+>[\s\S]*?</script>','g'), '\n');
	
	// init
	var i=0;
	this.iSpace = function(ch){
		if( ch==' ' || ch=='\n' || ch=='\r' || ch=='\t') return true;
		return false;
	}
	this.iNum = function(ch){
		var ich = ch.charCodeAt();
		return ( (ich>=48 && ich<=57) || ch=='.' || ch=='-' );
	}
	this.sKntil = function(ch, dat){
		var d = dat || c;
		while(d.charAt(i) != ch) ++i;
	}
	this.sKntilRev = function(ch, dat){
		var d = dat || c;
		while(true){
			if(d.charAt(i) == ch){
				if(d.charAt(i-1) != '\\') break;
			}
			++i;
		}
		
	}
	this.sKpace = function(dat){
		var d = dat || c;
		while(this.iSpace(d.charAt(i))) ++i;
	}
	this.iEnd = function(ch){
		if( ch==' ' || ch=='>' || ch=='/' || ch=='\t' || ch=='=') return true;
		return false;
	}
	this.sKnd = function(dat){
		var d = dat || c;
		while(!this.iEnd(d.charAt(i))) ++i;
	}
	
	this.mkObj = function(part, putInner){
		var stend = this.tago[part];
		var cont = c.substring(stend.start, stend.end);
		// var obj = {};
		var obj = new XML(cont);
		
		// parse
		i = 0;
		var attrs = cont.substring(0,cont.indexOf('>')+1);
		attrs = attrs.substring(attrs.indexOf('<'), attrs.length);
		var n = attrs.length;
		
		this.sKpace(attrs);
		
		// var start = i;
		this.sKnd(attrs);
		i++;
		// obj.tagName = attrs.substring(start+1, i-1).toUpperCase();
		obj.tagName = stend.name;	// .toUpperCase();

		attrloop:
		while(i < n){
			this.sKpace(attrs);
			
			var start = i;
			this.sKnd(attrs);
			switch(attrs.charAt(i)){
				case '/':
					++i;
				case '>':
					// end
					++i;
					break attrloop;
			}
			var attrNs = attrs.substring(start, i);
			if(attrs.charAt(i)=='='){
				// has value
				start = ++i;
				if(attrs.charAt(i) == '"'){
					++i;
					this.sKntilRev('"', attrs);
					++i;
					obj[attrNs] = attrs.substring(start+1, i-1);
				}
			}else{
				obj[attrNs] = true;
			}
		}
		if(stend.inner && putInner){
			// has inner
			// this.sKntilRev('>', cont);
			// ++i;
			this.sKpace(cont);
			start = i;
			var end = cont.lastIndexOf('<');
			obj.innerHTML = cont.substring(start, end);
		}
		
		return obj;
	}
	
	
	// tago[n] = {tagname, start, end, hasinnerHTML}
	
	this.load = function(d){
		d = d || 0;
		this.sKpace();
		
		var start = c.indexOf('<',i);
		mainloop:
		while(start >= 0){
			i = start = c.indexOf('<',i)	// tag start
			if(start<0) break;
			switch(c.charAt(start+1)){
				default:
					// get tagname
					// var start = i+1;
					var sta = i+1;
					this.sKnd();
					var tagName = c.substring(sta, i);
					break;
				case '?':
				case '!':
					this.sKntil('>');
					i++;
					continue mainloop;
				case '/':
					// outHTML end sign
					//i--;
					// fix previous tag
					// wanna find it by tag name
					i+=2;
					var tgs = i;
					this.sKnd();
					var tgName = c.substring(tgs, i);
					var n = this.tago.length;
					for(var j = n-1; j >= 0; --j){
						var tag = this.tago[j];
						if(tag.name == tgName && tag.inner == undefined){
							tag.end = i+1;
							tag.inner = true;
							break;
						}
					}
					this.sKntil('>');
					i++;
					continue mainloop;
					// break mainloop;
			}
			this.sKntil('>');	// tag end
			var hasInner = undefined;
			// strict mode
			if(c.charAt(i-1) == '/'){
				hasInner = false;
			}
			// make a object first, change it later
			this.sKntil('>');
			i++;
			// this.tago.push([tagName, start, i, hasInner, ]);
			this.tago.push({
				name: tagName,
				start: start,
				end: i,
				inner: hasInner
			});
		}
	}
	
	this.load();
	
	this.getByTagName = function(name, putInner){
		if(putInner == undefined) putInner = true;
		name = name.toString();
		var ret = [];
		var n = this.tago.length;
		for(var x=0;x<n;++x){
			if(this.tago[x].name == name){
				ret.push(this.mkObj(x,putInner));
			}
		}
		return ret;
	}
	
	this.getByAttr = function(attr,v, putInner){
		if(putInner == undefined) putInner = true;
		var ret = [];
		var n = this.tago.length;
		for(var x=0;x<n;++x){
			var obj = this.mkObj(x, putInner);
			var attrs = Object.keys(obj);
			var nn = attrs.length;
			checkloop:
			for(var j=0;j<nn;++j){
				var y = attrs[j];
				switch(y){
					case attr:
						if(obj[y] == v){
							ret.push(obj);
							break checkloop;
						}
						break;
					case 'innerHTML':
					case 'tagName':
						break;
				}
			}
		}
		return ret;
	}
}


// yeah that's my whole work

// GLOBAL.GFILE = GFILE;
GLOBAL.XML = XML;
// GLOBAL.SVG = SVG;
// GLOBAL.WGET = WGET;
// GLOBAL.WGETSync = WGETSync;

// GLOBAL.setInterv = setInterv;
// GLOBAL.readlineSync = readlineSync;
