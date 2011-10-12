module("ConditionalBranch", { 
	setup: function(){
	}
});

test("Splash Page Copy Test", function(){
	S.open("//survey/test/funcunit/resources/conditionalBranchSurvey.html");
	
	// wait until the survey is loaded
	S('#survey_title').exists(function(){
		equals(S("#survey_title").text(), TEST_MESSAGES.CONDITIONAL_BRANCH_SURVEY.TITLE);
	});
	
});


test("Start Survey", function(){
	// start the survey
	S('#start').exists();
	S('#start').click();
	
	// make sure first question is loaded and has the correct text
	S('#questionnum').text('1',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Please enter an integer");
	});
	
});

test("Integer Branching", function(){

	// test 1
	S('#question_1 .answer:first .answer-input').click().type("1");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "integer less than 5");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 5
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("5");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "integer equal to 5");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 6
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("6");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('2', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "integer greater than 5");
	});
	
});

test("Date Branching", function(){
	// click next and wait for third question to render
	S('#next').click();
	S('#questionnum').text('3',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Please enter a date");
	});
	
	// test 05/05/1985
	S('#question_1 .answer:first .answer-input').click().type("05/05/1985");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('4', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "date less than 01/01/2011");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 01/01/2011
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("01/01/2011");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('4', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "date equal to 01/01/2011");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 02/01/2011
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("02/01/2011");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('4', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "date greater than 01/01/2011");
	}); 
});

test("Decimal Branching", function(){
	// click next and wait for fith question to render
	S('#next').click();
	S('#questionnum').text('5',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Please enter a decimal");
	});
	
	// test 0.1
	S('#question_1 .answer:first .answer-input').click().type("0.1");
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('6', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "decimal less than 3.14");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test .1000
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type(".1000");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('6', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "decimal less than 3.14");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 3.14
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("3.14");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('6', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "decimal equal to 3.14");
	}); 
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 03.140
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("03.140");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('6', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "decimal equal to 3.14");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// test 3.145
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("3.145");
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('6', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "decimal greater than 3.14");
	});
});

test("Object Branching", function(){
	// click next and wait for seventh question to render
	S('#next').click();
	S('#questionnum').text('7',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "select one");
	});
	
	// test #apple
	S('#question_1 .answer:first .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('8', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "apple selected");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// orange
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('8', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "junk question");
		equals(S("#contextdetails").text(), "orange selected");
	});
	
});

test("Boolean Object Branching", function(){
	// click next and wait for question to render
	S('#next').click();
	S('#questionnum').text('9',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Please select yes or no");
	});
	
	// test yes
	S('#question_1 .answer:first .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	S('#questionnum').text('10', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "yes was selected");
		equals(S("#contextdetails").text(), "yes selected");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// no
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next, select "yes" to change answer, and wait for second question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('10', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "no was selected");
		equals(S("#contextdetails").text(), "no selected");
	});
	
});

test("Contains/Does Not Contain Operator", function(){
	// click next and wait for question to render
	S('#next').click();
	S('#questionnum').text('11',function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "Please select many");
	});
	
	// test Alaska and Hawaii 
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer .answer-selector:last').click();
	
	// click next and wait for question to render
	S('#next').click();
	S('#questionnum').text('12', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "alaska was selected");
		equals(S("#contextdetails").text(), "alaska selected");
	});
	
	// click next and wait for question to render
	S('#next').click();
	S('#questionnum').text('13', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "hawaii was selected");
		equals(S("#contextdetails").text(), "hawaii selected");
	});
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// go back 
	S('#previous').click();
	S('#question_1').exists();
	
	// deselect hawaii
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next, select "yes" to change answer, and wait for question to render
	S('#next').click();
	S('#dialog').visible();
	S('.ui-dialog-buttonset .ui-button-text:first').click();
	S('#questionnum').text('12', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "alaska was selected");
		equals(S("#contextdetails").text(), "alaska selected");
	});
	
	// click next and wait for question to render
	S('#next').click();
	S('#questionnum').text('13', function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + "no hawaii");
		equals(S("#contextdetails").text(), "no hawaii");
	});
	
});
