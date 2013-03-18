// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Pinterest',
    prepareImgLinks:function (callback) {
        var res = [];
		$('div.pin').each(function(){
			var _this = $(this),
				img = _this.find('img.PinImageImg'),
				url = this.dataset ? this.dataset.closeupUrl : false;
			if (img.length) {
				if (!url) {
					url = img.attr('src').replace('/192/', '/550/')
				}
				img.data().hoverZoomSrc = [url];
				res.push(img);
			}
		});
        hoverZoom.urlReplace(res,
            'img[src*="/avatars/"]',
            /\.jpg/,
            '_o.jpg'
        );
        callback($(res));
    }
});
