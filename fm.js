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
  function fm(){
    this.running=false;
  }
  fm.prototype.init=function(){
    this.running=true;
    fmDoc=$('fm'),
    btnPause=$.call(fmDoc,'btn-pause'),
    btnLove=$.call(fmDoc,'btn-like'),
    btnBan=$.call(fmDoc,'btn-del'),
    btnSkip=$.call(fmDoc,'btn-next'),
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
    pauseOverlay.onmouseup=this.resume;
  };
  fm.prototype.pause=function(){
    pauseOverlay.style.display="";
  };
  fm.prototype.resume=function(){
    pauseOverlay.style.display="none";
  };
  fm.prototype.love=function(){

  };
  fm.prototype.ban=function(){

  };
  fm.prototype.skip=function(){

  };
  fm.showDetail=function(){

  };
  fm.switch=function(){

  }

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
  root.onload=function(){new fm().init();};
})();
