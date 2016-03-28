var util = (function() {
    var _cookies = document.cookie;
    // 扩展到原型上的兼容方法
    // Function.bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function() {
            if (typeof this != "function"){
                return;
            }
            var args = Array.prototype.slice.call(arguments),
                bThis = args.shift(),
                that = this,
                fBind = function(){
                    // console.dir(this);
                    return that.apply(bThis, args.concat(Array.prototype.slice.call(arguments)));
                };      
            
            return fBind;
        }
    }
    return {
        extend: function(o1, o2){
            for (var i in o2)
                if (o1[i] == undefined) {
                    o1[i] = o2[i]
                }
        },
        addClass: function(node, className){
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? (current + " " + className) : className;
            }
        },
        delClass: function(node, className) {
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").replace(/^\s+|\s+$/g,'');
        },
        // 兼容版添加事件, 参考jQuery的实现模式加上对ie 8的统一处理，回调与规范e.target等，默认不使用捕获，只关注冒泡
        addEvent: function(elem, type, listener, useCapture){
            // 支持DOM2以上的浏览器
            function listenHandler(e){
                var r = listener.apply(this, arguments);
                // 事件处理函数return false即可取消事件传播
                if(r === false) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return (r);
            }
            // for ie8
            function attachHandler(e){
                if(!e){e = window.event;}
                // 规范target属性
                e.target = e.srcElement;
                e.relatedTarget = e.toElement;
                var r = listener.call(this, e);
                // 兼容实现
                if(r === false){
                    window.event.returnValue = false;
                    window.event.cancelBubble = true;
                }
                return(r);
            }
            if (document.addEventListener) {
                elem.addEventListener(type, listenHandler, useCapture);
            } else {
                elem.attachEvent('on' + type, attachHandler);
            }
        },
        // 兼容版删除事件
        delEvent: function(elem, type, listener, useCapture){
            if(document.removeEventListener) {
                elem.removeEventListener(type, listener, useCapture);
            } else {
                elem.detachEvent('on' + type, listener);
            }
        },
        // 兼容版getElementsByClassName
        getElementsByClassName: function(elem, classNames){
            //  如果提供了该方法，则直接返回结果
            if (elem.getElementsByClassName) {
                return elem.getElementsByClassName(classNames);
            }
            //  兼容实现
            var elementsList = elem.getElementsByTagName('*'),
                result = [],
                match = 0,
                cList = classNames.split(' ');
            
            for (var i=0,element;element = elementsList[i];i++) {

                for (var j=0;j<cList.length;j++) {
                    // 补充首尾空格
                    var names = ' ' + element.className + ' ';
                    match = (names.indexOf(' '+cList[j]+' ') == -1)? 0:1;
                    if(!match) break;
                }
                if (!!match) {
                    result.push(element);
                }
            }

            return result;
        },
        // 简单实现setDatas
        setDataSet: function(elem,datas){
            // 模拟data-key-abc的形式，将大写字母转换成小写字母并前面加上符号-            
            for(key in datas){
                var _key = key.replace(/[A-Z]/g,function($1){
                    return '-'+$1.toLowerCase();
                });
                elem.setAttribute('data-'+_key,datas[key]);
            }
        },
        // 兼容版获取dataset对象
        getDataSet: function(elem){
            // if (false){
            if (elem.dataset||elem.dataset==={}){
                return elem.dataset;
            } else{
                // 默认编写时所有属性使用双引号，去掉双引号并以空格或者<分割字符串获取属性数组
               var outHTML = elem.outerHTML.replace(/"[^"]+"/g, function($1,$2){
                    return $1.replace(/ |\s/g,'&nbsp;');
                })
                var _attr = outHTML.replace(/"/g,'').split(/ |>/);
                var _dataAttr = [];
                var _aTemp = '';
                for(var i =0;i<_attr.length;i++){
                    var _aTemp = _attr[i];
                    if(/^data-/.test(_aTemp)){
                        _dataAttr.push(_aTemp.substring(5));
                    }
                }
                var _tmp = [];
                var _dataSet = {};
                for(var i=0;i<_dataAttr.length;i++){
                    var _start = _dataAttr[i].indexOf('=');
                    _tmp[0] = _dataAttr[i].substring(0,_start);
                    _tmp[1] = _dataAttr[i].substring(_start+1);
                    var _key = _tmp[0].replace(/\-([a-zA-Z])/g, function($1,$2){
                        return $2.toUpperCase();
                    });
                    _dataSet[_key] = _tmp[1];
                }

            }
            return _dataSet;
        },
        // 简单的模板插值<%%>
        parseTemplate: function(tpl, data) {
            var re = /<%([^%>]+)?%>/;
            var match = re.exec(tpl);
            while(!!match) {
                tpl = tpl.replace(match[0], data[match[1]]);
                match = re.exec(tpl);
            }
            return tpl;
        },
        html2node:function (str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },
        // 默认连接符,
        object2string:function(obj,split,encode){
            if(!obj){
                return '';
            }
            var _arr = [];
            for (_key in obj){
                if (!obj.hasOwnProperty(_key)){
                    continue;
                }
                var _value = obj[_key];
                // 不处理function类型
                if (this.type(_value) === 'function'){
                    continue;
                } else if(this.type(_value) === 'date'){
                    _value = _value.getTime();
                } else if(this.type(_value) === 'array'){
                    _value = _value.join(',');
                } else if(this.type(_value) === 'object'){
                    _value = JSON.stringify(_value);
                }
                if(!!encode){
                    _value =  encodeURIComponent(_value);
                }
                _arr.push(encodeURIComponent(_key)+'='+_value);
            }
            return _arr.join(split||',')
        },
        // ajax请求简单封装
        ajax:function(opt){
            var _xhr = new XMLHttpRequest();
            _xhr.onreadystatechange = function(){
                if(_xhr.readyState == 4&&_xhr.status==200){
                    if(!!opt.success){
                        opt.success(_xhr.responseText)
                    }
                    
                }
            };      
            if (opt.type == 'post') {
                _xhr.open('post',opt.url,opt.async||true);
                _xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                _xhr.send(this.object2string(opt.data,'&',true)||'');
            } else if(opt.type == 'get'){
                var _query = '?' + this.object2string(opt.data,'&',true)||'';
                _xhr.open('get',opt.url+_query,opt.async||true);                
                _xhr.send();
            }
            
        },
        // 判断基本类型和内置对象类型
        type:function(obj){
            return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();  
        },
        // cookie操作
        // 获取指定名字的cookie
        getCookie:function(name){
            var _cookieName = encodeURIComponent(name) + '=',
                _cookieStart = _cookies.indexOf(_cookieName),
                _cookieValue = null;
            if(_cookieStart > -1){
                var _cookieEnd = _cookies.indexOf(';');
                if (_cookieEnd<=-1){
                    _cookieEnd = _cookies.length;
                }
                _cookieValue = decodeURIComponent(_cookies.substring(_cookieStart+_cookieName.length, _cookieEnd));
            }
            return _cookieValue;
        },
        // 设置cookie
        setCookie:function(opt){
            var _cookieText = encodeURIComponent(opt.name) + '=' +
                                            encodeURIComponent(opt.value);
            if(this.type(opt.expires) == 'date'){
                _cookieText += " ; expires=" + opt.expires.toGMTString();
            }
            if (opt.path){
                _cookieText += " ; path=" + opt.path;
            }
            if (opt.domain){
                _cookieText += " ; domain=" + opt.domain;
            }
            if(opt.secure){
                _cookieText += " ; secure";
            }
            document.cookie = _cookieText;
        },
        // 重置cookie
        unsetCookie:function(opt){
            opt.value = "";
            opt.expires = new Date(0);
            this.setCookie(opt);
        },
        emitter: {
            // 注册事件
            on: function(event, fn) {
                var handles = this._handles || (this._handles = {}),
                    calls = handles[event] || (handles[event] = []);

                // 找到对应名字的栈
                calls.push(fn);

                return this;
            },
            // 解绑事件
            off: function(event, fn) {
                if (!event || !this._handles) this._handles = {};
                if (!this._handles) return;

                var handles = this._handles,
                    calls;

                if (calls = handles[event]) {
                    if (!fn) {
                        handles[event] = [];
                        return this;
                    }
                    // 找到栈内对应listener 并移除
                    for (var i = 0, len = calls.length; i < len; i++) {
                        if (fn === calls[i]) {
                            calls.splice(i, 1);
                            return this;
                        }
                    }
                }
                return this;
            },
            // 触发事件
            emit: function(event) {
                var args = [].slice.call(arguments, 1),
                    handles = this._handles,
                    calls;

                if (!handles || !(calls = handles[event])) return this;
                // 触发所有对应名字的listeners
                for (var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            }
        }

    }
})();

