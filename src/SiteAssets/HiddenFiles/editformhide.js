SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
Templates: {
		OnPostRender: [
			function(ctx) {
				jQuery(".csrHiddenField").closest("tr").hide(); 
			}
		],
		Fields: { 
			// Apply the new rendering for Priority field on List View 
			"AcId": { 
				"DispForm": hideFunction
			},
			"DocId": { 
				"DispForm": hideFunction
			},
			"RevID": { 
				"DispForm": hideFunction
			}
		}
	}
});

function hideFunction(){
	return "<span class='csrHiddenField'></span>";
}