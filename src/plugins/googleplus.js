// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Google+',
    version:'0.2',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*=".googleusercontent.com/-"]',
            /\/(w\d+-h\d+|[hws]\d+)(-[npck])*\//,
            options.showHighRes ? '/s0/' : '/s800/'
        );
        hoverZoom.urlReplace(res,
            'img[src*="proxy\?url="]',
            /.*proxy\?url=([^&]+).*/,
            '$1'
        );
        callback($(res));
    }
});