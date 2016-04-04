/**
 * @author 黄笛
 * @description 供不支持@media的浏览器实现宽窄屏适配，通过修改内部样式的方式
 */
;(function(_){
    "use strict";

    var supportMediaQuery = window.matchMedia && window.matchMedia( "only all" ) !== null && window.matchMedia( "only all" ).matches;
    // 检测浏览器是否支持media query，如果支持则直接返回
    if(supportMediaQuery){
        return ;
    }
    // 初始化、缓存变量
    var doc = document,
        head = doc.head||document.getElementsByTagName('head')[0],
        links = head.getElementsByTagName('link'),
        threshold = 1205,
        // 配置宽窄屏样式，这里默认不支持mediaquery的浏览器同样不支持css3其他特性,将box-shadow替换为1px的border
        // 窄屏对应的样式
        maxWidthStyle = "html,body,.g-bd,.m-wrap .m-imgs,.m-sld-wrap{width:1364px;}\n"+
                        ".g-hd,.g-ft{min-width:1364px;}\n"+
                        ".m-note,.m-top,.m-wrap .m-nav1,.m-foot,.g-mn{width: 960px;}\n"+
                        ".g-mnc{width:736px;}\n"+
                        ".m-banner .u-banner img{margin-left:-120px;}\n"+
                        ".m-wrap .m-nav1 .m-ad{width:320px;}\n"+
                        ".m-wrap .m-imgs .i-first, .m-wrap .m-imgs .i-last{width:194px;}\n"+
                        ".m-foot .m-logo{margin-left:0;}\n"+
                        ".m-foot .m-about{margin-right:0;}\n"+
                        ".m-list1 li .m-hover{top:0px;left:245px;}\n"+
                        ".f-shadow,.f-shadow-big{border:1px solid #ecebeb;}",
        // 宽屏对应的样式
        minWidthStyle = "html,body,.g-bd{width:100%;height:100%;}\n"+
                        ".g-hd,.g-ft,.m-sld-wrap,.m-wrap .m-imgs{min-width:1616px;}\n"+
                        ".g-mn,.m-note,.m-top,.m-wrap .m-nav1,.m-foot {width: 1206px;}\n"+
                        ".g-mnc{width:980px;}\n"+
                        ".m-wrap .m-nav1 .m-ad{width:402px;}\n"+
                        ".m-wrap .m-imgs .i-first,.m-wrap .m-imgs .i-last{width:320px;}\n"+
                        ".m-list1 li .m-hover{top:-10px;left:-10px;}\n"+
                        ".m-banner .u-banner img{margin-left:0;}\n"+
                        ".m-foot .m-logo{margin-left:50px;}\n"+
                        ".m-foot .m-about{margin-right:209px;}\n"+
                        ".f-shadow,.f-shadow-big{border:1px solid #ecebeb;}";   
        // 创建行内样式标签并初始化
        matStyle = document.createElement('style'),
        matStyle.type = 'text/css';
        matStyle.setAttribute('media', 'screen');

    // 修改内部样式函数
    var changeStyleSheet = function(ss,css){
        // 重置内部样式标签内容
        if ( ss.styleSheet ){
            ss.styleSheet.cssText = '';
            ss.styleSheet.cssText = css;
        }
        else {
            if(ss.firstChild){
                ss.removeChild(ss.firstChild);
            }
            
            ss.appendChild( doc.createTextNode( css ) );
        }
    }
    // 页面初始化时，根据窗口宽度设置样式，将对应的样式以内部样式表的方式加入到head中
    var initStyle = function(){
        var currWidth = document.documentElement.clientWidth;
        
        if(currWidth<threshold){
            // 窄屏样式
            changeStyleSheet(matStyle,maxWidthStyle);
            matStyle.setAttribute('data-size', 'maxWidth');

            
        }else{
            // 宽屏样式            
            changeStyleSheet(matStyle,minWidthStyle);
            matStyle.setAttribute('data-size', 'minWidth');
            
        }
        head.appendChild(matStyle);
    };
    // 调用初始化时设置样式
    initStyle();
    // 当窗口resize时，根据当前宽度修改内部样式表
    _.addEvent(window, 'resize', function(){
        var currWidth = document.documentElement.clientWidth,
            styles = head.getElementsByTagName('style')[0];
        // 仅在小于或大于等于阈值时修改一次，避免频繁修改样式
        if(currWidth < threshold && (matStyle.getAttribute('data-size') != 'maxWidth')){
            changeStyleSheet(matStyle,maxWidthStyle);
            matStyle.setAttribute('data-size', 'maxWidth');            
        }
        if(currWidth >= threshold && (matStyle.getAttribute('data-size') != 'minWidth')){
            changeStyleSheet(matStyle,minWidthStyle);
            matStyle.setAttribute('data-size', 'minWidth');
        }
    });
})(util)