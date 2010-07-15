// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Google",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("#iur a[href], #ImgContent a[href]");
		var res = $();
		links.each(function() {
			if ($(this).attr('href')) {
				var imgUrlIndex = $(this).attr('href').indexOf('imgurl=');
				if (imgUrlIndex > -1) {
					var src = unescape($(this).attr('href').substring(imgUrlIndex + 7, $(this).attr('href').indexOf('&', imgUrlIndex)));		
					$(this).data('hoverZoomSrc', src);
					res = res.add($(this));
				}
			}
		});
		return res;		
	}
});