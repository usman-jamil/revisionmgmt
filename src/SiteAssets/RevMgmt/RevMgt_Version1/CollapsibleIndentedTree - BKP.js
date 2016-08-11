// Create unique namespace
Type.registerNamespace('jslinkViews')
var jslinkTransform = window.jslinkTransform || {};
var jslinkViews = window.jslinkViews || {};
jslinkViews.AnnouncementAccordion = {};
var jslinkTemplates = window.jslinkTemplates || {};
jslinkTransform.jslinkTransform = {};
jslinkTemplates.Announcements = {};

jslinkTransform.RenderCollapsibleIndentedTree = function () {
	var self = this;
	self.margin = null;
	self.width = null;
	self.barHeight = null;
	self.barWidth = null;
	self.i = null;
	self.duration = null;
	self.root = null;
	self.tree = null;
	self.diagonal = null;
	self.svg = null;
	
    var _init = function (jsonData) {
		self.margin = {top: 30, right: 20, bottom: 30, left: 20};
		self.width = 960 - self.margin.left - self.margin.right;
		self.barHeight = 20;
		self.barWidth = self.width * .8;
		
		self.i = 0;
		self.duration = 400;
		self.root;
		
		self.tree = d3.layout.tree()
			.nodeSize([0, 20]);
		self.diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });
			
		//For Seattle.Master
		$('#pageContentTitle').append('<span><input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleIndentedTree.collapseAll(); return false;" value="Collapse All" />&nbsp;<input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleIndentedTree.expandAll(); return false;" value="Expand All" /></span>');
		//For Oslo.Master			
		//$('#pageTitle').append('<span><input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleIndentedTree.collapseAll(); return false;" value="Collapse All" />&nbsp;<input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleIndentedTree.expandAll(); return false;" value="Expand All" /></span>');
		
		self.svg = d3.select("#contentBox").append("svg")
			.attr("width", self.width + self.margin.left + self.margin.right)
			.append("g")
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

		jsonData.x0 = 0;
		jsonData.y0 = 0;
		update(self.root = jsonData);
    };
	
	var update = function (source) {
		// Compute the flattened node list. TODO use d3.layout.hierarchy.
		var nodes = self.tree.nodes(self.root);
		var height = Math.max(500, nodes.length * self.barHeight + self.margin.top + self.margin.bottom);
		d3.select("svg").transition()
		  .duration(self.duration)
		  .attr("height", height);
		d3.select(self.frameElement).transition()
		  .duration(self.duration)
		  .style("height", height + "px");
		
		// Compute the "layout".
		nodes.forEach(function(n, i) {
			n.x = i * self.barHeight;
		});
		// Update the nodes…
		var node = self.svg.selectAll("g.node")
		  .data(nodes, function(d) { return d.id || (d.id = ++self.i); });
		var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		  .style("opacity", 1e-6);
		// Enter any new nodes at the parent's previous position.
		nodeEnter.append("rect")
		  .attr("y", -self.barHeight / 2)
		  .attr("height", self.barHeight)
		  .attr("width", self.barWidth)
		  .style("fill", color)
		  .on("click", click);
		nodeEnter.append("text")
		  .attr("dy", 3.5)
		  .attr("dx", 5.5)
		  .text(function(d) { return d.name; });
		// Transition nodes to their new position.
		nodeEnter.transition()
		  .duration(self.duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		  .style("opacity", 1);
		node.transition()
		  .duration(self.duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		  .style("opacity", 1)
		.select("rect")
		  .style("fill", color);
		// Transition exiting nodes to the parent's new position.
		node.exit().transition()
		  .duration(self.duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .style("opacity", 1e-6)
		  .remove();
		// Update the links…
		var link = self.svg.selectAll("path.link")
		  .data(self.tree.links(nodes), function(d) { return d.target.id; });
		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
		  })
		.transition()
		  .duration(self.duration)
		  .attr("d", self.diagonal);
		// Transition links to their new position.
		link.transition()
		  .duration(self.duration)
		  .attr("d", self.diagonal);
		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
		  .duration(self.duration)
		  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		  })
		  .remove();
		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	};
	
	// Toggle children on click.
	var click = function click(d) {
	if (d.children) {
	d._children = d.children;
	d.children = null;
	} else {
			d.children = d._children;
			if(!d._children) {
				var parsed = $('<div/>').append(d.comments);
				var url = parsed.find('a').attr('href');
				
				var options = SP.UI.$create_DialogOptions();
				var n = url.lastIndexOf("#SPBookmark_Comments");
				options.url = url.substring(0, n);
				options.title = "Add Comments";
				options.dialogReturnValueCallback = Function.createDelegate(null, CloseCallbackPublish);
				SP.UI.ModalDialog.showModalDialog(options);
			}
			d._children = null;
		}
		// If the node has a parent, then collapse its child nodes
		// except for this clicked node.
		if (d.parent) {
			d.parent.children.forEach(function(element) {
			  if (d !== element) {
				collapse(element);
			  }
			});
		}
		update(d);
	};	
	
	var CloseCallbackPublish = function (result, target) {
		if (result == SP.UI.DialogResult.OK) {
			SP.UI.Notify.addNotification("Changes have been saved!", false);
		}
	};
	
	var color = function (d) {
		var depth = d.children ? d.children[0].depth : -1;
		var color = '#e5f0ff';
		if(depth > 0) {
			switch(depth) {
				case 1:
					color = '#0066ff';
				break;
				case 2:
					color = '#1a75ff';
				break;
				case 3:
					color = '#4d94ff';
				break;
				case 4:
					color = '#80b3ff';
				break;
				case 5:
					color = '#b3d1ff';
				break;
			}
		}
		//return d._children ? "#003466" : d.children ? "#0072C6" : "#BCBCBC";
		return color;
	};
	
	var expand = function (d) {
		var children = (d.children)?d.children:d._children;
		if (d._children) {        
			d.children = d._children;
			d._children = null;       
		}
		if(children)
		  children.forEach(expand);
	}

	var _expandAll = function () {
		expand(self.root); 
		update(self.root);
	}	
	
	var _collapseAll = function (){
		self.root.children.forEach(collapse);
		collapse(self.root);
		update(self.root);
	};
	
	var collapse = function (d){
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	};

    return {
        "init": _init,
		"expandAll": _expandAll,
		"collapseAll": _collapseAll
    }
}();

