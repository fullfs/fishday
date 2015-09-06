// Это типа document ready
$(function() {
	// Общие блоки для страниц

	new Project.Blocks.Header($('.main-menu, .header'));
	// Блок преимуществ
	new Project.Blocks.Features($('.features'));

	// Кнопка "Наверх"
	new Project.Blocks.ToTopButton($('.tothetop'));

	// Форма обратной связи (отзывы)
	new Project.Blocks.FeedbackForm($('.index-page__post'));

	
	// Контроллеры страниц. По конкроллеру на страницу.
	// Если переданный элемент найдется на странице, то контроллер инициализируется 
	// (автовызов метода .init), если нет, то ничего не происходит. 
	// Так что никакого вызова "левого" кода на страницах.
	new Project.Pages.Cart($('.cart'));
	new Project.Pages.Main($('.index-page'));
	new Project.Pages.Delivery($('.paying'));
	new Project.Pages.OfferCard($('.goods'));
	new Project.Pages.PromoList($('.promolist'));
	new Project.Pages.Catalog($('.catalog'));
	new Project.Pages.LegalInfo($('.legal'));
	new Project.Pages.CartProceedSignIn($('.signin'));
	new Project.Pages.CartProceedDeliveryInfo($('.forming'));
	new Project.Pages.PasswordRecovery($('.forgot'));
	new Project.Pages.SignUp($('.signup'));
	new Project.Pages.Subscribe($('.subscribe'));
	new Project.Pages.MyOrders($('.orderlist'));
	new Project.Pages.Profile($('.profile'));
	new Project.Pages.About($('.about'));
	new Project.Pages.News($('.news'));
	new Project.Pages.Reciepe($('.reciepe'));

	$('.content .offer-item').each(function() {
		var $item = $(this);
		new Project.Blocks.OfferItem($item);
	});
});