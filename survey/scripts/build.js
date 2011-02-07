//steal/js survey/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('survey/scripts/build.html',{to: 'survey'});
});
