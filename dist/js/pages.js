// Страница с Корзиной
Project.Pages.Cart = Project.extend({
	init: function() {
		new Project.Blocks.Cart(this.$el);
	}
});




// Главное страница. Всякая лапшичка
Project.Pages.Main = Project.extend({
	init: function() {
		// Слайдер на главной
		this.$('.index-page__slider-inner')
			.removeClass('_raw')
			.slick({
				dots: true,
				autoplay: true,
				autoplaySpeed: this.$('.index-page__slider-inner').data('interval')
			});


		var $recList = this.$('.recommended__list-inner');

		$recList
			.removeClass('_raw')
			.slick({
				dots: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: $recList.data('interval')
			});
	}

});



// Доставка и оплата
Project.Pages.Delivery = Project.extend({
	init: function() {
		var that = this;
		that.$('.paying__condition-header').click(function() {
			that.$('.paying__condition-text-wrapper').slideToggle();
			that.$('.paying__condition-close').toggle();
		});

		that.$('.paying__condition-close-link').click(function() {
			that.$('.paying__condition-text-wrapper').slideUp();
			that.$('.paying__condition-close').hide();
		});

	}
});



// Страница товара
Project.Pages.OfferCard = Project.extend({
	galleryItemIndex: 0,

	init: function() {
		var that = this;

		var $target = this.$el;

		this.$('.goods__add-butt').click(function () {
	        var productData = {
	            productId: $target.data('product-id'),
	            quantity: $target.data("product-quantity"),
	            action: 'add'
	        };

	        Project.Utils.modifyMiniCart(productData);
	    });


		// Управление полем веса
		var $field = this.$('.goods__add-field');
		$field.numeric();

		this.$('.goods__add-less').click(function() {
			var quantity = Project.Utils.changeValue($field, 'minus');
			// обновляем сам атрибут исключительно в визуально-отслеживательных целях.
			// на самом деле достаточно следующей строчки
			$target.attr('data-product-quantity', quantity);
			$target.data('product-quantity', quantity);
		});
		
		this.$('.goods__add-more').click(function() {
			var quantity = Project.Utils.changeValue($field, 'plus');
			// обновляем сам атрибут исключительно в визуально-отслеживательных целях.
			// на самом деле достаточно следующей строчки
			$target.attr('data-product-quantity', quantity);
			$target.data('product-quantity', quantity);
		});

		// this.$('.goods__add-butt').click(function() {
		// 	var item = that.$el.data('item');
		// 	var value = $field.val();
		// 	var type = $field.data('type');
		// 	var step = $field.data('step');
		// 	Project.Utils.addToCart(item, {type: type, step: step, value: value});
		// });




		// Кпить в один клик
		this.$('.goods__buy-butt').click(function() {
			var dialog = new Project.Blocks.Dialog(
				$('<div>').append(that.$('.buy-asap-popup').children().clone()),
				{
					title: 'Купить в один клик',
					dialogClass: '',
					// width: 700
				}
			);
			dialog.open();
		});





		// Фоточки
		var items = this.$('.goods__gallery').data('items');

		this.$('.goods__big-pic:not(._no-photo)').click(function() {
			$.fancybox.open(items, {
				index: that.galleryItemIndex,
				padding: 0
			});

			return false;
		});


		this.$('.goods__small-pic-wrap').click(function() {
			$(this).addClass('_selected').siblings().removeClass('_selected');

			that.galleryItemIndex = $(this).index();
			that.$('.goods__big-pic').attr('src', items[that.galleryItemIndex].display);
		});





		// Блок Рекомендуем
		var $recList = this.$('.recommended__list-inner');

		$recList
			.removeClass('_raw')
			.slick({
				dots: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: $recList.data('interval')
			});
	}
});






// Доставка и оплата
Project.Pages.PromoList = Project.extend({
	init: function() {

		this.$('.promolist__link').click(function(e) {
			e.preventDefault();

			var $item = $(this).closest('.promolist__item');

			var dialog = new Project.Blocks.Dialog(
				$('<div>').append($item.find('.promolist__description').clone().show()),
				{
					title: $item.find('.promolist__name').text(),
					dialogClass: '_shady',
					width: 700
				}
			);
			dialog.open();
		});

	}
});



