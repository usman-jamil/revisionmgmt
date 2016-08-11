// Create unique namespace
var jslinkTransform = window.jslinkTransform || {};

jslinkTransform.jslinkTransform = {};
jslinkTransform.HierarchyConversion = function () {	
    var _convert = function (jsonData) {
		var data = [];
		jQuery.each(jsonData["Row"], function(i, val) {
			var item = {
				title: val.Title,
				comments: val.Comments,
				revId: val.Revision_x003a_RevID[0].lookupValue,
				acId: val.Revision_x003a_AcId[0].lookupValue,
				docID: val.Revision_x003a_DocId[0].lookupValue
			};
			
			data.push(item);
		});
		
		var jsonData = wrapData(startConversion(data));
		console.log(jsonData);
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

