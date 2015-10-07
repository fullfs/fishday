<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

//pre($arResult);

?>

<div class="forming__box _goods">
	<div class="forming__header">Состав заказа</div>
	<table cellspacing="0" class="forming__list">
		<tr class="forming__list-head">
			<td class="forming__list-article"></td>
			<td class="forming__list-name">Наименование</td>
			<td class="forming__list-cost">Цена</td>
			<td class="forming__list-weight">Количество</td>
			<td class="forming__list-sum">Стоимость</td>
		</tr>
		<?foreach($arResult["GRID"]["ROWS"] as $arRow){
			$productId = $arRow["data"]["PRODUCT_ID"];
			// pre($arRow["data"]);?>
			<tr class="forming__list-row">
				<td class="forming__list-article"><?=$arResult["PRODUCTS"][$productId]["PROPERTIES"]["CML2_ARTICLE"]["VALUE"]?></td>
				<td class="forming__list-name"><?=$arRow["data"]["NAME"]?></td>
				<?
				/**
				 * в зависмости от типа товара делать нужные подстановки меры и количества/веса
				 */
				?>
				<td class="forming__list-cost"><?=getPrintFormatPrice($arRow["data"]["PRICE"], 'руб/кг.')?></td>
				<td class="forming__list-weight"><?=$arRow["data"]["QUANTITY"]?></td>
				<td class="forming__list-sum"><?=getPrintFormatPrice($arRow["data"]["SUM"])?></td>
			</tr>
		<?}?>
	</table>
	<div class="forming__goods-separator"></div>
	<table cellspacing="0" class="forming__goods-bottom">
		<tr class="forming__result">
			<td class="forming__goods-bottom-name">Товаров на:</td>
			<td class="forming__goods-bottom-sum"><?=getPrintFormatPrice($arResult["ORDER_TOTAL_PRICE_FORMATED"], 'руб.', 'forming__goods-bottom-num')?></td>
		</tr>
		<tr class="forming__sale">
			<td class="forming__goods-bottom-name">Скидка по карте (n%):</td>
			<td class="forming__goods-bottom-sum"><span class="forming__goods-bottom-num">44,90</span> руб.</td>
		</tr>
		<tr class="forming__final">
			<td class="forming__goods-bottom-name">Итого к оплате:</td>
			<td class="forming__goods-bottom-sum"><?=getPrintFormatPrice($arResult["ORDER_TOTAL_PRICE_FORMATED"], 'руб.', 'forming__goods-bottom-num')?></td>
		</tr>
	</table>
</div>
<div class="forming__box _addition">
	<div class="forming__header">Дополнительная информация</div>
	<div class="forming__field-wrapper">
		<p class="forming__field-text">Комментарии к заказу:</p>
		<textarea name="ORDER_DESCRIPTION" class="forming__area _big"><?=$arResult["USER_VALS"]["ORDER_DESCRIPTION"]?></textarea>
        <input type="hidden" name="" value="">
	</div>
</div>
