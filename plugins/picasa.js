// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Picasa Web Albums",
	"version": "0.2",
	"prepareImgLinks": function() {
		var links = $("a.goog-icon-list-icon-link,div.gphoto-grid-cell a");
		links.each(function() {
			var src = $(this).find('img')[0].src;
			src = src.replace(/\/(s128|s144-c)\//, '/s800/');
			$(this).data('hoverZoomSrc', [src]);
			
			var tooltip = $(this).parent().find('.goog-icon-list-icon-meta:eq(0)');
			if (tooltip.length) {
				$(this).data('hoverZoomCaption', tooltip.text());
			}
		});
		return links;		
	}
});