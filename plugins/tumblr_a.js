// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Tumblr',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a img[src*=media.tumblr.com]').each(function() {
			var img = $(this),
				url = img.attr('src'),
				link = img.parents('a:eq(0)');
			url = url.replace(/_[0-9a-z]*\.(.*)$/, '_maxwidth.$1');
			link.data('hoverZoomSrc', [
				url.replace('maxwidth', '1280'),
				url.replace('maxwidth', '500'),
				url.replace('maxwidth', '400'),
				url.replace('maxwidth', '250'),
				url.replace('maxwidth', '100')
			]);
			res.push(link);
		});
		callback($(res));
	}
});