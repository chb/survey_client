/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var SURVEY;

MainController = $.Controller.extend('Survey.Controllers.Main',{
	onDocument: true
},
{    
	init: function(){
		// insert busy and dialog divs
		$('body').append('<div id="loading"></div>');
		$('body').append('<div id="dialog"><p id="dialog-text"></p></div>');
	},

    /* This method loads up the survey RDF by using the survey build and instructs
     * the survey controller to load the survey splash page.
     */
     'main.load subscribe': function(event, params) {
		// the survey connector is a JavaScript object with callbacks:
		// get_survey, get_survey_metadata, get_answers, get_state, save_answers, save_state
		// this allows for various backend connectors to be hooked in.
		var data_connector = params.data_connector;

		// load the survey
		Survey.load(data_connector, function(survey) {
			SURVEY = survey;
			SURVEY.data_connector = data_connector;
			SURVEY.started = false;

			data_connector.get_state(function(state) {
			if (state != null && state.length > 0){
           		SURVEY.existing_state = state;
           		SURVEY.restore_from_state(SURVEY.existing_state);
         	}

			data_connector.get_answers(function(answers) {
				$('#loading').hide();
				if (answers != null && typeof answers != "string") {
					SURVEY.answers = answers;
					SURVEY.done_p = true;
					OpenAjax.hub.publish('survey.donePage', params);
				} 
				else {
					if (state == null) {
						OpenAjax.hub.publish('survey.loadStateAndGo', {});
					} 
					else {
						OpenAjax.hub.publish('survey.loadStateAndGo', {state: state});
					}
				}
			});
			});
		});
    }
    
});
