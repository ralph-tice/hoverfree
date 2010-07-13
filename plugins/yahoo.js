// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Yahoo",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("#yschimg a[href], .sm-media a[href]");
		var res = $();
		links.each(function() {
			if ($(this).attr('href')) {
				var src = unescape($(this).attr('href'));
				var imgUrlIndex = src.indexOf('imgurl=');
				if (imgUrlIndex == -1) {
					src  = unescape($(this).find('img')[0].src);
					imgUrlIndex = src.indexOf('url=');
					if (imgUrlIndex > -1) {
						imgUrlIndex -= 3;
					}
				}
				if (imgUrlIndex > -1) {
					src = src.substring(imgUrlIndex + 7, src.indexOf('&', imgUrlIndex));		
					if (src.substr(0, 4) != 'http') {
						src = 'http://' + src;
					}
					$(this).data('hoverzoomsrc', src);
					res = res.add($(this));
				}
			}
		});
		return res;		
	}
});