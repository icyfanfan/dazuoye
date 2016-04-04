/**
 * @author 黄笛
 * @description 工具类，提供兼容的基础方法供其他文件调用；
 */
var util = (function() {
    "use strict";
    var cookies = document.cookie;
    // 扩展到Funciton原型上的兼容方法bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function() {
            if (typeof this != "function"){
                return;
            }
            // bind方法实现
            var args = Array.prototype.slice.call(arguments),
                bThis = args.shift(),
                that = this,
                fBind = function(){
                    return that.apply(bThis, args.concat(Array.prototype.slice.call(arguments)));
                };      
            
            return fBind;
        }
    }
    return {
        /**
         * 课件上提供的extend方法，mixin模式拷贝属性
         * @param  {Object} oTo 拷贝目标
         * @param  {Object} oFrom 拷贝源
         * @return 无
         */
        extend: function(oTo, oFrom){
            for (var i in oFrom)
                if (oTo[i] == undefined) {
                    oTo[i] = oFrom[i]
                }
        },
        /**
         * 为节点添加类名
         * @param {Element} node  节点
         * @param {String} className 类名
         * @return 无
         */
        addClass: function(node, className){
            if(!node){
                return;
            }
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? (current + " " + className) : className;
            }
        },
        /**
         * 删除节点上的类名
         * @param {Element} node  节点
         * @param {String} className 类名
         * @return 无
         */
        delClass: function(node, className) {
            if(!node){
                return;
            }
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").replace(/^\s+|\s+$/g,'');
        },
        /**
         * 兼容版添加事件, 参考jQuery的实现模式加上对ie 8的统一处理，回调与规范e.target等，默认不使用捕获，只关注冒泡
         * 根据回调函数返回true或false，继续事件传播或取消事件传播
         * @param {Element} elem       节点
         * @param {String]} type       事件类型
         * @param {Function} listener  回调函数
         * @param {Boolean} useCapture 是否捕获
         * @return 无
         */
        addEvent: function(elem, type, listener, useCapture){
            // 支持DOM2以上的浏览器
            function listenHandler(e){
                var r = listener.apply(this, arguments);
                // 事件处理函数return false即可取消事件传播和默认处理
                if(r === false) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return (r);
            }
            // 不支持DOM2以上浏览器
            function attachHandler(e){
                if(!e){e = window.event;}
                // 规范target属性
                e.target = e.srcElement;
                e.relatedTarget = e.toElement;
                var r = listener.call(this, e);
                // 兼容实现取消事件冒泡和取消事件默认处理
                if(r === false){
                    window.event.returnValue = false;
                    window.event.cancelBubble = true;
                }
                return(r);
            }
            // 检测浏览器对事件的支持情况，分类处理
            if (document.addEventListener) {
                elem.addEventListener(type, listenHandler, useCapture|false);
            } else {
                elem.attachEvent('on' + type, attachHandler);
            }
        },
        /**
         * 兼容版删除事件
         * @param {Element} elem       节点
         * @param {String]} type       事件类型
         * @param {Function} listener  回调函数
         * @param {Boolean} useCapture 是否捕获
         * @return 无
         */
        delEvent: function(elem, type, listener, useCapture){
            if(document.removeEventListener) {
                elem.removeEventListener(type, listener, useCapture);
            } else {
                elem.detachEvent('on' + type, listener);
            }
        },
        /**
         * 兼容版getElementsByClassName
         * @param  {Element} elem       节点
         * @param  {String}  classNames 类名，可传入多个，以空格分开
         * @return {Array}   获取到的节点数组
         */
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
        /**
         * 简单实现将传入属性设置为传入节点的dataSet属性
         * @param {Element} elem  传入节点
         * @param {Object} datas 传入属性
         */
        setDataSet: function(elem,datas){
            // 传入空对象则返回
            if(datas == {}){
                return;
            }
            // 模拟data-key-abc的形式，将大写字母转换成小写字母并前面加上符号-            
            for(var key in datas){
                var k = key.replace(/[A-Z]/g,function($1){
                    return '-'+$1.toLowerCase();
                });
                elem.setAttribute('data-'+k,datas[key]);
            }
        },
        /**
         * 兼容版获取节点dataset对象
         * @param {Element} elem  传入节点
         * @return {Object} 获取到的dataset对象
         */
        getDataSet: function(elem){
            // 检测浏览器是否支持Element.dataset属性
            if (elem.dataset||elem.dataset==={}){
                return elem.dataset;
            // 兼容实现，为获得较好的效率，使用正则匹配的方式
            } else{
                // 替换属性中的空格
                var outHTML = elem.outerHTML.replace(/"[^"]+"/g, function($1,$2){
                    return $1.replace(/ |\s/g,'&nbsp;');
                })
                // 默认编写时所有属性使用双引号，去掉双引号并以空格或者<分割字符串获取属性数组
                var attr = outHTML.replace(/"/g,'').split(/ |>/);
                var dataAttr = [];
                var aTemp = '';
                // 获取所有data-开头的属性
                for(var i =0;i<attr.length;i++){
                    var aTemp = attr[i];
                    if(/^data-/.test(aTemp)){
                        dataAttr.push(aTemp.substring(5));
                    }
                }
                var tmp = [];
                var dataSet = {};
                // 组成dataSet对象
                for(var i=0;i<dataAttr.length;i++){
                    var start = dataAttr[i].indexOf('=');
                    tmp[0] = dataAttr[i].substring(0,start);
                    tmp[1] = dataAttr[i].substring(start+1);
                    var key = tmp[0].replace(/\-([a-zA-Z])/g, function($1,$2){
                        return $2.toUpperCase();
                    });
                    dataSet[key] = tmp[1];
                }

            }
            return dataSet;
        },
        /**
         * html标签元素过滤替换
         * @param  {String} str 传入字符串
         * @return {String} 过滤后的字符串   
         */
        strFilter: function(str){
            // html标签字符过滤
            str.replace(/[&<">']/g, function($1, $2) {
                if($2){
                    return $1;
                }else{
                    return {
                        '<':'&lt;',
                        '&':'&amp;',
                        '"':'&quot;',
                        '>':'&gt;',
                        "'":'&#39;',
                    }[$1];
                }
            });

            return str;
        },
        /**
         * 简单的模板插值，支持<%%>标记，处理数据将空格和html标签元素过滤
         * @param  {String} tpl  字符串模板
         * @param  {Object} data 数据对象
         * @return {String}      插值后的字符串模板
         */
        parseTemplate: function(tpl, data) {
            var re = /<%([^%>]+)?%>/;
            var match = re.exec(tpl);
            // 获取匹配项并替换
            while(!!match) {
                var tmpValue = '';
                if(data[match[1]]){
                    tmpValue = this.strFilter(data[match[1]].toString());
                }
                tpl = tpl.replace(match[0], tmpValue);                
                match = re.exec(tpl);            
            }
            // debugger;
            return tpl;
        },
        /**
         * html模板转换为node节点
         * @param  {String} str 字符串模板
         * @return {Element}    返回节点
         */
        html2node:function (str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },
        /**
         * 将对象转为字符串，默认连接符为','
         * @param  {Object} obj 传入对象   
         * @param  {String} split 连接符 
         * @param  {Boolean} encode 是否需要URI编码
         * @return {String}  转换后的字符串      
         */
        object2string:function(obj,split,encode){
            if(!obj){
                return '';
            }
            var arr = [];
            for (var key in obj){
                if (!obj.hasOwnProperty(key)){
                    continue;
                }
                var value = obj[key];
                // 不处理function类型
                if (this.type(value) === 'function'){
                    continue;
                } else if(this.type(value) === 'date'){
                    value = value.getTime();
                } else if(this.type(value) === 'array'){
                    value = value.join(',');
                } else if(this.type(value) === 'object'){
                    value = JSON.stringify(value);
                }
                if(!!encode){
                    value =  encodeURIComponent(value);
                }
                arr.push(encodeURIComponent(key)+'='+value);
            }
            return arr.join(split||',')
        },
        /**
         * ajax请求,处理跨域与非跨域两种情况，如果需要跨域调用getCORSRequest获取到能处理跨域的XMLHttpRequest对象
         * 默认使用get方式
         * @param  {Object} opt 传入参数
         * @return 无
         */
        ajax:function(opt){
            var query = '',
                xhr = new XMLHttpRequest();
            opt.method = opt.method||'get';
            // 是否传参
            if(opt.data && opt.method=='get'){
                query = '?' + this.object2string(opt.data,'&',true)||'';
            }      
            // 判断是否需要跨域请求     
            if(opt.noCors){
                xhr.open(opt.method,opt.url+query);    
                xhr.onreadystatechange = function () {
                    if ( xhr.readyState !== 4 || xhr.status !== 200 && xhr.status !== 304 ){
                        return;
                    }
                    opt.success( xhr.responseText ); 
                }         
            }else{
                xhr = this.getCORSRequest(opt.method,opt.url+query,opt.async);
                xhr.onload = function(){                                
                    if(!!opt.success){
                        opt.success(xhr.responseText);
                    }                    
                }      
            }
            // post方法传参
            if(opt.method == 'post'){
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhr.send(this.object2string(opt.data,'&',true)||'');
            }else{
                xhr.send(null);
            }
        },
        /**
         * 兼容版获取支持跨域的请求对象
         * @param  {String} method 请求方式，get或post
         * @param  {String} url    请求地址
         * @return {XMLHttpRequest或XDomainRequest}    支持跨域的请求对象
         */
        getCORSRequest: function(method,url){
            var xhr = new XMLHttpRequest();
            // 是否支持跨域
            if('withCredentials' in xhr){
                xhr.open(method, url, true);
            } else if(this.type(XDomainRequest) != 'undefined'){
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } 
            return xhr;
        },
        /**
         * 判断基本类型和内置对象类型
         * @param  {Object} obj 传入待判断类型的对象
         * @return {String}     判断结果
         */
        type:function(obj){
            return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();  
        },
        /**
         * cookie操作,获取指定名字的cookie
         * @param  {String} name cookie名
         * @return {String}      查询cookie值结果
         */
        getCookie:function(name){
            var cookieName = encodeURIComponent(name) + '=',
                cookieStart = cookies.indexOf(cookieName),
                cookieValue = null;
            if(cookieStart > -1){
                var cookieEnd = cookies.indexOf(';');
                if (cookieEnd<=-1){
                    cookieEnd = cookies.length;
                }
                cookieValue = decodeURIComponent(cookies.substring(cookieStart+cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        /**
         * 设置cookie
         * @param {Object} opt 设置参数
         * @return 无
         */
        setCookie:function(opt){
            var cookieText = encodeURIComponent(opt.name) + '=' +
                                            encodeURIComponent(opt.value);
            if(this.type(opt.expires) == 'date'){
                cookieText += " ; expires=" + opt.expires.toGMTString();
            }
            if (opt.path){
                cookieText += " ; path=" + opt.path;
            }
            if (opt.domain){
                cookieText += " ; domain=" + opt.domain;
            }
            if(opt.secure){
                cookieText += " ; secure";
            }
            document.cookie = cookieText;
        },
        /**
         * 重置cookie
         * @param {Object} opt 设置参数
         * @return 无
         */
        unsetCookie:function(opt){
            opt.value = "";
            opt.expires = new Date(0);
            this.setCookie(opt);
        },
        /**
         * 课件提供-事件发射器
         */
        emitter: {
            // 注册事件
            on: function(event, fn) {
                var handles = this.handles || (this.handles = {}),
                    calls = handles[event] || (handles[event] = []);

                // 找到对应名字的栈
                calls.push(fn);

                return this;
            },
            // 解绑事件
            off: function(event, fn) {
                if (!event || !this.handles) this.handles = {};
                if (!this.handles) return;

                var handles = this.handles,
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
                    handles = this.handles,
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

