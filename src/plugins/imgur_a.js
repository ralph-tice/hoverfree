// Copyright (c) 2012 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Imgur',
    version:'0.4',
    prepareImgLinks:function (callback) {

        var res = [],
            minSplitLength = 4;

        function prepareImgLink() {
            var link = $(this), data = link.data(), href = link.attr('href');
            if (data.hoverZoomSrc) {
                return;
            }

            function createUrls(hash) {
                var url = 'http://i.imgur.com/' + hash;
                var srcs = [url + '.jpg', url + '.gif', url + '.png'];
                // Same array duplicated several times so that a retry is done if an image fails to load
                return srcs.concat(srcs).concat(srcs).concat(srcs);
            }

            var matches = href.match(/(?:\/(a|signin))?\/([^\W_]{5})(?:\/|\.[a-zA-Z]+|#([^\W_]{5}|\d+))?$/);
            if (matches && matches[2]) {

                var view = matches[1];
                var hash = matches[2];
                var excl = ['imgur', 'forum', 'stats'];
                if (excl.indexOf(hash) > -1) {
                    return;
                }

                switch (view) {
                    case 'signin':
                        return;
                    case 'a': // album view:
                        var anchor = matches[3];
                        if (!anchor || anchor.match(/^\d+$/)) { // whole album or indexed image
                            data.hoverZoomGallerySrc = [];
                            data.hoverZoomGalleryCaption = [];

                            var albumUrl = 'http://api.imgur.com/2/album/' + hash + '.json';
                            $.get(albumUrl, function (imgur) {
                                imgur.album.images.forEach(function (img) {
                                    var urls = createUrls(img.image.hash),
                                        caption = img.image.title;
                                    if (data.hoverZoomGallerySrc.indexOf(urls) == -1) {
                                        if (caption != '' && img.image.caption != '') {
                                            caption += ';\n';
                                        }
                                        caption += img.image.caption;
                                        data.hoverZoomGalleryCaption.push(caption);
                                        data.hoverZoomGallerySrc.push(urls);
                                    }
                                });
                                callback($([link]));
                            });
                            break;
                        } else { // image of an album (hash as anchor)
                            hash = anchor; // fall through
                        }
                    case undefined:
                    default: // single pic view
                        data.hoverZoomSrc = createUrls(hash);
                        res.push(link);
                }
            }
        }

        // Every sites
        $('a[href*="//imgur.com/"], a[href*="//www.imgur.com/"], a[href*="//i.imgur.com/"], ').each(prepareImgLink);

        // On imgur.com (galleries, etc)
        if (window.location.host.indexOf('imgur.com') > -1) {
            minSplitLength = 2;
            $('a[href^="/"]').each(prepareImgLink);
        }

        if (res.length) {
            callback($(res));
        }
    }

});
