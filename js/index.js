(function(_){
    // 公用方法区   
    var $ = function( selector ){
        return [].slice.call(document.querySelectorAll(selector))
    }
    /* silder相关初始化与事件绑定注册 */
    var sliderContainer =  $('.m-sld-wrap')[0];
    var silderCursors = $('.u-pointer i');
    silderCursors.forEach(function(cursor, index){
        _.addEvent(cursor,'click', function(){
            slider.nav(index);
        });
    })

    var slider = new Slider({
        //视口容器
        container: sliderContainer,
        // 图片列表
        images: [
        {'src':'./images/banner1.jpg','href':'http://open.163.com/'}, 
        {'src':'./images/banner2.jpg','href':'http://study.163.com/'}, 
        {'src':'./images/banner3.jpg','href':'http://www.icourse163.org/'}        
        ],
        onMouseOver: function(){
            clearInterval(silderInterval);
         },
         onMouseOut: function(){
            silderInterval = applyTimer();
         }
    });

    slider.on('nav', function( ev ){
        var pageIndex = ev.pageIndex;

        silderCursors.forEach(function(cursor, index){
            if(index === pageIndex ){
                cursor.className = 'z-active';
            }else{
                cursor.className = '';
            }
        });
    });
    // 初始
    slider.nav(0);
    // 定时器
    var silderInterval;
    var applyTimer = function (){
        return setInterval(function(){
            slider.next();       
        },5000);
    }
    silderInterval = applyTimer();
    // 热门课程
 
})(util);
