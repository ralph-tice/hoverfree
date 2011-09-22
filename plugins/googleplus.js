// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Google+',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			':not([oid]) > img[src*=".googleusercontent.com/-"]',
			[/\/(w\d+-h\d+|[hws]\d+)(-[npck])*\//, /\?sz=\d+/],
			['/', '']
		);		
		hoverZoom.urlReplace(res, 
			'img[src*="proxy\?url="]',
			/.*proxy\?url=([^&]+).*/,
			'$1'
		);		
		// Circles thumbs
		$('img.a-j-Db-z').each(function() {
			var _this = $(this),
				title = _this.next();
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