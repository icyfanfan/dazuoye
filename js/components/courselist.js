/**
 *  @author 黄笛
 *  @description 课程列表与翻页组件，
 *  初始化时获取课程数据，并以dataset形式存储在li节点上
 *  hover时获取对应li节点上的dataset数据并根据模板创建出详细课程卡片
 *  翻页组件最多显示8个页码，点击‘上一页’‘下一页’在页码列表边缘时更新新的8个页码
 */
;
(function(_){
    "use strict";
    // 课程列表模板
    var listTpl = '<ul class="m-list1"></ul>';
    // 翻页组件模板
    var pagerTpl = '<div class="m-pagerwrap f-cb"><ul class="m-pager"><li><span class="u-pre" data-tar="pre">'+
                    '</span></li><li><span class="u-next" data-tar="next"></span></li></ul></div>';
    // 页码模板
    var numTpl = '<span class="u-number" data-tar="<%tar%>"><%num%><span>'
    // 课程列表每一项li标签内html模板
    var detailTpl =  '<img src="<%middlePhotoUrl%>" alt="图片加载失败">'+                        
                        '<div class="u-info"><h4><%name%></h4><span class="f-fc1"><%provider%></span><span class="u-learner f-fc1">' +
                        '<%learnerCount%></span><span class="f-fc2 f-fbold">￥<%price%></span></div>';
    // 课程列表hover时显示的课程卡片html模板
    var hoverTpl = '<div class="m-detail"><img src="<%middlePhotoUrl%>" alt="图片加载失败" class="f-fl"><div class="u-info f-fl">'+
                    '<h3><%name%></h3><span class="u-learner f-fc1"><%learnerCount%>人在学</span><span class="f-fc1">发布者：<%provider%></span>'+
                    '<span class="f-fc1">分类：<%categoryName%></span></div></div><div class="u-des"><span><%description%></span></div>';

    function CourseList(opt){
        var opt = opt || {};
        _.extend(this, opt);
        if(this.container){
            this._init();
        }        
    }    
    // 扩展到CourseList原型上的方法
    _.extend(CourseList.prototype, {
        // 课程列表组件初始化，完成模板转化为页面节点、获取课程列表数据并插入模板、翻页组件初始化等
        _init: function(){            
            // 初始化容器html结构
            this.list = _.html2node(listTpl).cloneNode(true);
            this.pager = _.html2node(pagerTpl).cloneNode(true);
            // ajax获取数据成功后的回调函数，初始化课程列表、翻页组件
            var _initNode = function(r){
                var total = JSON.parse(r);
                var data = total.list;
                var pager = total.pagination;
                // 遍历数据生成课程列表li节点并插入dom
                for(var i=0;i<data.length;i++){
                    var item = {
                        id:data[i].id,
                        middlePhotoUrl:data[i].middlePhotoUrl,
                        name:data[i].name,             
                        provider:data[i].provider||'无',   
                        learnerCount:data[i].learnerCount||'0',
                        price:data[i].price||'0',
                        categoryName:data[i].categoryName||'无',
                        description:data[i].description||'无',
                     };
                     // 生成li节点
                     var li = _.parseTemplate(detailTpl,item);
                     var newLi = document.createElement('li');
                     // 设置li节点innerHTML
                     newLi.innerHTML = li;
                     // 将每一项数据都加入li节点dataset中
                     _.setDataSet(newLi,item);
                     _.addClass(newLi,'f-shadow');
                     this.list.appendChild(newLi);
                     // 鼠标移入移出件绑定, 事件处理函数中的this为触发事件currentTarget，li标签
                     _.addEvent(newLi,'mouseover',this._showHover.bind(newLi));
                     _.addEvent(newLi,'mouseout',this._hideHover.bind(newLi));                     
                }
                // 翻页组件
                this.pagerUl = this.pager.lastChild;
                this.totalPage = pager.totlePageCount;        
                var next = this.pagerUl.lastChild;
                var number;
                // 根据总页数初始化pager
                var finalPage = this.totalPage>8?8:this.totalPage;          
                for(var i=1;i<=finalPage;i++){
                    // 生成每一个页码li元素
                    number = document.createElement('li');
                    var span = _.parseTemplate(numTpl,{num:i,tar:i});
                    number.innerHTML = span; 
                    this.pagerUl.insertBefore(number,next);
                }     
                // 点击事件绑定到外层ul标签上
                _.addEvent(this.pagerUl,'click',this._onPage.bind(this));
                // 加入容器中
                this.container.appendChild(this.list); 
                this.container.appendChild(this.pager);
                // 设置最初选中状态，并记录上一个选中的页码项
                this.firstIndex = 1;
                this._changeSelected(1);
            }
            // 调用获取课程信息函数
            this._getData({pageNo:1,success:_initNode.bind(this)});

        },
        // 翻页组件页码按钮点击事件处理函数
        _onPage: function(e){
            // 获取触发事件的target,和target上的目标页码属性
            var tar = e.target;
            var dataTar = _.getDataSet(tar).tar;
            if(!dataTar){
                return;
            }
            if(!isNaN(parseInt(dataTar))){
                // 点击具体页码
                dataTar = parseInt(dataTar);                                        
            }else{
                // 点击‘下一页’
                if(dataTar=='next'){
                    if(this.lastSelected>=this.totalPage){
                        return false;
                    }
                    // next按钮生效
                    dataTar = this.lastSelected+1;
                    // 是否需要更新pagerList
                    if(this.lastSelected-this.firstIndex>=7){
                        this.firstIndex = dataTar;
                        var numbers = this.pagerUl.getElementsByTagName('li');
                        // 更新页码列表
                        for(var i=1;i<numbers.length-1;i++){
                            var index = i+this.firstIndex-1;
                            var span = '';
                            if(index<=this.totalPage){
                                span = _.parseTemplate(numTpl,{num:index,tar:index});                                
                            }
                            numbers[i].innerHTML = span;
                            // debugger;
                        }
                    }
                }
                // 点击‘上一页’
                if(dataTar=='pre'){
                    if(this.lastSelected<=1){
                        return false;
                    }
                    dataTar = this.lastSelected-1;
                    // 是否需要更新pagerList
                    if(this.lastSelected==this.firstIndex){
                        this.firstIndex = dataTar-7;
                        var numbers = this.pagerUl.getElementsByTagName('li');
                        for(var i=numbers.length-2;i>0;i--){
                            var index = i+this.firstIndex-1;
                            var span = '';
                            if(index<=this.totalPage){
                                span = _.parseTemplate(numTpl,{num:index,tar:index});                                
                            }
                            numbers[i].innerHTML = span;
                        }
                    }
                }
            }
            // 修改页码标签样式
            this._changeSelected(dataTar);
            // 重新获取数据并刷新课程列表
            this._getData({pageNo:dataTar,success:this._refreshNode.bind(this)});  
            return false;
        },
        // 修改页码选中样式，清除上一个选中页码的样式
        _changeSelected: function(tar){
            // 设置选中状态与清除上一个选项的选中状态
            var numbers = _.getElementsByClassName(this.pagerUl, 'u-number');
            if(_.type(this.lastSelected)!='undefined'&&numbers[this.lastSelected-this.firstIndex]!=undefined){
                _.delClass(numbers[this.lastSelected-this.firstIndex],'z-selected');
            }            
            _.addClass(numbers[tar-this.firstIndex],'z-selected');
            // 更新上一个选中页码缓存
            this.lastSelected = tar;
        },
        // 刷新课程列表，与初始化类似，但不需要处理翻页组件
        _refreshNode: function(r){
            var total = JSON.parse(r);
            var data = total.list;
            var li = this.list.firstChild;
            // 修改li节点
            for(var i=0;i<data.length;i++){
                var item = {
                    id:data[i].id,
                    middlePhotoUrl:data[i].middlePhotoUrl,
                    name:data[i].name,             
                    provider:data[i].provider||'无',   
                    learnerCount:data[i].learnerCount||'0',
                    price:data[i].price||'0',
                    categoryName:data[i].categoryName||'无',
                    description:data[i].description||'无',
                };
                li = this.list.childNodes[i];
                _.setDataSet(li,item);
                li.innerHTML = _.parseTemplate(detailTpl,item);
            }
        },
        // ajax方式调用接口获取课程数据，需要跨域
        _getData: function(opt){
            opt.success = opt.success||function(){};
            _.ajax({
                method:'get',
                url:'http://study.163.com/webDev/couresByCategory.htm',
                data:{pageNo:opt.pageNo,psize:20,type:this.type},
                success:opt.success,
            }); 
        },
        // 课程列表每一项li标签鼠标移入时处理函数
        _showHover: function(e){
            // 绑定的this节点内任意元素触发事件均显示Hover的Modal，并且阻止事件继续冒泡
            var li = this;
 
            var div = _.getElementsByClassName(li, 'm-hover')[0];
            // 如果已经显示了课程卡片，则不再处理事件
            if(div){
                return false;
            }
            // 根据模板和数据生成课程卡片内容
            var _modal = _.parseTemplate(hoverTpl,_.getDataSet(li)); 
            var div = document.createElement('div');
            // 修改样式
            _.addClass(div,'m-hover');
            _.addClass(div,'f-shadow-big');
            _.delClass(li,'f-shadow');
            _.addClass(li,'f-shadow-big');
            var title = li.getElementsByTagName('h4')[0];
            _.addClass(title,'f-fc3');
            div.innerHTML = _modal;
            // 将卡片作为子元素加入到li标签
            li.appendChild(div);
            return false;         
        },
        // 课程列表每一项li标签鼠标移出时处理函数
        _hideHover: function(e){
            // 进入的元素如果在this节点内则忽略事件并阻止事件继续冒泡
            // 忽略鼠标从父节点到子节点时也会触发的mousemoveout事件
            var li = this;
            if(li.contains(e.relatedTarget)){
                return false;
            }
            var div = _.getElementsByClassName(li, 'm-hover')[0];
            li.removeChild(div);
            // 修改样式
            _.delClass(li,'f-shadow-big');
            _.addClass(li,'f-shadow');
            var title = li.getElementsByTagName('h4')[0];
            _.delClass(title,'f-fc3');
            return false;
        },
    });
    window.CourseList = CourseList;
})(util);