(function(ui){
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
  symbLove,
  fmDoc;
  var fm={
    init:function(){
      this.running=true;
      root.document.querySelectorAll('.player-wrap')[0].innerHTML=ui;
      fmDoc=$('fm'),
      btnPause=$.call(fmDoc,'btn-pause'),
      btnLove=$.call(fmDoc,'btn-like'),
      btnBan=$.call(fmDoc,'btn-del'),
      btnSkip=$.call(fmDoc,'btn-next'),
      symbLove=$.call(fmDoc,'symb-like');
      imgCover=$.call(fmDoc,'cover'),
      pauseOverlay=$.call(fmDoc,'pause-overlay'),
      barProgress=$.call(fmDoc,'bar-progress'),
      lblTitle=$.call(fmDoc,'lbl-title'),
      lblSongName=$.call(fmDoc,'songname'),
      lblTime=$.call(fmDoc,'time'),
      lblAlbum=$.call(fmDoc,'lbl-album');
      //behavior
      [btnPause,
       btnLove,
       btnBan,
       btnSkip,
       pauseOverlay,
       imgCover].forEach(function(e,i){
	 e.onmouseenter=fadeOut;
	 e.onmouseout=fadeIn;
       });
      imgCover.onmouseout=hide;
      //event
      btnPause.onmouseup=this.pause;
      btnLove.onmouseup=this.love;
      btnBan.onmouseup=this.ban;
      btnSkip.onmouseup=this.skip;
      imgCover.onmouseup=this.showDetail;
      pauseOverlay.onmouseup=this.pause;
    },
    pause:function(){
      if(fm.running){
	fm.running=false;
	pauseOverlay.style.display="";
      }else{
	fm.running=true;
	pauseOverlay.style.display="none";
      }
    },
    love:function(){
      console.log('love');
      symbLove.setAttribute('fill','#ee0000');
    },
    ban:function(){

    },
    skip:function(){

    },
    detail:function(){

    },
    switch:function(){

    }
  };

  function audioPlayer(){
    
  }
  function $(id){
    return document.getElementById(id);
  }
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
  
})('<svg width="510" height="245" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
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
	<g id="cover" opacity="0">\
	  <!--album-->\
	  <g id="svg_10">\
	    <path id="svg_11" d="m0,0l245,0l0,245l-245,0l0,-245z" fill="rgba(0,0,0,1)" fill-opacity="0.2" stroke-width="0" stroke-dashoffset="0"/>\
	  </g>\
	  <g id="svg_12">\
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
	<g id="album-right" transform="matrix(1, 0, 0, 1, 300, 70)">\
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
	<rect id="svg_57" height="1" width="216.99999" y="106" x="270" stroke-width="5" stroke="#eae1e1" fill="#FF0000"/>\
	<rect id="bar-progress" height="1" width="216.99999" y="106" x="270" stroke-width="5" stroke="#7a7373" fill="#FF0000"/>\
	<text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="17" id="time" y="130.39999" x="289" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#000000">12:32</text>\
	<text font-weight="normal" xml:space="preserve" text-anchor="middle" font-family="serif" font-size="15" id="songname" y="95.39999" x="291" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#000000">hello</text>\
\
	<g style="display:none" id="pause-overlay">\
	  <rect opacity="0.5" id="svg_61" height="242" width="266" y="0.39999" x="244" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#141313" fill="#110f0f"/>\
	  <text xml:space="preserve" pointer-events="none" text-anchor="middle" font-family="serif" font-size="17" id="svg_62" y="120.39999" x="373" font-weight="bold" stroke-width="0" stroke="#7a7373" fill="#f4e8e8" >play</text>\
	</g>\
      </g>\
    </svg>');
