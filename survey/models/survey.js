//
// A Survey Object
// not RDF at the top-level, but RDF within.
//

Survey = Class.extend({
    init: function(xml_document, metadata) {
		if (metadata != null && metadata.length > 0) {
			this.digest = metadata.getElementsByTagName('Document')[0].getAttribute('digest');
			this.created_at = metadata.getElementsByTagName('Document')[0].getElementsByTagName('created')[0].getAttribute('at');
		}

		this.store = new RDFIndexedFormula();

		var parser = new RDFParser(this.store);

		// parse the document the right way if it can be parsed the right way
		var root = null;
		if (xml_document.getElementsByTagNameNS)
			root = xml_document.getElementsByTagNameNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#','RDF')[0];
		else
			root = xml_document.getElementsByTagName('rdf:RDF')[0];
	
		parser.parse(root, undefined, 'survey');

		// find the URI of the survey
		var uri = this.store.any(undefined, RDF.NS.rdf('type'), SurveyJSObject.TYPE);

		// instantiate it and go
		this.survey = RDFJSObject.getObject(this.store, uri);
    },

    estimateNumQuestions: function() {
	// create a new state
	var state = new SurveyState(this.survey);
	
	var num_questions = 0;

	// loop until survey done
	while(true) {
	    // forward to next question
	    state.forwardUntilRequiresAnswer();

	    // no more questions? break
	    if (state.isEndOfSurvey())
		break;

	    // if it's been answered, answer it
	    if (this.state.answers.length > num_questions) {
		state.setCurrentAnswer(this.state.answers[num_questions]);
	    } else {
		// otherwise answer with the default answer if there is one
		var current_question = state.getCurrentQuestion();
		var default_answer = current_question.getDefaultAnswerForEstimation();
		if (default_answer) {
		    state.setCurrentAnswer(default_answer);
		}
	    }
		

	    num_questions += 1;
	}

	return num_questions;
    },

    // set up the state and all
    start: function() {
		if (!this.state){
			this.state = new SurveyState(this.survey);
		}
		//start off with a default of rendering 1 element per page
		this.elementsToRender = 1;
		this.started = true;
		this.forward_until_next_question();
    },

    current_question: function() {
	return this.state.getCurrentQuestion();
    },

    current_questions: function() {
        return this.state.getCurrentQuestions();
    },

    current_element: function(offset) {
	return this.state.getCurrentElement(offset);
    },

    getSubtitle: function() {
	// see if the element has something to say
	return(this.state.getSubtitle());
    },

    getSubdescription: function() {
	// see if the element has something to say
	return(this.state.getSubdescription());
    },

    // if there is an answer for the current question, give it
    current_answer: function(offset) {
	return this.state.getCurrentAnswer(offset);
    },

    /*  
     * Retrieve an answer from the DOM element representing a question.
     *
     * @param {Number} number The question number to retrieve the answer for
     * @param {Number} offset The offset of this question from the top of the stack
     *
     * @returns A representation of the answer for this question dependant on the question and answer type
    */
    getAnswerFromDOM: function(number, offset) {
	var current_question = this.state.getCurrentQuestion(offset);
	
	// the DOM selector
	var dom_element = $('#question_' + number)[0];

	return current_question.getCurrentAnswer(dom_element);
    },

    /*
     * Set the answer for a question into the current survey state
     *
     * @param {Object} answer Representation of the current answer
     * @param {Number} offset The offset from the top of the stack of the question this answer is for
     */
    setCurrentAnswer: function(current_answer, offset, failOnChange) {
	// set the current answer
	return this.state.setCurrentAnswer(current_answer, offset, failOnChange);
    },

    forward_until_next_question: function() {
	return this.state.forwardUntilRenderable();
    },

    rewind_until_prev_question: function() {
	return this.state.rewindUntilRenderable();
    },

	rewind: function(index) {
		return this.state.rewind(index);
	},

    get_state: function() {
	return this.state.getEncodedAnswers();
    },

    restore_from_state: function(state) {
	this.state = SurveyState.load(this.survey, state);
    }

});

Survey.load = function(data_connector, callback) {
    data_connector.get_survey(function(survey_raw) {
    // parse xml to see if it is valid.  Adapted from the W3Cschool's example
	try {
			if (window.DOMParser) {
  				parser=new DOMParser();
				xmlDoc=parser.parseFromString(survey_raw, "text/xml");
  			}
			else { 
				// Internet Explorer  
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
  				xlDoc.loadXML(survey_raw); 
			}
		}
		catch (e) {
			//alert("bad survey definition");
		}
		data_connector.get_survey_metadata(function(meta_raw) {
			var survey = new Survey(survey_raw, meta_raw);
			callback(survey);
		});
    });
};
