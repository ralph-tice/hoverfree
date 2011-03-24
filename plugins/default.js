// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Default',
	version: '0.5',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a[href]').filter(function() {
			return this.href.match(/\/[^:]+\.(?:jpe?g|gif|png|svg|bmp|ico|xbm)(?:[\?#].*)?$/i);
		}).each(function() {
			var _this = $(this);
			if (!_this.data('hoverZoomSrc')) {
				_this.data('hoverZoomSrc', [this.href]);
				res.push(_this);
			}
		});
		callback($(res));	
	}
});