// Доставка и оплата
Project.Pages.Catalog = Project.extend({
	init: function() {

	}
});







// Доставка и оплата
Project.Pages.LegalInfo = Project.extend({
	init: function() {


		this.$('.legal__link').click(function(e) {
			e.preventDefault();

			var $item = $(this).closest('.legal__item');


			var $content = $('<div>').append($item.find('.legal__description').clone().show());
			var $contentDescr = $content.find('.legal__description');

			var dialog = new Project.Blocks.Dialog(
				$content,
				{
					title: $item.find('.legal__link-text').text(),
					dialogClass: '_shady _content-indented',
					width: 700
				}
			);
			dialog.open();


			var height = $(window).height() - 190;

			if ($contentDescr.height() > height) {
				$contentDescr.slimScroll({
					height: height,
					size: '10px',
					alwaysVisible: true
				});
			}
		});

	}
});








// Оформление заказа -> авторизация/регистрация
Project.Pages.CartProceedSignIn = Project.extend({
	init: function() {

		this.$('.signin__new-form')
			.validateServer()
			.validate({
				rules: {
					firstname: 'required',
					lastname: 'required',
					password: {
						required: true,
						minlength: 5
					},
					confirm_password: {
						required: true,
						minlength: 5,
						equalTo: '.signin__new-form input[name="password"]'
					},
					email: {
						required: true,
						email: true
					},
					captcha: {
						required: true
					},
				},
				messages: {
					confirm_password: {
						equalTo: 'Пароль должен совпадать с введённым выше'
					}
				}
			});

	}
});





// Регистрация
Project.Pages.SignUp = Project.extend({
	init: function() {

		this.$('.signup__form')
			.validateServer()
			.validate({
				rules: {
					firstname: 'required',
					lastname: 'required',
					password: {
						required: true,
						minlength: 5
					},
					confirm_password: {
						required: true,
						minlength: 5,
						equalTo: '.signup__form input[name="password"]'
					},
					email: {
						required: true,
						email: true
					},
					captcha: {
						required: true
					}
				},
				messages: {
					confirm_password: {
						equalTo: 'Пароль должен совпадать с введённым выше'
					}
				}
			});

	}
});






// Оформление заказа -> данные для доставки (последний шаг)
Project.Pages.CartProceedDeliveryInfo = Project.extend({
	init: function() {
		var that = this;


		this.$('.forming__form').validate({
			rules: {
				firstname: 'required',
				lastname: 'required',
				email: {
					required: true,
					email: true
				},
				phone: 'required'
			}
		});



		var $discountField = this.$('.forming__field._discount-card');

		$discountField.on('keydown', function() {
			clearTimeout(that.discountCheckTimeout);
			that.discountCheckTimeout = setTimeout(function() {
				// ТУТ ДОЛЖЕН БЫТЬ РЕАЛЬНЫЙ ЗАПРОС
				// $.ajax({
				// 	url: '/',
				// 	data: {
				// 		number: $discountField.val()
				// 	}
				// })
				// 	.done(function(response) {
				// 		if (response.valid) {
				// 			that.discountSuccess(response.discountAmmount);
				// 		} else {
				// 			that.discountFail();
				// 		}
				// 	});

				// Типа аякс
				setTimeout(function() {
					var response = {
						valid: true,
						discountAmmount: 5
					}

					if (response.valid) {
						that.discountSuccess(response.discountAmmount);
					} else {
						that.discountFail();
					}
				}, 150);
			}, 200);
		});
	},


	discountSuccess: function(ammount) {
		var subTotal = Number( this.$('.forming__result .forming__goods-bottom-num').text().replace(',', '.') );
		var discountText = this.$('.forming__sale .forming__goods-bottom-name').text();

		discountText = discountText.replace(/\(.+\)/, '(' + ammount + '%)');

		this.$('.forming__sale .forming__goods-bottom-name').text(discountText);


		var discountValue = subTotal / 100 * ammount;
		this.$('.forming__sale .forming__goods-bottom-num').text( Project.Utils.numberToText(discountValue) );
		this.$('.forming__sale').css('display', 'table-row');


		this.$('.forming__final .forming__goods-bottom-num').text( Project.Utils.numberToText(subTotal - discountValue) );
	},

	discountFail: function() {
		var subTotal = Number( this.$('.forming__result .forming__goods-bottom-num').text().replace(',', '.') );
		this.$('.forming__sale').hide();
		this.$('.forming__final .forming__goods-bottom-num').text( Project.Utils.numberToText(subTotal) );
	}
});






