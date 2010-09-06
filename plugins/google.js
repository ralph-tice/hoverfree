// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Google',
	version: '0.6',
	prepareImgLinks: function(callback) {
	
		function getSrc(link) {
			var href = link.attr('href');
			if (!href) { return null; }
			var imgUrlIndex = href.indexOf('imgurl=');
			if (imgUrlIndex > -1) {
				return decodeURIComponent(href.substring(imgUrlIndex + 7, href.indexOf('&', imgUrlIndex)));		
			} else {
				return null;
			}
		}
		
		var res = [];
		$('#iur a[href], #ImgCont a[href]').each(function() {
			var _this = $(this);
			if (_this.attr('href')) {
				var src = getSrc(_this);
				if (src) {
					_this.data('hoverZoomSrc', [src]);
					res.push(_this);
				}
			}
		});		
		callback($(res));
		
		function rgHtaOnMouseMove() {
			var _this = $(this);
			var src = getSrc(_this);
			_this.addClass('hoverZoomLink').data('hoverZoomSrc', [src]);
		}		
		$('#rg_hta').mousemove(rgHtaOnMouseMove);
	}
});