/*
 * 
 */
AnswerController = $.Controller.extend('Survey.Controllers.Answer',
/* @Static */
{
},
/* @Prototype */
{
	init: function(el) {
	
		// attach special handlers to inputs of certain data types
		$.each($(el).find('.answer-input'), function(){
			var elDataType = $(this).attr("data-datatype") || "";
		
			if (elDataType === 'xsd:date' || elDataType === RDF.Symbol.XSDdate.uri ){
				$(this).closest('.answer-text').after('<span>' + MESSAGES.DATE_DISPLAY_FORMAT + '</span>');
				var current_year = new Date().getFullYear();
				$(this).datepicker({showOn: "button", buttonImage: CALENDAR_PNG, buttonImageOnly: true, duration: 'fast', changeMonth: true, changeYear:true, minDate: new Date(1900, 1,1), yearRange: '1900:' + current_year});
			}
		});
	
	 	
  	},
    
    // select radio buttons and check boxes when a user clicks on the answer line
    ".answer-text click": function(el, ev){
    	var prevInput = el.prev('input');
		if(prevInput.length > 0){
			if(prevInput.attr('type') === 'checkbox'){
				if (el.find('input').length > 0) {
					// there is a sub-input box in the answer text
					prevInput.attr('checked', 'checked');
				}
				else {
					prevInput.attr('checked', !prevInput.attr('checked'));
				}
			}
			else{
				prevInput.attr('checked', true);				
			}
		}
    }
});
