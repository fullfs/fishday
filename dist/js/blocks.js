// Главное меню сайта (вертикальное + горизонтальное)
Project.Blocks.Header = Project.extend({
	cartItems: [],

	totalPrice: 0,

	init: function() {
		var that = this;

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
		this.$('.header__order').click(function(e) {
			e.preventDefault();

			if (that.cartItems.length == 0) {
				/* debug */
				alert('товаров в корзине нет - не открываем модалку с корзиной')
				return;
			}

			var source = $('#cart-modal').html();
			var template = Handlebars.compile(source);
			var context = {list: that.cartItems};
			var html    = template(context);
			var $content = $('<div>').html(html);

			var dialog = new Project.Blocks.Dialog($content, {title: 'Корзина'});
			dialog.open();
			new Project.Blocks.Cart($content);

			$content.on('itemRemoved', function(e, index) {
				that.cartItems.splice(index, 1);
				that.calculateTotalPrice();
				if (!that.cartItems.length) {
					$content.dialog('close');
				}
			});
		});


		// Глобальная ловилка для добавления товара в корзину
		$('body').on('addedToCart', function(e, item) {
			that.cartItems.push(item);

			var priceSplit = String(item.price).split('.');
			item.price_base = priceSplit[0];
			item.price_after_dec = priceSplit[1] ? priceSplit[1] : '00';
			that.calculateTotalPrice();
		});

		return this;
	},

	calculateTotalPrice: function() {
		var that = this;
		var totalPricePrev = that.totalPrice;
		var itemPrice;

		that.totalPrice = 0;

		for (var i = that.cartItems.length - 1; i >= 0; i--) {
			// Вводим разные типы значений (weight/item)
			if (that.cartItems[i].value.type === 'weight') {
				itemPrice = that.cartItems[i].price * (that.cartItems[i].value.value / 1000);
			}
			if (that.cartItems[i].value.type === 'item') {
				itemPrice = that.cartItems[i].price * that.cartItems[i].value.value;
			}
			console.log(4423423, itemPrice)
			that.totalPrice += itemPrice;
		};

		if (that.totalPrice - 12 > totalPricePrev) {
			that.priceAnimation = setInterval(function() {
				if (totalPricePrev < that.totalPrice) {
					totalPricePrev += 12;
					that.setTotalPrice(totalPricePrev);
				} else {
					that.setTotalPrice(that.totalPrice);
					clearInterval(that.priceAnimation);
				}
			}, 8);
		} else {
			that.setTotalPrice(that.totalPrice);
		}
	},

	setTotalPrice: function(value) {
		this.$('.header__order-summ').text( value.toFixed(2).replace('.', ',') );
	}
});



// Абстрактный контроллер карточки товара
Project.Blocks.OfferItem = Project.extend({
	init: function() {
		var that = this;
		var $field = this.$('.offer-item__field');
		$field.numeric();


		this.$('.offer-item__less').click(function() {
			Project.Utils.changeValue($field, 'minus');
		});
		
		this.$('.offer-item__more').click(function() {
			Project.Utils.changeValue($field, 'plus');
		});

		this.$('.offer-item__cart').click(function() {
			var item = that.$el.data('item');
			var value = $field.val();
			var type = $field.data('type');
			Project.Utils.addToCart(item, {type: type, value: value});
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
			Project.Utils.changeValue($field, 'minus');
			that.countTotalPrice($field);
			that.$el.trigger('totalPriceRecounted');
		});
		
		this.$('.cart__item-more').click(function() {
			Project.Utils.changeValue($field, 'plus');
			// that.$('.cart__input-weight').val($field.val());
			that.countTotalPrice($field);
			that.$el.trigger('totalPriceRecounted');
		});


		this.$('.cart__item-delete').click(function() {
			that.$el.trigger('itemRemoved', that.$el.index());
		});

		this.countTotalPrice($field);

		return this;
	},

	countTotalPrice: function($field) {
		var priceForOne = Number( this.$('.cart__item-info .cart__item-main-price').text() );
		var secondaryDigits = Number( this.$('.cart__item-info .cart__item-tenth').text() );
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
		var $fieldName = $('.index-page__post-name');
		var $fieldMail = $('.index-page__post-mail');
		var $fieldText = $('.index-page__post-text');

		this.$('.index-page__post-form').on('submit', function(e) {
			// Если хоть одно поле не заполнено - не отправляем форму
			if (!$fieldName.val() || !$fieldMail.val() || !$fieldText.val()) {
				e.preventDefault();
			}
		});
	}
});

