;(function(_){
    var supportMediaQuery = window.matchMedia && window.matchMedia( "only all" ) !== null && window.matchMedia( "only all" ).matches;
    // 如果支持@media则直接返回
    if(supportMediaQuery){
        // return ;
    }
    // debugger;
    var doc = document,
        head = doc.head||document.getElementsByTagName('head')[0],
        links = head.getElementsByTagName('link'),
        regs = {
            media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
            keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
            comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
            urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
            findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
            only: /(only\s+)?([a-zA-Z]+)\s?/,
            minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
            maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
            minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
            other: /\([^\)]*\)/g
        },
    // 获取head中引入的外联样式表
    var getCss = function(){

        for(var i=0;i<links.length;i++){
            _.ajax({
                method:'get',
                url:links[i].href,
                noCors:true,
                success:function(r){

                }
            })
        }
    }
    getCss();
    _.addEvent(window, 'resize', function(){

    });
})(util)