/*
实现每次进入或刷新本页面，“热门推荐”模块中，接口返回20门课程数据，
默认展示前10门课程，隔5秒更新一门课程，实现滚动更新热门课程的效果。
课程数据接口见本文档的数据接口列表
[{
   "id":"967019",//课程ID
 "name":"和秋叶一起学职场技能",//课程名称
 "bigPhotoUrl":"http://img1.ph.126.net/eg62.png",//课程大图
 "middlePhotoUrl ":"http://img1.ph.126.net/eg62.png",//课程中图
 "smallPhotoUrl":" http://img1.ph.126.net/eg62.png ",//课程小图
 "provider ":"秋叶",//机构发布者
 "learnerCount ":"23",//在学人数
 "price ":"128",//课程价格，0为免费
 "categoryName ":"办公技能",//课程分类
 "description ":"适用人群：最适合即将实习、求职、就职的大学生，入职一、二三年的新人。别以为那些职场老人都知道！"//课程描述
}]
 */
;
(function(_) {
    var detailTemplate =  '<img src=<%src%> alt="图片加载失败" class="f-fl">' +
                                '<div class="u-info"><h4><%title%></h4><span><%num%></span></div>';
    var template = '<ol class="m-list2"></ol>';

    function HotList(opt){
        this.container = this.container||document.body;
        this._init();
    }
    _.extend(this, opt);

    _.extend(Slider.prototype, {
        _init: function() {
            this.list = _.html2node(template).cloneNode(true);
            
            this.container.appendChild(this.list);
        },
        next: function() {
            this._step(1);
        },
    });
    
})(util);