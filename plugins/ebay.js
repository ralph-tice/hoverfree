// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

// This one is quite different from the others as it makes use of the eBay API

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	name: 'eBay',
	version: '0.2',
	prepareImgLinks: function(callback) {
		var res = [];
		var appId = 'RomainVa-3007-4951-b943-aaedf0d9af84';
		var requestUrlBase = 'http://open.api.ebay.com/shopping?appid=' + appId + '&version=687&siteid=0&callname=GetMultipleItems&responseencoding=JSON&ItemID=';
		var itemIndex = 0;
		var hzItems = [], itemIds = [];
		var cachePrefix = 'cache_eBayItem_' + (options.showHighRes ? 'hi' : 'lo') + '_';
	
		// First we gather all the products on the page and we store their eBay ID and 
		// the link that will receive the 'hoverZoomSrc' data.
		$('a.l-tn, table.l-tn a, td.gv-gvtd a, a.pic, table.pic a, a.gpvi, a.img').each(function() {
			var item = {link: this, id: ''};
			var parent = $(this).parents('table:eq(0)');
			if (parent.hasClass('l-tn') || parent.hasClass('gv-gvimg') || parent.hasClass('pic')) {
				parent = parent.parents('div:eq(0)');
			}
			var dtlLink = parent.find('div.l-its a, div.gv-gvitmttl a, div.ittl a, div.ttl a');
			if (dtlLink.length > 0) {
				item.id = dtlLink.attr('href');
				item.id = item.id.substr(item.id.lastIndexOf('/') + 1);
				item.id = item.id.substr(0, item.id.indexOf('?'));
				itemIds.push(item.id);
				hzItems.push(item);
			}
		});		
		
		// Check if some urls were stored
		for (var i = 0; i < hzItems.length; i++) {
			var storedItem = localStorage[cachePrefix + hzItems[i].id];
			if (storedItem) {
				storedItem = JSON.parse(storedItem);
				var link = $(hzItems[i].link), data = link.data();
				data.hoverZoomSrc = [storedItem.pictureUrl];
				data.hoverZoomCaption = storedItem.title;
				res.push(link);
				hzItems.splice(i, 1);
				i--;
			}
		}
		if (res.length > 0) {
			callback($(res));
			res = [];
		}
		
		// Then we make calls to the eBay API to get details on the items
		// using the IDs we found
		function getItems() {
		
			// Each call can get a maximum number of 20 items, so we have to iterate
			var indexEnd = Math.min(itemIndex + 20, itemIds.length);			
			var itemBunch = itemIds.slice(itemIndex, indexEnd);
			itemIndex = indexEnd;			
			var requestUrl = requestUrlBase + itemBunch.join(',');
			
			// Ajax calls are made through the background page (not possible from a content script)
			chrome.extension.sendRequest({action: 'ajaxGet', url: requestUrl}, function(data) {
				var getMultipleItemsResponse = JSON.parse(data);
				for (var i=0; i<getMultipleItemsResponse.Item.length; i++) {
					var item = getMultipleItemsResponse.Item[i];
					for (var j=0; j<hzItems.length; j++) {
						if (hzItems[j].id == item.ItemID && item.PictureURL && item.PictureURL.length > 0) {
							var link = $(hzItems[j].link), data = link.data();
							data.hoverZoomSrc = [item.PictureURL[0]];
							data.hoverZoomCaption = item.Title;
							res.push(link);
							
							// Items are stored to lessen API calls
							localStorage[cachePrefix + item.ItemID] = JSON.stringify({pictureUrl: item.PictureURL[0], title: item.Title});
						}
					}
				}
				callback($(res));
				res = [];
				if (itemIndex < itemIds.length) {
					// Continue with the next 20 items
					getItems();			
				}
			});
		}
		if (hzItems.length > 0) {
			getItems();
		}
	}
});