// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Google',
    prepareImgLinks:function (callback) {
	
		var res = [];
        hoverZoom.urlReplace(res,
            'a[href*="imgurl="]',
            /.*imgurl=([^&]+).*/,
            '$1'
        );
		callback($(res));
	
		// remove this when old google image is retired 
        function prepareImgLink(img) {
            var img = $(this);
			if (this.id != 'rg_hi' && img.data().hoverZoomSrc) { return; }
            var link = this.parentNode,
                href = link.href,
                imgUrlIndex = href.indexOf('imgurl=');
            href = href.substring(imgUrlIndex + 7, href.indexOf('&', imgUrlIndex));
            try {
                while (decodeURIComponent(href) != href)
                    href = decodeURIComponent(href);
            } catch (e) {
            }
			link.classList.remove('hoverZoomLink');
            img.data().hoverZoomSrc = [href];
            img.addClass('hoverZoomLink');
        }
        $('a[href*="imgurl="] > img').each(prepareImgLink);
        $('#rg_hi').load(prepareImgLink);
		
    }
});