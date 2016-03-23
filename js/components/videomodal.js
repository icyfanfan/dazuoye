(function(_){
    var tpl = '';

    function VideoModal(opt){
        var _opt = opt || {};
        Modal.apply(this,_opt);

        // 设置视频框内容
        this.setContent(lgTpl);
        
    }
    // 使用扩展的方式继承父类方法
    _.extend(LoginModal.prototype, Modal.prototype);
    // 子类原型上的方法
    _.extend(LoginModal.prototype, {

    });
    window.LoginModal = LoginModal;
})(util);