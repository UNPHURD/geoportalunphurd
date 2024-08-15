// Inicializar el mapa y establecer la vista inicial
var map = L.map('map').setView([18.4853673, -69.9487009], 13); // Coordenadas de República Dominicana

// Establecer el nivel de zoom máximo para una mayor escala de detalles
map.options.maxZoom = 20; // Puedes ajustar este valor según sea necesario

// Agregar una capa de mapa base (OpenStreetMap en este caso)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20, // Asegúrate de que la capa de mapa también tenga un nivel de zoom máximo alto
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Control de escala con opciones personalizadas
L.control.scale({
    metric: true, // Usa el sistema métrico
    imperial: false, // No mostrar unidades imperiales
    maxWidth: 100, // Ajusta el ancho máximo de la barra de escala en píxeles
}).addTo(map);

// Añadir Mapas Base
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
var googleStreets = L.tileLayer("https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}").addTo(map); // Mapa base inicial
var googleSat = L.tileLayer("http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}");

// Diccionario de Mapas Base
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Streets": googleStreets,
    "Satélite": googleSat
};

// Georreferenciación de la imagen de ortofoto
var relieve_punto1 = L.latLng(18.489438042, -69.950433144);
var relieve_punto2 = L.latLng(18.482486460, -69.947226282);
var georreferenciacion = L.latLngBounds(relieve_punto1, relieve_punto2);
var ruta_img_relieve = "images/Foto_unphu/Ortomosaico_UNPHU2018.png"; // Ajusta la ruta según la ubicación del archivo
var img_relieve = L.imageOverlay(ruta_img_relieve, georreferenciacion);

// Función para crear popups con el nombre y una imagen desde la carpeta Fotos_UNPHU
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NOMBRE) {
        // Crea la ruta de la imagen basada en el nombre del edificio
        var imagePath = "images/Foto_UNPHU/" + encodeURIComponent(feature.properties.NOMBRE) + ".jpg";

        // Verificar si la imagen existe
        var img = new Image();
        img.src = imagePath;

        img.onload = function() {
            // Crea el contenido del popup con el nombre y la imagen
            var popupContent = "<b>Edificio: " + feature.properties.NOMBRE + "</b><br>";
            popupContent += "<img src='" + imagePath + "' alt='Imagen del edificio' style='width:200px;height:auto;'><br>";

            // Asigna el popup al layer
            layer.bindPopup(popupContent);
        };

        img.onerror = function() {
            // Maneja el error si la imagen no se carga
            var popupContent = "<b>Edificio: " + feature.properties.NOMBRE + "</b><br>";
            popupContent += "<p>Imagen no disponible.</p>";

            // Asigna el popup al layer
            layer.bindPopup(popupContent);
        };
    }
}

// Estilo para la capa de edificios UNPHU
var edificios_UNPHU_style = {
    color: "#ff7800",
    weight: 2,
    opacity: 1
};

// Asegúrate de cargar los datos GeoJSON de calles_UNPHU y edificios_UNPHU antes de usarlos
// var calles_UNPHU = {}; // Definir o cargar el GeoJSON aquí
// var edificios_UNPHU = {}; // Definir o cargar el GeoJSON aquí

// Agregar GeoJSON de calles de la UNPHU
var calles_UNPHU = L.geoJSON(calles_UNPHU).addTo(map);  // Se añade al mapa

// Agregar GeoJSON de edificios de la UNPHU con estilo y popups
var edificios_UNPHU = L.geoJSON(edificios_UNPHU, {
    style: edificios_UNPHU_style,    // Asignar estilo
    onEachFeature: onEachFeature     // Asignar la función para los popups
}).addTo(map);

// Diccionario de Capas
var overlayMaps = {
    "Calles UNPHU": calles_UNPHU,
    "Ortomosaico UNPHU": img_relieve,
    "Edificios UNPHU": edificios_UNPHU
};

// Agregar control de capas
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Agregar un marcador
var marker = L.marker([18.4853673, -69.9487009]).addTo(map);
marker.bindPopup("<b>Distrito Nacional </b><br>Universidad Nacional Pedro Henríquez Ureña.").openPopup();

// Agregar control de escala
L.control.scale().addTo(map);

// Control para mostrar latitud y longitud
map.on('mousemove', function(e) {
    document.getElementById('coordinates').innerHTML = "Latitud: " + e.latlng.lat.toFixed(5) + ", Longitud: " + e.latlng.lng.toFixed(5);
});

// Agregar control de búsqueda
L.Control.geocoder().addTo(map);

// Agregar control de ubicación actual
L.control.locate({
    locateOptions: {
        enableHighAccuracy: true
    },
    strings: {
        title: "Mostrar mi ubicación",
        popup: "Estás aquí",
        outsideMapBoundsMsg: "Pareces estar fuera de los límites del mapa"
    }
}).addTo(map);

// Agregar mini mapa
var miniMap = new L.Control.MiniMap(
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    { toggleDisplay: true }
).addTo(map);

// Agregar créditos personalizados
var creditControl = L.control({position: 'bottomright'});
creditControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-control-credits');
    div.innerHTML = 'Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a> | Map imagery © <a href="https://developers.google.com/maps/documentation/urls/get-started" target="_blank">Google</a>';
    return div;
};
creditControl.addTo(map);
