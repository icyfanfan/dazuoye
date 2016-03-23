(function(_){
    // 公用方法与兼容实现 
    var $ = function( selector ){
        if(selector.indexOf('#') != -1){
            return document.querySelector(selector);
        }else{
            return [].slice.call(document.querySelectorAll(selector));            
        }
    }
    // 定时器
    var silderInterval,hotInterval;
    var applySliderTimer = function(){        
        silderInterval = setTimeout(function(){         
            slider.next();   
            applySliderTimer();            
        },5000);                
    };
    var applyHotTimer = function(){
        hotInterval = setTimeout(function(){
            hotList.next();
            applyHotTimer();
        },5000);
    };
    applySliderTimer();
    hotInterval = applyHotTimer();
    /* silder相关初始化与事件绑定注册 */
    var sliderContainer =  $('.m-sld-wrap')[0];
    var silderCursors = $('.u-pointer i');
    silderCursors.forEach(function(cursor, index){
        _.addEvent(cursor,'click', function(){
            slider.nav(index);
        });
    });
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
            clearTimeout(silderInterval);
         },
         onMouseOut: function(){
            applySliderTimer();
         }
    });
    // 接收事件
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
    
    // 热门课程
    var hotContainer =  $('.m-rank-wrap')[0];
    var hotList = new HotList({
        container:hotContainer,
    }) 

    // tab页
    var tabControl = $('#tabControl');
    var tabContent = $('#tabContent');
    var courseTab = new Tab({
        control:tabControl,
        content:tabContent,
        default:0,
    });
    // 登录框
    
    // 弹出视频
    var videoModal = new Modal();
    var videoTrigger = $('.u-video img')[0];
    videoTrigger.onclick = function(e){
        e.stopPropagation();
        var ctn = '<video src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" width="890" height="568" controls="controls"></video>';
        videoModal.show(ctn);                 
        // TODO 弹出框control的样式
    }
    // debugger;
})(util);
