// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Wordpress',
	prepareImgLinks: function(callback) {
		if ((hoverZoom.pageGenerator && hoverZoom.pageGenerator.indexOf('WordPress') == -1) || $('img[src*="wp-content"]').length == 0) { return; }
		var res = [];
		$('img[src*="wp-content"]').each(function() {
			var img = $(this),
				src = this.src.replace(/-\d+x\d+\./, '.');
			img.data().hoverZoomSrc = [src, src.replace(/jpg$/, 'jpeg')];
			res.push(img);
		});
		callback($(res));
	}
});