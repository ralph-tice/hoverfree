// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];

var hoverZoom = {

	loadHoverZoom: function() {
		var wnd = $(window),
			hoverZoomImg = null,
			hoverZoomCaption = null,
			imgFullSize = null,
			imgLoading = null,
			imgSrc = '',
			currentLink = null,
			mousePos = {},
			loading = false,
			loadFullSizeImageTimeout,
			options = {},
			actionKeyDown = false,
			fullZoomKeyDown = false,
			pageActionShown = false;
		
		// Calculate optimal image position and size
		function posImg(position) {
			if (!imgFullSize) {
				return;
			}
			position = position || {top: mousePos.top, left: mousePos.left};
			
			var offset = 20,
				padding = 10,
				wndWidth = wnd.width(),
				wndHeight = wnd.height(),
				wndScrollLeft = wnd.scrollLeft(),
				wndScrollTop = wnd.scrollTop(),
				displayOnRight = (position.left - wndScrollLeft < wndWidth / 2);
			
			function posCaption() {
				if (hoverZoomCaption) {
					hoverZoomCaption.css('max-width', imgFullSize.width());
					while (hoverZoomImg.height() > wndHeight) {
						imgFullSize.height(wndHeight - padding - hoverZoomCaption.height()).width('auto');
						hoverZoomCaption.css('max-width', imgFullSize.width());
					}
				}				
			}
			
			if (displayOnRight) {
				position.left += offset;
			} else {
				position.left -= offset;
			}
			
			if (loading) {
				position.top -= 10;
				if (!displayOnRight) {
					position.left -= 25;
				}
					
			} else if (fullZoomKeyDown) {
			
				imgFullSize.width(wndWidth - padding).height('auto');				
				if (hoverZoomImg.height() > wndHeight) {
					imgFullSize.height(wndHeight - padding).width('auto');
					position.top = wndScrollTop;
					position.left = wndScrollLeft + wndWidth / 2 - hoverZoomImg.width() / 2;
				} else {
					position.top = wndScrollTop + wndHeight / 2 - hoverZoomImg.height() / 2;
					position.left = wndScrollLeft;
				}

				posCaption();
				
			} else {
				
				imgFullSize.width('auto').height('auto');
				
				// Image natural dimensions
				var naturalWidth = imgFullSize.width(),
					naturalHeight = imgFullSize.height();
				if (!naturalWidth || !naturalHeight) {
					return;
				}
				
				// Width adjustment
				if (displayOnRight) {
					if (naturalWidth + padding > wndWidth - position.left) {
						imgFullSize.width(wndWidth - position.left - padding + wndScrollLeft);
					}
				} else {
					if (naturalWidth + padding > position.left) {
						imgFullSize.width(position.left - padding - wndScrollLeft);
					}			
				}
				
				position.top -= hoverZoomImg.height() / 2;
				
				// Height adjustment
				if (hoverZoomImg.height() > wndHeight) {
					imgFullSize.height(wndHeight - padding).width('auto');
				}

				posCaption();

				// Display image on the left side if the mouse is on the right
				if (!displayOnRight) {
					position.left -= hoverZoomImg.width() + padding;
				}
					
				// Vertical position adjustments
				if (position.top + hoverZoomImg.height() >= wndScrollTop + wndHeight) {
					position.top = wndScrollTop + wndHeight - hoverZoomImg.height() - padding;
				}
				if (position.top < wndScrollTop) {
					position.top = wndScrollTop;
				}
				
			}
			
			position = {top: Math.round(position.top), left: Math.round(position.left)};
			hoverZoomImg.css(position);
			//hoverZoomImg.offset(position);
		}
		
		function hideHoverZoomImg(now) {
			if (!now && !imgFullSize || !hoverZoomImg || fullZoomKeyDown) {
				return;
			}
			imgFullSize = null;
			if (loading) { now = true; }
			hoverZoomImg.stop(true, true).fadeOut(now ? 0 : options.fadeDuration, function() {
				hoverZoomCaption = null;
				hoverZoomImg.empty();
				showFlashObjects(true);
			});
		}

		function documentMouseMove(event) {
			if (!options.extensionEnabled || isExcludedSite()) {			
				return;
			}
			
			// Test if the action key was pressed without moving the mouse
			var staticActionKeyPressed = ((options.actionKey || options.fullZoomKey) && event.pageY == undefined);

			// If so, the MouseMove event was triggered programmaticaly and we don't have details
			// about the mouse position and the event target, so we use the last saved ones.
			var links;
			if (staticActionKeyPressed) {
				links = currentLink;
			} else {
				mousePos = {top: event.pageY, left: event.pageX};
				links = $(event.target).parents('.hoverZoomLink');
				if ($(event.target).hasClass('hoverZoomLink')) {
					links = links.add($(event.target));
				}
			}
			
			if (links && links.length > 0) {
				var hoverZoomSrcIndex = links.data('hoverZoomSrcIndex') || 0;
				if (links.data('hoverZoomSrc') && links.data('hoverZoomSrc') != 'undefined' && 
					links.data('hoverZoomSrc')[hoverZoomSrcIndex] && 
					links.data('hoverZoomSrc')[hoverZoomSrcIndex] != 'undefined') {
					// Happens when the mouse goes from an image to another without hovering the page background
					if (links.data('hoverZoomSrc')[hoverZoomSrcIndex] != imgSrc) {
						hideHoverZoomImg();
					}				
					
					// Is the image source has not been set yet
					if (!imgFullSize) {
						currentLink = links;
						if (!options.actionKey || actionKeyDown) {
							imgSrc = links.data('hoverZoomSrc')[hoverZoomSrcIndex];
							clearTimeout(loadFullSizeImageTimeout);
							
							// If the action key has been pressed over an image, no delay is applied
							var delay = staticActionKeyPressed ? 0 : options.displayDelay;
							loadFullSizeImageTimeout = setTimeout(loadFullSizeImage, delay);
							loading = true;
						}
					} else {
						posImg();
					}
				} else {
					return;
				}			
			} else {
				cancelImageLoading();
			}
		}
		
		function loadFullSizeImage() {
			// If no image is currently displayed...
			if (!imgFullSize) {
				
				// Full size image container
				hoverZoomImg = hoverZoomImg || $('<div id="hoverZoomImg"></div>').appendTo(document.body);			
				hoverZoomImg.empty();
				hoverZoomImg.stop(true, true).fadeIn(options.fadeDuration);
				
				// Loading image container
				imgLoading = imgLoading || $('<img />', {src: chrome.extension.getURL('images/loading.gif')});
				imgLoading.appendTo(hoverZoomImg);
				
				imgFullSize = $('<img/>').attr('src', imgSrc).load(function() {
					// Only the last hovered link gets displayed
					if (imgSrc == $(this).attr('src')) {
						loading = false;
						hoverZoomImg.stop(true, true);
						hoverZoomImg.offset({top:-9000, left:-9000});	// hides the image while making it available for size calculations
						hoverZoomImg.empty();
						$(this).appendTo(hoverZoomImg);
						if ($(this).height() <= 1) {
							$(this).error();
							return;
						}
						if (options.showCaptions && currentLink && currentLink.data('hoverZoomCaption')) {
							hoverZoomCaption = $('<div/>', {id: 'hoverZoomCaption', text: currentLink.data('hoverZoomCaption')}).appendTo(hoverZoomImg);
						}
						hoverZoomImg.hide().fadeIn(options.fadeDuration);
						setTimeout(posImg, 10);
						if (options.addToHistory && !chrome.extension.inIncognitoTab) {
							chrome.extension.sendRequest({action : 'addUrlToHistory', url: imgSrc});
						}
						showFlashObjects(false);
					}
				}).error(function() {
					if (imgSrc == $(this).attr('src')) {
						var hoverZoomSrcIndex = currentLink ? currentLink.data('hoverZoomSrcIndex') : 0;
						if (currentLink && hoverZoomSrcIndex < currentLink.data('hoverZoomSrc').length - 1) {
							// If the link has several possible sources, we try to load the next one
							hoverZoomSrcIndex++;
							currentLink.data('hoverZoomSrcIndex', hoverZoomSrcIndex);
							console.info('[HoverZoom] Failed to load image: ' + imgSrc + '\nTrying next one...');
							imgSrc = currentLink.data('hoverZoomSrc')[hoverZoomSrcIndex];
							imgFullSize = null;
							setTimeout(loadFullSizeImage, 10);
						} else {
							hideHoverZoomImg();
							console.warn('[HoverZoom] Failed to load image: ' + imgSrc);
						}
					}
				}).mousemove(function(event) {
					if (!imgFullSize) {
						hideHoverZoomImg(true);
					}
				});
			}
			posImg();
		}

		function cancelImageLoading() {
			currentLink = null;
			clearTimeout(loadFullSizeImageTimeout);
			hideHoverZoomImg();
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
				titledElement.parents('[title]').andSelf().add('[title]').removeAttr('title');
			}
		}
		
		// Callback function called by plugins after they finished preparing the links
		function imgLinksPrepared(links) {	
			var showPageAction = false;

			links.each(function() {
				var _this = $(this);
				if (!_this.data('hoverZoomSrc')) {

					prepareImgLinksAsync(true);
			
				} else {
										
					// Skip if the image has the same URL as the thumbnail.
					// Base64 embedded thumbnails are filtered to avoid a freeze.
					try {
						if (_this.data('hoverZoomSrc')[0].indexOf("'") == -1 && 
							_this.find('img[src]').length && 
							_this.find('img[src^=data]').length == 0 && 
							_this.find('img[src="' + _this.data('hoverZoomSrc')[0] + '"]').length) {
							return;
						}
					} catch(e) {
						console.error(e);
					}
				
					showPageAction = true;
					
					// If the extension is disabled or the site is excluded, we only need to know 
					// whether the page action needs to be shown or not.
					if (!options.extensionEnabled || isExcludedSite()) {
						return;
					}

					_this.addClass('hoverZoomLink');
					
					// Convert URL special characters
					var srcs = _this.data('hoverZoomSrc');
					for (var i=0; i<srcs.length; i++) {
						srcs[i] = deepUnescape(srcs[i]);
					}
					_this.data('hoverZoomSrc', srcs);
					
					_this.data('hoverZoomSrcIndex', 0);
					
					// Caption
					if (options.showCaptions && !_this.data('hoverZoomCaption')) {
						prepareImgCaption(_this);
					}
				}
			});
			
			if (options.pageActionEnabled && !pageActionShown && showPageAction) {
				chrome.extension.sendRequest({action : 'showPageAction'});
				pageActionShown = true;
			}
		}
		
		function prepareImgLinks() {
			pageActionShown = false;
			$('.hoverZoomLink').removeClass('hoverZoomLink').removeData('hoverZoomSrc');
			for (var i = 0; i < hoverZoomPlugins.length; i++) {
				hoverZoomPlugins[i].prepareImgLinks(imgLinksPrepared);
			}
		}
		
		var prepareImgLinksDelay = 500, prepareImgLinksTimeout;
		function prepareImgLinksAsync(dontResetDelay) {
			if (!options.extensionEnabled || isExcludedSite()) {
				return;
			}
			if (!dontResetDelay) {
				prepareImgLinksDelay = 500;
			}
			clearTimeout(prepareImgLinksTimeout);
			prepareImgLinksTimeout = setTimeout(prepareImgLinks, prepareImgLinksDelay);
			prepareImgLinksDelay *= 2;
		}
		
		function deepUnescape(url) {
			var ueUrl = unescape(encodeURIComponent(url));
			while (url != ueUrl) {
				url = ueUrl;
				ueUrl = unescape(url);
			}
			return decodeURIComponent(escape(url));
		}
		
		function applyOptions() {
			init();
			if (!options.extensionEnabled || isExcludedSite()) {
				hideHoverZoomImg();
				$(document).unbind('mousemove', documentMouseMove);
			}
		}
		
		var webSiteExcluded = null;
		function isExcludedSite() {
			
			// If site exclusion has already been tested
			if (webSiteExcluded != null) {
				return webSiteExcluded;
			}
			
			var siteHost = document.location.href.split('/', 3)[2];
			for (var i = 0; i < options.excludedSites.length; i++) {
				if (options.excludedSites[i] && options.excludedSites[i].length <= siteHost.length) {
					if (siteHost == options.excludedSites[i] || siteHost.substr(siteHost.length - options.excludedSites[i].length - 1) == '.' + options.excludedSites[i]) {
						webSiteExcluded = true;
						return true;
					}
				}
			}
			webSiteExcluded = false;
			return false;
		}

		var flashObjects = null;
		function showFlashObjects(visible) {
			if (!visible) {
				flashObjects = $('object:visible, embed:visible, iframe[src*=flickr.com/apps], iframe.media-embed, iframe.youtube-player');
				flashObjects.css('visibility', 'hidden');
			} else if (flashObjects) {
				flashObjects.css('visibility', 'visible');
			}
		}
		
		function loadOptions() {
			chrome.extension.sendRequest({action : 'getOptions'}, function(result) {
				options = result;
				applyOptions();
			});
		}
		
		function onRequest(request, sender, sendResponse) {
			if (request.action == 'optionsChanged') {
				options = request.options;
				applyOptions();
			}
		}
		
		function windowOnDOMNodeInserted(event) {
			if (event.srcElement && (event.srcElement.nodeName == 'A' || event.srcElement.nodeName == 'IMG' || $(event.srcElement).find('a, img').length || $(event.srcElement).parents('a, img').length)) {
				prepareImgLinksAsync();
			}
		}
		
		function bindEvents() {
			$(document).mousemove(documentMouseMove).mouseleave(cancelImageLoading);
			
			if (options.actionKey || options.fullZoomKey) {
				$(document).keydown(function(event) {
					if (event.which == options.actionKey && !actionKeyDown) {
						actionKeyDown = true;
						$(this).mousemove();
						if (loading || imgFullSize) {
							return false;
						}
					}
					if (event.which == options.fullZoomKey && !fullZoomKeyDown) {
						fullZoomKeyDown = true;
						posImg();
						if (imgFullSize) {
							return false;
						}
					}
					if (imgFullSize && (event.which == options.actionKey || event.which == options.fullZoomKey)) {
						return false;
					}
				}).keyup(function(event) {
					if (event.which == options.actionKey) {
						actionKeyDown = false;
						hideHoverZoomImg();
					}
					if (event.which == options.fullZoomKey) {
						fullZoomKeyDown = false;
						$(this).mousemove();
					}
				});
			}
			
			wnd.bind('DOMNodeInserted', windowOnDOMNodeInserted);
			wnd.load(prepareImgLinksAsync);
			wnd.scroll(hideHoverZoomImg);
		}
		
		function init() {
			webSiteExcluded = null;
			prepareImgLinks();		
			bindEvents();
		}
		
		chrome.extension.onRequest.addListener(onRequest);		
		loadOptions();
	},
	
	loadJQuery: function() {
		chrome.extension.sendRequest(
			{action : 'ajaxGet', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js'},
			function(data) {
				if (data != null) {
					eval(data);
					hoverZoom.loadHoverZoom();
				} else {
					console.warn('[HoverZoom] Failed to load jQuery');
				}
			}
		);
	},
	
	// Utility function to be used by plugins.
	// Search for image links using the 'filter' parameter,
	// process their src attribute using the 'search' and 'replace' values,
	// store the result in the link and add the link to the 'res' array.
	srcReplace: function(res, filter, search, replace) {
		$(filter).each(function() {
			var _this = $(this),
				link = _this.parents('a:eq(0)');
			if (link.data('hoverZoomSrc')) { return; }
			var src = _this.attr('src');
			if (!src) {	return;	}
			if (Array.isArray(search)) {
				for (var i=0; i<search.length; i++) {
					src = src.replace(search[i], replace[i]);
				}
			} else {
				src = src.replace(search, replace);
			}
			link.data('hoverZoomSrc', [src]);
			res.push(link);
		});
	},
	
	// Utility function to be used by plugins.
	// Search for links using the 'filter' parameter,
	// process their href attribute using the 'search' and 'replace' values,
	// store the result in the link and add the link to the 'res' array.
	hrefReplace: function(res, filter, search, replace) {
		$(filter).each(function() {
			var link = $(this);
			if (link.data('hoverZoomSrc')) { return; }
			var href = link.attr('href');
			if (!href) { return; }
			if (Array.isArray(search)) {
				for (var i=0; i<search.length; i++) {
					href = href.replace(search[i], replace[i]);
				}
			} else {
				href = href.replace(search, replace);
			}
			link.data('hoverZoomSrc', [href]);
			res.push(link);
		});
	}	
};

hoverZoom.loadJQuery();