// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Gawker',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a img[src*=/assets/]').each(function() {
			var img = $(this),
				url = hoverZoom.getThumbUrl(this);
			if (!url) {	return;	}
			url = url.replace(/\/([0-9]+x[0-9]*|gallery)_/, '/');
			if (img.hasClass('avatar')) { url = url.replace(/_[0-9]+\./, '_160.'); }
			url = url.substr(0, url.lastIndexOf('.'));
			img.data('hoverZoomSrc', [url + '.jpg', url + '.png', url + '.gif', url]);
			res.push(img);
		});
		hoverZoom.urlReplace(res, 
			'a img.FB_profile_pic',
			/_[sqta]\./, 
			'_n.'
		);
		callback($(res));	
	}
});