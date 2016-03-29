(function(_){
    // 公用方法与兼容实现 
    var $ = function( selector ){
        if(selector.indexOf('#') != -1){
            return document.querySelector(selector);
        }else{
            // return [].slice.call(document.querySelectorAll(selector));            
            return document.querySelectorAll(selector);            
        }
    }
    // 定时器
    var bannerInterval,hotInterval;
    var applyBannerTimer = function(){        
        bannerInterval = setTimeout(function(){         
            banner.nxt();   
            applyBannerTimer();            
        },5000);                
    };
    var applyHotTimer = function(){
        hotInterval = setTimeout(function(){
            hotList.nxt();
            applyHotTimer();
        },5000);
    };
    applyBannerTimer();
    hotInterval = applyHotTimer();
    // silder相关初始化与事件绑定注册 
    var bannerContainer =  $('.m-sld-wrap')[0];
    var bannerCursors = $('.u-pointer i');
    for(var i=0;i<bannerCursors.length;i++){
        
        (function(){
            var j = i;
            var cursor = bannerCursors[j];
            _.addEvent(cursor,'click', function(){
                banner.nav(j);
            });  
        })();
     
    }
   
    var banner = new Banner({
        //视口容器
        container: bannerContainer,
        // 图片列表
        images: [
        {src:'./images/banner1.jpg',href:'http://open.163.com/'}, 
        {src:'./images/banner2.jpg',href:'http://study.163.com/'}, 
        {src:'./images/banner3.jpg',href:'http://www.icourse163.org/'}        
        ],
        onMouseOver: function(){
            clearTimeout(bannerInterval);
        },
        onMouseOut: function(){
            applyBannerTimer();
        }
    });
    // 接收事件
    banner.on('nav', function(ev){
        var pageIndex = ev.pageIndex;
        for(var i=0;i<bannerCursors.length;i++){
            var cursor = bannerCursors[i];
            if(i === pageIndex ){
                cursor.className = 'z-active';
            }else{
                cursor.className = '';
            }
        }
    });
    // 初始
    banner.nav(0);    
    // 热门课程
    var hotContainer =  $('.m-rank-wrap')[0];
    var hotList = new HotList({
        container:hotContainer,
    });
    // tab按钮
    var tabControl = $('#tabControl');
    var tabContent = $('#tabContent');
    var courseTab = new Tab({
        control:tabControl,
        content:tabContent,
        dft:0,
    });
    // tab内容页
    // 产品课程页
    var designContent = $('#tabDesign');
    var designCourse = new CourseList({
        container:designContent,
        type:'10',
    });
    // 编程语言页
    var programContent = $('#tabProgram');
    var programCourse = new CourseList({
        container:programContent,
        type:'20',
    });

    // 登录框
    var btnFavor = $('#btnFavor');
    var btnFavored = $('#btnFavored');
    var loginModal = new LoginModal();
    _.addEvent(btnFavor,'click',function(){
        loginModal.show();
    });
    loginModal.on('formSubmit', function(){
        _.addClass(btnFavor,'f-dn');
        _.delClass(btnFavored,'f-dn');
    });
    var btnCancel = btnFavored.getElementsByTagName('a')[0];
    _.addEvent(btnCancel,'click',function(){
        // 清除掉登陆的cookie TODO

        _.addClass(btnFavored,'f-dn');
        _.delClass(btnFavor,'f-dn');
    });
    // 顶部提示框
    var btnNoShow = $('.m-note .u-noshow')[0];
    _.addEvent(btnNoShow,'click',function(){
        var note = $('.m-note-wrap')[0];
        _.addClass(note,'f-dn');
    })
    // 弹出视频
    var videoModal = new Modal();
    var videoTrigger = $('.u-video img')[0];
    videoTrigger.onclick = function(e){
        var ctn = '<div class="m-videoWrap"><p class="f-fbold">请观看下面的视频：</p><video poster="./images/poster.jpg"'+
                'src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4"'+
                'width="890" height="538" controls="controls"></video></div>';
        videoModal.show(ctn);                 
    }
    // debugger;
})(util);
