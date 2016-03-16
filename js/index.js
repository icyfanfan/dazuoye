(function(_){
    var $ = function( selector ){
      return [].slice.call(document.querySelectorAll(selector))
    }
    var container =  $('.m-sld-wrap')[0];
    var cursors = $('.u-pointer i');
    cursors.forEach(function(cursor, index){
        cursor.addEventListener('click', function(){
            slider.nav(index);
        });
    })

    var slider = new Slider({
      //视口容器
      container: container,
      // 图片列表
      images: [
        "./images/banner1.jpg", 
        "./images/banner2.jpg", 
        "./images/banner3.jpg"        
      ],
    });

    slider.on('nav', function( ev ){
      var pageIndex = ev.pageIndex;

      cursors.forEach(function(cursor, index){
        if(index === pageIndex ){
          cursor.className = 'z-active';
        }else{
          cursor.className = '';
        }
      });
    });

    slider.nav(0);
    var interval = setInterval(5000,function(){})


})(util);
