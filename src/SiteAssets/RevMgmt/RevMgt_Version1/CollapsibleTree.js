// Create unique namespace
var jslinkTransform = window.jslinkTransform || {};

jslinkTransform.jslinkTransform = {};
jslinkTransform.RenderCollapsibleTree = function () {
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
		self.margin = {top: 20, right: 120, bottom: 20, left: 120};
		self.width = 960 - self.margin.right - self.margin.left;
		self.height = 800 - self.margin.top - self.margin.bottom;
		
		self.i = 0;
		self.duration = 750;
		self.root;
		
		self.tree = d3.layout.tree()
			.size([self.height, self.width]);
			
		self.diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });
				
		//For Seattle.Master
		$('#pageContentTitle').append('<span><input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleTree.collapseAll(); return false;" value="Collapse All" />&nbsp;<input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleTree.expandAll(); return false;" value="Expand All" /></span>');
		//For Oslo.Master
		//$('#pageTitle').append('<span><input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleTree.collapseAll(); return false;" value="Collapse All" />&nbsp;<input type="button" class="ms-ButtonHeightWidth" onclick="javascript:jslinkTransform.RenderCollapsibleTree.expandAll(); return false;" value="Expand All" /></span>');
		
		self.svg = d3.select("#contentBox").append("svg")
			.attr("width", self.width + self.margin.right + self.margin.left)
			.attr("height", self.height + self.margin.top + self.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

		self.root = jsonData;
		self.root.x0 = self.height / 2;
		self.root.y0 = 0;
		self.root.children.forEach(collapse);
		update(self.root);
		
		d3.select(self.frameElement).style("height", "800px");
    };
	
	var update = function (source) {
		// Compute the new tree layout.
		var nodes = self.tree.nodes(self.root).reverse(),
		links = self.tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 180; });

		// Update the nodes…
		var node = self.svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++self.i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		.on("click", click);

		nodeEnter.append("circle")
		.attr("r", 1e-6)
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeEnter.append("text")
		.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		.attr("dy", ".35em")
		.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		.text(function(d) { return d.name; })
		.style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
		.duration(self.duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		nodeUpdate.select("circle")
		.attr("r", 4.5)
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeUpdate.select("text")
		.style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
		.duration(self.duration)
		.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		.remove();

		nodeExit.select("circle")
		.attr("r", 1e-6);

		nodeExit.select("text")
		.style("fill-opacity", 1e-6);

		// Update the links…
		var link = self.svg.selectAll("path.link")
		.data(links, function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
		.attr("class", "link")
		.attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
		});

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
	var click = function (d) {
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
		
		update(d);
	};
	
	var CloseCallbackPublish = function (result, target) {
		if (result == SP.UI.DialogResult.OK) {
			SP.UI.Notify.addNotification("Changes have been saved!", false);
		}
	};	
	
	var color = function (d) {
		return d._children ? "#3182bd" : d.children ? "#ffffff" : "#fd8d3c";
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