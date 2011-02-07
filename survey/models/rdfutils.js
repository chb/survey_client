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
