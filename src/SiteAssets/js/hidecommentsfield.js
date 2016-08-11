(function () {

    var overrideCtx = {};
    overrideCtx.Templates = {};
    overrideCtx.Templates.Fields = {
        // need to use the internal name of the field here
		
        "Comments": {
            "NewForm": formFieldOverride
            
        }
			
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);

})();


function formFieldOverride(ctx) {
    // get the span that represents the field's actual edit control
    var span = $get(ctx.FormUniqueId + ctx.FormContext.listAttributes.Id + ctx.CurrentFieldSchema.Name);

    // still need to go up two levels to hide the entire <tr>
    span.parentNode.parentNode.setAttribute("style", "display:none");
    return "";
}