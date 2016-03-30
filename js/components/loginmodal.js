;(function(_){
    var lgTpl = '<div class="m-login"><div class="u-title">登录网易云课堂</div>' +
        '<form action="/login" method="get">' +
            '<div class="u-input">' +
                '<input type="text" name="usrName" placeholder="账户" required>' +
            '</div>' +
            '<div class="u-input">' +
                '<input type="password" name="usrPwd" placeholder="密码" required>' +
            '</div>' +
            '<div class="u-btn">' +
                '<button type="submit" class="btn">登录</button>' +
            '</div>' +
        '</form></div>';

    function LoginModal(opt){
        var _opt = opt || [];
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

            var _formData = this.loginForm.elements;
            var _usrName = hex_md5(_formData['usrName'].value);
            var _usrPwd = hex_md5(_formData['usrPwd'].value);
            // 验证并提交表单
            if(!!this._validate()){
                _.ajax({
                    method:'get',
                    url:'http://study.163.com/webDev/login.htm',
                    data:{userName:_usrName, password:_usrPwd},
                    success:this._afterLogin.bind(this)
                }); 
            }
            return false;
        },
        _afterLogin:function(r){
            // 判断登录验证是否成功
            if(r === '1'){
               // 验证通过则隐藏登录弹框                
                this.hide();
                this.emit('formSubmit');    
            } else{
                alert('用户名或密码错误');
            }
        },
    });
    window.LoginModal = LoginModal;
})(util);