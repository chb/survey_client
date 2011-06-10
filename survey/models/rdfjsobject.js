/* Base class to represent an element from the survey RDF.
 * This class is responsible for wrapping the elements of each survey
 * tag in an accessible dictionary-like format.
 */
RDFJSObject = Class.extend({

  init : function(store, subject) {
    var self = this;
    this.resource = subject;

    // a map of the object's properties
    this.propertyContainer = {};
    this.propertyKeys = [];

    //FIXME What is this?  URI it?
    var statements = store.statementsMatching(subject, undefined, undefined);

    // loop through properties
    $(statements).each( function(statement_num, statement) {
      //NOTE: could we have multiple?  just using any for now (returns first)
      var object = null;

      if (statement.object.termType === 'literal') {
        object = RDF.convertLiteralToJavaScript(statement.object);
      } 
     /* else if (statement.object.termType === 'bnode' && statement.predicate.uri === 'http://indivo.org/survey/vocab#Condition') {
      	// don't build object for conditions
      	steal.dev.log("found Condition");
      }*/
      else {
        object = RDFJSObject.getObject(store, statement.object);
      }

			if (object) {
	      // TODO: allow multiples values for a given predicate and a given subject
	      if (self.propertyContainer[statement.predicate] == null) {
	        self.propertyContainer[statement.predicate] = [];
	      }
	
	      // put the object and the raw RDF element in one tuple
	      var complete_object = {'raw': statement.object, 'processed' : object};
	      self.propertyContainer[statement.predicate].push(complete_object);
	      self.propertyKeys[statement_num] = statement.predicate;
      }
    });
    this.set_attributes();
  },
  //
  // sets the attributes from the RDF
  //
  set_attributes: function() {
  },
  get_all_complete: function(prop) {
    return this.propertyContainer[prop];
  },
  get_all: function(prop) {
    return $(this.get_all_complete(prop)).map( function(i, el) {
      return el.processed;
    });
  },
  get_one_complete: function(prop, processing_func) {
    var all_props = this.get_all_complete(prop);
    if (all_props)
      return processing_func(all_props[0]);
    else
      return null;
  },
  get_one: function(prop, processing_func) {
    // get the complete object extract its processed form, and call the callback
    return this.get_one_complete(prop, function(el) {
      return processing_func(el.processed);
    });
  },
  get_value: function(prop) {
    return this.get_one(prop, function(el) {
      return el.value;
    });
  },
  get_uri: function(prop) {
    return this.get_one(prop, function(el) {
      return el.resource.uri;
    });
  },
  get_resource_object: function(prop) {
    return this.get_one(prop, function(el) {
      return el;
    });
  },
  get_raw: function(prop) {
    return this.get_one_complete(prop, function(el) {
      return el.raw;
    });
  },
  get_type: function() {
    return this.get_uri(RDF.NS.rdf('type')).split('#')[1];
  }
});

/* static factory method
 * check the type and if it's a type of question (MCQ, etc..)
 * then we have to ensure we reference in on the id literal property
 * as the "subject"... this may involve an extra step
 * we can generalize this and then create answer, and branch tags and conditional tags
 */
RDFJSObject.getObject = (function() {
  var objectMap = {};

  var the_func = function(store, subject) {
    var return_object = objectMap[subject];

    if (!return_object) {
      var tripleObject = store.any(subject, RDF.NS.rdf('type'),undefined);

      if(tripleObject == null) {
        return_object = new RDFJSObject(store, subject);
      } else {
        if (!OBJECT_TYPES[tripleObject.uri]) {
          alert('ERROR: unrecognized type: ' + tripleObject.uri );
        }
        return_object = new OBJECT_TYPES[tripleObject.uri](store, subject);
      }

      objectMap[subject] = return_object;

    }

    return return_object;
  };
  return the_func;
})();
/* The SurveyComponent class is the main class for survey elements.  It defines
 * the idea of renderability of a survey object and defines a method for access
 * of the initial survey variables.
 */
SurveyComponent = RDFJSObject.extend({
  getInitVars: function(env, answer_graph) {
    return {};
  },
  // does this component have to be rendered to screen?
  isRenderable: function() {
    return false;
  },
  // can this component be rendered along with other
  canRenderWithOthers: function() {
    return false;
  },
  // does this component require an answer?
  requiresAnswer: function() {
    return false;
  },
  // initialize in answer graph, e.g. when connecting a new element
  // this should return a new subject if need be
  initAnswerGraph: function(connector, current_subject, graph) {
    if (connector != null) {
      // create a new bnode in the graph and connect it
      var new_node = new RDFBlankNode();
      graph.add(current_subject, connector, new_node);
      return new_node;
    } else {
      return current_subject;
    }
  }
});

/* Answer object that represents an answer corresponding to a question in a survey.
 */
AnswerJSObject = SurveyComponent.extend({
  set_attributes: function() {
    this.label = this.get_value(RDF.NS.survey('answerLabel'));
    this.note = this.get_value(RDF.NS.survey('answerNote'));
    this.text = this.get_value(RDF.NS.survey('answerText'));
    this.selected = this.get_value(RDF.NS.survey('selected'));
    this.type = this.get_uri(RDF.NS.rdf('type')).split('#')[1];

    this.property = this.get_raw(RDF.NS.survey('answerProperty'));
    this.object = this.get_raw(RDF.NS.survey('answerObject'));
  },
  validateAnswer: function(text) {
    return null;
  },
  // getValue extract the value for this answer from the dom_element
  getValue: function(dom_element) {
    throw new UnsupportedException("base answer doesn't implement getValue");
  },
  prettify: function(struct) {
    throw new UnsupportedException("base answer doesn't implement prettify");
  },
  // FIXME: probably deprecate this
  // setValue sets the value of the answer (e.g. when someone clicks "back")
  setValue: function(dom_element, value) {
    throw new UnsupportedException("base answer doesn't implement setValue");
  },
  // indicates whether this answer matches the current_answer object
  matches: function(current_answer) {
    throw new UnsupportedException("base answer doesn't implement matches");
  }
});