// Доставка и оплата
Project.Pages.PasswordRecovery = Project.extend({
	init: function() {

		this.$('.forgot__form')
			.validateServer()
			.validate({
				rules: {
					email: {
						required: true,
						email: true
					},
					captcha: 'required'
				}
			});
	}
});



// Настройки подписки
Project.Pages.Subscribe = Project.extend({
	init: function() {

		this.$('.subscribe__form')
			.validateServer()
			.validate({
				rules: {
					email: {
						required: true,
						email: true
					}
				}
			});
	}
});




// Настройки подписки
Project.Pages.MyOrders = Project.extend({
	init: function() {
		this.$('.orderlist__inner-link').click(function() {
			$(this).closest('tbody').find('.orderlist__hidden-stroke').toggle();
		});
	}
});



// Настройки подписки
Project.Pages.Profile = Project.extend({
	init: function() {
		var that = this;
		var $addrTable = this.$('.profile__address-table');
		
		var $rowTpl = this.$('.profile__address-stroke._body').first().clone();
		$rowTpl.find('input[type="text"]').val('');
		$rowTpl.find('input[type="radio"]').prop('checked', false);


		this.$('.profile__address-add').click(function(e) {
			e.preventDefault();
			var $newRow = $rowTpl.clone();
			$newRow.find('.profile__address-del').data('prevent', true);

			that.bindRemoveItem( $newRow.find('.profile__address-del') );
			// that.bindCheckItem( $newRow.find('.profile__check') );
			$addrTable.append( $newRow );

			that.refreshIndexes();
			that.toggleRemoveButton();
		});

		this.bindRemoveItem( this.$('.profile__address-del') );
		// this.bindCheckItem( $addrTable.find('.profile__check') );
		that.toggleRemoveButton();
	},


	refreshIndexes: function() {
		var that = this;
		this.$('.profile__address-stroke._body').each(function(index, item) {
			$(this).find('input').each(function() {
				$(this).prop('name', $(this).prop('name').replace(/\[[0-9]+\]/, '[' + index + ']') )
			});
		});
	},


	bindRemoveItem: function($item) {
		var that = this;
		$item.click(function(event) {
			if ($(this).data('prevent')) {
				event.preventDefault();
			}
			$(this).closest('tr').remove();
			that.refreshIndexes();
			that.toggleRemoveButton();
		});
	},

	// bindCheckItem: function($item) {
	// 	var that = this;
	// 	$addrTable = this.$('.profile__address-table');
	// 	$item.click(function() {
	// 		$addrTable.find('.profile__check').not(this).prop('checked', false);
	// 	});
	// },


	toggleRemoveButton: function() {
		if (this.$('.profile__address-stroke._body').length == 1) {
			this.$('.profile__address-del').hide();
		} else {
			this.$('.profile__address-del').show();
		}
	}
});




// О компании
Project.Pages.About = Project.extend({
	init: function() {
		this.$('.about__pic-link').fancybox();
	}
});




// Новости
Project.Pages.News = Project.extend({
	init: function() {
		this.$('.news__pic-link').fancybox();
	}
});


// Рецепт
Project.Pages.Reciepe = Project.extend({
	init: function() {
		this.$('.reciepe__pic-link').fancybox();
	}
});

