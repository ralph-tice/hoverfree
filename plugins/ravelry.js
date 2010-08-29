// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Ravelry',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		
		$('.thumbnail, .zoomable_photo, .photo').each(function() {
			var _this = $(this);
			var src = _this.attr('style');
			if (!src) return;
			src = src.substr(src.indexOf('http:'));
			src = src.substr(0, src.indexOf("'"));
			src = src.replace('_small', '').replace('_best_fit', '').replace(/_[mst]./, '.');
			_this.data('hoverZoomSrc', [src]);
			res.push(_this);
		});

		hoverZoom.srcReplace(res, 
			'a img',
			/_square\.|_[mst]\./,
			'.'
		);	
		
		callback($(res));
	}
});