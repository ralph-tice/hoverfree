// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	version: '0.6',
	prepareImgLinks: function(callback) {
		var res = [];
		
		/*var	https = (document.location.protocol == 'https:'),
			filter = https ? 'a img[src*="/th/"]' : 'a img[src^="http://th"]',
			sizeIndex = https ? 5 : 4;
		$(filter).each(function() {
			var img = $(this);
			var src = img.attr('src'), srcLo;
			if (!src) { return; }
			var aSrc = src.split('/');
			if (!options.showHighRes) {
				aSrc[sizeIndex] = 'PRE';
				srcLo = aSrc.join('/');
			}
			aSrc.splice(sizeIndex, 1);
			src = aSrc.join('/');
			// deviantArt tends to refuse to load images sometimes.
			// src is stored several times in hoverZoomSrc so that it may retry several times if loading fails.
			srcs = [src + '#1', src + '#2', src + '#3', src + '#4'];
			if (!options.showHighRes) {
				srcs = [srcLo + '#1', srcLo + '#2'].concat(srcs);
			}
			var link = img.parents('a:eq(0)');
			link.data().hoverZoomSrc = srcs;
			res.push(link);
		});*/
		$('a[super_img]').each(function() {
			var _this = $(this),
				url = this.getAttribute('super_img');
			if (options.showHighRes && this.hasAttribute('super_fullimg'))
				url = this.getAttribute('super_fullimg');
			_this.data().hoverZoomSrc = [url];
			res.push(_this);
		});
		callback($(res));
	}
});