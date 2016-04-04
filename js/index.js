/**
 * 页面入口函数，主要逻辑处理，控制各部分组件的初始化和显示 
 */
(function(_){
    "use strict";
    // 公用选择器方法 
    var $ = function( selector ){
        if(selector.indexOf('#') != -1){
            return document.querySelector(selector);
        }else{
            return document.querySelectorAll(selector);            
        }
    }
    // 定时器设置与初始化
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
    applyHotTimer();
    // 轮播组件与轮播导航按钮初始化 
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
    // 轮播组件初始化
    var banner = new Banner({
        //视口容器
        container: bannerContainer,
        // 图片列表
        images: [
        {src:'./images/banner1.jpg',href:'http://open.163.com/'}, 
        {src:'./images/banner2.jpg',href:'http://study.163.com/'}, 
        {src:'./images/banner3.jpg',href:'http://www.icourse163.org/'}        
        ],
        // 鼠标移入移出事件
        onMouseOver: function(){
            clearTimeout(bannerInterval);
        },
        onMouseOut: function(){
            applyBannerTimer();
        }
    });
    // 接收nav事件，设置导航按钮的active状态
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
    // 轮播组件初始页
    banner.nav(0);   
    // 页面中部右侧热门课程列表初始化
    var hotContainer =  $('.m-rank-wrap')[0];
    var hotList = new HotList({
        container:hotContainer,
    });
    // tab按钮初始化
    var tabControl = $('#tabControl');
    var tabContent = $('#tabContent');
    var courseTab = new Tab({
        control:tabControl,
        content:tabContent,
        dft:0,
    });
    // tab内容页初始化
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
    // 关注与登录框初始化
    var btnFavor = $('#btnFavor');
    var btnFavored = $('#btnFavored');
    var loginModal = new LoginModal();
    var lgCookie = 'loginSuc';
    var flCookie = 'followSuc';
    // 关注按钮状态初始化
    if(_.getCookie(flCookie)!=null){
        _.addClass(btnFavor ,'f-dn');
    }else{
        _.addClass(btnFavored ,'f-dn');
    }
    // 调用关注API
    var setFollow = function(){
        _.ajax({
            method:'get',
            url:'http://study.163.com/webDev/attention.htm',
            success:function(r){
                if (r != 1){
                    return;
                }
                // 设置关注cookie
                _.setCookie({
                    name:flCookie,
                    value:true
                });
                _.addClass(btnFavor,'f-dn');
                _.delClass(btnFavored,'f-dn');
            }
        });        
    };
    // 关注按钮点击事件
    _.addEvent(btnFavor,'click',function(){
        if(_.getCookie(lgCookie) == null){
            // 未登录情况下弹出登录框
            loginModal.show();
        } else{
            // 调用关注API
            setFollow();
        }       
    });
    // 监听登录成功事件
    loginModal.on('formSubmit', function(){
        // 设置登录cookie
        _.setCookie({
            name:lgCookie,
            value:true
        });
        setFollow();
    });
    // 取消关注按钮点击事件
    var btnCancel = btnFavored.getElementsByTagName('a')[0];
    _.addEvent(btnCancel,'click',function(){
        // 清除掉已关注的cookie 
        _.unsetCookie({
            name:flCookie
        });
        _.addClass(btnFavored,'f-dn');
        _.delClass(btnFavor,'f-dn');
    });
    // 顶部提示框初始化
    var btnNoShow = $('.m-note .u-noshow')[0];
    var note = $('.m-note-wrap')[0];
    var nShowCookie = 'noShow';
    if(_.getCookie(nShowCookie)!=null){
        _.addClass(note,'f-dn');
    }
    // ‘不再提示’点击事件处理
    _.addEvent(btnNoShow,'click',function(){ 
        _.setCookie({
            name:nShowCookie,
            value:true
        });
        _.addClass(note,'f-dn');
    });
    // 弹出视频框初始化
    var videoModal = new Modal();
    var videoTrigger = $('.u-video img')[0];
    videoTrigger.onclick = function(e){
        var videoCtn = '<div class="m-videoWrap"><p class="f-fbold">请观看下面的视频：</p><video poster="./images/poster.jpg"'+
                'src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4"'+
                'width="890" height="538" controls="controls"><div style="width:890px;height:538px;margin:0 auto;">您的浏览器不支持视频QAQ</div></video></div>';
        videoModal.show(videoCtn);                 
    }
})(util);
