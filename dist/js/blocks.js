// Главное меню сайта (вертикальное + горизонтальное)
Project.Blocks.Header = Project.extend({
	cartItems: [],

	totalPrice: null,

	init: function() {
		var that = this;


		// Записываем текущую общую цену товаров в корзине
		this.totalPrice = this.getTotalPrice();

		// Вход
		this.$('.header__signin-link').click(function() {
			var $loginDialog = $('<div>').append($('#login-popup').children().clone());

			new Project.Blocks.LoginDialog($loginDialog);
			var dialog = new Project.Blocks.Dialog(
				$loginDialog,
				{
					title: 'Вход',
				}
			);
			dialog.open();
		});


		// Перезвоните мне
		this.$('.header__recall').click(function() {
			var dialog = new Project.Blocks.Dialog(
				$('<div>').append($('#callback-popup').children().clone()),
				{
					title: 'Заказ звонка',
				}
			);
			dialog.open();
		});




		// Прикрепляем к окну менюшки при скролле вниз
		var $menuHead = this.$('.main-menu__head');
		var $headerMenuHolder = this.$('.main-menu__head');

		this.$menuHolder = this.$('.main-menu__holder');
		this.$headerMenuWrapper = this.$('.header__bottom-wrapper');
		
		this._menuOffset = $menuHead.height() + $menuHead.offset().top ;
		this._headerMenuOffset = $headerMenuHolder.height() + $headerMenuHolder.offset().top;

		$(window).on('scroll', function() {
			if ($(window).scrollTop() > that._menuOffset) {
				that.$menuHolder.addClass('_fixed');
				that.$headerMenuWrapper.addClass('_fixed');
			} else {
				that.$menuHolder.removeClass('_fixed');
				that.$headerMenuWrapper.removeClass('_fixed');
			}
		});



		// Мини корзина
		$('body').on('modifyMiniCart', function(e, item) {
			that.setTotalPriceAnimated(item.price);
		});

		return this;
	},

	setTotalPriceAnimated: function(newPrice) {
		var that = this;
		var iteratingPrice = that.totalPrice;
		var animationStep;
		var addedPrice;

		clearInterval(that.priceAnimation);

		if (newPrice === undefined || newPrice === null) {
			newPrice = that.totalPrice;
		}

		addedPrice = newPrice - that.totalPrice;

		animationStep = addedPrice / 30;

		if (newPrice - animationStep > that.totalPrice) {
			that.priceAnimation = setInterval(function() {
				if (newPrice > iteratingPrice) {
					iteratingPrice += animationStep;
					that.setTotalPrice(iteratingPrice);
				} else {
					that.setTotalPrice(newPrice);
					clearInterval(that.priceAnimation);
				}
			}, 8);
		} else {
			that.setTotalPrice(newPrice);
		}

		that.totalPrice = newPrice;
	},

	setTotalPrice: function(value) {
		this.$('.header__order-summ').text( Project.Utils.formatMoney(value / 100, 2, ',', ' ') );
	},

	getTotalPrice: function(value) {
		return Number(this.$('.header__order-summ').text().replace(',', '').replace('.', ''));
	}
});



// Абстрактный контроллер карточки товара
Project.Blocks.OfferItem = Project.extend({
	init: function() {
		var that = this;
		var $target = this.$el;

		var $field = this.$('.offer-item__field');
		$field.numeric();


		this.$('.offer-item__less').click(function() {
			var quantity = Project.Utils.changeValue($field, 'minus');
			// обновляем сам атрибут исключительно в визуально-отслеживательных целях.
			// на самом деле достаточно следующей строчки
			$target.attr('data-product-quantity', quantity);
			$target.data('product-quantity', quantity);
		});
		
		this.$('.offer-item__more').click(function() {
			var quantity = Project.Utils.changeValue($field, 'plus');
			// обновляем сам атрибут исключительно в визуально-отслеживательных целях.
			// на самом деле достаточно следующей строчки
			$target.attr('data-product-quantity', quantity);
			$target.data('product-quantity', quantity);
		});

		Project.Utils.preventClickSelection(this.$('.offer-item__less, .offer-item__more'));

		this.$('.offer-item__cart').click(function() {
	        var productData = {
	            productId: $target.data('product-id'),
	            quantity: $target.data('product-quantity'),
	            action: 'add'
	        };

	        Project.Utils.modifyMiniCart(productData);
		});
	}	
});


Project.Blocks.LoginDialog = Project.extend({
	init: function() {
		var that = this;
		that.$('form')
			.validate({
				rules: {
					email: {
						required: true,
						email: true
					},
					password: 'required'
				}
			});
	}

});




// Абстрактное модальное окно
Project.Blocks.Dialog = Project.extend({
	init: function() {
		var that = this;
		that.$el
			.dialog({
				modal: true,
				title: that.config.title || '',
				width: that.config.width || 'auto',
				dialogClass: that.config.dialogClass || '',
				draggable: false,
				resizable: false,
				autoOpen: false,
				maxWidth: 900
			})
			.on('dialogopen', function() {
				$('.ui-widget-overlay').click(function() {
					that.$el.dialog('close');
				});
			})
			.on('dialogclose', function() {
				$(this).dialog('destroy');
			});

		return that;
	},

	open: function() {
		this.$el.dialog('open');
	}
});





