// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Reddit',
	version: '0.1',
	prepareImgLinks: function(callback) {
		$('.hoverZoomLink').each(function() {
			var _this = $(this),
				title = _this.parent().find('a.title').text();
			_this.data().hoverZoomCaption = title;
		});
	}
});