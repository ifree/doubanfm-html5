(function($,ui) {
    var root=this;
    var btnPause,
	btnLove,
	btnBan,
	btnSkip,
	barProgress,
	lblTime,
	lblTitle,
	lblAlbum,
	lblSongName,
	pauseOverlay,
	imgCover,
	lnkCover,
	symbLove,
	player,
	progressTimer,
	fmDoc;
    var fm={
	init:function(){
	    this.running=true;
	    player= new AudioPlayer();
	    root.document.querySelectorAll('.player-wrap')[0].innerHTML=ui;
	    fmDoc=$('.player-wrap > svg'),
	    btnPause=fmDoc.find('#btn-pause'),
	    btnLove=fmDoc.find('#btn-like'),
	    btnBan=fmDoc.find('#btn-del'),
	    btnSkip=fmDoc.find('#btn-next'),
	    symbLove=fmDoc.find('#symb-like'),
	    lnkCover=fmDoc.find('#cover'),
	    imgCover=fmDoc.find('#cover-img'),
	    pauseOverlay=fmDoc.find('#pause-overlay'),
	    barProgress=fmDoc.find('#bar-progress'),
	    lblTitle=fmDoc.find('#lbl-title'),
	    lblSongName=fmDoc.find('#songname'),
	    lblTime=fmDoc.find('#time'),
	    lblAlbum=fmDoc.find('#lbl-album');
	    
	    //behavior
	    [btnPause,
	     btnLove,
	     btnBan,
	     btnSkip,
	     pauseOverlay,
	     lnkCover].forEach(function(e,i){
		 e[0].onmouseenter=fadeOut;
		 e[0].onmouseout=fadeIn;
	     });
	    
	    lnkCover[0].onmouseout=hide;
	    //event
	    [btnPause,
	     btnLove,
	     btnBan,
	     btnSkip,
	     lnkCover,
	     pauseOverlay].map(
		 function(e,i){
		     e[0].onmouseup=[fm.pause,
				     fm.love,
				     fm.ban,
				     fm.skip,
				     fm.detail,
				     fm.pause][i];
		 }
	     );
	    player.on('playing',function(){
		var song=player.currentSong;
		imgCover.attr('xlink:href',song.picture);
		if(song.like)
		    symbLove.attr('fill','#ee0000');
		else
		    symbLove.attr('fill','#000000');
		lblTitle.text(song.artist);
		lblAlbum.text("<"+song.albumtitle+"> "+song.pubtime);
		lblSongName.text(song.title);
		progressTimer=root.setInterval(fm.onProgress,1000);
	    });
	    player.channel=RED_HEART_CHANNEL;
	    player.init();
	},
	pause:function(){
	    if(fm.running){
		fm.running=false;
		pauseOverlay.css('display','');
	    }else{
		fm.running=true;
		pauseOverlay.css('display','none');
	    }
	    root.clearInterval(fm.onProgress);
	    player.pause();
	},
	love:function(){
	    player.currentSong.like=!player.currentSong.like;
	    if(player.currentSong.like)
		    symbLove.attr('fill','#ee0000');
		else
		    symbLove.attr('fill','#000000');
	    //broadcast like
	},
	ban:function(){
	    
	},
	skip:function(){
	    root.clearInterval(fm.onProgress);
	    player.skip();
	},
	detail:function(){
	    root.open("http://douban.com/"+player.currentSong.album,'_blank');
	},
	switch:function(){

	},
	onProgress:function(){
	    var leftTime=player.delegate.duration-player.delegate.currentTime;
	    var date=new Date(leftTime*1000);
	    var timeFormat=date.getUTCMinutes()+":"+date.getSeconds();
	    var ratio=player.delegate.currentTime/player.delegate.duration;
	    if(!isNaN(leftTime))
	       lblTime.text(timeFormat);
	    if(!isNaN(ratio)){		
		barProgress[0].setAttribute('width',$('#bar-progress-bg')[0].getAttribute('width')*ratio);

	    }
	    
	}
    };


    //audio play stuff
    var PLAYOUT = "p";
    var PLAYED = "e";
    var LIKE = "r";
    var BAN = "b";
    var UNLIKE = "u";
    var NEW = "n";
    var SKIP = "s";
    var SUBTYPE_AD = "T";
    var ADTYPE_AUDIO = "3";
    var ADTYPE_VIDEO = "4";
    var START = "start";
    var NEW_LIST = "nl";
    var LIST_ZERO_ERROR = "lze";
    var LIST_PARSE_ERROR = "lpe";
    var LIST_SERVER_ERROR = "lse";
    var LIST_SERVER_WARN = "lsw";
    var LIST_IOERROR = "lioe";
    var CHANNEL_OFFLINE_ERROR = "2";
    var PERSONAL_CHANNEL = "0";
    var RED_HEART_CHANNEL = "-3";
    var PERSONAL_HIGH_CHANNEL = "-4";
    var PERSONAL_EASY_CHANNEL = "-5";
    var RED_HEART_HIGH_CHANNEL = "-6";
    var RED_HEART_EASY_CHANNEL = "-7";
    var RED_HEART_TAGS_CHANNEL = "-8";
    var PERSONAL_TAGS_CHANNEL = "-9";
    var RAND = "Pr";
    var SESSION = "Ps";

    function AudioPlayer(){
	var that=this;	
	this.delegate=new Audio();
	this.LISTURL="/j/mine/playlist";
	this.requesturl="";
	this.playlist=[];
	this.channel='';
	this.tags="";
	this.context="";
	this.artistid="";
	this.currentSong=null;
	this.delegate.addEventListener('ended',function(){
	    that.skip();
	});
    }
    
    AudioPlayer.prototype.on=function(event,handler){
	this.delegate.addEventListener(event,handler);
	return this;
    };
    
    AudioPlayer.prototype.un=function(event,handler){
	this.delegate.removeEventListener(event,handler);
	return this;
    };
    
    AudioPlayer.prototype.init=function(){
	root.document.body.appendChild(this.delegate);
	this.load(NEW);
    };
    
    AudioPlayer.prototype.setChannel=function(channel,tags,artistId){
	this.channel=channel;
	this.tags=tags;
	this.artistid=artistId;
    };

    AudioPlayer.prototype.load=function(type){
	this.playlist=[];
	var that=this;
	var sid=this.currentSong ? this.currentSong.sid : "";
	this.requesturl=
	    this.LISTURL+
	    "?type="+type+
	    "&sid="+sid+
	    "&pt="+(this.delegate.currentTime).toFixed(1)+
	    "&channel="+this.channel;
	var contexts=[];
	if (this.channel === RED_HEART_TAGS_CHANNEL || this.channel === PERSONAL_TAGS_CHANNEL || this.channel === PERSONAL_CHANNEL)
        {
                contexts.push("tags:" + this.tags);
        }
	if (this.channel === PERSONAL_CHANNEL && this.artistid !== "")
        {
                contexts.push("artist_id:" + this.artistid);
        }
	if (this.context !== "")
        {
            contexts.push(this.context);
            this.context = "";
        }
	if(contexts.length){
	    this.requesturl+="&context="+contexts.join("|");
	}
	if(this.currentSong){
	    this.requesturl+="&pb="+this.currentSong.kbps;//dont be eval
	}
	this.requesturl=Format.signUrl(this.requesturl);
	console.log("loading",this.requsturl);
	$.getJSON(this.requesturl,function(data){
	    var i=0,song;
	    while(i < data.song.length){
		song = data.song[i];
                that.playlist.push({sid:song["sid"], url:song["url"], ssid:song["ssid"], artist:song["artist"] || "", title:song["title"], picture:song["picture"].replace("/mpic/", "/lpic/").replace("//otho.", "//img3."), album:song["album"], albumtitle:song["albumtitle"], like:song["like"] == "1", subtype:song["subtype"], adtype:song["adtype"], len:(song["length"]), kbps:song["kbps"] || "", monitor_url:song["monitor_url"] || "", pubtime:song["public_time"] || "", extrainfo:song["alg_info"] || ""});
		i++;
	    }
	    that.skip();
	});
    };

    AudioPlayer.prototype.play=function(){
	this.currentSong=this.playlist.shift();
	this.delegate.src=this.currentSong.url;
	this.delegate.play();
    };

    AudioPlayer.prototype.pause=function(){
	if(this.delegate.paused)
	    this.delegate.play();
	else
	    this.delegate.pause();
    };

    AudioPlayer.prototype.isPlaying=function(){
	return !this.delegate.paused && !this.delegate.ended;
    };

    AudioPlayer.prototype.skip=function(){
	if(this.playlist.length<1)
	    this.load(PLAYOUT);
	else
	    this.play();
	console.log('skip');
    };

    var Format={
	signUrl:function(url){
	    return url + (url.indexOf("?") == -1 ? ("?") : ("&")) + "r=" + Format.md5(url + "fr0d0").substr(-10);
	}
    };
    //https://github.com/blueimp/JavaScript-MD5
    (function ($) {
	'use strict';

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
		msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */
	function binl_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << (len % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var i, olda, oldb, oldc, oldd,
		a = 1732584193,
		b = -271733879,
		c = -1732584194,
		d = 271733878;

            for (i = 0; i < x.length; i += 16) {
		olda = a;
		oldb = b;
		oldc = c;
		oldd = d;

		a = md5_ff(a, b, c, d, x[i], 7, -680876936);
		d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
		b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

		a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = md5_gg(b, c, d, a, x[i], 20, -373897302);
		a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

		a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
		d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = md5_hh(d, a, b, c, x[i], 11, -358537222);
		c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

		a = md5_ii(a, b, c, d, x[i], 6, -198630844);
		d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
            }
            return [a, b, c, d];
	}

	/*
	 * Convert an array of little-endian words to a string
	 */
	function binl2rstr(input) {
            var i,
		output = '';
            for (i = 0; i < input.length * 32; i += 8) {
		output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            }
            return output;
	}

	/*
	 * Convert a raw string to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binl(input) {
            var i,
		output = [];
            output[(input.length >> 2) - 1] = undefined;
            for (i = 0; i < output.length; i += 1) {
		output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
		output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            }
            return output;
	}

	/*
	 * Calculate the MD5 of a raw string
	 */
	function rstr_md5(s) {
            return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	 * Calculate the HMAC-MD5, of a key and some data (raw strings)
	 */
	function rstr_hmac_md5(key, data) {
            var i,
		bkey = rstr2binl(key),
		ipad = [],
		opad = [],
		hash;
            ipad[15] = opad[15] = undefined;
            if (bkey.length > 16) {
		bkey = binl_md5(bkey, key.length * 8);
            }
            for (i = 0; i < 16; i += 1) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	 * Convert a raw string to a hex string
	 */
	function rstr2hex(input) {
            var hex_tab = '0123456789abcdef',
		output = '',
		x,
		i;
            for (i = 0; i < input.length; i += 1) {
		x = input.charCodeAt(i);
		output += hex_tab.charAt((x >>> 4) & 0x0F) +
                    hex_tab.charAt(x & 0x0F);
            }
            return output;
	}

	/*
	 * Encode a string as utf-8
	 */
	function str2rstr_utf8(input) {
            return unescape(encodeURIComponent(input));
	}

	/*
	 * Take string arguments and return either raw or hex encoded strings
	 */
	function raw_md5(s) {
            return rstr_md5(str2rstr_utf8(s));
	}
	function hex_md5(s) {
            return rstr2hex(raw_md5(s));
	}
	function raw_hmac_md5(k, d) {
            return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	}
	function hex_hmac_md5(k, d) {
            return rstr2hex(raw_hmac_md5(k, d));
	}

	function md5(string, key, raw) {
            if (!key) {
		if (!raw) {
                    return hex_md5(string);
		}
		return raw_md5(string);
            }
            if (!raw) {
		return hex_hmac_md5(key, string);
            }
            return raw_hmac_md5(key, string);
	}

	if (typeof define === 'function' && define.amd) {
            define(function () {
		return md5;
            });
	} else {
            $.md5 = md5;
	}
    }(Format));
    

    function fadeIn(e){
	e.currentTarget.setAttribute('opacity',1);
    }
    function fadeOut(e){
	e.currentTarget.setAttribute('opacity',.5);
    }
    function hide(e){
	e.currentTarget.setAttribute('opacity',0);
    }
    fm.init();
    
})(jQuery/*douban enable jQuery by default*/,'<svg width="510" height="245" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <defs>\
	<pattern patternUnits="userSpaceOnUse" x="0" y="0" width="72" height="13" patternTransform="matrix(1,0,0,1,90,117)" id="view-album">\
	  <rect id="svg_1" x="0" y="0" width="72" height="13" fill="rgba(0,0,0,0)"/>\
	  <g id="svg_2">\
	    <image id="svg_3" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAANCAYAAAAKeCiYAAAFLklEQVR4nI2Xxy90bRjGebUEUcZanUisEIalPthakFgRJSN2oo2yFAy22tjrS90oK9Fmr47Yqv/CN7+TXJPHeb3JdyUn5znPuZ+7l3Oi/vz5E2UiOjr6xzomJuafz3boXW5urtO+9xvv/8PzN3o7b+2ZfNLS0hz2ffOsifz8fOe/3v1ggLMgPDw8DNgVMYUPDQ15uYS5uTnfwcFBYH5+3r+xsbE1ODjoFT/dY2NjrXVzc3PL5OSkD/7aM2VrLxiG3jU0NLgHBga8IyMjltzh4WFvb2+vx7SB/aamphZ44Jyjo6NAVlZWJFCmPdILmxxhXFxcBJOTkx2mjZE1gmCm6+TkJPD19fV9fHwcEPb29qx9hMTFxUW5wqitrXXX1NS4Uayzs9NSFuNEI7A3PT3tw+nwf319DT09PYXgu7u7G9C+6HHe1dVV8P7+PoRMzvb391uBqKqqciMXcM40BB7l5eWWXlxdXV2e7e3tLWirq6vdlZWVbtNJHx8f35yBz/n5eeDs7CxAkC8vL4PIsjvV8mp2drZzYWHBj4Kzs7M+mNozDOAwHAjz7zC463l/f99al5WVuf4SEga8MzIyHOJnZpcwMzPjI+31TObc3NwEFUQ5Vefq6+vdS0tL/ra2Ng/ZRQbrTgA5L6NlC/xwOGcrKircrOvq6tyjo6NeAhLJIBmNx4kqTsJAKTo1NeXLyclxipboIFwK3N3dhUh/FOEZ8MwFfXd3t4c96KF5fn4OqUSh5+rr6/P29PR4JINIFhUVudApPT3dQQaQrchmrexNTEx0QL++vr4Ff4ySQ3iWLvC39zn0kE4qXYCjf7QIlMCbpDKCFQ08ijIIwGH0FpxHZJW29InW1tYWegRnucsQgJCSkhIXe/Db3NzcIjq8Yw9IZnFxsQuFCgsLXZQZvDAAmeiDDgoMa/YKCgqcahEYiDw5k2xgDeAVZcPj42PIzDIFdXFx0Y/DIoTOMCgDXtJk5UlSjT0YQWdOJuAJ4+3t7ZtoU3K6A9aKgEqMcqC85Fwco55Co1Qm08RxwPX1dZBeReAwVg5CJ2RwDnr6X0sYijrOghYduFPyrBMSEn5MO4Kr4HDJoSpP9IlkHQd5sby87Fe5aGqQiqKRETRp0joUhpmiiggG2CNGJuF4KSB8fn5+yzjJUSZAxzPK0xuVEay5845LtKY88TGDJOeA9/f3SJNWTwO3t7dBZeMPRjJQpaLoEklzKhExmNFoeafmRlortYmanb+MMRUmIL4wRKumm5eX50QX5BB9+BIoDQPWyiBABsjJmsDKJEAQTD3I2NTUVAe6UkGcVZ9NSUmx9v+aYDiIEkCJnZ0da6wjhCllRqaxsdFN47Qro0tTDKfap58/jPb2dg/CyQJ9Hpi0lPbExISPcmdAcJZswQjR0Me4+N7hWZ8brDX+TbBnNmnO6tuK7CPY9Fho2F9bW9si462A0VvIAkadgAd1wUA9wz6yNQlUMupfZomZZ4jO+Pi49+XlJXR6ehrQuP8NMoApSOAo6dXV1S2M5ezKyoqfTMMos8QeHh6ssh8bG4tMSfVRwOcH51nDn54nPXEKWU0CMLiSkpIcVnRgBvAsh9QMzW8IKWB+szBJcKIaLoryTOTj4+MjdGY/EDo6Ojw0YWWBfQzDC70k02yaGM178aUnMo1Z4ziVusofo1XalFJmZqaTZ5yF41XKrEtLS12Sb7YWCxhl7xN2/PZvpf8p+wcfe+ZnvSA684PR/CczZZs8tc/oV5mb+/qSFyTbbov9/9PUIYz/AHow3faA0qw/AAAAAElFTkSuQmCC" height="13" width="72"/> \
	  </g>\
	</pattern>\
	<pattern patternUnits="userSpaceOnUse" x="0" y="0" width="26" height="26" id="pause">\
	  <rect id="svg_7" x="0" y="0" width="26" height="26" fill="rgba(0,0,0,0)"/>\
	  <g id="svg_8">\
	    <image id="svg_9" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAIAAAAmKNuZAAAAKklEQVR42mOYe+0oFRHDqHEjzbj/ MEBQcNS4UeNGjSPLuNECatQ4GhoHAL/aDwWLXToQAAAAAElFTkSuQmCC" height="26" width="26"/>\
	  </g>\
	</pattern>\
      </defs>\
      <g>\
	<title>douban fm</title>\
	<g>\
	  <!--album-->\
	  <g >\
            <image id="cover-img" x="0" y="0" width="245" height="245" xlink:href="" />\
	  </g>\
	  <g id="cover" opacity="0">\
	    <g id="svg_13" fill-rule="evenodd">\
	      <path id="svg_14" d="m186.95,137l0,-26l-122.05,0l0,26l122.05,0" fill="rgba(60,60,60,0.5019607843137255)" stroke-width="0" stroke-dashoffset="0"/>\
	    </g>\
	    <g id="svg_15" transform="matrix(1.1395263671875,0,0,5.6976776123046875,0,0)" opacity="0">\
	      <g id="svg_16"/>\
	      <g id="svg_17" transform="matrix(10.75,0,0,2.149993896484375,0,0)" fill-rule="evenodd">\
		<path id="svg_18" d="m20,0l-20,0l0,20l20,0l0,-20" fill="rgba(255,255,255,1)" stroke-width="0" stroke-dashoffset="0"/>\
	      </g>\
	    </g>\
	    <g id="svg_19" fill-rule="evenodd">\
	      <path id="svg_20" d="m162,130l0,-13l-72,0l0,13l72,0" fill="url(#view-album)" stroke-width="0" stroke-dashoffset="0"/>\
	    </g>\
	  </g>\
	</g>\
	<g id="svg_21" style="display:none">\
	  <g id="svg_22">\
	    <path id="svg_23" d="m0,0l245,0l0,245l-245,0l0,-245z" fill="rgba(0,0,0,1)" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	</g>\
	<g id="album-right" transform="matrix(1, 0, 0, 1, 290, 70)">\
	  <!--song right-->\
	  <text font-size="12px" id="lbl-album" transform="matrix(1,0,0,1,-2,-2)">song info</text>\
	</g>\
	<g id="svg_24" transform="matrix(1, 0, 0, 1, 266, 26)">\
	  <!--title-->\
	  <text font-size="23px" id="lbl-title" transform="matrix(1,0,0,1,20,20)">title</text>​​​​​</g>\
	<g id="btn-like" transform="matrix(1, 0, 0, 1, 340, 190)">\
	  <!--like-->\
	  <g id="svg_44" fill-rule="evenodd">\
	    <path id="symb-like" d="m24.2,1.8l0,0q-2.05,-1.8 -5.15,-1.8q-2.1,0 -3.7,1.15l-2.3,2.25l-2.3,-2.25q-1.65,-1.15 -3.75,-1.15q-3.05,0 -5.1,1.8q-2.75,2.4 -2.7,7.25q0.05,4 4.3,7.85l4.4,3.6l5.15,4.5q3.55,-3.4 9.5,-8.1q4.3,-3.85 4.35,-7.85q0.05,-4.85 -2.7,-7.25" fill="rgba(50,50,50,1)" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	</g>\
	<g id="btn-del" transform="matrix(1,0,0,1,402.95,187)">\
	  <!--delete-->\
	  <g id="svg_46" fill-rule="evenodd">\
	    <path id="svg_47" d="m22,4.9l0,0l-5.65,0l0,-2.25q0,-1.05 -0.75,-1.8q-0.8,-0.75 -1.8,-0.75l-5.6,0q-1,0 -1.8,0.75q-0.75,0.75 -0.75,1.8l0,2.25l-5.65,0l0,3.1l22,0l0,-3.1m-8.05,0l0,0l-5.9,0l0,-2.25q0,-0.4 0.4,-0.4l5.1,0q0.4,0 0.4,0.4l0,2.25m-6.9,7.65l0,0q0.25,-0.3 0.65,-0.3q0.4,0 0.7,0.3l0.3,0.7l0,9.9l-0.3,0.75l-0.7,0.3l-0.65,-0.3q-0.3,-0.3 -0.3,-0.75l-0.05,0l0,-9.9l0.05,0q0,-0.4 0.3,-0.7m6.2,0.7l0,0q0,-0.4 0.3,-0.7q0.3,-0.3 0.7,-0.3q0.4,0 0.7,0.3l0.35,0.7l0,9.9l-0.35,0.75q-0.3,0.3 -0.7,0.3l-0.7,-0.3q-0.3,-0.3 -0.3,-0.75l0,-9.9m6.75,-4.25l0,0l-18,0l0,15.65q0,1.4 0.95,2.35q0.95,1 2.3,1l11.45,0q1.35,0 2.3,-1q1,-0.95 1,-2.35l0,-15.65" fill="rgba(50,50,50,1)" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	</g>\
	<g id="btn-next" transform="matrix(1,0,0,1,457,194)">\
	  <!--next-->\
	  <g id="svg_48" fill-rule="evenodd">\
	    <path id="svg_49" d="m0.85,-0.05l-0.45,-0.05q-0.15,0.1 -0.15,0.4l0,17.15q0,0.3 0.15,0.4l0.45,-0.05l14.9,-8.6q0.55,-0.35 0,-0.65l-14.9,-8.6" fill="rgba(51,51,51,1)" stroke-width="0" stroke-dashoffset="0"/>\
	    <path id="svg_50" d="m14.8,-0.05l-0.4,-0.05q-0.15,0.1 -0.15,0.4l0,17.15q0,0.3 0.15,0.4l0.4,-0.05l14.75,-8.6q0.5,-0.35 0,-0.65l-14.75,-8.6" fill="rgba(51,51,51,1)" stroke-width="0" stroke-dashoffset="0"/>\
	    <path id="svg_51" d="m31.25,17.25l0,-16.75l-2.95,0l0,16.75l2.95,0" fill="rgba(51,51,51,1)" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	</g>\
	<g id="btn-pause" transform="matrix(1, 0, 0, 1, 472, 0)">\
	  <!--pause-->\
	  <g id="svg_52" fill-rule="evenodd">\
	    <path id="svg_53" d="m0,0l0,26l26,0l0,-26l-26,0" fill="url(#pause)" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	</g>\
	<rect id="bar-progress-bg" height="1" width="216.99999" y="106" x="270" stroke-width="5" stroke="#eae1e1" fill="#FF0000"/>\
	<rect id="bar-progress" height="1" width="216.99999" y="106" x="270" stroke-width="5" stroke="#7a7373" fill="#FF0000"/>\
	<text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="17" id="time" y="130.39999" x="289" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#000000">12:32</text>\
	<text font-weight="normal" xml:space="preserve" text-anchor="" font-family="serif" font-size="15" id="songname" y="95.39999" x="265" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#000000">hello</text>\
\
	<g style="display:none" id="pause-overlay">\
	  <rect opacity="0.5" id="svg_61" height="242" width="266" y="0.39999" x="244" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#141313" fill="#110f0f"/>\
	  <text xml:space="preserve" pointer-events="none" text-anchor="middle" font-family="serif" font-size="17" id="svg_62" y="120.39999" x="373" font-weight="bold" stroke-width="0" stroke="#7a7373" fill="#f4e8e8" >play</text>\
	</g>\
      </g>\
    </svg>');
