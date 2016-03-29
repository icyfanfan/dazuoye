/**

 */


;
(function(_) {

    var template =
        '<div class="m-slider" >\
    <div class="u-slider"></div>\
    <div class="u-slider"></div>\
  </div>'


    function Slider(opt) {

        _.extend(this, opt);


        this.container = this.container || document.body;
        this.container.style.overflow = 'hidden';


        this.slider = this._layout.cloneNode(true);
        this.slides = this.slider.querySelectorAll('.u-slider');

        this.pageNum = this.images.length;

        this.slideIndex = 1;
        this.pageIndex = this.pageIndex || 0;


        this.container.appendChild(this.slider);

    }

    _.extend(Slider.prototype, _.emitter);

    _.extend(Slider.prototype, {

        _layout: _.html2node(template),

        // 直接跳转到指定页
        nav: function(pageIndex) {

            this.pageIndex = pageIndex;
            this.slideIndex = (this.slideIndex === 0)?1:0;            

            this.slider.style.transitionDuration = '0s';

            this._onNav(this.pageIndex,slideIndex);

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

            this.slideIndex = this.slideIndex === 0?1:0;
            this.slider.style.transitionDuration = '.5s';
            this._onNav();

        },

        _setOpacity: function(slideIndex) {

            var slides = this.slides;

            // 当前slide 添加 'z-active'的className
            for(var i=0;i<slides.length;i++){
                slides[i].style.opacity =0;                   
                _.delClass(slides[i], 'z-active');
                
            }
            slides[slideIndex].style.opacity = 1;
            _.addClass(slides[slideIndex], 'z-active');

        },

        // 触发跳转后先设置图片
        _onNav: function(pageIndex, slideIndex) {

            var slides = this.slides;

            var img = slides[slideIndex].querySelector('img');
            if (!img) {
                img = document.createElement('img');
                slides[index].appendChild(img);
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

            this._setOpacity(slideIndex);
        },

    })

    window.Slider = Slider;

})(util);
