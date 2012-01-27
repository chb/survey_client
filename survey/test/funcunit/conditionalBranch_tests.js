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
	SBTestUtils.checkQuestionText(1, 'Please enter an integer');
	
});

test("Integer Branching", function(){

	// test 1
	S('#question_1 .answer:first .answer-input').click().type("1");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(2, 'integer less than 5');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 5
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("5");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(2, 'integer equal to 5');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 6
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("6");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(2, 'integer greater than 5');
	
});

test("Date Branching", function(){
	// click next and wait for third question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(3, 'Please enter a date');
	
	// test 05/05/1985
	S('#question_1 .answer:first .answer-input').click().type("05/05/1985");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(4, 'date less than 01/01/2011');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 01/01/2011
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("01/01/2011");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(4, 'date equal to 01/01/2011');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 02/01/2011
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("02/01/2011");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(4, 'date greater than 01/01/2011');
});

test("Decimal Branching", function(){
	// click next and wait for fith question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(5, 'Please enter a decimal');
	
	// test 0.1
	S('#question_1 .answer:first .answer-input').click().type("0.1");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(6, 'decimal less than 3.14');
	
	// go back 
	SBTestUtils.back(1);
	
	// test .1000
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type(".1000");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(6, 'decimal less than 3.14');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 3.14
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("3.14");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(6, 'decimal equal to 3.14');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 03.140
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("03.140");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(6, 'decimal equal to 3.14');
	
	// go back 
	SBTestUtils.back(1);
	
	// test 3.145
	S('#question_1 .answer:first .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	equals(S('#question_1 .answer:first .answer-input').text(), "");
	S('#question_1 .answer:first .answer-input').click().type("3.145");
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(6, 'decimal greater than 3.14');
});

test("Object Branching", function(){
	// click next and wait for seventh question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(7, 'select one');
	
	// test #apple
	S('#question_1 .answer:first .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(8, 'apple selected');
	
	// go back 
	SBTestUtils.back(1);
	
	// orange
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(8, 'orange selected');
	
});

test("Boolean Object Branching", function(){
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(9, 'Please select yes or no');
	
	// test yes
	S('#question_1 .answer:first .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(10, 'yes was selected');
	
	// go back 
	SBTestUtils.back(1);
	
	// no
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next and wait for second question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(10, 'no was selected');
	
});

test("Contains/Does Not Contain Operator", function(){
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(11, 'Please select many');
	
	// test Alaska and Hawaii 
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer .answer-selector:last').click();
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(12, 'alaska was selected');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(13, 'hawaii was selected');
	
	// go back 
	SBTestUtils.back(2);
	
	// deselect hawaii
	S('#question_1 .answer:last .answer-selector').click();
	
	// click next  and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(12, 'alaska was selected');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(13, 'no hawaii');
	
});

test("AND/OR Operator", function(){
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(14, 'Select many things');
	
	// test with apple checked
	S('#question_1 .answer .answer-selector:first').click();
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(15, 'apple or yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(16, 'apple or 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(17, 'end of AND OR testing');
		
	// go back 
	SBTestUtils.back(3);
	
	// test with yes checked
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer .answer-selector:eq(1)').click();
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(15, 'apple or yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(16, 'yes and not 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(17, 'end of AND OR testing');
	
	// go back 
	SBTestUtils.back(3);
	
	// test with apple and yes checked
	S('#question_1 .answer .answer-selector:first').click();
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(15, 'apple and yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(16, 'apple or yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(17, 'apple or 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(18, 'yes and not 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(19, 'end of AND OR testing');
	
	// go back 
	SBTestUtils.back(5);
	
	// test with yes and 6 checked
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer:last .answer-input').click().type("6");
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(15, 'apple or yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(16, 'apple or 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(17, 'yes and 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(18, 'end of AND OR testing');
	
	// go back 
	SBTestUtils.back(4);
	
	// test with apple yes and 6.5 checked
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer:last .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	S('#question_1 .answer:last .answer-input').click().type("6.5");
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(15, 'apple and yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(16, 'apple or yes');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(17, 'apple or 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(18, 'yes and not 6');
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkContextDetails(19, 'apple and yes and 6.5');
	SBTestUtils.back(5);
	
	// test with 5
	S('#question_1 .answer .answer-selector:first').click();
	S('#question_1 .answer .answer-selector:eq(1)').click();
	S('#question_1 .answer:last .answer-input').click().type("[ctrl][a][ctrl-up][delete]");
	S('#question_1 .answer:last .answer-input').click().type("5");
	
	// click next and wait for question to render
	S('#next').click();
	SBTestUtils.checkQuestionText(15, 'end of AND OR testing');
	
});

