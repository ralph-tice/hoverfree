// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Yahoo',
	version: '0.3',
	prepareImgLinks: function(callback) {
		var links = $("#yschimg a[href], .sm-media a[href], .imgdd a[href]");
		var res = [];
		try {
			links.each(function() {
				var _this = $(this);
				if (_this.attr('href')) {
					var img = _this.find('img').get(0);
					var src = unescape(_this.attr('href'));
					var imgUrlIndex = src.indexOf('imgurl=');
					if (imgUrlIndex == -1) {
						if (img) {
							src = $(img).attr('src');
							imgUrlIndex = src.indexOf('url=');
							if (imgUrlIndex > -1) {
								imgUrlIndex -= 3;
							}
						}
					}
					if (imgUrlIndex > -1) {
						src = unescape(src.substring(imgUrlIndex + 7, src.indexOf('&', imgUrlIndex)));		
						if (src.substr(0, 4) != 'http') {
							src = 'http://' + src;
						}
						_this.data('hoverZoomSrc', [src]);
						res.push(_this);
					} else {
						if (img) {
							src = $(img).attr('src');
							var lastDotIndex = src.lastIndexOf('.');
							if (src.substr(lastDotIndex - 2, 2) == '-s') {
								src = unescape(src.replace('-s.', '.'));	
								_this.data('hoverZoomSrc', [src]);
								res.push(_this);
							}
						}
					}
				}
			});
		} finally {
			callback($(res));
		}
	}
});