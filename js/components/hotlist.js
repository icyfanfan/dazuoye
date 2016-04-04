/**
 *  @author 黄笛
 *  @description 热门列表组件，
 *  初始化时获取热门课程数据，并生成热门课程列表中的节点
 *  index中设置了5s的定时器，每5s移动列表一个项目
 *  通过绝对定位改变top值得方式移动列表
 */
;
(function(_){
    "use strict";
    // 热门列表每一项li标签内容模板
    var detailTemplate =  '<img src="<%smallPhotoUrl%>" alt="图片加载失败" class="f-fl" data-id="<%id%>">' +
                          '<div class="u-info"><h4><%name%></h4><span><%learnerCount%></span></div>';
    // 热门列表模板
    var template = '<ol class="m-list2"></ol>';

    function HotList(opt){
        var opt = opt || {};
        _.extend(this, opt);
        this.container = this.container||document.body;
        this._init();
    }    

    _.extend(HotList.prototype, {
        // 初始化热门列表标签和数据并加入到页面容器中
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
                         // 将数据插入到模板
                         var _li = _.parseTemplate(detailTemplate,_item);
                         var newLi = document.createElement('li');
                         newLi.innerHTML = _li;
                         // 将li节点加入到热门课程列表
                         that.list.appendChild(newLi);
                    }                                       
                }
            });                       
            // 加入容器中
            this.container.appendChild(this.list); 
        },
        // 控制列表移动一步
        nxt: function(){
            this._move();
        },
        // 控制列表移动方向
        _move: function(){
            var _top = parseInt(this.list.style.top.slice(0,-2));
            if(isNaN(_top)){
                _top = 0;
            }
            if(_top >-690 && this.moveup){
                var length = 0;
                _top = this._stepUp(_top,length);
                
            } else {
                this.moveup = false;
                this._stepDown(_top);

            }            
        },
        // 向上移动，即回到起点
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
        // 向下移动
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