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
		$('a[data-expanded-url]').each(function() {
			var link = $(this),
				url = this.getAttribute('data-expanded-url');
			if (url.match(/\/[^:]+\.(?:jpe?g|gif|png|svg|webp|bmp|ico|xbm)(?:[\?#].*)?$/i)) {
				link.data().hoverZoomSrc = [url];
				res.push(link);
			}
		});
		$('a[data-expanded-url*="/photo/"]').each(function() {
			var link = $(this),
				linkData = link.data(),
				expandedUrl = link.attr('data-expanded-url'),
				photoId = expandedUrl.replace(/.*status\/(\d+).*$/, '$1'),
				storedUrl = localStorage['HZcache_' + photoId];
			if (storedUrl) {
				linkData.hoverZoomSrc = [storedUrl];
				link.addClass('hoverZoomLink');
			} else {
				link.mouseenter(function() {
					linkData.hoverZoomMouseOver = true;
					if (linkData.hoverZoomTwitterApiCalled) { return; }
					linkData.hoverZoomTwitterApiCalled = true;
					$.getJSON('http://api.twitter.com/1/statuses/show.json?id=' + photoId + '&include_entities=true&trim_user=true',
						function (data) {
							if (data && data.entities && data.entities.media && data.entities.media.length) {
								var media = data.entities.media[0],
									url = (location.protocol == 'https:') ? media.media_url_https : media.media_url;
									
								linkData.hoverZoomSrc = [url];
								link.addClass('hoverZoomLink');
								
								// Image is displayed if the cursor is still over the link
								if (linkData.hoverZoomMouseOver)
									hoverZoom.displayPicFromElement(link);

								// URLs are stored to lessen API calls
								localStorage['HZcache_' + photoId] = url;
							}
						}
					);
				}).mouseleave(function() {
					linkData.hoverZoomMouseOver = false;
				});
			}
		});
		callback($(res));
	}
});