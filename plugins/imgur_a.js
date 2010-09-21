// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Imgur',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a[href*=/imgur.com], a[href*=/i.imgur.com]').each(function() {
			var _this = $(this);
			var href = _this.attr('href');
			href = href.substr(href.lastIndexOf('/'));
			var i = href.indexOf('?');
			if (i > -1) {
				href = href.substr(0, i - 1);
			}
			i = href.indexOf('&');
			if (i > -1) {
				href = href.substr(0, i - 1);
			}
			if (href.indexOf('.') == -1) {
				href = 'http://i.imgur.com' + href;
				_this.data('hoverZoomSrc', [href + '.jpg', href + '.png', href + '.gif']);
				res.push(_this);
			}
		});
		if (res.length) { callback($(res));	}
	}
});