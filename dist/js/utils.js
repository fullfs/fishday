Project.Utils.changeValue = function($field, dir) {
	var value = parseInt($field.val(), 10);
	var type = $field.data('type');

	if (isNaN(value)) {
		value = 0;
	}

	if (dir == 'minus') {
		if (type === 'weight') {
			if (value > 100) {
				value -= 100;
			} else {
				value = 0;
			}
		}

		if (type === 'item') {
			if (value > 1) {
				value -= 1;
			} else {
				value = 0;
			}
		}
	}

	if (dir == 'plus') {
		if (type === 'weight') {
			if (value < 99999) {
				value += 100;
			} 
		}

		if (type === 'item') {
			if (value < 99999) {
				value += 1;
			} 
		}
	}
	$field.val(value);
};

Project.Utils.addToCart = function(data, valueData) {
	if (!data) {
		/* debug */
		alert('Не пришли данные карточки товара (data-item="")');
		return;
	}

	if (!valueData.type) {
		/* debug */
		alert('Не пришёл тип данных поля (data-type="" у инпута)');
		return;
	}

	var offer = $.extend(true, {}, data);
	offer.price = Number(offer.price);
	offer.value = valueData;
	offer.value.value = Number(offer.value.value);

	if (offer.value.type === 'weight') {
		offer.value.sign = 'г';
		if (!offer.value.value) {
			offer.value.value = 100;
		}
	}

	if (offer.value.type === 'item') {
		offer.value.sign = 'шт.';
		if (!offer.value.value) {
			offer.value.value = 1;
		}
	}

	if (!offer.value.value) {
		/* debug */
		alert('Значение поля оказалось восем пустым. Это может быть, только если тип значения оказался отличным от weight/item');
		return;
	}

	$('body').trigger('addedToCart', offer);
};



Project.Utils.numberToText = function(value) {
	return String( value.toFixed(2) ).replace('.', ',');
};