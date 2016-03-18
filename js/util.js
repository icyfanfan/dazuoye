var util = (function() {

    return {
        extend: function(o1, o2) {
            for (var i in o2)
                if (o1[i] == undefined) {
                    o1[i] = o2[i]
                }
        },
        addClass: function(node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? (current + " " + className) : className;
            }
        },
        delClass: function(node, className) {
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        },
        addEvent: function(elem, type, listener, useCapture) {
            if (document.addEventListener) {
                elem.addEventListener(type, listener, useCapture);
            } else {
                elem.attachEvent('on' + type, listener);
            }
        },
        // 简单的模板插值<%%>
        parseTemplate: function(tpl, data) {
            var re = /<%([^%>]+)?%>/g;
            while(match = re.exec(tpl)) {
                tpl = tpl.replace(match[0], data[match[1]])
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
})()
