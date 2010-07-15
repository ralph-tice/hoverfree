// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Default",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a[href]").filter(function(index) {
			return this.href.match(/^[^\?]*\.(jpg|jpeg|gif|png)$/i);
		});
		links.each(function() {
			if (!$(this).data('hoverZoomSrc') && !$(this).data('hoverZoomIframeSearch'))
				$(this).data('hoverZoomSrc', this.href);
		});
		return links;	
	}
});