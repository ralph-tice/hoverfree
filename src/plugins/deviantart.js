// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'deviantART',
	prepareImgLinks: function(callback) {
		var res = [];
		$('a[data-super-img]').each(function() {
			var _this = $(this),
				url = this.dataset.superImg;
			if (options.showHighRes && this.dataset.superFullImg)
				url = this.dataset.superFullImg;
			_this.data().hoverZoomSrc = [url];
			res.push(_this);
		});
		callback($(res));
	}
});