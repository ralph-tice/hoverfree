// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'IMDb',
	version: '0.4',
	prepareImgLinks: function(callback) {
		var res = [];
		$('img[src*="._V1"], img.loadlate, div.rec_poster_img').each(function() {
			var elem = $(this), url;
			if (elem.hasClass('loadlate'))
				url = elem.attr('loadlate');
			else 
				url = hoverZoom.getThumbUrl(this);
			if (url.replace) {
				url = url.replace(/\._V1.*\./, options.showHighRes ? '.' : '._V1._SX600_SY600_.');
				elem.data().hoverZoomSrc = [url];
				res.push(elem);
			}
		});
		callback($(res));
	}
});