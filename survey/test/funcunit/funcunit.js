steal
 .plugins("funcunit")
 .resources("testMessages.js", "constants.js")
 .then("//survey/resources/messages.js")
 .then("simpleQuestion_tests")
 .then("selectOne_tests")
 .then("selectMultiple_tests")
 .then("gridSelectOne_tests")
 .then("dataFormat_tests")
 .then("behavior_tests")
 .then("conditionalBranch_tests");
