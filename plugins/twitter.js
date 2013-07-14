// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Twitter',
    version:'0.2',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*="_mini"]:not([src*="default_profile_"]), img[src*="_normal"]:not([src*="default_profile_"]), img[src*="_bigger"]:not([src*="default_profile_"])',
            /_(mini|normal|bigger)/,
            ''
        );
        hoverZoom.urlReplace(res,
            'img[src*=":thumb"]',
            ':thumb',
            ''
        );
        $('a[data-expanded-url], a[data-full-url], a[data-url]').each(function () {
            var link = $(this),
                url = this.getAttribute('data-expanded-url') || this.getAttribute('data-full-url') || this.getAttribute('data-url');
            if (url.match(/\/[^:]+\.(?:jpe?g|gif|png|svg|webp|bmp|ico|xbm)(?:[\?#].*)?$/i)) {
                link.data().hoverZoomSrc = [url];
                res.push(link);
            }
        });

        $('a:contains("pic.twitter.com/")').each(function () {
            var link = $(this);
            var url = $(link.parent().parent().parent().data('expandedFooter')).find("a.media-thumbnail").data('url');
            link.data().hoverZoomSrc = [url];
            link.addClass('hoverZoomLink');
        });

/*        $('a[data-expanded-url*="/photo/"], a[data-full-url*="/photo/"]').each(function () {
            var link = $(this),
                expandedUrl = link.attr('data-expanded-url') || link.attr('data-full-url'),
                photoId = expandedUrl.replace(/.*status\/(\d+).*$/, '$1');
            //getFromAPI(link, photoId);
            link.addClass('hoverZoomLink');
        });
*/
        callback($(res));
    }
});