LabelAnswerJSObject = AnswerJSObject.extend({
  getValue: function(dom_element) {
    return this.getValueFromRaw(this.text);
  },
  getValueFromRaw: function(raw) {
    return {'label' : raw};
  },
  prettify: function(struct) {
    return struct['label'];
  },
  setValue: function(dom_element, value) {
    // nothing needed here for just a label
  },
  matches: function(current_answer) {
    return (this.text == current_answer.label)
  },
  addToAnswerGraph: function(current_subject, current_question, answer, graph) {
    var property = this.property || current_question.answer_property;
    var object = this.object || current_question.answer_object;

    if (property != null && object != null)
      graph.add(current_subject, property, object);
  },
  removeFromAnswerGraph: function(current_subject, current_question, answer, graph) {
    var property = this.property || current_question.answer_property;
    var object = this.object || current_question.answer_object;

    if (property != null && object != null)
      graph.removeMany(current_subject, property, object);
  }
});

// fill-in a text answer
TextAnswerJSObject = AnswerJSObject.extend({
  set_attributes: function() {
    this._super();
    this.label = this.get_value(RDF.NS.survey('answerLabel'));

    // long or short?
    this.length = this.get_value(RDF.NS.survey('length'));

    // maybe a datatype
    var datatype = this.get_uri(RDF.NS.survey('datatype'));
    if (datatype) {
    	this.datatype = new RDFSymbol(datatype);
    }
  },
  getValue: function(dom_element) {
    var raw_answer = $(dom_element).find('.answer-input').val();

    // make sure it's not empty
    if ($.trim(raw_answer) == "") {
      var error = new Error(MESSAGES.EMPTY_ANSWER);
      error.name = 'AnswerRequired';
      error.el = $(dom_element).closest('.answer');
      throw error;
    }

		if (this.datatype) {
	    if (this.datatype.sameTerm(RDF.Symbol.XSDdateTime)) {
	      //TODO: better way to handle this
	      // Grab the date from the datepicker if the text in the input field matches the date selected on the datepicker
	      if (raw_answer && raw_answer === $.datepicker.formatDate( MESSAGES.DATE_FORMAT, $(dom_element).find('.answer-input').datepicker('getDate'))) {
	        raw_answer = $.datepicker.formatDate( 'mm/dd/yy', $(dom_element).find('.answer-input').datepicker('getDate'));
	      }
	    }

    	// validate the text answer
      var validation_message = VALIDATION[this.datatype.uri](raw_answer);
      if (validation_message != null) {
        var error = new RangeError(validation_message);
        error.el = dom_element;
        throw error;
      }
    }

    return this.getValueFromRaw(raw_answer);
  },
  getValueFromRaw: function(raw) {
    return {'text' : raw};
  },
  prettify: function(struct) {
    return struct['text'];
  },
  setValue: function(dom_element, value) {
    if (value) {
      $(dom_element).find('.answer-input').val(value.text);
    }
  },
  matches: function(current_answer) {
    // aggressively, if there is a non-null text field, go for it
    return (current_answer.text != null);
  },
  addToAnswerGraph: function(current_subject, current_question, answer, graph) {
    // if there is a datatype, then apply it
    var literal = new RDFLiteral(answer.text, "", this.datatype);
    var property = this.property || current_question.answer_property;

    graph.add(current_subject, property, literal);
  },
  removeFromAnswerGraph: function(current_subject, current_question, answer, graph) {
    // if there is a datatype, then apply it
    var literal = new RDFLiteral(answer.text, null, this.datatype);
    var property = this.property || current_question.answer_property;

    graph.removeMany(current_subject, property, literal);
  }
});

/* Sequence object that represents the typical actions of a domain object that
 * contains an array of properties in a survey.
 * TODO: Incorporate this with RDFJSObject instead?
 * TODO: SHould this inherit from RDFJSObject and just customize sequence-related
 * handling?
 */
SequenceRDFJSObject = SurveyComponent.extend({

  init: function(store, subject, keyName) {
    this._super(store, subject);

    var elements = [];

    // go find the elements
    var i = 0;
    while(true) {
      i += 1;
      var value = this.get_resource_object(RDF.NS.rdf('_' + i));
      if (value == null) {
        break;
      }

      elements[i-1] = value;
    }

    this.elements = elements;
  },
  get_type: function() {
    return "sequence";
  }
});

/* AnswerSequence object that represents a grouping of answers
 * corresponding to a question in a survey.
 * NOTE: Should we replace this with the relationship that a QuestionJSObject
 * simply has 1..* Answer objects?  This will change the way we initialize our
 * survey, but it might be worth looking into.
 */
AnswerSequenceJSObject = SequenceRDFJSObject.extend({});

QuestionSequenceJSObject = SequenceRDFJSObject.extend({});

/* Question object that represents the logical grouping of a question,
 * including its answers in a survey.
 */
