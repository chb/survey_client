steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/dom/form_params',		// form data helper
	'jquery/controller/view')

	.css('resources/css/redmond/jquery-ui-1.8.6.custom', 'resources/css/survey')	// loads styles

	// jquery include jquery-ui and progressbar
    .resources("jquery-json/jquery.json-1.3.js", "jquery-ui-1.8.6.custom.min.js", "jquery.progressbar/js/jquery.progressbar.min.js")

    // rdf
    .resources("tabulator/util.js", "tabulator/uri.js", "tabulator/term.js", "tabulator/match.js", "tabulator/rdfparser.js", "tabulator/identity.js")

    // resig class
    .resources("resig/class.js")

    // utils
    .resources("utils.js")
    
    // date validation
    .resources("date.js")
    
    // messages 
    .resources("messages.js")
    
    // storage
    .resources("jstorage.min.js")

    .models('rdfutils')
    .models('rdfjsobject')
    .models('survey', 'surveystate')
    .controllers('main', 'survey', 'question', 'answer')
	.views();						// adds views to be added to build
