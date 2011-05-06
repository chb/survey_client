/*
 * 
 */
QuestionController = $.Controller.extend('Survey.Controllers.Question',
/* @Static */
{
  onDocument: true
},
/* @Prototype */
{
   'question.show subscribe': function(event, params) {

        $('#questions').empty();

        for (var i = 1; i <=  params.questions.length; i++){
            var element_name = 'question_' + i;
            $('#questions').append('<div id="' + element_name + '" class="question"></div>')
            var questionElement = $('#' + element_name);
            var currentQuestion = params.questions[i-1];
            var questionOffset = params.questions.length - i;
            // render the question
            questionElement.html($.View("//survey/views/question/" + currentQuestion.get_type() + ".ejs", {question: currentQuestion, currentAnswer: SURVEY.current_answer(questionOffset) }));
            // attach answer controllers
            $.each(questionElement.find('.answer'), function (){
            	$(this).survey_answer();
            });
        }
        
        $('html, body').animate({scrollTop:0}, 0);
    }
});
