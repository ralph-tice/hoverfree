// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Facebook",
	"version": "0.4",
	"prepareImgLinks": function() {
		var links = $();
		var imgs = $('a img.img:not([src^="http://static.ak.fbcdn.net"]),a img.UIProfileImage'); //:not(.loader):not(.throbber)
		imgs.each(function() {
			links = links.add($(this).parents('a').get(0));
		});
		links.each(function() {
			
			// Thumbnail URL
			var img = $(this).find('img').get(0);
			var src = unescape(img.src);
			
			// If image URL is included as a querystring parameter
			var indexQS = src.lastIndexOf('&url=');
			if (indexQS == -1)
				indexQS = src.lastIndexOf('&src=');
				
			if (indexQS > -1) {
				src = unescape(src.substr(indexQS + 5));
				if (src.indexOf('&') > -1)
					src = src.substr(0, src.indexOf('&'));
			} else {
				src = src.replace(/photos-\w/, 'sphotos').replace(/_[sqta]\./, '_n.').replace(/\/[sqta](\d)/, '/n$1');
			}
			
			$(this).data('hoverZoomSrc', [src]);
			
			var tooltip = $(this).find('.uiTooltipText:eq(0)');
			if (tooltip.length) {
				$(this).data('hoverZoomCaption', tooltip.text());
			}
		});
		return links;		
	}
});