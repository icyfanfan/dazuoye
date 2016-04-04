/**
 *  @author 黄笛
 *  @description 登录弹框组件，
 *  继承Modal组件
 *  完成登录框显示、登录操作逻辑
 */
;(function(_){
    "use strict";
    var lgTpl = '<div class="m-login"><div class="u-title">登录网易云课堂</div>' +
        '<form action="/login" method="get">' +
            '<div class="u-input">' +
                '<input type="text" name="usrName" placeholder="账户" required>' +
            '</div>' +
            '<div class="u-input">' +
                '<input type="password" name="usrPwd" placeholder="密码" required>' +
            '</div>' +
            '<div class="u-btn">' +
                '<button type="submit" class="btn">登&nbsp;录</button>' +
            '</div>' +
        '</form></div>';

    function LoginModal(opt){
        var opt = opt || [];
        Modal.apply(this,opt);

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
        // 表单验证，仅验证不为空
        _validate:function(name,pwd){
            return (name!=''&&pwd!='');
        },
        // 表单提交
        _onSubmit:function(e){

            var formData = this.loginForm.elements;
            // 去掉输入字段的首尾空格
            var usrName = formData['usrName'].value.replace(/(^\s*)|(\s*$)/g,"");
            var usrPwd = formData['usrPwd'].value.replace(/(^\s*)|(\s*$)/g,"");
            // 验证并提交表单
            if(!!this._validate(usrName,usrPwd)){
                _.ajax({
                    method:'get',
                    url:'http://study.163.com/webDev/login.htm',
                    data:{userName:hex_md5(usrName), password:hex_md5(usrPwd)},
                    success:this._afterLogin.bind(this)
                }); 
            }else{
                alert('用户名或密码不能为空');
            }
            return false;
        },
        // 提交完成后处理结果
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