// Copyright (c) 2012 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Imgur',
	version: '0.4',
	prepareImgLinks: function(callback) {
	
		var res = [],
			minSplitLength = 4;
		
		function prepareImgLink() {
			var link = $(this), i = 0, data = link.data(), href = link.attr('href');
			if (data.hoverZoomSrc) { return; }
			
			/*if (href.indexOf('imgur.com') == -1) {
				href = 'imgur.com' + href;
			}*/
			var matches = href.match(/\/([a-zA-Z0-9]{5})(\/|\.[a-zA-Z]+)?$/);
			if (matches && matches[1]) {
				
				var hash = matches[1];
				var excl = ['imgur', 'forum', 'stats'];
				if (excl.indexOf(hash) > -1) { return; }
				
				var re = new RegExp('/(?:a|signin)/' + hash);
				if (href.match(re)) { return; }

				var url = 'http://i.imgur.com/' + hash;
				var srcs = [url + '.jpg', url + '.gif', url + '.png'];
				// Same array duplicated several times so that a retry is done if an image fails to load
				data.hoverZoomSrc = srcs.concat(srcs).concat(srcs).concat(srcs);
				//data.hoverZoomGallery = (aHref[0] == 'a');
				res.push(link);
			} /*else if (location.host.indexOf('imgur.com') == -1) {
				link.one('mouseenter', function() {
					hoverZoom.prepareOEmbedLink(this, 'http://api.imgur.com/oembed?url=', this.href);
				});
			}*/
			
			/*var aHref = href.split('/');
			if (aHref.length < minSplitLength) { return; }
			
			if (minSplitLength == 4) {
				// The URL may contain 'imgur.com' but we can be on another domain, so one more test
				//if (aHref[2].length < 9 || aHref[2].substr(-9) != 'imgur.com' || aHref[2] == 'api.imgur.com') { return; }
				// Removes the first part (http://*.imgur.com)
				for (i=0; i<3; i++) { 
					aHref.shift(); 
				}
			}
			
			// Excluded words
			var excl = ['delete', 'forum', 'removalrequest', 'contact', 'upgrade', 'tools', 'stats', 'logout', 'signin', 'register', 'blog'];
			if (aHref[0].length < 5 || excl.indexOf(aHref[0]) > -1) { return; }
			
			// This assumes that the hash length is always 5			
			
			var hash = '';
			if (aHref.length == 1) {
			
				if (aHref[0] == 'gallery') {
					return;
				} else if (aHref[0].indexOf('&') > -1) {
					// Several hashes in one URL (first, second, etc).
					// The good one has an 'l' appended to it.
					// If none has an 'l', the default one if the first one.
					var a = aHref[0].split('&');
					hash = a[0].substr(0, 5);
					for (i=1; i<a.length; i++) {
						if (a[i].length > 5) {
							hash = a[i].substr(0, 5);
						}
					}
				} else if (aHref[0].indexOf('#') > -1) {
					hash = aHref[0].substr(aHref[0].indexOf('#') + 1, 5);
				} else {
					hash = aHref[0].substr(0, 5);				
				}
				
			} else if (aHref[0] == 'gallery' || aHref[0] == 'a') {
				hash = aHref[1].substr(0, 5);				
			}

			if (!hash) { return; }
			var url = 'http://i.imgur.com/' + hash;
			var srcs = [url + '.jpg', url + '.png', url + '.gif'];
			// Same array duplicated several times so that a retry is done if an image fails to load
			data.hoverZoomSrc = srcs.concat(srcs).concat(srcs).concat(srcs);
			data.hoverZoomGallery = (aHref[0] == 'a');
			res.push(link);*/
		}
	
		// Every sites
		$('a[href*="//imgur.com/"], a[href*="//www.imgur.com/"], a[href*="//i.imgur.com/"], ').each(prepareImgLink);
		
		// On imgur.com (galleries, etc)
		if (window.location.host.indexOf('imgur.com') > -1) {
			minSplitLength = 2;
			$('a[href^="/"]').each(prepareImgLink);			
		}
		
		if (res.length) { callback($(res));	}
	}
});