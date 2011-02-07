
/*
 * New Survey State Design (Noah and Ben, 2008-11-25)
 * redone completely in mid 2009 by Ben.
 *
 * contains the raw answers given by the user so far.
 * will be worthless if the survey changes in any meaningful way.
 * needs to be serializable without strong dependency on domain objects.
 *
 * used for
 * - determining variables required for next question display
 * - determine which is the next question
 * - determine which is the previous question
 *
 * tricky things
 * - removing variables from the "context" on clicking "previous".
 * -- probably requires keeping a separate context for each question, and copying it on "next".
 *
 * Example State
 * user has answered three questions: (b), (d,a), 31.
 * first question led to a conditional, which sent the user to a subline for questions 2 and 3.
 * STATE = {
 *   answers: [{answer_positions: [1]}, {answer_positions: [3,0]}, {answer_text: "31"}]
 * }
 *
 * we are on question #4, assume a "next" click, what happens?
 *
 * we need to re-simulate the whole survey to figure out WHAT question we're even on.
 *
 * - Survey.next(EMPTY_STACK) --> NEW_STACK = [{surveyElement: LINE_0, variables: {}}];
 * - Survey.next([{surveyElement: LINE_0, variables: {}}]) --> STACK_0 =
 *       [{surveyElement: LINE_0, variables: {pos: 0}}, {surveyElement: QUESTION_0, variables: {}}]
 * 
 * - RENDERABLE! We don't need to render though, because we have an answer already
 * 
 * - STATE = [{answer_positions: [1]}]
 *
 * - Survey.next(STACK_0) --> STACK_1 =
 *      [{surveyElement: LINE_0, variables: {pos: 1}}, {surveyElement: LINE_1, variables: {}}]
 *
 * - Survey.next(STACK_1) --> STACK_2 =
 *      [{surveyElement: LINE_0, variables: {pos: 1}}, {surveyElement: LINE_1, variables: {pos:0}}, {surveyElement: QUESTION_1, variables :{}}]
 * 
 * - STATE = [{answer_positions: [1]}, {answer_positions:[3,0]}]
 *
 * - Survey.next(STACK_2) --> STACK_3 =
 *      [{surveyElement: LINE_0, variables: {pos: 1}}, {surveyElement: LINE_1, variables: {pos:1}}, {surveyElement: QUESTION_2, variables :{}}]
 *
 * - Survey.next needs an extra pameter: auxiliary data in some form that lets it decide conditionals.
 *
 * - a different call for getting the data out of the view: Survey.questionAnswered(STACK, ANSWER_DATA) --> update the ANSWER_DATA appropriately.
 *
 * Build abstractions for:
 * - Stack (StackEntry)
 * - AnswerList (AnswerListItem)
 * 
 */

//
// Some invariants for survey state (Ben, 2009-06-03)
//
// the answer_index should point to the position in the answers array that corresponds
// to the current_question

