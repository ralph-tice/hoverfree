// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Google',
	version: '0.7',
	prepareImgLinks: function(callback) {
		function prepareImgLink(img) {
			var img = $(this),
				link = this.parentNode,
				href = link.href,
				imgUrlIndex = href.indexOf('imgurl=');
			href = href.substring(imgUrlIndex + 7, href.indexOf('&', imgUrlIndex));
			while (decodeURIComponent(href) != href)
				href = decodeURIComponent(href);
			img.data().hoverZoomSrc = [href];
			img.addClass('hoverZoomLink');
		}
		
		$('a[href*="imgurl="] > img').each(prepareImgLink);
		$('#rg_hi').load(prepareImgLink);
	}
});