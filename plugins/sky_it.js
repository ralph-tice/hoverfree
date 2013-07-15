// Copyright (c) 2011 Andrea Carron <mail2hox@gmail.com> and Romain Vallet <romain.vallet@gmail.com>
// Copyright (c) 2013 Ralph Tice
// removed hidden links eval
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Sky.it',
    version:'0.1',
    prepareImgLinks:function (callback) {
        var res = [],
            sky_n = 0,
            pics_data = [],

        $('img[src*="/resized/"], a.opener_img').each(function () {
            var img = $(this),
                src = hoverZoom.getThumbUrl(this);

            if (src.substr(-4) != '.jpg')
                return;

            src = src.replace('/resized/', '/original/').replace(/_\d+x\d+\./, '.');
            img.data('hoverZoomSrc', [src]);

            if (pics_data && pics_data[sky_n] && pics_data[sky_n].description)
                img.data('hoverZoomCaption', pics_data[sky_n].description);
            sky_n++;

            res.push(img);
        });

        callback($(res));
    }
});