QuestionJSObject = SurveyComponent.extend({

  set_attributes: function() {
    this.title = this.get_value(RDF.NS.dc('title'));
    this.question = this.get_value(RDF.NS.survey('questionText'));
    this.answers = this.get_resource_object(RDF.NS.survey('questionAnswers')).elements;
    this.default_answer_for_estimation = this.get_value(RDF.NS.survey('defaultAnswerForEstimation'));

    // answer property for all answers
    this.answer_property = this.get_raw(RDF.NS.survey('answerProperty'));

    // answer object for all answers
    this.answer_object = this.get_raw(RDF.NS.survey('answerObject'));

    this.displayType = this.get_value(RDF.NS.survey('displayType')) || 'list';
  },
  getQuestionType: function() {
    return this.get_uri(RDF.NS.rdf('type')).split('#')[1];
  },
  getInitVars: function(env, answer_graph) {
    var vars = {};

    // if we have a title
    if (this.title != null) {
      // substitute the vars
      vars.title = substitute_vars(this.title, env.subject, answer_graph, env.vars_and_params());
    } else {
      vars.title = env.params.title;
    }

    return vars;
  },
  isRenderable: function() {
    return true;
  },
  canRenderWithOthers: function() {
    return true;
  },
  requiresAnswer: function() {
    return true;
  },
  doNext: function(env, answer_graph) {
    return null;
  },
  // get the current answer from the DOM
  // a region of the DOM should be provided for
  // the question to find its proper elements.
  // validate them, raises an exception if there's a problem
  getCurrentAnswer: function(dom_element) {
    throw new UnsupportedException("base question class doesn't have this method");
  },
  getAnswerFromRawAnswer: function(raw_answer) {
    // packages a raw answer into an answer object, for defaults and such
    throw new UnsupportedException("base question doesn't know how to do this.");
  },
  prettifyAnswer: function(answer_struct) {
    // show a user-displayabled version of the answer
    throw new UnsupportedException("base question doesn't know how to do this.");
  },
  getDefaultAnswerForEstimation: function() {
    if (this.default_answer_for_estimation)
      return this.getAnswerFromRaw(this.default_answer_for_estimation);
    else
      return null;
  },
  addToAnswerGraph: function(current_subject, answer, graph) {
    throw new UnsupportedException("each question needs to define how to add its answer to the graph");
  }
});

/* Line object that represents the logical grouping of data in a survey.
 */
LineJSObject = SequenceRDFJSObject.extend({

  set_attributes: function() {
    // this will have to be evaluated for var subst
    this.title = this.get_value(RDF.NS.dc('title'));
    this.description = this.get_value(RDF.NS.survey('description'));
    this.questionsPerPage = this.get_value(RDF.NS.survey('questionsPerPage')) || 1;

    // parameters that are passed on to all children
    this.parameters = this.get_all(RDF.NS.survey('parameter'));

    this.connector = this.get_uri(RDF.NS.survey('connector'));
  },
  isRenderable: function() {
    return false;
  },
  /*
   *
   */
  getInitVars: function(env, answer_graph) {
    // we can now evaluate the title
    var vars = {'position': 0};

    // if we have a title
    if (this.title != null) {
      // substitute the vars
      vars.title = substitute_vars(this.title, env.subject, answer_graph, env.vars_and_params());
    } else {
      vars.title = env.params.title;
    }

    if(this.description !== null) {
      vars.description = substitute_vars(this.description, env.subject, answer_graph, env.vars_and_params());
    }

    return vars;
  },
  doNext: function(env, answer_graph, limit) {
    // still items to process - look up via position
    //env.vars.position += 1;

    if (!(env.vars.position < this.elements.length)) {
      // nothing more to do in this line
      return null;
    }

    // process the parameters
    var params;
    if (this.parameters != null) {
      params = process_parameters(this.parameters, env.subject, answer_graph, env.vars_and_params());
    }

    var elements = [];
    var maxElementsToPush = (limit && limit < this.questionsPerPage) ? limit : this.questionsPerPage;
    var pushed = 0;
    var keepPushing = true;
    while (keepPushing && pushed < maxElementsToPush && env.vars.position < this.elements.length) {
      if (this.elements[env.vars.position].canRenderWithOthers() || pushed === 0) {
        elements.push( {
          'survey_element': this.elements[env.vars.position],
          'params' : params,
          'connector' : this.connector
        });
        // stop adding elements if the one we just pushed can't render with others
        if (!this.elements[env.vars.position].canRenderWithOthers()) {
          keepPushing = false;
        }
        pushed += 1;
        env.vars.position += 1;
      } else {
        keepPushing = false;
      }

    }

    return {'elements': elements};
  }
});

/* Branch object that represents the branch logic of a survey.
 */
BranchJSObject = SurveyComponent.extend({

  set_attributes: function() {
    this.connector = this.get_uri(RDF.NS.survey('connector'));
    this.line = this.get_resource_object(RDF.NS.survey('line'));

    // parameters for the line
    this.parameters = this.get_all(RDF.NS.survey('parameter'));
  },
  /*
   * New doNext method (revamped by Noah and Ben 2008-11-25)
   */
  getInitVars: function(env, answer_graph) {
    return {'position': -1};
  },
  doNext: function(env, answer_graph) {
    // have we already branched
    if (env.vars.branched) {
      return null;
    }

    env.vars.branched = true;

    // figure out the parameters
    var params = process_parameters(this.parameters, env.subject, answer_graph, env.vars_and_params());

    var elements = [];
    elements.push({
      'params' : params,
      'survey_element': this.line,
      'connector' : this.connector
    });

    return {'elements': elements};
  }
});

