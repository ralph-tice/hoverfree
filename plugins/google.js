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
					_this.data().hoverZoomSrc = [src];
					res.push(_this);
				}
			}
		});		
		$('img.O-L-K2').live('mousemove', function() {
			var _this = $(this);
			var src = _this.attr('src');
			console.log(src);
			var urlIndex = href.indexOf('url=');
			if (imgUrlIndex > -1) {
				src = decodeURIComponent(src.substring(imgUrlIndex + 4, src.indexOf('&', imgUrlIndex)));		
				_this.addClass('hoverZoomLink');
				_this.data().hoverZoomSrc = [src];
				//res.push(_this);
			}
		});
		callback($(res));
		
		
		
		$('#rg_hta').mousemove(function() {
			var _this = $(this), data = _this.data();
			if (data.hoverZoomSrc) { return; }
			var src = getSrc(_this);
			if (src) {
				_this.addClass('hoverZoomLink');
				data.hoverZoomSrc = [src];
			}
		}).mouseleave(function() {
			$(this).removeData('hoverZoomSrc');
		});
		
		/*$('.rg_l').mousemove(prepareRgHl);
		$(window).bind('DOMNodeInserted', function(event) {
			var el = event.srcElement
			if (el && el.getAttribute && el.getAttribute('id') == 'rg_h') {
				setTimeout(function() {
					prepareRgHl();
					console.log('appel de mousemove');
					$(document).trigger('mousemove');
					//$(document).mousemove();
					//var evt = document.createEvent("MouseEvents");
					//evt.initEvent("mousemove", true, true);
					//document.getElementById('rg_hl').dispatchEvent(evt);
				}, 1000);
			}
		});*/
	}
});