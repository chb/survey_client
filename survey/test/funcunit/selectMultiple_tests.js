module("selectMultiple", { 
	setup: function(){
	}
});

test("Copy Test", function(){
	S.open("//survey/test/funcunit/resources/selectMultipleSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.SELECT_MULTIPLE_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.SELECT_MULTIPLE_SURVEY.INTRO_TEXT);
	});
});

test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Select the fruits that you like.");
	});
	
	// select a value and go to next
	S('#question_1 .answer:first .answer-selector').click();
	S('#next').click();
	
	// wait for second question to render
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "What is your race? Check all that apply.");
	});
});

test("No Option Selected", function(){
	// select no option and go to next
	S('#next').click();
	S('#submit_answers').exists(function(){
		equals(S('#submit_answers').text(), CONSTANTS.ANSWER_SUBMIT_BUTTON);
	});
	
	// go back and make sure no anwer is selected
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').size(), 0);
	});
});

test("One Option Selected", function(){	
	// select first option and go to next
	S('#question_1 .answer:first .answer-selector').click();
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').next().text().trim(), "Asian");
	});
});

test("Two Options Selected", function(){	
	// select second option as well and go to next
	S('#question_1 .answer:nth-child(2) .answer-selector').click();
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure both of our answers show up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').size(), 2);
		equals(S('#question_1 .answer:nth-child(1) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(2) .answer-selector').attr('checked'), true);
	});
	
	// go back and then forward and make sure our answers still show up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .answer-selector:checked').size(), 2);
		equals(S('#question_1 .answer:nth-child(1) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(2) .answer-selector').attr('checked'), true);
	});
});		
	
test("Three Options Selected, Including Text", function(){		
	// also select a text answer
	S('#question_1 .answer:last .answer-input').click().type("martian");
		
	S('#next').click();
	S('#submit_answers').exists();
	
	// go back and make sure our answer shows up
	S('#previous').click();
	S('#question_1').exists(function(){
		equals(S('#question_1 .answer-selector:checked').size(), 3);
		equals(S('#question_1 .answer:nth-child(1) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(2) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(6) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(6) .answer-input').val().trim(), "martian");
	});
	
	// go back and then forward and make sure our answers still shows up
	S('#previous').click();
	S('#questionnum').text('1');
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S('#question_1 .answer-selector:checked').size(), 3);
		equals(S('#question_1 .answer:nth-child(1) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(2) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(6) .answer-selector').attr('checked'), true);
		equals(S('#question_1 .answer:nth-child(6) .answer-input').val().trim(), "martian");
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
		equals(S('#completedMessage').text(), TEST_MESSAGES.SELECT_MULTIPLE_SURVEY.COMPLETED);
	});
	
	S('#goto_answer_summary').click(function(){
		equals(S('.answer-summary[data-number=1] .summary-question').text().trim(), "1. Select the fruits that you like.");
		equals(S('.answer-summary[data-number=1] .summary-answer').text(), "Apple");
		equals(S('.answer-summary[data-number=2] .summary-question').text().trim(), "2. What is your race? Check all that apply.");
		equals(S('.answer-summary[data-number=2] .summary-answer').text(), "Asian, American Indian/Alaskan Native, martian");
	});
});