/*Enhanced branch object that is followed when a conditional is met */
ConditionalBranchJSObject = BranchJSObject.extend({
  set_attributes: function() {
    this._super();
    this.branch_condition = this.get_value(RDF.NS.survey('branchCondition'));
    this.condition = this.get_resource_object(RDF.NS.survey('condition'));
  },
  doNext: function(env, answer_graph) {
    // have we already branched
    if (env.vars.branched) {
      return null;
    }

	if (this.branch_condition) {
		// support for old conditions  TODO: remove eventually
		if (!eval_conditional(this.branch_condition, env.subject, answer_graph, env.vars_and_params())) {
	      return null;
	    }
	}
	if (this.condition) {
		if (this.condition.evaluate(env, answer_graph).sameTerm(RDF.Literal.FALSE)) {
			return null;
		}
	}
    

    env.vars.branched = true;

    // figure out the parameters
    var params = process_parameters(this.parameters, env.subject, answer_graph, env.vars_and_params());

    var elements = [];

    elements.push({
      'params' : params,
      'survey_element': this.line,
      'connector' : this.connector
    });

    return {'elements': elements};
  }
});

/**
 * Represents a condition that evaluates to an RDFLiteral representation 
 * of true or false.  Consists of an operator and two operands. 
 */
ConditionJSObject = SurveyComponent.extend({
	set_attributes: function() {
		this.operator = this.get_resource_object(RDF.NS.survey('operator'));
		this.leftOperand = this.get_resource_object(RDF.NS.survey('leftOperand'));
		this.rightOperand = this.get_resource_object(RDF.NS.survey('rightOperand'));
	},
	    
	evaluate: function(env, answer_graph) {
		return this.operator.applyOperator(env, answer_graph, this.leftOperand, this.rightOperand);
	}
});

/**
 * Operands evaluate to an RDFLiteral representation of true or false, 
 * and can contain a nested ConditionJSObject
 */
OperandJSObject = SurveyComponent.extend({
	set_attributes: function() {
		this.condition = this.get_resource_object(RDF.NS.survey('condition'));
		this.value = this.get_raw(RDF.NS.survey('value'));
		
		var datatype = this.get_value(RDF.NS.survey('datatype'));
	    if (datatype) {
	    	this.datatype = new RDFSymbol(datatype);
	    }
	},
	getValue: function(env, answer_graph) {
		if (this.value) {
			if (this.datatype) {
				if (this.datatype.sameTerm(RDF.Symbol.predicate)) {
					// predicate
					return answer_graph.statementsMatching(env.subject, this.value);
				}
				else if (this.datatype.sameTerm(RDF.Symbol.object)) {
					// object
					return this.value;
				}
				else {
					// literal with a datatype
					return new RDFLiteral(this.value.value, '', this.datatype); 
				}
			}
			else {
				// literal without datatype
				return new RDFLiteral(this.value.value, '', null); 
			}
		}
		else {
			// evaluate sub-condition
			return this.condition.evaluate(env, answer_graph);
		}
	}
});

/**
 * Operators can be applied to two Operands, and return an RDFLiteral
 * representation of true or false
 */
OperatorJSObject = SurveyComponent.extend({
	set_attributes: function() {
		this.value = this.get_value(RDF.NS.survey('value'));
	},
	applyOperator: function(env, answer_graph, leftOperand, rightOperand) {
		var leftValue = leftOperand.getValue(env, answer_graph);
		var rightValue = rightOperand.getValue(env, answer_graph);
		var leftTerm;
		var rightTerm;
		var result = false;  //TODO: no default?
		var comparisonValue = null;
		
		if (this.value === 'contains') {
			// set operations TODO
			
		}
		else {
			// single value operations
			leftTerm = this.getFirstTerm(leftValue);
			rightTerm = this.getFirstTerm(rightValue);
			if (leftTerm && rightTerm) {
				comparisonValue = this.compareTerms(leftTerm, rightTerm);
			}
			
			switch (this.value) {
				case '=':
					if(comparisonValue === 0) {
						result = true;
					}
					else {
						result = false;
					}
					break;
				case '>':
					if(comparisonValue > 0) {
						result = true;
					}
					else {
						result = false;
					}
					break;
				case '>=':
					if(comparisonValue >= 0) {
						result = true;
					}
					else {
						result = false;
					}
					break;
				case '<':	
					if(comparisonValue < 0) {
						result = true;
					}
					else {
						result = false;
					}
					break;
				case '<=':	
					if(comparisonValue <= 0) {
						result = true;
					}
					else {
						result = false;
					}
					break;
				default:
					alert("unsupported operator: " + this.value);
					break;
			}
		}
		
		return new RDFLiteral(result.toString(), '', RDF.Symbol.XSDboolean);
	},
	
	getFirstTerm: function(value) {
		if (value.termType) {
			// literal
			return value;
		}
		
		// test borrowed from Crockford to see if this is an Array
		if (Object.prototype.toString.apply(value) === '[object Array]') {
			// grab first item if an array, might be undefined
			value = value[0];
		}
		
		if (value && value.object) {
			// RDF triple
			return value.object;
		}
		
		return value;
	},
	
	compareTerms: function(leftTerm, rightTerm) {
		var leftNumber; 
		var rightNumber;
		var leftDate;
		var rightDate;
		result = null;
		
		if (leftTerm && rightTerm) {
			// both terms are non-null
			if (leftTerm.datatype && rightTerm.datatype) {
				// both terms have datatypes
				if (leftTerm.datatype.sameTerm(rightTerm.datatype)) {
					// both terms have the same datatype
					if (leftTerm.datatype.sameTerm(RDF.Symbol.XSDdecimal)  || leftTerm.datatype.sameTerm(RDF.Symbol.XSDinteger)) {
						// compare Numbers
						leftNumber = Number(leftTerm.value);
						rightNumber = Number(rightTerm.value);
						if(leftNumber != NaN && rightNumber != NaN) {
							// two valid numbers
							if (leftNumber > rightNumber) {
								result = 1;
							}
							else if (leftNumber < rightNumber) {
								result = -1;
							}
							else if (leftNumber === rightNumber) {
								result = 0;
							}
						}
					}
					else if (leftTerm.datatype.sameTerm(RDF.Symbol.XSDdate)) {
						// TODO: refactor to remove duplicate code
						// compare Dates
						leftDate = Date.parse(leftTerm.value);
						rightDate = Date.parse(rightTerm.value);
						if (leftDate != NaN && rightDate != NaN ) {
							// two valid Dates
							if (leftDate > rightDate) {
								result = 1;
							}
							else if (leftDate < rightDate) {
								result = -1;
							}
							else if (leftDate === rightDate) {
								result = 0;
							}
						}
					}
					else {
						// unsupported datatype
						alert("unsupported datatype for comparison: " + leftTerm.dataType.toString());
					}
				}
				else {
					//TODO: proper handling of non-mathing data-types?
				}
			}
			else {
				// null datatype, compare as strings
				result = leftTerm.compareTerm(rightTerm);
				
			}
		}
		//TODO: return value for one of the terms being null?
		
		return result;
	}
});

