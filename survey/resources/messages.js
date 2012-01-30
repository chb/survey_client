var SURVEY_CLIENT = {};

SURVEY_CLIENT.TRANSLATIONS = {
	EN: {
		// Validation Messages
		EMPTY_ANSWER: "Please provide a non-empty answer",
		EMPTY_SELECT_ONE: "Please select an option",
		EMPTY_SELECT_MULTIPLE: "Please select at least one option",
		INVALID_DATE: "Please enter a valid date in the form of mm/dd/yyyy",
		INVALID_DECIMAL: "A valid decimal value, e.g. 23.5, is required",
		INVALID_INTEGER: "A valid integer value, e.g. 35, is required",
		
		// Data Connector Messages
		SAVE_STATE_SUCCESS: "Your progress was successfully saved.  Please come back at a later time to complete the survey and submit your answers.",
		SAVE_STATE_ERROR: "We're sorry, but we encountered an error while trying to save your answers.",
		SAVE_ANSWERS_SUCCESS: "Your answers were successfully saved.  Thank you for participating in the survey.",
		SAVE_ANSWERS_ERROR: "We're sorry, but we encountered an error while trying to submit your answers.",
		LOADING_SURVEY: "Loading Survey...",
		
		// Buttons
		BUTTONS: {
			ANSWERS_SUBMIT: "Submit Answers",
			ANSWERS_REVIEW: "Review Answers",
			ANSWERS_REVIEW_SENT: "Review the Answers You Sent",
			SURVEY_START: "Start Survey",
			SURVEY_RESTORE: "Continue Where I left Off",
			SURVEY_RESTART: "Clear My Answers and Start Over",
			SURVEY_REDO: "Redo This Survey",
			BACK_TO_SURVEY: "Back to Survey",
			EDIT_ANSWER: "edit answer",
			NEXT: "Next",
			PREVIOUS: "Previous",
			BACK: "Back",
			SAVE_AND_EXIT: "Save & Exit",
			EXIT: "Exit"
		},
		
		// Miscellaneous Messages
		TRANSITION_BASE: "OK, now we're going to ask you questions about",
		SURVEY_SUPPORT_INTRO: "Questions or comments? Contact",
		SURVEY_SUPPORT_MESSAGE: "Please try again or contact",
		SURVEY_SUPPORT_NAME: "Survey Support",
		SURVEY_COMPLETED: "You have submitted answers for this survey.",
		PROBAND_INTRO: "This survey contains questions that pertain to",
		PROBAND_PREFIX: "Survey for",
		SURVEY_ALREADY_STARTED: "You have already started this survey. Please choose from the following:",
		DE_IDENTIFIED_INTRO: "This survey collects <b><em>de-identified</em></b> data to protect your privacy.<br /> Whenever you are prompted for a free-form text entry, be careful not to include your name.",
		DE_IDENTIFIED: "This survey collects <b>de-identified data</b>.<br /> Don't enter your name in any of the text fields.",
		ANSWER_SUMMARY_MESSAGE: "Please review your answers and then submit them:",
		ANSWER_SUMMARY_HEADER: "Summary of your Answers",
		QUESTION_PREFIX: "Q. ",
		SUCCESS: "Success",
		ERROR: "Error",
		DATE_DISPLAY_FORMAT: "mm/dd/yyyy",
		DATE_FORMAT: "mm/dd/yy",
		
		
		// Dialog Messages
		DIALOG_YES: "Yes",
		DIALOG_NO: "No",
		ANSWER_CHANGE_WARNING: "Warning! Changing your answers to this question clears answers you have already provided to later questions. Are you sure you want to do this?",
		ANSWER_CHANGE_TITLE: "Change answer?",
		
		// Single Words
		QUESTION: "Question",
		QUESTIONS: "Questions",
		ABOUT: "about"
	},

	ES: {
		// Validation Messages
		EMPTY_ANSWER: "Por favor, responde todas las preguntas",
		EMPTY_SELECT_ONE: "Por favor, seleccione una opci&oacute;n",
		EMPTY_SELECT_MULTIPLE: "Por favor, seleccione al menos una opci&oacute;n",
		INVALID_DATE: "Por favor, inserte una fecha v&aacute;lida",
		INVALID_DECIMAL: "Se require un valor decimal, p.e. 23.5",
		INVALID_INTEGER: "Se require un valor entero, p.e. 35",
	
		// Data Connector Messages
		SAVE_STATE_SUCCESS: "Tu progreso ha sido guardado.  Regresa m&aacute;s adelante para terminar la encuesta y enviar tus preguntas.",
		SAVE_STATE_ERROR: "Lo sentimos, pero hemos encontrado un error al guardar tus respuestas.",
		SAVE_ANSWERS_SUCCESS: "Tus respuestas han sido guardadas correctamente. Gracias por participar en la encuesta.",
		SAVE_ANSWERS_ERROR: "Lo sentimos,  pero hemos encontrado un error al enviar tus respuestas.",
		LOADING_SURVEY: "Cargando encuesta...",
		
		// Buttons
		BUTTONS: {
			ANSWERS_SUBMIT: "Enviar respuestas",
			ANSWERS_REVIEW: "Revisar respuestas",
			ANSWERS_REVIEW_SENT: "Ver respuestas enviadas",
			SURVEY_START: "Comenzar encuesta",
			SURVEY_RESTORE: "Comenzar de nuevo",
			SURVEY_RESTART: "Borrar respuestas anteriores y empezar de nuevo",
			SURVEY_REDO: "Rehacer la encuesta",
			BACK_TO_SURVEY: "Regresar a la encuesta",
			EDIT_ANSWER: "edici&oacute;n respuesta",
			NEXT: "Siguiente",
			PREVIOUS: "Anterior",
			BACK: "Atr&aacute;s",
			SAVE_AND_EXIT: "Guardar y salir",
			EXIT: "Salir"
		},
	
		// Miscellaneous Messages
		TRANSITION_BASE: "OK, ahora te vamos a hacer preguntas sobre ti",
		SURVEY_SUPPORT_INTRO: "Cont&aacute;ctanos para cualquier comentario o pregunta",
		SURVEY_SUPPORT_MESSAGE: "Prueba de nuevo o cont&aacute;ctanos",
		SURVEY_SUPPORT_NAME: "Soporte t&eacute;cnico de la encuesta",
		SURVEY_COMPLETED: "Has enviado las respuestas de la encuesta.",
		PROBAND_INTRO: "Esta encuesta tiene preguntas sobre ti",
		PROBAND_PREFIX: "Encuesta para",
		SURVEY_ALREADY_STARTED: "Ya has comenzado la encuesta. Por favor, escoge una de las siguientes opciones:",
		DE_IDENTIFIED_INTRO: "Esta encuesta solo recoge datos de manera <b><em>an&oacute;nima</em></b> para proteger tu privacidad.<br />Cuando tengas la opci&oacute;n de escribir texto, ten cuidado de no poner tu nombre.",
		DE_IDENTIFIED: "Esta encuesta recoge tus datos de manera <b>an&oacute;nima</b>.<br /> No introduzcas tu nombre en ning&uacute;n campo.",
		ANSWER_SUMMARY_MESSAGE: "Por favor, revisa tus respuestas antes de enviarla:",
		ANSWER_SUMMARY_HEADER: "Resumen de tus respuestas",
		QUESTION_PREFIX: "P. ",
		SUCCESS: "&Eacute;xito",
		ERROR: "Error",
		DATE_DISPLAY_FORMAT: "dd/mm/yyyy",
		DATE_FORMAT: "dd/mm/yy",
		
		// Dialog Messages
		DIALOG_YES: "S&iacute;",
		DIALOG_NO: "No",
		ANSWER_CHANGE_WARNING: "&iexcl;Importante! Cambiar esta respuesta eliminar&aacute; las respuestas anteriores que has contestado. &iquest;Seguro quieres hacer esto?",
		ANSWER_CHANGE_TITLE: "&iquest;Cambiar esta respuesta?",
		
		// Single Words
		QUESTION: "Pregunta",
		QUESTIONS: "Preguntas",
		ABOUT: "aproximadamente"
	}
}