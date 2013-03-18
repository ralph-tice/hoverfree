// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'YouTube',
    prepareImgLinks:function (callback) {
        var res = [],
            repl = 'http://i1.ytimg.com/vi/$1/0.jpg';
        /*hoverZoom.urlReplace(res,
            'a[href*="youtube.com/watch"] img',
            /^.*v=([\w-]+).*$/,
            repl,
            'eq(0)'
        );
        hoverZoom.urlReplace(res,
            'a[href*="youtu.be/"] img',
            /^.*youtu.be\/([\w-]+).*$/,
            repl,
            'eq(0)'
        );*/
        $('a[href*="youtu.be/"] img').each(function () {
            var link = $(this.parentNode);
            link.data().hoverZoomSrc = [link.attr('href').replace(/^.*youtu.be\/([\w-]+).*$/, repl)];
            res.push(link);
        });
        $('a[href*="youtube.com/watch"] img').each(function () {
            var link = $(this.parentNode);
            link.data().hoverZoomSrc = [link.attr('href').replace(/^.*v=([\w-]+).*$/, repl)];
            res.push(link);
        });
        hoverZoom.urlReplace(res,
            'img[src*="ytimg.com/vi/"]',
            /\/(\d|default)\.jpg/,
            '/0.jpg'
        );
        $('img[data-thumb*="ytimg.com/vi/"]').each(function () {
            var _this = $(this);
            _this.data().hoverZoomSrc = [_this.attr('data-thumb').replace(/\/(\d|default)\.jpg/, '/0.jpg')];
            res.push(_this);
        });
        callback($(res));
    }
});