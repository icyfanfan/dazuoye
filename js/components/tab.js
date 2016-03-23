;(function(_){
    function Tab(opt){
        var _opt = opt||{};
        _.extend(this, _opt);
        if (this.control && this.content){
            this._init();
        }        
    };
    _.extend(Tab.prototype, _.emitter);
    _.extend(Tab.prototype,{
        _init:function(){
            this._initEvent();
            if(this.default){

            }
        },
        _initEvent:function(){
            var _tmpList = this.control.getElementsByTagName('a');
            // var _ctnList = this.content.querySelectorAll('div');
            var that = this;
            for(var i=0;i<_tmpList.length;i++){
                _.addEvent(_tmpList[i],'click',this._onTab.bind(this));
            }
        },
        _onTab:function(e){
            e = e||window.event;
            e.preventDefault();
            var _controls = this.control.getElementsByTagName('a');
            for(var i=0;i<_controls.length;i++){
                _.delClass(_controls[i],'z-tab-acv');
            }
            _.addClass(e.currentTarget,'z-tab-acv');
            var _target = e.currentTarget.getAttribute('href');
            this._showContent(_target);
            e.stopPropagation();
        },
        _showContent:function(target){
            var _ctnList = this.content.getElementsByTagName('div');
            // 隐藏所有Tab内容页
            for (var i=0;i<_ctnList.length;i++) {
                if(_ctnList[i].parentElement != this.content){
                    continue;
                }
                _.addClass(_ctnList[i],'f-dn');
            };
            // 显示目标内容页
            _.delClass(this.content.querySelector(target),'f-dn');
        }
    });
    window.Tab = Tab;
})(util);