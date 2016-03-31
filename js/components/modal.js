/* 模态框
*/
;(function(_){
    "use strict";
    var template = 
    '<div class="m-modal">\
      <div class="modal_align"></div>\
      <div class="modal_wrap animated">\
        <div class="close">×</div>\
        <div class="modal_body">内容</div>\
      </div>\
    </div>';

    function Modal(opt){
        var _opt = opt || {};
        // 即 div.m-modal 节点
        this.container = this._layout.cloneNode(true);
        // body 用于插入自定义内容
        this.body = this.container.querySelector('.modal_body');
        // 窗体节点，在应用动画时有用
        this.wrap = this.container.querySelector('.modal_wrap');
        // 将传入的opt复制到组件实例上
        _.extend(this, _opt);

        this._initEvent();
    }

    _.extend(Modal.prototype, _.emitter);

    _.extend(Modal.prototype,{
        _layout: _.html2node(template),
        _initEvent:function(){
            var _confirm = this.container.querySelector('.confirm');
            var _cancel = this.container.querySelector('.cancel');
            var _close = this.container.querySelector('.close');
            _.addEvent(_close, 'click', this._onClose.bind(this));
            if(!!_confirm){
                _.addEvent(_confirm, 'click', this._onConfirm.bind(this));
            }
            if(!!_cancel){
                _.addEvent(_cancel, 'click', this._onCancel.bind(this));
            }

        },
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
        show:function(content){
            if(content){
                this.setContent(content);
            }
            document.body.appendChild(this.container);
        },
        hide:function(){
            document.body.removeChild(this.container);
            // TODO 事件解绑是否需要？
            
        },
        _onConfirm:function(e){
            this.emit('confirm');
            this.hide();
            return false; 
        },
        _onCancel:function(e){
            this.emit('cancel');
            this.hide();
            return false; 
        },
        _onClose:function(e){
            this.emit('close');
            this.hide();          
            return false;  
        },
    });
    window.Modal = Modal;
})(util);
