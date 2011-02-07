module("selectOne", { 
	setup: function(){
	}
});


test("Copy Test", function(){
	S.open("//survey/test/funcunit/resources/selectOneSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.SELECT_ONE_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.SELECT_ONE_SURVEY.INTRO_TEXT);
	});
	
});

test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Are you male or female?");
	});
	
	// enter value and go to next
	S('#question_1 .answer:first .answer-selector').click();
	S('#next').click();
});

test("No Answer Selected", function(){	
	// wait for question to render
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "In general, would you say your health is:");
	});
	
	// make sure dialog shows up when next is clicked and no text entered
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.EMPTY_SELECT_ONE);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
});

test("Label Answer Selected", function(){		
	// select first option and go to next
	S('#question_1 .answer:first .answer-selector').click();
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').next().text().trim(), "Excellent");
	});
	
	// go back and then forward and make sure our answer still shows up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .answer-selector:checked').next().text().trim(), "Excellent");
	});
});

test("Text Answer Selected", function(){			
	// change our answer to a label one
	S('#question_1 .answer:last .answer-input').click().type("meh");
		
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').next().find('.answer-input').val().trim(), "meh");
	});
	
	// go back and then forward and make sure our answer still shows up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .answer-selector:checked').next().find('.answer-input').val().trim(), "meh");
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
		equals(S('#completedMessage').text(), TEST_MESSAGES.SELECT_ONE_SURVEY.COMPLETED);
	});
	
	S('#goto_answer_summary').click(function(){
		equals(S('.answer-summary[data-number=1] .summary-question').text().trim(), "1. Are you male or female?");
		equals(S('.answer-summary[data-number=1] .summary-answer').text(), "Male");
		equals(S('.answer-summary[data-number=2] .summary-question').text().trim(), "2. In general, would you say your health is:");
		equals(S('.answer-summary[data-number=2] .summary-answer').text(), "meh");
	});

});
