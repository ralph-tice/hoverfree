// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Tumblr',
	version: '0.1',
	prepareImgLinks: function(callback) {
		var res = [];
		$('img[src*="media.tumblr.com/tumblr_"]').each(function() {
			var img = $(this),
				url = img.attr('src'),
				link = img.parents('a:eq(0)'),
				width = img.width(),
				url = url.replace(/_[0-9a-z]*\.(.*)$/, '_maxwidth.$1'),
				urls = [];
			link = link.length ? link : img;
			//if (width < 1280) { urls.push(url.replace('maxwidth', '1280')); }
			if (width < 500) { urls.push(url.replace('maxwidth', '500')); }
			if (width < 400) { urls.push(url.replace('maxwidth', '400')); }
			if (width < 250) { urls.push(url.replace('maxwidth', '250')); }
			if (width < 128) { urls.push(url.replace('maxwidth', '128')); }
			if (width < 100) { urls.push(url.replace('maxwidth', '100')); }
			if (urls.length) {
				link.data().hoverZoomSrc = urls;
				res.push(link);
			}
		});
		hoverZoom.urlReplace(res, 
			'a[href*="tumblr.com/photo/"]',
			'',
			''
		);
		if (location.host.indexOf('tumblr.com') == -1) {
			$('a[href*="tumblr.com/post/"]').one('mouseenter', function() {
				var link = $(this),
					aHref = this.href.split('/');
				$.getJSON('http://api.tumblr.com/v2/blog/' + aHref[2] + '/posts?id=' + aHref[4] + '&api_key=GSgWCc96GxL3x2OlEtMUE56b8gjbFHSV5wf8Zm8Enr1kNcjt3U', function(data) {
					if (data && data.response && data.response.posts && data.response.posts[0]) {
						var post = data.response.posts[0];
						if (post.photos && post.photos[0]) {
							link.data().hoverZoomSrc = [post.photos[0].alt_sizes[0].url];
							if (post.photos.length > 1) {
								link.data().hoverZoomGallery = true;
							}
							link.addClass('hoverZoomLink');
							hoverZoom.displayPicFromElement(link);
						}
					}
				});
			});
		}
		callback($(res));
	}
});