/* Survey object that represents the "root"/start point of a survey.
 */
SurveyJSObject = SurveyComponent.extend({

  set_attributes: function() {
    this.line = this.get_resource_object("<http://indivo.org/survey/vocab#surveyLine>");
    this.title = this.getTitle();
    this.description = this.getDescription();
    this.introText = this.get_value(RDF.NS.survey('introText'));
    this.creator = this.getCreator();
    this.date = this.getDate();
    this.language = this.getLanguage();
    this.contact_email = this.getContactEmail();
    this.showDeIdentifiedMessage = this.get_value(RDF.NS.survey('showDeIdentifiedMessage'));
    this.reviewAnswers = this.get_value(RDF.NS.survey('reviewAnswers'));
    this.completedMessage = this.get_value(RDF.NS.survey('completedMessage'));
    this.showWhoFor = this.get_resource_object(RDF.NS.survey('showWhoFor'));
    this.showCreator = this.get_resource_object(RDF.NS.survey('showCreator'));
  },
  // initialize in answer graph, for a survey
  initAnswerGraph: function(connector, current_subject, graph) {
    return RDF.NS.survey('recordSubject');
  },
  render: function(controller) {
    // FIXME: build this
  },
  getTitle: function() {
    return this.get_value("<http://purl.org/dc/elements/1.1/title>");
  },
  getDescription: function() {
    return this.get_value("<http://purl.org/dc/elements/1.1/description>");
  },
  getCreator: function() {
    return this.get_value("<http://purl.org/dc/elements/1.1/creator>");
  },
  getDate: function() {
    return this.get_value("<http://purl.org/dc/elements/1.1/date>");
  },
  getLanguage: function() {
    return this.get_value("<http://purl.org/dc/elements/1.1/language>");
  },
  getContactEmail: function() {
    if(this.get_resource_object("<http://indivo.org/survey/vocab#contactEMail>") != null) {
      return this.get_uri("<http://indivo.org/survey/vocab#contactEMail>");
    } else {
      return this.get_value("<http://indivo.org/survey/vocab#contactEMail>");
    }
  },
  /*
   * New doNext method (revamped by Noah and Ben 2008-11-25)
   */
  getInitVars: function(env, answer_graph) {
    return {'main_line_started': false}
  },
  doNext: function(env, answer_graph) {
    // if we already started the main line, then we are done
    if (env.vars.main_line_started)
      return null;

    env.vars.main_line_started = true;

    var elements = [];

    // if not, return the main line as the new object
    elements.push({
      'survey_element': this.line
    });

    return {'elements': elements};
  }
});

/* SelectOneQuestionJSObject is a standard multiple choice question that also
 * has the option of having custom answers along with select-type answers.
 */
