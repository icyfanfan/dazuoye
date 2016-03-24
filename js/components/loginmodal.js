;(function(_){
    var lgTpl = '<div class="m-login"><div class="u-title">登录网易云课堂</div>' +
        '<form action="/login" method="get">' +
            '<div class="u-input">' +
                '<input type="text" id="usrName" placeholder="账户" required>' +
            '</div>' +
            '<div class="u-input">' +
                '<input type="password" id="usrPwd" placeholder="密码" required>' +
            '</div>' +
            '<div class="u-btn">' +
                '<button type="submit" class="btn">登录</button>' +
            '</div>' +
        '</form></div>';

    function LoginModal(opt){
        var _opt = opt || {};
        Modal.apply(this,_opt);

        // 设置登录框内容
        this.setContent(lgTpl);
        this.loginForm = this.body.querySelector('form');
        this._initForm();
    }
    // 使用扩展的方式继承父类方法
    _.extend(LoginModal.prototype, Modal.prototype);
    // 子类原型上的方法
    _.extend(LoginModal.prototype, {
        // form表单初始化和事件绑定
        _initForm:function(){
            _.addEvent(this.loginForm, 'submit', this._onSubmit.bind(this));

        },
        _validate:function(){
            return 1;
        },
        _onSubmit:function(e){
            e.preventDefault();
            // 验证并提交表单
            if(!!this._validate){
                this.hide();
                this.emit('formSubmit');
            }
        },
    });
    window.LoginModal = LoginModal;
})(util);