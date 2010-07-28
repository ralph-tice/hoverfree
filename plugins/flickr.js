// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Flickr',
	version: '0.3',
	prepareImgLinks: function(callback) {
		var res = [];
		$('span.photo_container a,div.context-photos a').each(function() {
			var _this = $(this);
			
			// Image URL
			var src = _this.find('img')[0].src;
			src = src.replace(/_[mst]\./, '.');
			
			// If an invisible link (spaceball.gif) has been put on the thumbnail...
			var spaceBall = _this.parent().parent().find('a.image_link');
			if (spaceBall.length > 0) {
				spaceBall.data('hoverZoomSrc', [src]);
				res.push(spaceBall);
			} 

			_this.data('hoverZoomSrc', [src]);
			res.push(_this);
		});
		callback($(res));
	}
});