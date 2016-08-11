// Create unique namespace
var jslinkTemplates = window.jslinkTemplates || {};

jslinkTemplates.Announcements = {};
jslinkTemplates.Announcements.Accordion = function () {
	var self = this;
	self.convertedData = [];
	
    var _onPreRender = function (ctx) {
        // Load css file
        loadCss(ctx.HttpRoot + '/SiteAssets/RevMgmt/styles.css');
		self.convertedData = jslinkTransform.HierarchyConversion.convert(WPQ2ListData);
    };
	
	var loadCss = function (url) {
		var link = document.createElement('link');
		link.href = url;
		link.rel = 'stylesheet';
		document.getElementsByTagName('head')[0].appendChild(link);
    };	

    var _item = function (ctx) {
        var html = '';

        return html;
    };

    var _onPostRender = function (ctx) {
		jslinkTransform.RenderCollapsibleIndentedTree.init(self.convertedData);
    };

    return {
        "item": _item,
        "onPreRender": _onPreRender,
        "onPostRender": _onPostRender
    }
}();