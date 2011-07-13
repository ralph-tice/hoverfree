// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Google+',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img:not(.a-b-c-z-pa):not(.a-Lc-Ct)[src*="?sz="]',
			/\?sz=\d+/,
			''
		);		
		hoverZoom.urlReplace(res, 
			'img:not([src*="/news/tbn/"])[src*="proxy?url="]',
			/.*proxy\?url=([^&]+).*/,
			'$1'
		);		
		hoverZoom.urlReplace(res, 
			'.ea-S img, .a-b-g-Mp-ba img',
			/\/(w\d+-h\d+|[hws]\d+)(-[pck])*\//,
			'/'
		);		
		// Circles thumbs
		$('img.a-j-Db-z').each(function() {
			var _this = $(this),
				title = _this.siblings('.a-j-Db-Dg');
			if (title.length > 0) {
				_this.data().hoverZoomCaption = title.text();
			}
		});
		// View photos of xxx with...
		$('.a-b-g-Mp-ba img').each(function() {
			var _this = $(this),
				title = _this.parents('.ea-g-Vc').find('a.a-g-h');
			if (title.length > 0) {
				_this.data().hoverZoomCaption = title.text();
			}
		});
		callback($(res));	
	}
});