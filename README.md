# Indivo Survey Client

### About
* Implemented in JavaScript using:
 * [JavaScriptMVC (JMVC)](http://javascriptmvc.com/) 
     * Initial implementation written for JMVC version 1.5
     * Currently runs on JMVC version 3
  * RDF/XML parser from the [Tabulator](http://www.w3.org/2005/ajar/tab) project
  * [jQuery](http://jquery.com/) & [jQuery UI](http://jqueryui.com/)
* Consumes RDF/XML survey definitions as described [here](http://wiki.chip.org/indivo/index.php/Survey_RDF_Model)

### Download
1. <code>git clone git://github.com/chb/survey_client.git</code>
2. <code>cd survey_client</code>
3. <code>git submodule init</code>
4. <code>git submodule update</code>

### Sample Survey
View a sample survey by opening <code>survey_client/survey/exampleSurvey.html</code> in your favorite browser

### Loading Survey Definitions
The client's example data connector (contained in <code>survey_client/survey/index.html</code>) is configured to read from your browser's local storage to retrieve survey definitions.  This setup works well when testing the client in conjunction with the [Indivo Survey Builder](https://github.com/chb/survey_builder), which by default is configured to write to browser local storage.

The example data connector also contains commented out code for retrieving definitions using an Ajax request.

###Development v.s. Production Modes
By default, the client will run in development mode, allowing for console logging and easier debugging.  To compress the client for increased performance and a decreased download profile, do the following

1. from <code>survey_client/</code> run <code>./steal/js ./survey/scripts/build.js</code>
2. edit <code>survey_client/survey/index.html</code> and change the existing script tag to point to the new production bundle: 
 * old <code> src='../steal/steal.js?survey,development'></code>
 * new <code> src='../steal/steal.js?survey,production'></code>


###Running Tests
You can run the functional test suite by opening up <code>survey_client/survey/funcunit.html</code>

