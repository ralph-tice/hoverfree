// Copyright (c) 2012 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Pixiv',
    version:'0.1',
    prepareImgLinks:function (callback) {
        var res = [],
            filter = 'a img[src*="pixiv.net/img"]',
            search = [/_(s|\d+(ms)?|\d+x\d+)\./, '/mobile/'];

        hoverZoom.urlReplace(res, filter, search, ['_m.', '/']);
        if (options.showHighRes) {
            hoverZoom.urlReplace(res, filter, search, ['.', '/']);
        }
        hoverZoom.urlReplace(res, 'a img[src*="pixiv.net/profile/"]', search, ['.', '/']);

        callback($(res));
    }
});