// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
function hoverZoom() {

	var wnd = $(window);
	var hoverZoomImg = $('<div id="hoverZoomImg"></div>').appendTo(document.body);
	var hoverZoomCaption = null;
	var imgFullSize = null;		
	var imgLoading = $('<img />', {src: chrome.extension.getURL('images/loading.gif')});
	
	var imgSrc = '';
	var currentLink = null;
	var mousePos = {};
	var loading = false;
	var bindLinksTimeout, loadFullSizeImageTimeout;
	var options = {};
	var bindLinksDelay = 500;
	
	// Calculate optimal image position and size
	function posImg(position) {
		if (!imgFullSize)
			return;
		position = position || {top:mousePos.top, left:mousePos.left};
		
		var offset = 20;
		
		if (loading) {
			position.left += offset;
			position.top -= 10;
		} else {
			var margin = 8;
			var padding = 10;
			var wndWidth = wnd.width();
			var wndHeight = wnd.height();
			var wndScrollLeft = wnd.scrollLeft();
			var wndScrollTop = wnd.scrollTop();
			
			imgFullSize.width('auto').height('auto');
			var naturalWidth = imgFullSize.width();
			var naturalHeight = imgFullSize.height();
			if (!naturalWidth || !naturalHeight)
				return;
			
			var displayOnRight = true;
			if (position.left - wndScrollLeft < wndWidth / 2) {
				position.left += offset;
				if (naturalWidth + padding > wndWidth - position.left) {
					imgFullSize.width(wndWidth - position.left - padding + wndScrollLeft);
				}
			} else {
				displayOnRight = false;
				position.left -= offset;
				if (naturalWidth + padding > position.left) {
					imgFullSize.width(position.left - padding - wndScrollLeft);
				}			
			}
			
			position.top -= hoverZoomImg.height() / 2;
			if (hoverZoomImg.height() > wndHeight)
				imgFullSize.height(wndHeight - padding).width('auto');

			if (hoverZoomCaption) {
				hoverZoomCaption.css('max-width', imgFullSize.width());
				while (hoverZoomImg.height() > wndHeight) {
					imgFullSize.height(wndHeight - padding - hoverZoomCaption.height()).width('auto');
					hoverZoomCaption.css('max-width', imgFullSize.width());
				}
			}

			if (!displayOnRight) 
				position.left -= hoverZoomImg.width() + padding;
			if (position.top + hoverZoomImg.height() >= wndScrollTop + wndHeight)
				position.top = wndScrollTop + wndHeight - hoverZoomImg.height() - padding;
			if (position.top < wndScrollTop)
				position.top = wndScrollTop;	
			
		}
		
		hoverZoomImg.css(position);
	}
	
	function hideHoverZoomImg() {
		if (imgFullSize != null) {
			$(imgFullSize).remove();
			imgFullSize = null;
		}
		hoverZoomCaption = null;
		hoverZoomImg.empty();
		hoverZoomImg.hide();
	}

	function documentMouseMove(event) {
		if (!options.extensionEnabled)
			return;
			
		mousePos = {top:event.pageY, left:event.pageX};
		var links = $(event.target).parents('.hoverZoomLink');
		if ($(event.target).hasClass('hoverZoomLink'))
			links = links.add($(event.target));
		if (links.length > 0) {
			if (links.data('hoverZoomSrc') && links.data('hoverZoomSrc') != 'undefined' && 
				links.data('hoverZoomSrc')[links.data('hoverZoomSrcIndex')] && 
				links.data('hoverZoomSrc')[links.data('hoverZoomSrcIndex')] != 'undefined') {
				// Happens when the mouse goes from an image to another without hovering the page background
				if (links.data('hoverZoomSrc')[links.data('hoverZoomSrcIndex')] != imgSrc) {
					hideHoverZoomImg();
				}				
				if (!imgFullSize) {
					currentLink = links;
					imgSrc = links.data('hoverZoomSrc')[links.data('hoverZoomSrcIndex')];
					window.clearTimeout(loadFullSizeImageTimeout);
					loadFullSizeImageTimeout = window.setTimeout(loadFullSizeImage, options.displayDelay);
				} else {
					posImg();
				}
			} else {
				return;
			}			
		} else {
			window.clearTimeout(loadFullSizeImageTimeout);
			hideHoverZoomImg();
		}
	}
	
	function loadFullSizeImage() {
		// If no image is currently displayed...
		if (!imgFullSize) {
			loading = true;
			imgLoading.appendTo(hoverZoomImg);
			hoverZoomImg.show();
			imgFullSize = $('<img/>').attr('src', imgSrc).load(function() {
				// Only the last hovered link gets displayed
				if (imgSrc == $(this).attr('src')) {
					loading = false;
					hoverZoomImg.offset({top:-9000, left:-9000}); 	// hides the image while making it available for size calculations
					hoverZoomImg.empty();
					$(this).appendTo(hoverZoomImg);
					if (options.showCaptions && currentLink.data('hoverZoomCaption')) {
						hoverZoomCaption = $('<div/>', {id: 'hoverZoomCaption', text: currentLink.data('hoverZoomCaption')}).appendTo(hoverZoomImg);
					}
					setTimeout(posImg, 10);
					if (options.addToHistory) {
						chrome.extension.sendRequest({action : 'addUrlToHistory', url: imgSrc});
					}
				}
			}).error(function() {
				if (imgSrc == $(this).attr('src')) {
					var hoverZoomSrcIndex = currentLink.data('hoverZoomSrcIndex');
					if (hoverZoomSrcIndex < currentLink.data('hoverZoomSrc').length - 1) {
						// If the link has several possible sources, we try to load the next one
						hoverZoomSrcIndex++;
						currentLink.data('hoverZoomSrcIndex', hoverZoomSrcIndex);
						imgSrc = currentLink.data('hoverZoomSrc')[hoverZoomSrcIndex];
						imgFullSize = null;
						window.setTimeout(loadFullSizeImage, 10);
					} else {
						hideHoverZoomImg();
						console.warn('HoverZoom: Failed to load image: ' + imgSrc);
					}
				}
			});
		}
		posImg();
	}
	
	function prepareImgCaption(link) {
		var titledElement = null;
		if (link.attr('title')) {
			titledElement = link;
		} else {
			titledElement = link.find('[title]:eq(0)');
			if (!titledElement.length) {
				titledElement = link.parents('[title]:eq(0)');
			}
		}
		if (titledElement && titledElement.length) {
			link.data('hoverZoomCaption', titledElement.attr('title'));
			titledElement.removeAttr('title');
		}
	}
	
	function bindImgLinks() {
		var showPageAction = false;
		for (i in hoverZoomPlugins) {
			hoverZoomPlugins[i].prepareImgLinks().each(function() {
				if (!$(this).data('hoverZoomSrc')) {
					bindImgLinksAsync();
				} else {
					showPageAction = true;
					
					// If the extension is disabled, we only need to know 
					// whether the page action needs to be shown or not.
					if (!options.extensionEnabled) {
						return;
					}

					$(this).addClass('hoverZoomLink');
					
					// Convert URL special characters
					var srcs = $(this).data('hoverZoomSrc');
					for (i in srcs) {
						srcs[i] = deepUnescape(srcs[i]);
					}
					$(this).data('hoverZoomSrc', srcs);
					
					$(this).data('hoverZoomSrcIndex', 0);
					
					// Caption
					if (options.showCaptions && !$(this).data('hoverZoomCaption')) {
						prepareImgCaption($(this));
					}
					
				}
			});
		}
		if (options.pageActionEnabled && showPageAction) {
			chrome.extension.sendRequest({action : 'showPageAction'});		
		}
	}
	
	function bindImgLinksAsync(resetDelay) {
		if (!options.extensionEnabled)
			return;
		if (resetDelay)
			bindLinksDelay = 500;
		window.clearTimeout(bindLinksTimeout);
		bindLinksTimeout = window.setTimeout(bindImgLinks, bindLinksDelay);
		bindLinksDelay *= 2;
	}
	
	function deepUnescape(url) {
		var ueUrl = unescape(encodeURIComponent(url));
		while (url != ueUrl) {
			url = ueUrl;
			ueUrl = unescape(url);
		}
		return url;
	}
	
	function applyOptions() {
		init();
		if (!options.extensionEnabled) {
			hideHoverZoomImg();
			$(document).unbind('mousemove', documentMouseMove);
		}
	}
	
	function isExcludedSite() {
		var excludedSites = ["photos.live.com"];
		var siteHost = document.location.href.split('/', 3)[2];
		for (i in excludedSites) {
			if (excludedSites[i].length <= siteHost.length)
				if (siteHost.substr(siteHost.length - excludedSites[i].length) == excludedSites[i])
					return true;
		}
		return false;
	}
	
	function loadOptions() {
		chrome.extension.sendRequest({action : 'getOptions'}, function(result) {
			options = result;
			applyOptions();
		});
	}
	
	function onRequest(request, sender, sendResponse) {
		switch(request.action) {
			case 'optionsChanged':
				options = request.options;
				applyOptions();
				break;
		}
	}
	
	function bindEvents() {
		$(document).bind('mousemove', documentMouseMove);
		
		wnd.bind('DOMNodeInserted', function(event) {
			if (event.srcElement && (event.srcElement.nodeName == 'A' || $(event.srcElement).find('a').length || $(event.srcElement).parents('a').length)) {
				bindImgLinksAsync(true);
			}
		});
		
		wnd.load(function () {
			bindImgLinksAsync(true);
		});
	}
	
	function init() {
		if (isExcludedSite()) {
			return;
		}
		bindImgLinks();		
		bindEvents();
	}
	
	chrome.extension.onRequest.addListener(onRequest);		
	loadOptions();
};

function jQueryOnLoad(data) {
	if (data != null) {
		eval(data);
		hoverZoom();
	} else {
		console.warn('HoverZoom: Failed to load jQuery');
	}
}

chrome.extension.sendRequest({action : 'loadJQuery'}, jQueryOnLoad);