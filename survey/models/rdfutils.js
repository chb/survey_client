/*
 * Utils for RDF processing in JavaScript
 */

RDF = {};

RDF.NS = {};

RDF.NS.rdf = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
RDF.NS.rdf.type = RDF.NS.rdf('type');
RDF.NS.xsd = new Namespace('http://www.w3.org/2001/XMLSchema#');
RDF.NS.dc = new Namespace('http://purl.org/dc/elements/1.1/');
RDF.NS.indivo = new Namespace('http://indivo.org/vocab#');
RDF.NS.survey = new Namespace('http://indivo.org/survey/vocab#');

RDF.Symbol = {};

// precalculated symbols  TODO: some of these are already defined in the updated Tabulator code, so switch to those when updated
RDF.Symbol.XSDboolean = new RDFSymbol('http://www.w3.org/2001/XMLSchema#boolean');
RDF.Symbol.XSDdecimal = new RDFSymbol('http://www.w3.org/2001/XMLSchema#decimal');
RDF.Symbol.XSDinteger = new RDFSymbol('http://www.w3.org/2001/XMLSchema#integer');
RDF.Symbol.XSDdate = new RDFSymbol('http://www.w3.org/2001/XMLSchema#date');
// custom survey ones TODO: better uri's for these
RDF.Symbol.predicate = new RDFSymbol('survey:predicate');
RDF.Symbol.object = new RDFSymbol('survey:object');


RDF.Literal = {};
// precalculated literals
RDF.Literal.TRUE = new RDFLiteral('true', '', RDF.Symbol.XSDboolean);
RDF.Literal.FALSE = new RDFLiteral('false', '', RDF.Symbol.XSDboolean);

RDF.getter = function(store) {
    return function(subject) {
	return function(property) {
	    return store.any(subject, property, undefined);
	};
    };
};

RDF.Object = function(store, uri) {
    this.store = store;
    this.uri = uri;
};

RDF.convertLiteralToJavaScript = function(literal) {
    if (literal.datatype && (literal.datatype.uri == RDF.NS.xsd('boolean').uri)) {
	return (literal.value == "true")
    }

    return literal;
};
