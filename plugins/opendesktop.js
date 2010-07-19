// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "openDesktop.org",
	"version": "0.1",
	"prepareImgLinks": function() {
		var imgs = $("a img[src*=CONTENT]");
		var res = $();
		var re = /(content|knowledgebase)-m(\d+)\/(m?)/;
		imgs.each(function() {
			var src = $(this).attr('src');
			var index = src.match(re);
			if (index) {
				var link = $(this).parents('a').get(0);
				var href = $(link).attr('href');
				var param = 'file' + index[2] + '=';
				var fileIndex = href.indexOf(param);
				var pre = index[1] == 'content' ? 'pre' : 'pics';
				if (fileIndex > -1) {
					src = '/CONTENT/' + index[1] + '-' + pre + index[2] + '/' + href.substring(fileIndex + param.length, href.indexOf('&', fileIndex));
				} else {
					src = src.replace(re, '$1-' + pre + '$2/');
				}
				$(link).data('hoverZoomSrc', src);
				res = res.add($(link));			
			}
		});
		return res;		
	}
});