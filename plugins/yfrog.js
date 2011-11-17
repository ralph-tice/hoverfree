// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
    name: 'Yfrog',
    version: '0.1',
    prepareImgLinks: function(callback) {
        var res = [];
		$('a[data-expanded-url^="http://yfrog."]').each(function() {
			var link = $(this),
				url = link.attr('data-expanded-url');
			link.data().hoverZoomSrc = [url + ':medium', url + ':frame'];
			res.push(link);
		});
        callback($(res));
    }
});