SurveyState = Class.extend({

    init: function(survey) {
	// store the survey
	this.survey = survey;
	this.reset();
    },

    reset: function() {
	// answer RDF graph
	this.answer_graph = new RDFIndexedFormula();

        // stack of answers and navigation through the survey
        this.stack = new Stack();
        var new_entry = new StackEntry(this.survey, {}, this.survey.getInitVars(), this.survey.initAnswerGraph({}, null, this.answer_graph));
        this.stack.push(new_entry);                

	// list of answers
        this.answers = new Array();

        // answer position of the current question we are analyzing
        this.answer_index = null;

        // default to showing one question at a time
        this.elementsToRender = 1;
        
	// current question is obtained from the stack
    },


    isEndOfSurvey: function() {
	return (this.getCurrentElement() == null);
    },

    // summary of all questions and answers
    getQuestionsAndAnswers: function() {
	// create a new state
	var new_state = new SurveyState(this.survey);
	
	var questions_and_answers = [];

	// go through each saved answer and do the right thing
	$(this.answers).each(function(i, answer) {
	    // forward to the next question
	    new_state.forwardUntilRequiresAnswer();

	    // FIXME: technically, an answer required doesn't mean there's
	    // a meaningful question here, it could be a transition screen.

	    // here we store the question and answer
	    var question = new_state.getCurrentQuestion();
	    var one_q_and_a = {'question': question.question, 'answer': question.prettifyAnswer(answer)};
	    questions_and_answers.push(one_q_and_a);

	    // set the answer
	    new_state.setCurrentAnswer(answer);
	});

	return questions_and_answers;
    },

    rewindUntilRenderable: function() {
        // are we at the very end of the survey?
		var end_of_survey_p = this.isEndOfSurvey();

		var indexToRewindTo = (end_of_survey_p) ? this.answer_index : (this.answer_index - this.elementsToRender);
		return this.rewind(indexToRewindTo);
        
    },
    
    rewind: function(index) {
    	var answers = this.answers.slice(0);
        // slice off answers we want to play back
        var answersToReplay = this.answers.slice(0, index+1);

		// clear stuff
		this.reset();
        var currentQuestions = [];

        while (answersToReplay.length > 0){
            this.forwardUntilRenderable();
            currentQuestions = this.getCurrentQuestions();
            if (currentQuestions.length >= answersToReplay.length) {
				// do not set the answer(s) in the answer graph if we are on the last question(s)   
				answersToReplay = [];          
            }
            else{
		        for (var i=1; i<=currentQuestions.length; i++){
		            this.setCurrentAnswer(answersToReplay.shift(), currentQuestions.length-i)
		        }
            }
        }

		//restore original answers
		this.answers = answers;

		//TODO: did this get missplaced on refactor?
		if (index < 0) {
			// trying to go back while on the first question?
			return false;
		}

		return true;
    },
    
    /**
     * Traverse the survey until the point where something is to be rendered on screen.
     */
    forwardUntilRenderable: function() {
            while(true) {
                var amountToRender = this.__next();

                if (!amountToRender) {
                    // we're done!
                    return false;
                }

                // FIXME: probably need another terminating condition than this
                if (this.stack.isRenderable())
                    break;
            }

            // we've gotten to a renderable place
            // if this is requires an answer, then move the answer array index forward too
            if (this.stack.requiresAnswer()) {
                // move the pointer to the next place in the answer
                if (this.answer_index != null)
                    this.answer_index += amountToRender;
                else
                    this.answer_index = amountToRender-1;
            }
	return true;
    },

    // traverse the survey until the point where something requires an answer

    /**
     *	Traverse the survey until the point where somethikng requires an answer.  This advances
     *	one question at a time and supresses survey elements that want to display more than
     *	one item per page
     */
    forwardUntilRequiresAnswer: function() {
	while(true) {
	    var still_going = this.__next(1);

	    if (!still_going) {
		// we're done!
		return false;
	    }

	    // FIXME: probably need another terminating condition than this
	    if (this.stack.requiresAnswer())
		break;
	}

	// we've gotten to place where an answer is required
	// move the pointer to the next place in the answer
	if (this.answer_index != null)
	    this.answer_index += 1;
	else
	    this.answer_index = 0;

	return true;
    },

    // clock-tick the survey to the next step
    // may not be renderable yet

    /**
     *	Clock-tick the survey to the next step.
     *
     *	@param {Number} limit Number of survey_elements to limit __next from placing on the stack.  Default is no limit.
     */
    __next: function(limit) {

	// loop until we are done or have an element
	// this differs from the previous approach in that there was no loop here.
	// but we want to ensure we pop the stack as far up as we need to, without going twice
	// over the components in the middle of the tree, like lines.
	while(true) {
	    // latest entry in stack
	    var current_entry = this.stack.peek();
	    
	    if (current_entry == null) {
		// done with survey!
		return null;
	    }

	    // what's the next step
	    // expect modification of the vars, it's mutable, but that's okay.
	    var env = {params: params, subject: new_subject, answer_graph : this.answer_graph};
	    var next = current_entry.survey_element.doNext(current_entry, this.answer_graph, limit);

	    // break out and do something
	    if (next != null)
		break;

	    this.stack.pop();
	}

	// next, if not null, contains
	// - survey_element
	// - connector to connect the previous stuff to the new stuff
	// - params to be fed to the new node
        // TODO refactor and comment
	// array of survey_elements to process
	for (var i=0; i< next.elements.length; i++){
	    var params = next.elements[i].params || {};

	    // initialize the answer graph and determine new subject
	    // based on connector
	    var new_subject = next.elements[i].survey_element.initAnswerGraph(next.elements[i].connector, current_entry.subject, this.answer_graph);

	    // generate the new stack entry
	    // don't know the vars yet, so none fed in
	    var new_entry = new StackEntry(next.elements[i].survey_element, params, null, new_subject);

	    // set the vars
	    new_entry.vars = next.elements[i].survey_element.getInitVars(new_entry, this.answer_graph);

	    // push a new entry onto the stack
	    this.stack.push(new_entry);

	}

	this.elementsToRender = next.elements.length;

	return next.elements.length;
	
    },

    // set the current answer
    setCurrentAnswer: function(answer, offset, failOnChange) {
		// set offset to 0 if not passed in
    	offset = offset || 0;

		var current_entry = this.stack.getRenderableEntry(offset);

		// remove rest of answers if this answer is different from the previous one
		if (this.answers[this.answer_index - offset] != null) {
			if ($.toJSON(this.answers[this.answer_index - offset]) != $.toJSON(answer)) {
				if(failOnChange){
					if(this.answer_index < (this.answers.length-1)) {
						//  don't change answer if failOnChange is true and we are not changing the last answer
						return false;
					}
				}
				else{
					var new_answers = new Array();
					for (var i=0; i<this.answer_index - offset; i++) {
						new_answers[i] = this.answers[i];
					}
					this.answers = new_answers;
				}
			}
		}

		// save the answer
		this.answers[this.answer_index - offset] = answer;

		// ask question to add itself
		current_entry.survey_element.addToAnswerGraph(current_entry.subject, answer, this.answer_graph);
		return true;
    },

    getCurrentAnswer: function(offset) {
	var result = this.answers[this.answer_index - offset];

	// always return a blank dictionary, just to make things easier
	if (result == null) {
	    return {};
	} else {
	    return result;
	}
    },

    getCurrentQuestionNum: function() {
	return this.answer_index + 1;
    },

    getCurrentProgress: function() {
    },

    getSubtitle: function() {
	return this.stack.lookup_var('title');
    },

    getSubdescription: function() {
	return this.stack.lookup_var('description');
    },
    
    /* Returns the JSONified answers.
    */
    getEncodedAnswers: function() {
        return $.toJSON(this.answers);
    },

    getEncodedAnswerGraph: function() {
	return this.answer_graph.toString();
    },
    
    /* Returns the answers from the answer list.
    */
    getAnswers: function() {
	return this.answers;
    },       

    /* returns the top element of the state's stack.
    */
    getCurrentQuestion:function(offset) {
        return this.stack.getQuestion(offset);
    },
    
    /* Returns all questions that currently need to be rendered
     *
    */
    getCurrentQuestions: function(){
        return this.stack.getQuestions(this.elementsToRender);
    },

    // FIXME: duplicate of above func, but better abstraction
    getCurrentElement:function(offset) {
	var entry = this.stack.getRenderableEntry(offset);
	if (entry) {
	    return entry.survey_element;
	}
    },

    serialize: function() {
	return this.getEncodedAnswers();
    }
});


