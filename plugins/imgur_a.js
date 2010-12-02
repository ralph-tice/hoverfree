// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Imgur',
	version: '0.2',
	prepareImgLinks: function(callback) {
	
		var res = [],
			minSplitLength = 4;
		
		function prepareImgLink() {
			var link = $(this);
			if (link.data('hoverZoomSrc')) { return; }
			var aHref = link.attr('href').split('/');
			if (aHref.length < minSplitLength) { return; }
			var excl = ['delete', 'forum', 'removalrequest', 'contact', 'upgrade', 'tools', 'stats', 'logout', 'signin', 'register', 'blog'];
			if (excl.indexOf(aHref[minSplitLength - 1]) > -1) { return; }
			var hash = '';
			try {
				while (!hash) {
					hash = aHref.pop().trim();
				}
			} catch(e) {}
			if (aHref.length < minSplitLength - 1 || hash.length < 5) { return; }
			var i = hash.indexOf('?');
			if (i > -1) {
				hash = hash.substr(0, i);
			}
			i = hash.indexOf('&');
			if (i > -1) {
				hash = hash.substr(0, i);
			}
			excl.push('gallery');
			if (excl.indexOf(hash) > -1) { return; }
			i = hash.indexOf('/');
			if (i > -1) {
				hash = hash.substr(0, i);
			}
			var srcs;
			if (hash.indexOf('.') == -1) {
				var url = 'http://i.imgur.com/' + hash;
				srcs = [url + '.jpg', url + '.png', url + '.gif'];
			} else {
				srcs = ['http://i.imgur.com/' + hash];
			}
			link.data('hoverZoomSrc', srcs);
			res.push(link);
		}
	
		// Every sites
		$('a[href*=/imgur.com/], a[href*=/i.imgur.com/]').each(prepareImgLink);
		
		// On imgur.com (galleries, etc)
		if (window.location.host.indexOf('imgur.com') > -1) {
			minSplitLength = 2;
			$('a[href^=/]').each(prepareImgLink);			
		}
		
		if (res.length) { callback($(res));	}
	}
});