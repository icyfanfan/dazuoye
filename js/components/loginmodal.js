;(function(_){
    var lgTpl = '<div class="title">登录网易通行证</div>' +
        '<form action="/login" method="get">' +
            '<div class="inputWrapper">' +
                '<label for="usrName">用户名：</label><input type="text" id="usrName" class="textInput">' +
            '</div>' +
            '<div class="inputWrapper">' +
                '<label for="usrPwd">密码：</label><input type="password" id="usrPwd" class="textInput">' +
            '</div>' +
            '<div class="btnWrapper">' +
                '<button type="submit" class="btn">登录</button>' +
            '</div>' +
        '</form></div>;';

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
            }
        },
    });
    window.LoginModal = LoginModal;
})(util);