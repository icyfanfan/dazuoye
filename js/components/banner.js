/**
    淡入淡出的banner组件
 */
;
(function(_) {
    "use strict";
    var template =
        '<div class="m-banner" >\
    <div class="u-banner"></div>\
    <div class="u-banner"></div>\
  </div>'

    function Banner(opt) {
        // 合并传入配置与默认配置
        var _opt = opt || {contianer:document.body,images:[],onMouseOver:function(){},onMouseOut:function(){}};
        _.extend(this, _opt);

        // 初始化组件节点
        this.container = this.container || document.body;

        this.banner = this._layout.cloneNode(true);
        this.banners = this.banner.querySelectorAll('.u-banner');

        this.pageNum = this.images.length;
        // 初始化状态变量
        this.nextIndex = this.nextIndex || 0;
        this.pageIndex = this.pageIndex || 0;

        // 将组件加入dom
        this.container.appendChild(this.banner);

    }
    // 扩展事件触发器功能
    _.extend(Banner.prototype, _.emitter);
    // 原型上扩展方法
    _.extend(Banner.prototype, {

        _layout: _.html2node(template),

        // 直接跳转到指定页
        nav: function(pageIndex) {
            this.pageIndex = pageIndex;
            // 隐藏上一个显示的容器页
            this._setOpacity(this.banners[this.nextIndex], 0);
            this.nextIndex = (this.nextIndex === 0)?1:0;      
            this._onNav(this.pageIndex,this.nextIndex);
        },
        // 下一页
        nxt: function() {
            this.pageIndex = (this.pageIndex+1==this.pageNum)?0:(this.pageIndex+1);
            this.nav(this.pageIndex);
        },
        // 兼容设置透明度，第二个参数表示百分数，如opacity=100即设置style.opacity=1
        _setOpacity:  function(elem, opacity) {
            if(elem.style.opacity != undefined) {
                elem.style.opacity = opacity/100.0;
            } else {
                // 兼容ie8
                elem.style.filter = "alpha(opacity=" + opacity + ")";
            }
        },
        // 使用定时器实现500ms淡入效果
        _easeIn: function(elem,opacity){
            var that = this;
            var _opacity = opacity;
            this.timer1 = setTimeout(function(){    
                _opacity += 2;
                that._setOpacity(elem,_opacity);
                if (_opacity>=100){
                    _opacity = 100;
                    clearTimeout(that.timer1);                    
                }  else{
                    that._easeIn(elem,_opacity);
                }                        
            }, 10);            
        },
        // 触发跳转后先设置图片页
        _onNav: function(pageIndex, nextIndex) {

            var banners = this.banners;

            var img = banners[nextIndex].querySelector('img');
            // 没有img节点则需要添加
            if (!img) {
                img = document.createElement('img');
                banners[nextIndex].appendChild(img);
                img.onmouseover = this.onMouseOver;
                img.onmouseout = this.onMouseOut;
            }
            //  获取当前图片页的图片地址和点击链接
            img.src = this.images[pageIndex].src;
            var href = this.images[pageIndex].href;
            // 直接替换click事件
            img.onclick = function(){
                window.open(href);
            };    
            
            this.emit('nav', {
                pageIndex: pageIndex,
            })

            this._easeIn(banners[nextIndex],0);
        },

    })

    window.Banner = Banner;

})(util);