/*
 * Static method to reload the survey state from the saved answer list.
 */
SurveyState.load = function(survey, saved_answers_json) {
    var saved_answers = $.secureEvalJSON(saved_answers_json);
    
    // create a new state
    var new_state = new SurveyState(survey);
    
    // go through each saved answer and do the right thing
    $(saved_answers).each(function(i, answer) {
	// forward to the next question
	new_state.forwardUntilRequiresAnswer();

	// set the answer
	new_state.setCurrentAnswer(answer);
    });

    // forward until renderable, otherwise the last "next" wasn't clicked
    new_state.forwardUntilRenderable();

    // that's it, we simulated taking this survey
    return new_state;
};

// an entry in a stack mapped to a given survey domain object
// and a facility for setting and getting variables
StackEntry = Class.extend({
    init: function(survey_element, params, vars, subject) {
	this.survey_element = survey_element;
	this.vars = vars;
	this.subject = subject;
	this.params = params;
    },

    isRenderable: function() {
        return this.survey_element.isRenderable();
        //return this.survey_element instanceof QuestionJSObject;
    },


    requiresAnswer: function() {
	return this.survey_element.requiresAnswer();
    },

    vars_and_params: function() {
	return jQuery.extend(jQuery.extend({}, this.vars), this.params);
    }
});

// a call-stack like structure for current position in the survey
Stack = Class.extend({
    init: function() {
    	this.entries = [];
    },

    pop: function() {
        return this.entries.pop();
    },
    
    push: function(stack_entry) {
    	return this.entries.push(stack_entry);
    },

    peek: function(offset) {
        if(this.entries.length > 0) {
            if(offset != null) {
                return this.entries[this.entries.length - offset - 1];
            }
        	return this.entries[this.entries.length-1];
	    } else {
	        return null;
	    }
    },

    lookup_var: function(var_name, additional_offset) {
	var offset = 1;
	if (additional_offset)
	    offset += additional_offset;
	while(true) {
	    var entry = this.peek(offset);
	    if (entry == null)
		return null;
	    if (entry.vars[var_name] != null)
		return entry.vars[var_name];
	    offset += 1;
	}
    },

    isComplete: function() {
        return this.peek() == null;
    },
    
    isRenderable: function() {
        var obj = this.peek();
        if(obj == null) {
            return false;
        }
        
    	return obj.isRenderable();
    },

    requiresAnswer: function() {
        var obj = this.peek();
        if(obj == null) {
            return false;
        }
        
    	return obj.requiresAnswer();
    },	

    getQuestion: function(offset) {
        if(this.isRenderable()) {
            return this.peek(offset).survey_element;
        }
        
        return null;
    },

    // returns up to "amount" number of questions
    getQuestions: function(amount){
        var questions = [];
        for (var i = 0; i < amount; i++){
            var element = this.peek(i);
            if (element && element.survey_element && element.isRenderable()){
                questions.push(element.survey_element);
            }
        }
        
        // restore original question order
        questions.reverse();
        
        return questions;
    },

    getRenderableEntry: function(offset) {
	if (this.isRenderable()) {
	    return this.peek(offset);
	} else {
	    return null;
	}
    },
    
    getVars: function() {
        if(this.isRenderable()) {
            return this.peek().vars;
        }
        
        return null;    
    }

});

