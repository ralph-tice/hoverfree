// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Gawker',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a img[src*=/assets]').each(function() {
			var img = $(this),
				url = hoverZoom.getThumbUrl(this);
			if (!url) {	return;	}
			if (url.indexOf('gizmodo.jp') > -1) {
				url = url.replace(/^.*\/([^\/]*)-thumb-.*$/, 'http://img.gizmodo.jp/upload_files2/$1.jpg');
			} else {
				url = url.replace(/\/(\d+x\d*|gallery|medium|small|xsmall)_/, '/');
			}
			if (img.hasClass('avatar')) { url = url.replace(/_\d+\./, '_160.'); }
			url = url.substr(0, url.lastIndexOf('.'));
			img.data('hoverZoomSrc', [url + '.jpg', url + '.png', url + '.gif', url]);
			res.push(img);
		});
		hoverZoom.urlReplace(res, 
			'a img.FB_profile_pic',
			/_[sqta]\./, 
			'_n.'
		);
		hoverZoom.urlReplace(res, 
			'img[src*=/wp/], img[src*=/wp-content/]',
			/-\d+x\d+\./, 
			'.'
		);
		hoverZoom.urlReplace(res, 
			'img[src*=_thumb.]',
			'_thumb.', 
			'.'
		);
		callback($(res));	
	}
});