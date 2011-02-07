module("behavior", { 
	setup: function(){
	}
});

test("Splash Page Copy Test", function(){
	S.open("//survey/test/funcunit/resources/dataFormatSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.DATA_FORMAT_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.DATA_FORMAT_SURVEY.INTRO_TEXT);
	});
	
});


test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "age?");
	});
	
});

test("Integer Validation", function(){

	// enter text
	S('#question_1 .answer:first .answer-input').click().type("martian");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_INTEGER);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("1.2");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_INTEGER);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter negative decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("-0.2");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_INTEGER);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter a valid integer
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("18");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "weight?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter negative integer
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("-1");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "weight?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter zero
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("0");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "weight?");
	});
});

test("Decimal Validation", function(){

	// enter text
	S('#question_1 .answer:first .answer-input').click().type("martian");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_DECIMAL);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter mixed text
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("13.a");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_DECIMAL);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter positive decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("1.2");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter negative decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("-0.2098709");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter zero
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("0");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter integer
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("1");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
});

test("Date Validation", function(){

	// enter restricted characters and make sure the input box is empty
	S('#question_1 .answer:first .answer-input').click().type("january");
	equals(S('#question_1 .answer:first .answer-input').text(), "");

	// enter invalid date
	S('#question_1 .answer:first .answer-input').click().type(CONSTANTS.SAMPLE_DATE_INVALID);
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_DATE);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear box and enter valid date
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type(CONSTANTS.SAMPLE_DATE_VALID);
	
	// click next and make sure we are at the answer submit page
	S('#next').click();
	S('#submit_answers').exists(function(){
		equals(S("#submit_answers").text(), CONSTANTS.ANSWER_SUBMIT_BUTTON);
	});
	
/*	// clear and enter mixed text
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("13.a");
	
	// make sure dialog shows up when next is clicked with invalid input
	S('#next').click();
	S('#dialog').visible(function(){
		equals(S('#dialog-text').text(), MESSAGES.INVALID_DECIMAL);
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	});
	S('#dialog').invisible();
	
	// clear and enter positive decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("1.2");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter negative decimal
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("-0.2098709");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter zero
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("0");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// clear and enter integer
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("1");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('3', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "date of birth?");
	});
	*/
});
