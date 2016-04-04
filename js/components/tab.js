/**
 *  @author 黄笛
 *  @description Tab组件，
 *  处理Tab导航按钮点击切换Tab内容标签的显示与隐藏
 *  需要传入Tab导航按钮与内容标签节点参数
 */
;(function(_){
    "use strict";
    function Tab(opt){
        var _opt = opt||{};
        _.extend(this, _opt);
        // 初始化
        if (this.control && this.content){
            this._init();
        }        
    };
    _.extend(Tab.prototype, _.emitter);
    _.extend(Tab.prototype,{
        // Tab组件初始化
        _init:function(){
            this._initEvent();
            // 如果传入了默认显示的tab页index
            if(_.type(this.dft)!='undefined'){
                this.control.getElementsByTagName('a')[this.dft].click();
            }
        },
        // 绑定Tab组件导航按钮点击事件
        _initEvent:function(){
            var tmpList = this.control.getElementsByTagName('a');
            for(var i=0;i<tmpList.length;i++){
                _.addEvent(tmpList[i],'click',this._onTab.bind(this));
            }
        },
        // 导航按钮点击处理事件
        _onTab:function(e){
            var tar = e.target;           
            var controls = this.control.getElementsByTagName('a');
            // 清除其他按钮选中样式
            for(var i=0;i<controls.length;i++){
                _.delClass(controls[i],'z-tab-acv');
            }
            // 设置选中按钮样式
            _.addClass(tar,'z-tab-acv');
            var target = tar.getAttribute('href');
            this._showContent(target);
            return false;
        },
        // 显示目标内容与隐藏其他Tab页
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
        },
    });
    window.Tab = Tab;
})(util);