(function($){
  var touch={}, touchTimeout;
  
  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }
  
  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now-(touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
    }).bind('touchmove', function(e){ 
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY; 
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0) {
          if ( Math.abs(touch.y2 - touch.y1) <= 50)
         {
                  if (touch.x2 < touch.x1)
                  {
                      (touch.x1-touch.x2)>30 && $(touch.target).trigger('swipeLeft');
                      touch.x1 = touch.x2 = touch.last = 0;
                  } 
                  else 
                  {
                      (touch.x2-touch.x1)>30 && $(touch.target).trigger('swipeRight');
                      touch.x1 = touch.x2 = touch.last = 0;
                  }
              }
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch={} });
  });
  
  ['swipeLeft', 'swipeRight', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
