// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'me.zing.vn',
	version: '0.1',
	prepareImgLinks: function(callback) {
		function prepareImgLink() {
			var _this = $(this);
			var src = _this.find('img')[0].src;
			src = src.replace('130_130.', '574_574.');
			_this.data('hoverZoomSrc', [src]).addClass('hoverZoomLink');
		}
	
		var links = $('img.boderImg');
		links.live('mouseover', prepareImgLink);
		callback(links);		
	}
});