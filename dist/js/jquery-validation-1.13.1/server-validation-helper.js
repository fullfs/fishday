// Помощник для обеспечения показа серверных ошибок в паре с клиентской валидацией
(function($) {

	$.fn.validateServer = function() {
		var $form = $(this);

		var $fieldsWithError = $form.find('.validation-error:not(span)');

		$fieldsWithError.focus(function() {
			$(this).parent().find('span.validation-error').remove();
		});

		return this;
	};

})(jQuery);