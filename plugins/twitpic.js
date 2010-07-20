// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Twitpic",
	"version": "0.1",
	"prepareImgLinks": function() {
		var imgs = $("a img[src*=twitpic.com/img]");
		var res = $();
		imgs.each(function() {
			var link = $(this).parents('a').get(0);
			if (link) {
				$(link).data('hoverZoomSrc', [$(this).attr('src').replace(/-thumb/, '-full')]);
				res = res.add(link);
			}
		});
		return res;
	}
});