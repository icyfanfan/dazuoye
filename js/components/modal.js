/* 模态框 
    登录+视频弹框
*/
;(function(_){
    var template = 
    '<div class="m-modal">\
      <div class="modal_align"></div>\
      <div class="modal_wrap animated">\
        <div class="close">X</div>\
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

        this._init();
    }

    _.extend(Modal.prototype, _.emitter);

    _.extend(Modal.prototype,{
        _layout: _.html2node(template),
        _init:function(){
            this.container.querySelector('.confirm').addEventListener(
              'click', this._onConfirm.bind(this)
            );
            this.container.querySelector('.cancel').addEventListener(
              'click', this._onCancel.bind(this)
            );
            this.container.querySelector('.close').addEventListener(
              'click', this._onClose.bind(this)
            )
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
        },
        _onConfirm:function(){
            this.emit('confirm')
            this.hide();
        },
        _onCancel:function(){
            this.emit('cancel')
            this.hide();
        },
        _onClose:function(){
            this.emit('cancel')
            this.hide();            
        },
    });
    window.Modal = Modal;
})(util);
