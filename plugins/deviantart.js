// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	version: '0.5',
	prepareImgLinks: function(callback) {
		var res = [],
			https = (document.location.protocol == 'https:'),
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
			srcs = [src + '#1', src + '#2', src + '#3', src + '#4'];
			if (!options.showHighRes) {
				srcs = [srcLo + '#1', srcLo + '#2'].concat(srcs);
			}
			var link = img.parents('a:eq(0)');
			// deviantArt tends to refuse to load images sometimes.
			// src is stored several times in hoverZoomSrc so that it may retry several times if loading fails.
			link.data('hoverZoomSrc', srcs);
			res.push(link);
		});
		callback($(res));
	}
});