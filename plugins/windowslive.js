// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Windows Live Photos",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("#thumbnailHost a");
		links.each(function() {		
			$(this).removeData('hoverZoomSrc');
			$(this).data('hoverZoomIframeSearch', '#spPreviewImage');
		});
		return links;		
	}
});
