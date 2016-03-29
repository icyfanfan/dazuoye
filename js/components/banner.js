/**
    淡入淡出的banner组件
 */
;
(function(_) {

    var template =
        '<div class="m-banner" >\
    <div class="u-banner"></div>\
    <div class="u-banner"></div>\
  </div>'


    function Banner(opt) {

        _.extend(this, opt);


        this.container = this.container || document.body;

        this.banner = this._layout.cloneNode(true);
        this.banners = this.banner.querySelectorAll('.u-banner');

        this.pageNum = this.images.length;

        this.nextIndex = 1;
        this.pageIndex = this.pageIndex || 0;


        this.container.appendChild(this.banner);

    }

    _.extend(Banner.prototype, _.emitter);

    _.extend(Banner.prototype, {

        _layout: _.html2node(template),

        // 直接跳转到指定页
        nav: function(pageIndex) {

            this.pageIndex = pageIndex;
            this.lastIndex = this.nextIndex;
            this.nextIndex = (this.nextIndex === 0)?1:0; 1           
            this._onNav(this.pageIndex,this.nextIndex);

        },
        // 下一页
        nxt: function() {
            this._step(1);
        },
        // 上一页
        prev: function() {
            this._step(-1);
        },
        // 单步切换
        _step: function(offset) {
            offset = offset % this.pageNum;
            var _end = this.pageIndex + offset;
            this.pageIndex = (_end >= this.pageNum)?(_end-this.pageNum):_end;
            this.lastIndex = this.nextIndex;
            this.nextIndex = this.nextIndex === 0?1:0;
            this._onNav(this.pageIndex,this.nextIndex);

        },

        _setOpacity: function(nextIndex) {

            var banners = this.banners;

            banners[this.lastIndex].style.opacity = 0;
            _.delClass(banners[this.lastIndex], 'z-active');
            // 当前slide 添加 'z-active'的className
            
            _.addClass(banners[nextIndex], 'z-active');
            banners[nextIndex].style.opacity = 1;
        },

        // 触发跳转后先设置图片
        _onNav: function(pageIndex, nextIndex) {

            var banners = this.banners;

            var img = banners[nextIndex].querySelector('img');
            if (!img) {
                img = document.createElement('img');
                banners[nextIndex].appendChild(img);
                img.onmouseover = this.onMouseOver;
                img.onmouseout = this.onMouseOut;
            }
            img.src = this.images[pageIndex].src;
            var href = this.images[pageIndex].href;
            img.onclick = function(){
                window.open(href);
            };    

            this.emit('nav', {
                pageIndex: pageIndex,
            })

            this._setOpacity(nextIndex);
        },

    })

    window.Banner = Banner;

})(util);
