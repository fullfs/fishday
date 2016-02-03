Project.Utils.bindIterate = function($el, $field, direction, cbIterate, cdFinish) {
	var iterate = function() {
		var quantity = Project.Utils.changeValue($field, direction);
		if (cbIterate) {
			cbIterate.call($field[0], quantity);
		}
	}

	$el.on('mousedown', function(e) {
		if (e.button !== 0 || $el.data('iterator')) {
			return;
		}
		var begin = setTimeout(function(argument) {
			iterate();
			$el.data('iterator', setInterval(iterate, 220));
			$el.data('beginFired', true);
		}, 350);

		$el.data('begin', begin);
	});
	$el.on('mouseup mouseleave', function(e) {
		if (e.button !== 0 || !$el.data('begin')) {
			return;
		}
		if (!$el.data('beginFired')) {
			iterate();
		}

		clearTimeout($el.data('begin'))
		clearInterval($el.data('iterator'));

		$el.data('begin', null);
		$el.data('beginFired', null);
		$el.data('iterator', null);

		if (cdFinish) {
			cdFinish.call($field[0]);
		}
	});
};


Project.Utils.changeValue = function($field, dir) {
	var value = parseInt($field.val(), 10);
	var type = $field.data('type');
	var step = $field.data('step') || 100;
	var min = $field.data('min') || 0;
	var quantity;

	if (isNaN(value)) {
		value = min;
	}

	if (dir == 'minus') {
		if (type === 'weight') {
			if (value > step && value > min) {
				value -= step;
			}
			// else {
			// 	value = 0;
			// }
		}

		if (type === 'item') {
			if (value > 1 && value > min) {
				value -= 1;
			}
			//  else {
			// 	value = 0;
			// }
		}
	}

	if (dir == 'plus') {
		if (type === 'weight') {
			if (value < 99999) {
				value += step;
			}
		}

		if (type === 'item') {
			if (value < 99999) {
				value += 1;
			}
		}
	}

	if (type === 'weight') {
		quantity = value / step
	} else if (type === 'item') {
		quantity = value;
	}

	$field.val(value);

	return quantity;
};

Project.Utils.updateDataQuantity = function($el, value) {
	// обновляем сам атрибут исключительно в визуально-отслеживательных целях.
	// на самом деле достаточно следующей строчки
	$el.attr('data-product-quantity', value);
	$el.data('product-quantity', value);
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
			offer.value.value = offer.value.step || 100;
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

	// $('body').trigger('addedToCart', offer);
};


Project.Utils.modifyMiniCart = function($el) {
	var productData = {
		productId: $el.data('product-id'),
		quantity: $el.data("product-quantity"),
		action: 'add'
	};

    $.ajax({
        type: 'post',
        url: '/include/ajax/add2basket.php',
        dataType: 'json',
        data: productData,
        success: function(data) {
            if (data && data['STATUS'] == 1) {
                switch(productData.action) {
                    case 'add' :
                        console.log('Add to cart success', data);
						$('body').trigger('modifyMiniCart', {
							price: data.PRODUCT_PRICE * 100
						});
                    break;
                }
            }
        }
    });
}



Project.Utils.numberToText = function(value) {
	return String( value.toFixed(2) ).replace('.', ',');
};


Project.Utils.formatMoney = function(number, c, d, t){
var n = number,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


// Предовращаем выделение близлежащих строк при накликивании
Project.Utils.preventClickSelection = function($el) {
	$el.on('selectstart mousedown', function() {
		return false;
	});
};
