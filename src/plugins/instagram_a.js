// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Instagram',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [],
			search = /.*instagr\.am\/p\/([^\/]+).*/,
			replace = 'http://instagr.am/p/$1/media/?size=l';
		hoverZoom.urlReplace(res, 'a[ref*="instagr.am/p/"]', search, replace);
		$('a[data-expanded-url*="instagr.am/p/"]').each(function() {
			var link = $(this);
			link.data().hoverZoomSrc = [this.dataset['expandedUrl'].replace(search, replace)];
			res.push(link);
		});
		if (res.length) { callback($(res)); }
	}
});