SelectOneQuestionJSObject = QuestionJSObject.extend({
  getCurrentAnswer: function(dom_element) {
    var self = this;
    var result = null;

    if (this.displayType === 'list') {
      var selectedAnswer = $(dom_element).find('.answer-selector:checked').first();
    } else if (this.displayType === 'dropDown') {
      var selectedAnswer = $(dom_element).find('.answer-selector:selected').first();
    }
    if (selectedAnswer.length > 0) {
      result = self.answers[selectedAnswer.attr("data-answerindex")].getValue(selectedAnswer.closest('.answer'));
    }

    if (result == null) {
      var error = new Error(MESSAGES.EMPTY_SELECT_ONE);
      error.name = 'AnswerRequired';
      error.el = dom_element;
      throw error;
    }

    return {'choice': result};
  },
  getMatchingAnswer: function(answer) {
    var choice = this.get_choice(answer);
    var the_answer = null;
    var self = this;
    $(this.answers).each( function(i, answer) {
      if (answer.matches(choice))
        the_answer = {'obj': answer, 'choice': choice};
    });
    return the_answer;
  },
  prettifyAnswer: function(answer) {
    // find the matching answer + choice (a tuple)
    var matching_answer = this.getMatchingAnswer(answer);
    if (matching_answer) {
      return matching_answer['obj'].prettify(matching_answer['choice']);
    } else {
      return "";
    }
  },
  get_choice: function(current_answer) {
    var choice = current_answer.choice
    if (choice == null)
      return {};
    else
      return choice;
  },
  addToAnswerGraph: function(current_subject, answer, graph) {
    // find the matching answer
    var matching_answer_and_choice = this.getMatchingAnswer(answer);
    if (matching_answer_and_choice)
      matching_answer_and_choice['obj'].addToAnswerGraph(current_subject, this, matching_answer_and_choice['choice'], graph);
  },
  removeFromAnswerGraph: function(current_subject, answer, graph) {
    // find the matching answer
    var matching_answer_and_choice = this.getMatchingAnswer(answer);
    if (matching_answer_and_choice)
      matching_answer_and_choice['obj'].removeFromAnswerGraph(current_subject, this, matching_answer_and_choice['choice'], graph);
  },
  getAnswerFromAnswerValue: function(answer_value) {
    return {'choice': {'label' : answer_value}};  //TODO: this is hardcoded for label answers only right now.  Need to rethink estimation
  },
  getAnswerFromRaw: function(raw) {
    return this.getAnswerFromAnswerValue(raw);
  }
});

/* SelectMultipleQuestionJSObject is a question where the user can check as many answers
 * as they'd like.
 */
SelectMultipleQuestionJSObject = QuestionJSObject.extend({
  getCurrentAnswer: function(dom_element) {
    var self = this;
    var result = [];
    // keep track of the answer elemenets
    var answer_els = $(dom_element).find('.answer-text');

    // which is the checked one?
    $(dom_element).find('.answer-selector').each( function(i, el) {
      if (el.checked) {
        result[i] = self.answers[i].getValue(answer_els[i]);
      } else {
        result[i] = {};
      }
    });
    return {"choices": result};
  },
  getChoices: function(answer) {
    if (answer) {
      return answer.choices;
    } else {
      return [];
    }
  },
  getMatchingAnswers: function(answer) {
    var the_answers = [];
    var self = this;
    $(this.getChoices(answer)).each( function(i, choice) {
      if (self.answers[i].matches(choice))
        the_answers.push({'obj':self.answers[i], 'choice': choice});
    });
    return the_answers;
  },
  prettifyAnswer: function(answer_struct) {
    var the_answers = $(this.getMatchingAnswers(answer_struct)).map( function(i, answer_and_choice) {
      return answer_and_choice['obj'].prettify(answer_and_choice['choice']);
    });
    var the_answers_raw = the_answers.get();
    return the_answers_raw.join(", ");
  },
  addToAnswerGraph: function(current_subject, answer, graph) {
    // go through the choices and for the appropriate ones
    // call the appropriate answer's addtoanswergraph
    var the_answers = this.getMatchingAnswers(answer);
    var self = this;
    $(the_answers).each( function(i, answer_and_choice) {
      answer_and_choice['obj'].addToAnswerGraph(current_subject, self, answer_and_choice['choice'], graph);
    });
  },
  removeFromAnswerGraph: function(current_subject, answer, graph) {
    // go through the choices and for the appropriate ones
    // call the appropriate answer's removeFromAnswerGraph
    var the_answers = this.getMatchingAnswers(answer);
    var self = this;
    $(the_answers).each( function(i, answer_and_choice) {
      answer_and_choice['obj'].RemoveFromAnswerGraph(current_subject, self, answer_and_choice['choice'], graph);
    });
  }
});

/* Question type that provides an area for the user to enter a custom answer.
 * NOTE: This could be generalized into a custom answer that then renders its
 * answers based on what custom type the answers are, thus removing the need
 * to create this (and other similar type of) question.
 */
SimpleQuestionJSObject = QuestionJSObject.extend({
  getCurrentAnswer: function(dom_element) {
    // the element where the answer is placed
    var answer_el = $(dom_element).find('.answer-text')[0];

    var single_value = this.answers[0].getValue(answer_el);

    return this.getAnswerFromAnswerValue(single_value);
  },
  getAnswerFromAnswerValue: function(answer_value) {
    return {'single': answer_value};
  },
  prettifyAnswer: function(answer_struct) {
    return answer_struct['single'].text;
  },
  getAnswerFromRaw: function(raw) {
    return this.getAnswerFromAnswerValue(this.answers[0].getValueFromRaw(raw));
  },
  get_single: function(answer) {
    return answer.single || {};
  },
  addToAnswerGraph: function(current_subject, answer, graph) {
    this.answers[0].addToAnswerGraph(current_subject, this, this.get_single(answer),graph);
  },
  removeFromAnswerGraph: function(current_subject, answer, graph) {
    this.answers[0].removeFromAnswerGraph(current_subject, this, this.get_single(answer),graph);
  }
});

/* Grid Question
 *
 */
