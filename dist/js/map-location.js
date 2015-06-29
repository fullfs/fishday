var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map-location', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [55.1229, 82.915], // Новосибирск
        zoom: 16
    });

    myMap.behaviors.disable('scrollZoom');


    var myPlacemark1 = new ymaps.Placemark([55.1229, 82.9151], {
        // Свойства.
        // Содержимое иконки, балуна и хинта.
        iconContent: '',
        // balloonContent: 'Балун',
        hintContent: 'Кубовая, 1'
    }, {
        // Опции.
        // Стандартная фиолетовая иконка.
        preset: 'twirl#violetIcon'
    });


    myMap.geoObjects
        .add(myPlacemark1);

}