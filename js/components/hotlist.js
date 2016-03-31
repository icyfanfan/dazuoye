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
    "use strict";
    var detailTemplate =  '<img src="<%smallPhotoUrl%>" alt="图片加载失败" class="f-fl" data-id="<%id%>">' +
                                                '<div class="u-info"><h4><%name%></h4><span><%learnerCount%></span></div>';
    var template = '<ol class="m-list2"></ol>';

    function HotList(opt){
        var _opt = opt || {};
        _.extend(this, _opt);
        this.container = this.container||document.body;
        this._init();
    }
    

    _.extend(HotList.prototype, {
        _init: function(){
            this.moveup = true
            // 初始化容器html结构
            this.list = _.html2node(template).cloneNode(true);
            var that = this;
            // 获取热门课程信息
            _.ajax({
                method:'get',
                url:'http://study.163.com/webDev/hotcouresByCategory.htm',
                success:function(r){                    
                    var _data = JSON.parse(r);
                    for(var i=0;i<_data.length;i++){
                        var _item = {
                            id:_data[i].id,
                            smallPhotoUrl:_data[i].smallPhotoUrl,
                            name:_data[i].name,                
                            learnerCount:_data[i].learnerCount
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
        nxt: function(){
            this._move();
        },
        _move: function(){
            var _top = parseInt(this.list.style.top.slice(0,-2));
            if(isNaN(_top)){
                _top = 0;
            }
            // var that = this;
            if(_top >-690 && this.moveup){
                var length = 0;
                _top = this._stepUp(_top,length);
                
            } else {
                this.moveup = false;
                this._stepDown(_top);

            }            
        },
        _stepUp:function(top,length){   
            var that = this; 
            this.timer1 = setTimeout(function(){
                top = top - 1;
                length = length + 1;
                that.list.style.top = top + 'px'; 
                if (length >= 69){
                    clearTimeout(this.timer1);                    
                }  else{
                    that._stepUp(top,length);
                }               
            }, 10);            
        },
        _stepDown:function(top){
            var that = this; 
            this.timer2 = setTimeout(function(){
                top = top + 69;
                that.list.style.top = top + 'px';
                if (top >= 0){
                    clearTimeout(that.timer2);
                    that.list.style.top = 0 + 'px';
                    that.moveup = true;
                }else{
                    that._stepDown(top);
                }                
            },50);        
        }
    });
    window.HotList = HotList;
})(util);