jslinkTransform.HierarchyConversion = function () {	
    var _convert = function (jsonData) {
		var data = [];
		jQuery.each(jsonData["Row"], function(i, val) {
			var item = {
				title: val.Title,
				comments: val.Comments,
				revId: val.Revision_x0020_Date,
				acId: val.Fleet[0].lookupValue,
				docID: val.ManualName[0].lookupValue,
				sectionId: val.Section
			};
			//console.log(item);
			data.push(item);
		});
		
		var jsonData = wrapData(startConversion(data));
		//console.log(jsonData);
		return jsonData;
    };
	
	var startConversion = function (arr) {
		return $.map(uniqueRevision(arr), function(revId){
			var children = $.grep(arr, function(item){
				return item.revId == revId
			});
			
			return {
				name: revId,
				children: startConversion1(children)
			};
		});
	};
	
	var startConversion1 = function (arr) {
		return $.map(uniqueAircraft(arr), function(acId){
			var name = acId;
			var children = $.grep(arr, function(item){
				return item.acId == acId
			});
			
			return {
				name: acId,
				children: startConversion2(children)
			};
		});
	};	
	
	var startConversion2 = function (arr) {
		return $.map(uniqueDocument(arr), function(docID){
			var name = docID;
			var children = $.grep(arr, function(item){
				return item.docID == docID
			});
			
			return {
				name: docID,
				children: startConversion3(children)
			};
		});
	};
	
	var startConversion3 = function (arr) {
		return $.map(uniqueSection(arr), function(sectionId){
			var name = sectionId;
			var children = $.grep(arr, function(item){
				return item.sectionId == sectionId
			});
			
			return {
				name: sectionId,
				children: trimData(children)
			};
		});
	};			
	
	var trimData = function (arr) {
		return $.map(arr, function(item){
			return {
				name: item.title,
				comments: item.comments
			};
		});
	};
	
	var wrapData = function (arr) {
		//var year = new Date().getFullYear();
		var root = {
			name: 'Revisions',
			children: arr
		};
		
		return root;
	};		

	var uniqueRevision = function (arr) {
		var result = [];
		$.map(arr, function(item){
			if ($.inArray(item.revId, result) < 0) {
				result.push(item.revId);
			}
		});
		
		return result;
	};
	
	var uniqueAircraft = function (arr) {
		var result = [];
		$.map(arr, function(item){
			if ($.inArray(item.acId, result) < 0) {
				result.push(item.acId);
			}
		});
		
		return result;
	};
	
	var uniqueSection = function (arr) {
		var result = [];
		$.map(arr, function(item){
			if ($.inArray(item.sectionId, result) < 0) {
				result.push(item.sectionId);
			}
		});
		
		return result;
	};	
	
	var uniqueDocument = function (arr) {
		var result = [];
		$.map(arr, function(item){
			if ($.inArray(item.docID, result) < 0) {
				result.push(item.docID);
			}
		});
		
		return result;
	};

    return {
        "convert": _convert,
		"data": self.structuredData
    }
}();

jslinkTemplates.Announcements.Accordion = function () {
	var self = this;
	self.convertedData = [];
	
    var _onPreRender = function (ctx) {
        // Load css file
        loadCss(ctx.HttpRoot + '/SiteAssets/RevMgmt/styles.css');
		//console.log(WPQ2ListData);
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

jslinkViews.AnnouncementAccordion.Templates = {};
jslinkViews.AnnouncementAccordion.OnPreRender = jslinkTemplates.Announcements.Accordion.onPreRender;
jslinkViews.AnnouncementAccordion.Templates.Header = '<div class="accordion">';
jslinkViews.AnnouncementAccordion.Templates.Item = jslinkTemplates.Announcements.Accordion.item;
jslinkViews.AnnouncementAccordion.Templates.Footer = '</div>';
jslinkViews.AnnouncementAccordion.OnPostRender = jslinkTemplates.Announcements.Accordion.onPostRender;

jslinkViews.AnnouncementAccordion.Functions = {};
jslinkViews.AnnouncementAccordion.Functions.RegisterTemplate = function () {
    // Register our object, which contains our templates
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(jslinkViews.AnnouncementAccordion);
};
jslinkViews.AnnouncementAccordion.Functions.MdsRegisterTemplate = function () {
    // Register our custom template
    jslinkViews.AnnouncementAccordion.Functions.RegisterTemplate();

    // And make sure our custom view fires each time MDS performs a page transition
    var thisUrl = _spPageContextInfo.siteServerRelativeUrl + "SiteAssets/AccordionView.js";
    RegisterModuleInit(thisUrl, jslinkViews.AnnouncementAccordion.Functions.RegisterTemplate)
};
if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
    // its an MDS page refresh
    jslinkViews.AnnouncementAccordion.Functions.MdsRegisterTemplate()
} else {
    // normal page load
    jslinkViews.AnnouncementAccordion.Functions.RegisterTemplate()
}