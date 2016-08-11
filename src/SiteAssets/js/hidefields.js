    function hideEdit() {
        var edit = document.getElementById("Ribbon.ListForm.Display.Manage.EditItem-Large");
        edit.style.display = "none";
    }       
	function hideDelete() {
        var edit = document.getElementById("Ribbon.ListForm.Display.Manage.DeleteItem-Medium");
        edit.style.display = "none";
    }    
    function hidesharedwith() {
        var edit = document.getElementById("Ribbon.ListForm.Display.Manage-LargeMedium-1-1");
        edit.style.display = "none";
    }   
	function hidealert() {
        var edit = document.getElementById("Ribbon.ListForm.Display.Actions");
        edit.style.display = "none";
    }   
	function hideversion() {
        var edit = document.getElementById("Ribbon.ListForm.Display.Manage.VersionHistory-Medium");
        edit.style.display = "none";
    }   
	function hidedisp() {
        var edit = document.getElementById("ctl00_ctl40_g_78cdeb71_5dc6_4a2e_8901_e09897603034_ctl00_ctl08_ctl00_owshiddenversion");
        edit.style.display = "none";
    }   
   function hidedel() {
        var edit = document.getElementById("Ribbon.ListForm.Edit.Actions-LargeLarge-0-0");
        edit.style.display = "none";
		
    }   
	
	_spBodyOnLoadFunctionNames.push("hideDelete");
	_spBodyOnLoadFunctionNames.push("hidesharedwith");
	_spBodyOnLoadFunctionNames.push("hidealert");
	_spBodyOnLoadFunctionNames.push("hideversion");
	_spBodyOnLoadFunctionNames.push("hidedel");
	
	
	
	