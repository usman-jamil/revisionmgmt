jQuery(document).ready(function () {
	$().SPServices.SPCascadeDropdowns({
		relationshipList: "MasterManual",
		relationshipListParentColumn: "FleetLookup",
		relationshipListChildColumn: "Title",
		parentColumn: "Fleet",
		childColumn: "ManualName",
		debug: true
	});
	
	 $().SPServices.SPCascadeDropdowns({
                                       relationshipList: "MasterChapter",
                                       relationshipListParentColumn: "ManualName",
                                       relationshipListChildColumn: "Title",
                                       parentColumn: "ManualName",
                                       childColumn: "Chapter",
                             });
							 
	 $().SPServices.SPCascadeDropdowns({
                                       relationshipList: "MasterSection",
                                       relationshipListParentColumn: "Chapter",
                                       relationshipListChildColumn: "Title",
                                       parentColumn: "Chapter",
                                       childColumn: "Section",
                             });
							 
      //Hide Reason fields initially
      $("[title$='Chapter Comments']").parent('span').parent('td').parent('tr').hide();
	  $("[title$='Section Comments']").parent('span').parent('td').parent('tr').hide();
	  
     //Associate a function with Drop down change event
  $("select[title$='Chapter']").change(function()
      {
	  
        if($(this).val()=='0')
         {
           $("[title$='Chapter Comments']").parent('span').parent('td').parent('tr').hide();
		   
		   //alert('jQuery Works');
         }
        else
         {
		   $("[title$='Chapter Comments']").parent('span').parent('td').parent('tr').show();
		  
         }
     });
	 
	 $("select[title$='Section']").change(function()
      {
        if($(this).val()=='0')
         {
            $("[title$='Section Comments']").parent('span').parent('td').parent('tr').hide();
		   
		   //alert('jQuery Works');
         }
        else
         {
		   
		   $("[title$='Section Comments']").parent('span').parent('td').parent('tr').show();
         }
     });							 
});