GridSelectOneQuestionJSObject = QuestionJSObject.extend({
  set_attributes: function() {
    this.question = this.get_value(RDF.NS.survey('questionText'));
    this.answers = this.get_resource_object(RDF.NS.survey('GridAnswers')).elements;
    this.questions = this.get_resource_object(RDF.NS.survey('GridQuestions')).elements;
    this.default_answer_for_estimation = this.get_value(RDF.NS.survey('defaultAnswerForEstimation'));

    // answer property for all answers
    //this.answer_property = this.get_raw(RDF.NS.survey('answerProperty'));
  },
  getCurrentAnswer: function(dom_element) {
    var self = this;

    var result = [];
    var errors = [];

    // check each question
    $(dom_element).find('.sub-question').each( function(j, el) {
      // which is the checked one?
      $(el).find('.answer-selector').each( function(i, el) {
        if (el.checked) {
          result[j] = self.questions[j].answers[i].getValue(null); //TODO currently we can pass a null element since grids only have labels
        }
      });
      if (result[j] == null) {
        var error = new Error(MESSAGES.EMPTY_SELECT_ONE);
        error.name = 'AnswerRequired';
        error.el = el;
        errors.push(error);
      }
    });
    if (errors.length > 0) {
      throw errors;
    }

    return {'choices': result};
  },
  getMatchingAnswer: function(answer) {
    var choice = this.get_choice(answer);
    var the_answer = null;
    var self = this;
    $(this.answers).each( function(i, answer) {
      if (answer.matches(choice))
        the_answer = {'obj': answer, 'choice': choice};
    });
    return the_answer;
  },
  prettifyAnswer: function(answer) {
    result = "";
    // find the matching answer + choice (a tuple)
    for (var i=0; i<answer.choices.length; i++) {
      var matching_answer = this.getMatchingAnswer(answer.choices[i]);
      if (matching_answer) {
        if (result != "") {
          result += "<br />";
        }
        result += this.questions[i].question + ": " + matching_answer['obj'].prettify(matching_answer['choice']);
      }
    }
    return result;
  },
  get_choice: function(current_answer) {
    var choice = current_answer
    if (choice == null)
      return {};
    else
      return choice;
  },
  addToAnswerGraph: function(current_subject, answer, graph) {
    // find the matching answer
    for (var i=0; i<answer.choices.length; i++) {
      var matching_answer_and_choice = this.getMatchingAnswer(answer.choices[i]);
      if (matching_answer_and_choice)
        matching_answer_and_choice['obj'].addToAnswerGraph(current_subject, this.questions[i], matching_answer_and_choice['choice'], graph);
    }
  },
  removeFromAnswerGraph: function(current_subject, answer, graph) {
    // find the matching answer
    var matching_answer_and_choice = this.getMatchingAnswer(answer);
    if (matching_answer_and_choice)
      matching_answer_and_choice['obj'].removeFromAnswerGraph(current_subject, this, matching_answer_and_choice['choice'], graph);
  },
  getAnswerFromAnswerValue: function(answer_value) {
    return {'choice': {'label' : answer_value}};  //TODO: this is hardcoded for label answers only right now.  Need to rethink estimation
  },
  getAnswerFromRaw: function(raw) {
    return this.getAnswerFromAnswerValue(raw);
  }
});

//
// A Repeater
//
RepeaterJSObject = SurveyComponent.extend({
  set_attributes: function() {
    this.title = this.get_value(RDF.NS.dc('title'));
    this.description = this.get_value(RDF.NS.dc('description'));
    this.connector = this.get_uri(RDF.NS.survey('connector'));
    this.repeat_condition_question = this.get_resource_object(RDF.NS.survey('repeatConditionQuestion'));
    this.repeat_condition = this.get_value(RDF.NS.survey('repeatCondition'));
    this.line = this.get_resource_object(RDF.NS.survey('line'));

    this.parameters = this.get_all(RDF.NS.survey('parameter'));
  },
  isRenderable: function() {
    return (this.description != null)
  },
  requiresAnswer: function() {
    return false;
  },
  // the vars are, initially, just a setting of the count of the lines
  getInitVars: function(env, answer_graph) {
    vars = {'repeat_condition_question_asked': false, 'repeat_count' : 0};

    // if we have a title
    if (this.title != null) {
      // substitute the vars
      vars.title = substitute_vars(this.title, env.subject, answer_graph, env.vars_and_params());
    } else {
      vars.title = env.params.title;
    }

    return vars;
  },
  doNext: function(env, answer_graph) {
    var elements = []

    // first ask the special question
    if (!env.vars.repeat_condition_question_asked) {
      env.vars.repeat_condition_question_asked = true;
      env.vars.repeat_count = 0;
      elements.push({
        'survey_element' : this.repeat_condition_question
      });
      return {'elements':elements};

    }

    // if we have repeated enough times
    if (!eval_conditional(this.repeat_condition, env.subject, answer_graph, env.vars_and_params()))
      return null;

    env.vars.repeat_count += 1;

    // evaluate the parameter to the line
    var params = process_parameters(this.parameters, env.subject, answer_graph, env.vars_and_params());

    // if not, return the main line as the new object
    var elements = [];
    elements.push({
      'params': params,
      'survey_element': this.line,
      'connector' : this.connector
    });

    return {'elements': elements};
  },
  render: function(controller, dom_element, current_answer) {
    controller.description = this.description;
    controller.render({action: 'repeater_start', to: dom_element});
  }
});

//
// process parameters
//
function process_parameters(parameters_rdf, subject, answer_graph, vars) {
  // evaluate the parameter to the line
  var params = {};
  $(parameters_rdf).each( function(i, p) {
    // variable subst the value
    var value = substitute_vars(p.get_value(RDF.NS.survey('value')), subject, answer_graph, vars);

    // set the param
    params[p.get_value(RDF.NS.survey('name'))] = value;
  });
  return params;
}

/* Validation function for dates that returns no error message or an error message
 * if the format is incorrect.
 */
