/*
 * The controller class handles click of previous and next buttons.
 * It dispatches previous and next calls to helper methods that handle
 * the applicable click type.
 */
SurveyController = $.Controller.extend('Survey.Controllers.Survey',
/* @Static */
{
	onDocument: true,
    
    showModalMessage: function(message, title, success) {
    	$('#dialog-text').html(message);
    	$('#dialog').dialog({
    		title: title,
			modal: true,
			resizable: false,
			buttons: {
				Ok: function() {
					if (success) {
						success();
					}
					$(this).dialog("close");
				}
			}
		});
    },
    
    showAjaxLoader: function() {
    	$('#ajax-busy').removeClass('hidden');
    },
    
    hideAjaxLoader: function() {
    	$('#ajax-busy').addClass('hidden');
    }, 
    
    disableButtons: function() {
    	$('button, .rewind').button('disable');
    },
    
    enableButtons: function() {
    	$('button, .rewind').button('enable');
    }
},
/* @Prototype */
{
    'survey.loadStateAndGo subscribe': function(event, params) {
    	this.loadStateAndGo(params);
    },
    
    loadStateAndGo: function(params){
		var state = params.state;

		if (state == null){
			// no state
			this.splash_page(params);
		}
		else{
			// existing state
			SURVEY.existing_state = state;
			this.splash_page(params);
		}
    },

	'survey.splashPage subscribe': function(event, params){
		this.splash_page(params);
	},

    /* splash page for the survey at the beginning
     */
    splash_page: function(params) {
		this.survey = SURVEY.survey;
		this.existing_state = SURVEY.existing_state;
		$('#survey').html(this.view('splash_page'));
		$('button').button();
    },

    end_page: function(params) {
		SURVEY.endpage_p = true;
		this.survey = SURVEY.survey;
		$('#survey').html(this.view('end_page'));
		$('button').button();
    },

	'survey.donePage subscribe': function(event, params){
		this.done_page(params);
	},

    done_page: function(params) {
		this.survey = SURVEY.survey;
		$('#survey').html(this.view('done_page'));
		$('button').button();
    },
    
    answer_summary: function(params) {
		this.survey = SURVEY.survey;
		this.questions_and_answers = SURVEY.state.getQuestionsAndAnswers();
		SURVEY.endpage_p = true;
		$('#survey').html(this.view('answer_summary'));
		$('.rewind, button').button();
    },

    updateState: function(ignoreAllEmpty, failOnChange, successEvent) {
    	// by default, fail when answers are changed
		if (failOnChange === null){
			failOnChange = true; 
		}
	
		// if no more survey elements, we're at the end, just say ok
		if (!SURVEY.current_element())
	    return true;

        var currentQuestions = SURVEY.current_questions()
        var numberToSave = currentQuestions.length;
        var pageErrors = [];

        for (var i=1; i<=numberToSave; i++){
        	var questionErrors = [];
        	var current_answer = undefined;
            // if this survey element does not have any answers, then we move on
            if (!SURVEY.current_element(numberToSave - i).requiresAnswer())
                break; // TODO break/continue?

            try {
                // record the answer to the current question
                current_answer = SURVEY.getAnswerFromDOM(i, numberToSave - i);
		    } catch(e) {
		    	if (e instanceof Error) {
		    		// single error
		    		pageErrors.push(e);
		    		questionErrors.push(e);
		    	}
		    	else {
		    		// multiple errors
		    		pageErrors = pageErrors.concat(e);
		    		questionErrors = e;
		    	}
		    	for (error in questionErrors) {
				    if (questionErrors[error].name === 'RangeError') {
						// apply error styling
						$(questionErrors[error].el).find('.answer-input').addClass('validation-error');
						$(questionErrors[error].el).closest('.question-form').find('.question-title .ui-state-error').show();  //TODO: better way
						$(questionErrors[error].el).closest('.answer').find('.ui-state-error').attr('title', questionErrors[error].message).show();
				  	}
				  	else if (questionErrors[error].name === 'AnswerRequired') {
			  			// apply error styling
			  			//TODO: styling will get applied even if we are ignoring all questions being empty, better way?
			  			if (!ignoreAllEmpty) {
					  		$(questionErrors[error].el).closest('.question').find('.question-title .ui-state-error').attr('title', questionErrors[error].message).show();
				  		}
				  	}
				  	else {
				  		// throw all unexpected errors
					  	throw questionErrors;
					}
				}
            }

			if(pageErrors.length <= 0 && current_answer != undefined) {
				// only try to save off the answer if we haven't found any on the page yet, and we have an answer to save
		        if(!SURVEY.setCurrentAnswer(current_answer, numberToSave - i, failOnChange) && failOnChange){
		        	$('#dialog-text').text(MESSAGES.ANSWER_CHANGE_WARNING);
		        	$('#dialog').dialog({
		        		title: MESSAGES.ANSWER_CHANGE_TITLE,
						autoOpen: true,
						resizable: false,
						modal: true,
						buttons: {
							"Yes": function() {  //TODO: figure out if there is a way to use the value of a variable as the id
								$(this).dialog("close");
								OpenAjax.hub.publish(successEvent, {});
								$(this).dialog("close");
							},
							"No": function() {
							    OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
								$(this).dialog("close");
							}
						}
					});
					return false;
		        }
            }
        }
        
        if (ignoreAllEmpty && pageErrors.length > 0) {
        	var allEmptyFlag = true;
        	for (error in pageErrors) {
        		if (pageErrors[error].name !== 'AnswerRequired') {
        			allEmptyFlag = false;
        			break;
        		}
        	}
        	if (allEmptyFlag) {
        		// if all errors are of the AnswerRequired type and we are allowing that
        		return true;
        	}
        }
        
        if (pageErrors.length > 0) {
			var messages = "";
			for (error in pageErrors) {
				messages += '<li>' + pageErrors[error].message + '</li>';
			}
			Survey.Controllers.Survey.showModalMessage('<ul>' + messages + '</ul>', MESSAGES.ERROR);
			return false;
		}
         
		return true;
    },

	saveState: function(success, error) {
        var answers_to_save = SURVEY.state.getEncodedAnswers();
        SURVEY.existing_state = answers_to_save;
        SURVEY.data_connector.save_state(SURVEY, answers_to_save, success, error); 
	},

    set_progress_bar: function(percentage) {
		$('#progressbar').progressBar(percentage, {showText:false});
    },

    render_shell: function() {
		// render the shell of the survey
		this.survey = SURVEY.survey;
		this.numberOfQuestionsToDisplay = 1;  //  TODO: safely remove this and allow question controller to add divs
		$('#survey').html(this.view('question'));
		$('button').button();
    },

    update_context: function() {
		// we don't re-render everything, though we could
		var old_value = $('#contextdetails').html()
		var new_value = SURVEY.getSubtitle() || "";
		var new_description = SURVEY.getSubdescription() || "";
	
		if (new_value !== "") {
			$('#contextdetails').html(new_value);
			$('#context').show();
		}
		else {
			$('#context').hide();
		}
	
		if (new_description !== ""){
		    $('#contextdescription').html(new_description).show();
		}
		else{
		    $('#contextdescription').hide();
		}

		// compute total num of questions and current question num
		var current_end_question_num = SURVEY.state.getCurrentQuestionNum();
		var current_start_question_count = current_end_question_num - (SURVEY.state.elementsToRender - 1);  // TODO: don't reach into the state to get this
		var num_questions = SURVEY.estimateNumQuestions();

	    if(current_end_question_num === current_start_question_count){
	        $('#question-count-label').text(MESSAGES.QUESTION);
	        $('#questionnum').html(current_end_question_num);
	    }
	    else{
	        $('#question-count-label').text(MESSAGES.QUESTIONS);
	        $('#questionnum').html(current_start_question_count + '-' + current_end_question_num);
	    }
		$('#totalquestion').html(num_questions);
		this.set_progress_bar((current_end_question_num * 100 - 50) / num_questions);

		if (TRANSITIONS && old_value != new_value)
			Survey.Controllers.Survey.showModalMessage(MESSAGES.TRANSITION_BASE + " " + new_value);
    },

    "#goto_end click": function(el, ev) {
	if (SURVEY.done_p)
		this.done_page({});
	else
		this.answer_summary({});
    },

    "#goto_answer_summary click": function(el, ev) {
    	this.answer_summary({});
    },

	"#restart click": function(el, ev) {
		this.render_shell();
		SURVEY.state = null;
		SURVEY.start();
		this.update_context();
		OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
    },

    "#start click": function(el, ev) {
        this.render_shell();
		SURVEY.start();
		this.update_context();
		OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
    },

    "#restore click": function(el, ev) {
		this.render_shell();
		SURVEY.restore_from_state(SURVEY.existing_state);

		// are we at the end? We have to special case that
		if (SURVEY.current_element()) {
			this.update_context();
			OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
		} else {
			this.end_page();
		}
    },

	/**
	 * When the user clicks next, try to save the answer(s) and go to the next 
	 * question(s). This is configured to not ignore validation errors and to 
	 * prompt the user if an answer is being changed and will delete others.
	 * @param el The DOM element clicked
	 * @param ev The click event
	 */
    "#next click": function(el, ev) {
    	$('.ui-state-error').hide();
    	$('.validation-error').removeClass('validation-error');
		if(this.updateState(false, true, 'survey.next')) {
			this.next();
		}
    },

	/**
	 * Attempts to save the answer(s) and go to the next question(s).  This is 
	 * configured to not ignore validation errors, and to not prompt the user
	 * if an answer change will delete future ones.
	 * @param ev The published OpenAjax Hub event
	 * @param {Object} params The parameters published with this event
	 */
	'survey.next subscribe': function(ev, params) {
		if(this.updateState(false, false, 'survey.next')){
			this.next();
		}
	},

	next: function() {
		// save the state, but don't warn on failure or success
		this.saveState(function() {}, function() {});
	
		// go to the next question
		var still_going = SURVEY.forward_until_next_question();

		if (still_going) {
			// render it
			this.update_context();
			OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
		} 
		else {
			this.end_page({});
		}
	},

	/**
	 * When the user clicks previous, try to save the answer(s) and go to the  
	 * previous question(s). This is configured to ignore validation errors and  
	 * to prompt the user if an answer is being changed and will delete others.
	 * @param el The DOM element clicked
	 * @param ev The click event
	 */
	"#previous click": function(el, ev) {
		$('.ui-state-error').hide();
		$('.validation-error').removeClass('validation-error');
    	if(this.updateState(true, true, 'survey.previous')) {
    		this.previous();	
    	}
    },

	/**
	 * Attempts to save the answer(s) and go to the previous question(s).  This  
	 * is configured to ignore validation errors, and to not prompt the user
	 * if an answer change will delete future ones.
	 * @param ev The published OpenAjax Hub event
	 * @param {Object} params The parameters published with this event
	 */
	'survey.previous subscribe': function(ev, params) {
		if(this.updateState(true, false, 'survey.previous')) {
    		this.previous();	
    	}
	},

    previous: function() {
    	// save the state, but don't warn on failure or success
		this.saveState(function() {}, function() {});
    
		// go to prev (but only if it's not the end page)
		var still_going = SURVEY.rewind_until_prev_question();
		if (SURVEY.endpage_p) {
			SURVEY.endpage_p = false;
			this.render_shell();
		}

		if (still_going) {
			// render it
			this.update_context();
			OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
		} else {
			this.splash_page({});
		}
    },
    
    "#submit_answers click": function(el, ev) {
	    Survey.Controllers.Survey.disableButtons();
    	Survey.Controllers.Survey.showAjaxLoader();

		// generate the XML for the answers document
		// FIXME: should do proper XML generation
		var answers_xml = "<SurveyAnswers xmlns=\"http://indivo.org/vocab/xml/documents#\" surveydigest=\"";

		// get the survey digest
		answers_xml += SURVEY.digest;

		answers_xml += "\" surveyUri=\"" + SURVEY.survey.resource.uri + "\"><answers>";
		answers_xml += Utils.encode_html(SURVEY.state.getEncodedAnswers());
		answers_xml += "</answers><answerGraph>";
		answers_xml += Utils.encode_html(SURVEY.state.getEncodedAnswerGraph());
		answers_xml += "</answerGraph></SurveyAnswers>";

		// save the answers
		var self = this;
		SURVEY.data_connector.save_answers(SURVEY, answers_xml, this.save_answers_success, this.save_answers_error);
    },
    
    "#exit-save click": function(el, ev){
	    Survey.Controllers.Survey.showAjaxLoader();
    	Survey.Controllers.Survey.disableButtons();

		if(this.updateState(true, true, 'survey.exitAndSave')) {
    		this.exitAndSave();	
    	}
    	else {
    		Survey.Controllers.Survey.hideAjaxLoader();
    	    Survey.Controllers.Survey.enableButtons();
    	}
    },
    
    "survey.exitAndSave subscribe": function(ev, params) {
    	Survey.Controllers.Survey.showAjaxLoader();
    	Survey.Controllers.Survey.disableButtons();
    	
    	if(this.updateState(true, false, 'survey.exitAndSave')) {
    		this.exitAndSave();	
    	}
    	else {
    		Survey.Controllers.Survey.hideAjaxLoader();
    	    Survey.Controllers.Survey.enableButtons();
    	}
    },
    
    exitAndSave: function() {
    	// save the state
		this.saveState(this.save_state_and_exit_success, this.save_state_error);
    },
    
    "#exit click": function(el, ev){
    	window.location.href = window.location.protocol + '//' + window.location.host + EXIT_PATH + window.location.search;
    },
    
    "#redo click": function(el, ev){
      SURVEY.done_p = false;
      this.load_state_and
      this.loadStateAndGo({});
    },
    
    ".rewind click": function(el, ev) {
    	var rewound = SURVEY.rewind(parseInt(el.attr("data-questionIndex")));
    	
		if (SURVEY.endpage_p) {
			SURVEY.endpage_p = false;
			this.render_shell();
		}

		if (rewound) {
			this.update_context();
			OpenAjax.hub.publish('question.show', {'questions': SURVEY.current_questions()});
		} else {
			this.splash_page({});
		}
    },
    
    save_state_error: function(){
	    this.survey = SURVEY.survey;
	    Survey.Controllers.Survey.hideAjaxLoader();
	    Survey.Controllers.Survey.enableButtons();
	    Survey.Controllers.Survey.showModalMessage($.View("//survey/views/survey/ajax_error.ejs", {survey:SURVEY.survey, text:MESSAGES.SAVE_STATE_ERROR, support_message:MESSAGES.SURVEY_SUPPORT_MESSAGE, support_name:MESSAGES.SURVEY_SUPPORT_NAME}), MESSAGES.ERROR);
    }, 
    
    save_state_success: function(){
    	Survey.Controllers.Survey.enableButtons();
    	Survey.Controllers.Survey.hideAjaxLoader();
	    Survey.Controllers.Survey.showModalMessage(MESSAGES.SAVE_STATE_SUCCESS, MESSAGES.SUCCESS);
	    SURVEY.existing_state = SURVEY.state.getEncodedAnswers(); 
	    OpenAjax.hub.publish('survey.splashPage', {});
    }, 
    
    save_state_and_exit_success: function(){
    	Survey.Controllers.Survey.hideAjaxLoader();
    	Survey.Controllers.Survey.showModalMessage(MESSAGES.SAVE_STATE_SUCCESS, MESSAGES.SUCCESS, function(){window.location = EXIT_PATH;});
    }, 
    
    save_answers_error: function(){
    	Survey.Controllers.Survey.enableButtons();
    	Survey.Controllers.Survey.hideAjaxLoader();
	    Survey.Controllers.Survey.showModalMessage($.View("//survey/views/survey/ajax_error.ejs", {survey:SURVEY.survey, text:MESSAGES.SAVE_ANSWERS_ERROR, support_message:MESSAGES.SURVEY_SUPPORT_MESSAGE, support_name:MESSAGES.SURVEY_SUPPORT_NAME}), MESSAGES.ERROR);
    }, 
    
    save_answers_success: function(){
    	Survey.Controllers.Survey.enableButtons();
	    Survey.Controllers.Survey.hideAjaxLoader();
	    SURVEY.done_p = true;
	    Survey.Controllers.Survey.showModalMessage(MESSAGES.SAVE_ANSWERS_SUCCESS, MESSAGES.SUCCESS);
	    OpenAjax.hub.publish('survey.donePage', {});
    }

});

