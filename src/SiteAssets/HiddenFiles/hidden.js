SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
Templates: {
		OnPostRender: [
			function(ctx) {
				jQuery(".csrHiddenField").closest("tr").hide(); 
			}
		],
		Fields: { 
			// Apply the new rendering for Priority field on List View 
			"Title": { 
				"NewForm": hideFunction
			}
		}
	}
});

function hideFunction(){
	return "<span class='csrHiddenField'></span>";
}