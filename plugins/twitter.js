// Copyright (c) 2011 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitter',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		hoverZoom.urlReplace(res, 
			'img[src*="_mini"]:not([src*="default_profile_"]), img[src*="_normal"]:not([src*="default_profile_"]), img[src*="_bigger"]:not([src*="default_profile_"])',
			/_(mini|normal|bigger)/,
			''
		);
		/*$('a[data-expanded-url*="/photo/"]').one('mouseover', function() {
			var link = $(this),
				url = link.attr('data-expanded-url'),
				id = url.replace(/.*status\/(\d+).*$/, '$1');
			$.getJSON('http://api.twitter.com/1/statuses/show.json?id=' + id + '&include_entities=true&trim_user=true',
				function (data) {
					if (data && data.entities && data.entities.media && data.entities.media.length) {
						var media = data.entities.media[0];
						link.data().hoverZoomSrc = (location.protocol == 'https:') ? media.media_url_https : media.media_url;
					}
				}
			);
		});*/
		callback($(res));
	}
});