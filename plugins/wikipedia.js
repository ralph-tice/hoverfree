// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Wikipedia',
	version: '0.4',
	prepareImgLinks: function(callback) {
		var links = $("a.image, div.l_image a");
		links.each(function() {
			var img = $(this).find('img')[0];
			if (img) {
				var src = img.src;
				if (!src) { return; }
				var ext;
				if (src.substr(src.length-8) == '.svg.png') {
					ext = '.svg';
				}
				else {
					ext = src.substr(src.lastIndexOf('.'));
				}
				var srcs = [];
				if (!options.showHighRes) {
					srcs.push(src.replace(/\/\d+px-/, '/800px-'));
				}
				srcs.push(src.substring(0, src.indexOf(ext) + ext.length).replace(/thumb\//, ''));
				$(this).data('hoverZoomSrc', srcs);
			}
		});
		callback(links);
	}
});