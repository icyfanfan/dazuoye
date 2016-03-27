/*
需要显示的字段如下：
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
    var detailTpl =  '<img src="<%middlePhotoUrl%>" alt="图片加载失败">'+                        
                        '<div class="u-info"><h4><%name%></h4><span class="f-fc1"><%provider%></span><span class="u-learner f-fc1">' +
                        '<%learnerCount%></span><span class="f-fc2 f-fbold">￥<%price%></span></div>';
    var hoverTpl = '<div class="m-detail"><img src="<%middlephotourl%>" alt="图片加载失败" class="f-fl"><div class="u-info f-fl">'+
                    '<h3><%name%></h3><span class="u-learner f-fc1"><%learnercount%>人在学</span><span class="f-fc1">发布者：<%provider%></span>'+
                    '<span class="f-fc1">分类：<%categoryname%></span></div></div><div class="u-des"><span><%description%></span></div>';
    var listTpl = '<ul class="m-list1"></ul>';
    var pagerTpl = '<div class="m-pagerwrap f-cb"><ul class="m-pager"><li><span class="u-pre" data-tar="pre">'+
                    '</span></li><li><span class="u-next" data-tar="next"></span></li></ul></div>';
    var numTpl = '<span class="u-number" data-tar="<%tar%>"><%num%><span>'

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
            this.list = _.html2node(listTpl).cloneNode(true);
            this.pager = _.html2node(pagerTpl).cloneNode(true);
            // var that = this;
            // 初始化节点
            var _initNode = function(r){
                var _total = JSON.parse(r);
                var _data = _total.list;
                var _pager = _total.pagination;
                for(var i=0;i<_data.length;i++){
                    var _item = {
                        id:_data[i].id,
                        middlePhotoUrl:_data[i].middlePhotoUrl,
                        name:_data[i].name,             
                        provider:_data[i].provider||'无',   
                        learnerCount:_data[i].learnerCount,
                        price:_data[i].price,
                        categoryName:_data[i].categoryName||'无',
                        description:_data[i].description||'无',
                     };
                     var _li = _.parseTemplate(detailTpl,_item);
                     var newLi = document.createElement('li');
                     newLi.innerHTML = _li;
                     _.setDataSet(newLi,_item);
                     _.addClass(newLi,'f-shadow');
                     this.list.appendChild(newLi);
                     // 事件绑定
                     _.addEvent(newLi,'mouseover',this._showHover.bind(this));
                     _.addEvent(newLi,'mouseout',this._hideHover.bind(this));                     
                }
                
                this.pagerUl = this.pager.lastChild;
                this.totalPage = _pager.totlePageCount;        
                var _next = this.pagerUl.lastChild;
                var _number;
                // 根据总页数初始化pager
                var _final = this.totalPage>8?8:this.totalPage;          
                for(var i=1;i<=_final;i++){
                    _number = document.createElement('li');
                    // _number.setAttribute('data-tar',i);
                    var _span = _.parseTemplate(numTpl,{num:i,tar:i});
                    _number.innerHTML = _span; 
                    this.pagerUl.insertBefore(_number,_next);
                }     
                // 事件绑定
                _.addEvent(this.pagerUl,'click',this._onPage.bind(this));
                // 加入容器中
                this.container.appendChild(this.list); 
                this.container.appendChild(this.pager);
                // 设置最初选中状态，并记录上一个选中的pager项
                this.firstIndex = 1;
                this._changeSelected(1);
            }
            // 获取课程信息
            this._getData({pageNo:1,success:_initNode.bind(this)});

        },
        next: function(){
            this._move();
        },
        _onPage: function(e){
            e.preventDefault();
            e.stopPropagation();
            var _tar = e.target;
            var _dataTar = _.getDataSet(_tar).tar;
            if(!isNaN(parseInt(_dataTar))){
                _dataTar = parseInt(_dataTar);                                        
            }else{
                if(_dataTar=='next'){
                    if(this.lastSelected>=this.totalPage){
                        return;
                    }
                    // next按钮生效
                    _dataTar = this.lastSelected+1;
                    // 是否需要更新pagerList
                    if(this.lastSelected-this.firstIndex>=7){
                        this.firstIndex = _dataTar;
                        var _numbers = this.pagerUl.getElementsByTagName('li');
                        for(var i=1;i<_numbers.length-1;i++){
                            var _index = i+this.firstIndex-1;
                            var _span = '';
                            if(_index<=this.totalPage){
                                _span = _.parseTemplate(numTpl,{num:_index,tar:_index});                                
                            }
                            _numbers[i].innerHTML = _span;
                            // debugger;
                        }
                    }
                }
                if(_dataTar=='pre'){
                    if(this.lastSelected<=1){
                        return;
                    }
                    _dataTar = this.lastSelected-1;
                    // 是否需要更新pagerList
                    if(this.lastSelected==this.firstIndex){
                        this.firstIndex = _dataTar-7;
                        var _numbers = this.pagerUl.getElementsByTagName('li');
                        for(var i=_numbers.length-2;i>0;i--){
                            var _index = i+this.firstIndex-1;
                            var _span = '';
                            if(_index<=this.totalPage){
                                _span = _.parseTemplate(numTpl,{num:_index,tar:_index});                                
                            }
                            _numbers[i].innerHTML = _span;
                            // debugger;
                        }
                    }
                }
            }
            this._changeSelected(_dataTar);
            this._getData({pageNo:_dataTar,success:this._refreshNode.bind(this)});  
            // if(_tar.)
        },
        _changeSelected: function(tar){
            // debugger;
            // 设置选中状态与清除上一个选项的选中状态
            var _numbers = this.pagerUl.getElementsByClassName('u-number');
            // debugger;
            if(_.type(this.lastSelected)!='undefined'&&_numbers[this.lastSelected-this.firstIndex]!=undefined){
                _.delClass(_numbers[this.lastSelected-this.firstIndex],'z-selected');
            }            
            _.addClass(_numbers[tar-this.firstIndex],'z-selected');
            this.lastSelected = tar;
        },
        _refreshNode: function(r){
            var _total = JSON.parse(r);
            var _data = _total.list;
            var _li = this.list.firstChild;
            // 修改li节点
            for(var i=0;i<_data.length;i++){
                var _item = {
                    id:_data[i].id,
                    middlePhotoUrl:_data[i].middlePhotoUrl,
                    name:_data[i].name,             
                    provider:_data[i].provider||'无',   
                    learnerCount:_data[i].learnerCount,
                    price:_data[i].price,
                    categoryName:_data[i].categoryName||'无',
                    description:_data[i].description||'无',
                };
                _li = this.list.childNodes[i];
                _.setDataSet(_li,_item);
                _li.innerHTML = _.parseTemplate(detailTpl,_item);
            }
        },
        // 获取数据
        _getData: function(opt){
            opt.success = opt.success||function(){};
            _.ajax({
                type:'get',
                url:'http://study.163.com/webDev/couresByCategory.htm',
                data:{pageNo:opt.pageNo,psize:20,type:this.type},
                success:opt.success,
            }); 
        },
        _showHover: function(e){
            var _e = e||window.event;
            _e.preventDefault();
            _e.stopPropagation();
            var _li = _e.currentTarget;
            var _div = _li.getElementsByClassName('m-hover')[0];
            if(_div){
                return;
            }
            var _modal = _.parseTemplate(hoverTpl,_.getDataSet(_li)); 
            var _div = document.createElement('div');
            _.addClass(_div,'m-hover');
            _.addClass(_div,'f-shadow-big');
            _div.innerHTML = _modal;
            _li.appendChild(_div);
            // debugger;
        },
        _hideHover: function(e){
            var _e = e||window.event;
            _e.preventDefault();
            _e.stopPropagation();
            var _li = e.currentTarget;
            // var _obj = e.relateTarget||e.toElement;
            if(_li.contains(_e.relateTarget)||_li.contains(_e.toElement)){
                return;
            }
            var _div = _li.getElementsByClassName('m-hover')[0];
            _li.removeChild(_div);

        },
    });
    window.CourseList = CourseList;
})(util);