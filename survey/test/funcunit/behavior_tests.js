module("behavior", { 
	setup: function(){
	}
});

test("Splash Page Copy Test", function(){
	S.open("//survey/test/funcunit/resources/exampleSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.EXAMPLE_SURVEY.TITLE);
		equals(S("#intro-text").text(), TEST_MESSAGES.EXAMPLE_SURVEY.INTRO_TEXT);
		equals(S("#de-identified-welcome-message").text(), TEST_MESSAGES.EXAMPLE_SURVEY.DE_IDENTIFIED);
		equals(S("#footer a").text(), TEST_MESSAGES.EXAMPLE_SURVEY.CONTACT_NAME);
		equals(S("#footer a").attr("href"), "mailto:"+TEST_MESSAGES.EXAMPLE_SURVEY.CONTACT_EMAIL);
	});
	
});


test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Which best describes why you are taking this survey?");
	});
	
});

test("Warn On Answer Change", function(){

	// select a value and go to next
	S('#question_1 .answer:first .answer-selector').click();
	S('#next').click();
	
	// wait for second question to render
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "When was the last time you saw a doctor?");
	});

	// select first option and go to back
	S('#question_1 .answer:first .answer-selector').click();
	S('#previous').click();
	
	// wait for the first question to render
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Which best describes why you are taking this survey?");
	});
	
	// change our answer and hit next
	S('#question_1 .answer:last .answer-selector').click();
	S('#next').click();
	
	// check the text on the dialog
	S('#dialog').visible(function(){
		equals(S('#ui-dialog-title-dialog').text(), MESSAGES.ANSWER_CHANGE_TITLE);
		equals(S('#dialog-text').text(), MESSAGES.ANSWER_CHANGE_WARNING);
		equals(S('.ui-dialog-buttonset .ui-button-text:first').text(), MESSAGES.DIALOG_YES);
		equals(S('.ui-dialog-buttonset .ui-button-text:last').text(), MESSAGES.DIALOG_NO);
	});
	
	// select no and check to make sure we didn't go anywhere
	S('.ui-dialog-buttonset .ui-button-text:last').click();
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Which best describes why you are taking this survey?");
	});
	
	// hit next, and select yes on dialog
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	
	// make sure we got to the next question
	S('#questionnum').text('2',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Are you male or female?");
	});
	
});
	
