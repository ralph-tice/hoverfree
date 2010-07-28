// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Google',
	version: '0.4',
	prepareImgLinks: function(callback) {
	
		function getSrc(link) {
			var imgUrlIndex = link.attr('href').indexOf('imgurl=');
			if (imgUrlIndex > -1) {
				return decodeURIComponent(link.attr('href').substring(imgUrlIndex + 7, link.attr('href').indexOf('&', imgUrlIndex)));		
			} else {
				return null;
			}
		}
		
		var links = $("#iur a[href], #ImgCont a[href]");
		var res = [];
		links.each(function() {
			var _this = $(this);
			if (_this.attr('href')) {
				var src = getSrc(_this);
				if (src) {
					_this.data('hoverZoomSrc', [src]);
					res.push(_this);
				}
			}
		});
		
		function rgHiOnLoad() {
			var src = getSrc($(this).parent());
			$('#rg_hta').addClass('hoverZoomLink').data('hoverZoomSrc', [src]).data('hoverZoomSrcIndex', 0);
		}		
		$('#rg_hi').load(rgHiOnLoad);
		
		callback($(res));
	}
});