function dateValidation(input) {
  if(!DateValidation.isDate(input)) {
    return MESSAGES.INVALID_DATE;
  }

  return null;
}

/* Validation function for decimals that returns no error message or an error message
 * if the format is incorrect.  Pattern is adapted from the W3C xsd:decimal definition
 */
function validate_decimal(input) {
  if (input.match(/^(\+|-)?([0-9]+(\.[0-9]*)?$|^\.[0-9]+)$/)) {
    return null;
  } else {
    return MESSAGES.INVALID_DECIMAL;
  }
}

/* Validation function for integers that returns no error message or an error message
 * if the format is incorrect.
 */
function validate_integer(input) {
  if (input.match(/^(\+|-)?\d+$/)) {
    return null;
  } else {
    return MESSAGES.INVALID_INTEGER;
  }
}

// conditional evaluation
function eval_conditional(conditional_expression, current_subject, answer_graph, local_vars) {
  // substitute the variables
  var subst_expression = substitute_vars(conditional_expression, current_subject, answer_graph, local_vars);

  // evaluate the string
  // FIXME: this needs to be safer from rogue surveys
  try {
    return eval(subst_expression);
  } catch(err) {
    // alert(subst_expression);
    return null;
  }
}

function substitute_vars(expression, current_subject, answer_graph, local_vars) {
  // find all the variables in {.*} form, substitute them
  var matches = expression.match(/{[^{}]+}/g);

  var result = expression;

  // for each one, resolve it
  if (matches != null) {
    $(matches).each( function(i, var_expr) {
      var resolved_var = resolve_var_expr(var_expr, current_subject, answer_graph, local_vars);

      if (resolved_var != null) {
        // the var_expr has kept the braces
        result = result.replace(var_expr, resolved_var);
      }
    });
  }

  return result;
}

function resolve_var_expr(var_exp, current_subject, answer_graph, local_vars) {
  // {O[property_url]} for the object of a triple with the current subject, and the given property URL
  // {P[object_url]} for the property of a triple with the current subject, and the given object URL
  //
  // all of these are resolved to URL strings, *with* angle brackets, e.g. '<http://xmlns.com/foaf/0.1/name>'

  // strip the surrounding {}
  var braces_match = var_exp.match(/^{(.+)}$/);
  if (braces_match)
    var_exp = braces_match[1];

  // an object expression O[]
  var object_expr_match = var_exp.match(/^O\[(.+)\]$/);

  if (object_expr_match) {
    property_url = object_expr_match[1];
    var triple_objs = answer_graph.each(current_subject, new RDFSymbol(property_url), undefined);
    if(triple_objs) {
      objects = [];
      $(triple_objs).each( function(i, val) {
        if (val.uri) {
          // uri needs to be quoted for string comparison when evaluating conditional
          objects[i] = "\"" + val + "\"";
        } else {
          objects[i] = val.value;
        }
      });
      return "[" + objects.toString() + "]";
    } else {
      return null;
    }
  }

  // a property expression P[]
  var prop_expr_match = var_exp.match(/^P\[(.+)\]$/);

  if (prop_expr_match) {
    object_url = prop_expr_match[1];
    var prop = answer_graph.any(current_subject, undefined, new RDFSymbol(object_url));
    if (prop) {
      return prop.uri;
    } else {
      return null;
    }
  }

  // if we're here, we've matched nothing, but maybe a local var works
  if (local_vars) {
    return local_vars[var_exp];
  } else {
    return null;
  }
}

//static survey namespace variables
SurveyJSObject.NS = new Namespace("http://indivo.org/survey/vocab#");  //TODO: duplicate of RDF.NS.survey from rdfutils.js
SurveyJSObject.TYPE = SurveyJSObject.NS('Survey');

//maintain the object types in a "global/static" array that provides a mapping
//between the type and associated class.  Cleaner than a switch statement
OBJECT_TYPES = {};
OBJECT_TYPES['http://indivo.org/survey/vocab#Line'] = LineJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#SelectOneQuestion'] = SelectOneQuestionJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#GridSelectOneQuestion'] = GridSelectOneQuestionJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#SelectMultipleQuestion'] = SelectMultipleQuestionJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#SimpleQuestion'] = SimpleQuestionJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#Survey'] = SurveyJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#AnswerSequence'] = AnswerSequenceJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#QuestionSequence'] = QuestionSequenceJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#LabelAnswer'] = LabelAnswerJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#TextAnswer'] = TextAnswerJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#Branch'] = BranchJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#ConditionalBranch'] = ConditionalBranchJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#Condition'] = ConditionJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#Operand'] = OperandJSObject;
OBJECT_TYPES['http://indivo.org/survey/vocab#Operator'] = OperatorJSObject;

// parameters are simple
OBJECT_TYPES['http://indivo.org/survey/vocab#Parameter'] = RDFJSObject;

// a repeater repeats a line a given number of times
OBJECT_TYPES['http://indivo.org/survey/vocab#Repeater'] = RepeaterJSObject;

//mappings for validation of custom answer types
//TODO: remove xsd:X types once we move fuly to new conditionals
VALIDATION = {};
VALIDATION['xsd:date'] = dateValidation;
VALIDATION[RDF.Symbol.XSDdate.uri] = dateValidation;
VALIDATION['xsd:decimal'] = validate_decimal;
VALIDATION[RDF.Symbol.XSDdecimal.uri] = validate_decimal;
VALIDATION['xsd:integer'] = validate_integer;
VALIDATION[RDF.Symbol.XSDinteger.uri] = validate_integer;