// Корзина
Project.Blocks.Cart = Project.extend({
	init: function() {
		var that = this;

		that.$('.cart__item').each(function() {
			var $el = $(this);
			$el.on('totalPriceRecounted', function() {
				that.countTotalPrice();
			});

			$el.on('itemRemoved', function(e, index) {
				$el.remove();
				that.countTotalPrice();
			});
			new Project.Blocks.CartItem($el);
		});

		that.countTotalPrice();

		return this;
	},

	countTotalPrice: function() {
		var totalPrice = 0;
		this.$('.cart__item').each(function() {
			totalPrice += $(this).data('widget').getTotalPrice();
		});

		totalPrice = totalPrice.toFixed(2).split('.')

		this.$('.cart__total .cart__item-main-price').text(totalPrice[0]);
		this.$('.cart__total .cart__item-tenth').text(totalPrice[1]);

		this.totalPrice = totalPrice;
	}
});



// Элемент (товар) корзины
Project.Blocks.CartItem = Project.extend({
	init: function() {
		var that = this;

		this.$el.data('widget', this)

		var $field = this.$('.cart__item-field');
		$field.numeric();

		$field.on('keyup', function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
			}

			that.countTotalPrice($field);
			that.$el.trigger('totalPriceRecounted');
		});


		this.$('.cart__item-less').click(function() {
			var count = Project.Utils.changeValue($field, 'minus');
			that.setCountToForm(count);
			that.countTotalPrice($field);
			that.$el.trigger('totalPriceRecounted');
		});
		
		this.$('.cart__item-more').click(function() {
			var count = Project.Utils.changeValue($field, 'plus');
			that.setCountToForm(count);
			// that.$('.cart__input-weight').val($field.val());
			that.countTotalPrice($field);
			that.$el.trigger('totalPriceRecounted');
		});

		Project.Utils.preventClickSelection(this.$('.cart__item-less, .cart__item-more'));


		// this.$('.cart__item-delete').click(function() {
		// 	that.$el.trigger('itemRemoved', that.$el.index());
		// });

		this.countTotalPrice($field);

		return this;
	},


	setCountToForm: function(quantity) {
		this.$('.cart__item-form').find('input[name*="QUANTITY_"][type="hidden"]').val(quantity);
		this.$el.attr('data-product-quantity', quantity);
		this.$el.data('product-quantity', quantity);

        var productData = {
            productId: this.$el.data('product-id'),
            quantity: this.$el.data('product-quantity'),
            action: 'add'
        };
        Project.Utils.modifyMiniCart(productData);
	},

	countTotalPrice: function($field) {
		var $price = this.$('.cart__item-info .cart__item-price').not('._old-price');
		var priceForOne = Number( $price.find('.cart__item-main-price').text() );
		var secondaryDigits = Number( $price.find('.cart__item-tenth').text() );
		var type = $field.data('type');

		for (var i = 0, l = String(secondaryDigits).length ; i < l; i++) {
			secondaryDigits = secondaryDigits * 0.1;
		}

		priceForOne += secondaryDigits;

		var value;
		if (type === 'weight') {
			value = Number($field.val()) * 0.001;
		} 
		if (type === 'item') {
			value = Number($field.val());
		}

		var totalPrice = priceForOne * value;

		this._totalPrice = totalPrice;

		totalPrice = totalPrice.toFixed(2).split('.');


		this.$('.cart__item-summ .cart__item-main-price').text(totalPrice[0]);
		this.$('.cart__item-summ .cart__item-tenth').text(totalPrice[1]);

	},

	getTotalPrice: function() {
		return this._totalPrice;
	}
});



Project.Blocks.Features = Project.extend({
	init: function() {
		// Всплывашки жёлтых блоков

		this.$('.features__item').each(function() {
			$(this)
				.on('mouseenter', function() {
					var $hint = $(this).find('.features__item-hint');
					
					$hint
						.show()
						.css({
							top: - $hint.height()
						});
				})
				.on('mouseleave', function() {
					$(this).find('.features__item-hint').hide();
				});
		});
	}
});



Project.Blocks.ToTopButton = Project.extend({
	init: function() {
		this.$('.tothetop__button').click(function(e) {
			e.preventDefault();
			$('html, body').stop().animate({scrollTop: 0}, '500', 'swing');
		})
	}
});


// Форма обратной связи (отзывы)
Project.Blocks.FeedbackForm = Project.extend({
	init: function() {
		var that = this;
		var $fieldName = this.$('.index-page__post-name');
		var $fieldMail = this.$('.index-page__post-mail');
		var $fieldText = this.$('.index-page__post-text');

		this.$('.index-page__post-form').on('submit', function(e) {
			// Если хоть одно поле не заполнено - не отправляем форму
			if (!$fieldName.val() || !$fieldMail.val() || !$fieldText.val()) {
				e.preventDefault();
			}

			if (!$fieldName.val()) {
				that.$('.index-page__post-error-text._name').show();
			} else {
				that.$('.index-page__post-error-text._name').hide();
			}

			if (!$fieldMail.val()) {
				that.$('.index-page__post-error-text._email').show();
			} else {
				that.$('.index-page__post-error-text._email').hide();
			}

			if (!$fieldText.val()) {
				that.$('.index-page__post-error-text._message').show();
			} else {
				that.$('.index-page__post-error-text._message').hide();
			}
		});
	}
});

