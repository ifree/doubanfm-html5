(function(){
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
  fmDoc;
  var fm={
    init:function(){
      fmDoc=$.call(root.document,'fm'),
      btnPause=$.call(fmDoc,'btn-pause'),
      btnLove=$.call(fmDoc,'btn-like'),
      btnBan=$.call(fmDoc,'btn-del'),
      btnSkip=$.call(fmDoc,'btn-next'),
      imgCover=$.call(fmDoc,'cover'),
      lblTitle=$.call(fmDoc,'lbl-title'),
      lblAlbum=$.call(fmDoc,'lbl-album');

      //behavior
      [btnPause,
       btnLove,
       btnBan,
       btnSkip,
       imgCover].forEach(function(e,i){
	 e.onmouseenter=fadeOut;
	 e.onmouseout=fadeIn;
       });
      imgCover.onmouseout=hide;
      //event
      btnPause.onmouseup=fm.pause;
      btnLove.onmouseup=fm.love;
      btnBan.onmouseup=fm.ban;
      btnSkip.onmouseup=fm.skip;
      imgCover.onmouseup=fm.showDetail;
      
    },
    pause:function(){
      console.log('pause');      
      console.log(btnPause);
    },
    love:function(){
      console.log('love');
    },
    ban:function(){
      console.log('ban');
    },
    skip:function(){
      console.log('skip');
    },
    showDetail:function()
    {
      console.log('show detail');
    },
    switch:function(){
      
    },
    //set kbps? no, no harm to douban
  };
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
  root.onload=fm.init;
})();
