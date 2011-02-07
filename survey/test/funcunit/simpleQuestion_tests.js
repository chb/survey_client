module("simpleQuestion", { 
	setup: function(){
	}
});

test("Copy Test", function(){
	S.open("//survey/test/funcunit/resources/simpleQuestionSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.SIMPLE_QUESTION_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.SIMPLE_QUESTION_SURVEY.INTRO_TEXT);
	});
});

test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Age?");
	});
	
	// enter value and go to next
	S('#question_1 .answer-input').type("42");
	S('#next').click();
});

test("No Option Selected", function(){	
	// wait for question to render
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Enter some text");
	});
	
	// make sure dialog shows up when next is clicked and no text entered
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.EMPTY_ANSWER);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
});

test("Text Answer Entered", function(){		
	// enter value and go to next
	S('#question_1 .answer-input').type("hello");
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-input').val(), "hello");
	});
	
	// go back and then forward and make sure our answer still shows up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .answer-input').val(), "hello");
	});
});

test("Answer Submit", function(){			
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
		equals(S('#completedMessage').text(), TEST_MESSAGES.SIMPLE_QUESTION_SURVEY.COMPLETED);
	});
	
	S('#goto_answer_summary').click(function(){
		equals(S('.answer-summary[data-number=1] .summary-question').text().trim(), "1. Age?");
		equals(S('.answer-summary[data-number=1] .summary-answer').text(), "42");
		equals(S('.answer-summary[data-number=2] .summary-question').text().trim(), "2. Enter some text");
		equals(S('.answer-summary[data-number=2] .summary-answer').text(), "hello");
	});
	
});
