// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt
// Contributions by Alex de Moure

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Tagged',
    version:'0.2',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'a img, #meetme_imagediv img, #friends_thumbs img, #friends_grid_fs img',
            /\/\d([^\/]+)$/,
            '/0$1'
        );
        callback($(res));
    }
});