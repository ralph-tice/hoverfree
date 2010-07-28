// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'Twitpic',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		$("a img[src*=twitpic.com/img]").each(function() {
			var link = $(this).parents('a:eq(0)');
			if (link) {
				$(link).data('hoverZoomSrc', [$(this).attr('src').replace(/-thumb/, '-full')]);
				res.push(link);
			}
		});
		callback($(res));
	}
});