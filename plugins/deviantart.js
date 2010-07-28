// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	version: '0.3',
	prepareImgLinks: function(callback) {
		var links = $("a[super_img]");
		links.each(function() {		
			$(this).data('hoverZoomSrc', [$(this).attr('super_fullimg') || $(this).attr('super_img')]);
		});
		return callback(links);
	}
});