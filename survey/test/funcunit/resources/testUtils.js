SBTestUtils = {
	back: function(count) {
		count = count || 1;
		for (var i=0; i<count; i++) {
			S('#previous').click();
			S('#question_1').exists();
		}
	},
	
	yesToChange: function() {
		S('#dialog').visible();
		S('.ui-dialog-buttonset .ui-button-text:first').click();
	},
	
	checkContextDetails: function(questionNumber, value) {
		S('#questionnum').text(String(questionNumber), function(){
			equals(S("#contextdetails").text(), value);
		});
	},
	
	checkQuestionText: function(questionNumber, value) {
		S('#questionnum').text(String(questionNumber), function(){
		equals(S("#question_1 .question-title").text(), CONSTANTS.QUESTION_PREFIX + value);
	});
	}
	
}
