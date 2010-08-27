// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Baidu',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		
		// Image search
		$("a[href^=/i?]").each(function() {
			var _this = $(this);
			var src = _this.attr('onclick');
			if (src) {
				src = src.toString();
				src = src.substring(src.indexOf('http'), src.lastIndexOf("',"));
				_this.data('hoverZoomSrc', [src]);
				res.push(_this);
			}
		});
		
		// Encyclopedia, Space, etc
		hoverZoom.srcReplace(res, 
			'a img[src*=/abpic/], a img[src*=/mpic/]',
			/abpic|mpic/,
			'pic'
		);		
				
		// News
		hoverZoom.srcReplace(res, 
			"a img[src*='/it/u=']",
			/.+(http:.*)&.*/,
			'$1'
		);	

		callback($(res));
	}
});