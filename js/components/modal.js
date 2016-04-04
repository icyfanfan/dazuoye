/**
 *  @author 黄笛
 *  @description 模态框组件，
 *  简化课件中的模态框组件，根据大作业需求，模态框大小由内容元素的样式指定
 *  不提供cancle与confirm处理和默认按钮，仅保留close按钮  
 */
;(function(_){
    "use strict";
    var template = 
    '<div class="m-modal">\
      <div class="modal_align"></div>\
      <div class="modal_wrap">\
        <div class="close">×</div>\
        <div class="modal_body">内容</div>\
      </div>\
    </div>';

    function Modal(opt){
        var opt = opt || {};
        // 即 div.m-modal 节点
        this.container = this._layout.cloneNode(true);
        // body 用于插入自定义内容
        this.body = this.container.querySelector('.modal_body');
        // 窗体节点
        this.wrap = this.container.querySelector('.modal_wrap');
        // 将传入的opt复制到组件实例上
        _.extend(this, opt);

        this._initEvent();
    }

    _.extend(Modal.prototype, _.emitter);

    _.extend(Modal.prototype,{
        _layout: _.html2node(template),
        // 初始化事件绑定
        _initEvent:function(){
            var close = this.container.querySelector('.close');
            if(!!close){
                _.addEvent(close, 'click', this._onClose.bind(this));
            }            

        },
        // 设置内容
        setContent:function(content){
            if(!content) return;
            //支持两种字符串结构和DOM节点
            if(content.nodeType === 1){ 
                this.body.innerHTML = 0;
                this.body.appendChild(content);
            }else{
              this.body.innerHTML = content;
            }
        },
        // 显示模态框
        show:function(content){
            if(content){
                this.setContent(content);
            }
            document.body.appendChild(this.container);
        },
        // 关闭模态框
        hide:function(){
            document.body.removeChild(this.container);
        
        },
        // 触发关闭
        _onClose:function(e){
            this.emit('close');
            this.hide();          
            return false;  
        },
    });
    window.Modal = Modal;
})(util);
