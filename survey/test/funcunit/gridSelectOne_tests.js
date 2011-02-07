module("selectMultiple", { 
	setup: function(){
	}
});

test("Copy Test", function(){
	S.open("//survey/test/funcunit/resources/gridSelectOneSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.GRID_SELECT_ONE_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.GRID_SELECT_ONE_SURVEY.INTRO_TEXT);
	});
});

test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title:first").text(), CONSTANTS.QUESTION_PREFIX + "How often do you eat the following fruits?");
	});
	
	// select first option for each sub-question and go to next
	S('#question_1 .sub-question:nth-child(1) .answer-selector:first').click();
	S('#question_1 .sub-question:nth-child(2) .answer-selector:first').click();
	S('#question_1 .sub-question:nth-child(3) .answer-selector:first').click();
	S('#next').click();
	
	// wait for second question to render
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title:first").text(), CONSTANTS.QUESTION_PREFIX + "How much do you agree with the following statements?");
	});
});


test("Not All Answers Selected", function(){	
	// select option for all but last two sub-questions
	S('#question_1 .sub-question:nth-child(1) .answer-selector:eq(0)').click();
	S('#question_1 .sub-question:nth-child(2) .answer-selector:eq(1)').click();

	// make sure dialog shows up when next is clicked and option not selected for last two sub-questions
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.EMPTY_SELECT_ONE+MESSAGES.EMPTY_SELECT_ONE);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();

	// select option for all but last sub-question 
	S('#question_1 .sub-question:nth-child(3) .answer-selector:eq(2)').click();

	// make sure dialog shows up when next is clicked and option not selected for last sub-question
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.EMPTY_SELECT_ONE);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
});


test("Label Answer Selected", function(){		
	// select first option for last sub-question and go to next
	S('#question_1 .sub-question:nth-child(4) .answer-selector:eq(3)').click();
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .sub-question:nth-child(1) .answer-selector:eq(0)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(2) .answer-selector:eq(1)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(3) .answer-selector:eq(2)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(4) .answer-selector:eq(3)').attr('checked'), true);
	});
	
	// go back and then forward and make sure our answer still shows up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .sub-question:nth-child(1) .answer-selector:eq(0)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(2) .answer-selector:eq(1)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(3) .answer-selector:eq(2)').attr('checked'), true);
		equals(S('#question_1 .sub-question:nth-child(4) .answer-selector:eq(3)').attr('checked'), true);
	}); 
});
	
test("Submit Answers", function(){		
	// go to the submit page and make sure that submit works
	S('#next').click();
	S('#submit_answers').exists(function(){
		equals(S("#submit_answers").text(), CONSTANTS.ANSWER_SUBMIT_BUTTON);
	});
	S('#submit_answers').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.SAVE_ANSWERS_SUCCESS);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	S('#completedMessage').exists(function(){
		equals(S('#completedMessage').text(), TEST_MESSAGES.GRID_SELECT_ONE_SURVEY.COMPLETED);
	});
	
	S('#goto_answer_summary').click(function(){
		equals(S('.answer-summary[data-number=1] .summary-question').text().trim(), "1. How often do you eat the following fruits?");
		equals(S('.answer-summary[data-number=1] .summary-answer').text(), "apple: Frequentlyorange: Frequentlybanana: Frequently");
		equals(S('.answer-summary[data-number=2] .summary-question').text().trim(), "2. How much do you agree with the following statements?");
		equals(S('.answer-summary[data-number=2] .summary-answer').text(), "I receive enough sleep each night: strongly agreeI receive enough food each day: agreeI receive enough gold each day: neutralI receive enough oxygen each day: disagree");
	});
});

