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
            var _tmpList = this.control.querySelectorAll('li');
            for(var i=0;i<_tmpList.length;i++){
                _.addEvent(_tmpList[i],function(e){
                    debugger;
                })
            }
        },
    });
    window.Tab = Tab;
})(util);