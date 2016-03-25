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
(function(_){
    var detailTemplate =  '<img src="<%middlePhotoUrl%>" alt="图片加载失败" class="" data-id="<%id%>">' +
                        '<div class="u-info"><h4><%name%></h4><span><%provider%></span><span><%learnerCount%></span><span><%price%></span></div>';
    var template = '<ul class="m-list1"></ul><div class="m-pager">1</div>';

    function CourseList(opt){
        var _opt = opt || {};
        _.extend(this, _opt);
        if(this.container){
            this._init();
        }        
    }
    

    _.extend(CourseList.prototype, {
        _init: function(){
            
            // 初始化容器html结构
            this.list = _.html2node(template).cloneNode(true);
            // this.list = this.content.getElementsByTagName('ul')[0];
            // debugger;
            var that = this;
            // 获取课程信息
            _.ajax({
                type:'get',
                url:'http://study.163.com/webDev/couresByCategory.htm',
                data:{pageNo:1,psize:20,type:this.type},
                success:function(r){                    
                    var _total = JSON.parse(r);
                    var _data = _total.list;
                    // debugger;
                    // console.log(_data);
                    for(var i=0;i<_data.length;i++){
                        var _item = {
                            id:_data[i].id,
                            middlePhotoUrl:_data[i].middlePhotoUrl,
                            name:_data[i].name,             
                            provider:_data[i].provider,   
                            learnerCount:_data[i].learnerCount,
                            price:_data[i].price,
                         };
                         var _li = _.parseTemplate(detailTemplate,_item);
                         var newLi = document.createElement('li');
                         newLi.innerHTML = _li;
                         that.list.appendChild(newLi);
                    }                                       
                }
            });                       
            // 加入容器中
            this.container.appendChild(this.list); 
        },
        next: function(){
            this._move();
        },
        
    });
    window.CourseList = CourseList;
})(util);