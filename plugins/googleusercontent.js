// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'googleusercontent',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*=".googleusercontent.com/"]',
            /(\/|=)(w\d{2,}-h\d{2,}|[hws]\d{2,})(-[npck])*(\/|$)/,
            options.showHighRes ? '$1s0$4' : '$1s800$4'
        );
        callback($(res));
    }
});
