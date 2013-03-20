// Copyright (c) 2013 Ralph Tice
// Licensed under the MIT license, read license.txt
// example url: https://i.chzbgr.com/maxW500/6695538688/h1D87EBD4/
// tested on: http://www.reddit.com/domain/i.chzbgr.com/
var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'chzbgr.com',
    version:'0.1',
    prepareImgLinks:function (callback) {
        var links = $('a[href*="//i.chzbgr.com/"]');
    	links.each(function () {
            $(this).data().hoverZoomSrc = [$(this).attr('href')];
        });
        callback(links);
    }
});