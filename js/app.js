
window.onload = init;
/**
 * Les données
 */
// Objet geojson des départements de l'Ile-de-France
var departements = JSON.parse(departementsJson);
// Objet geojson des routes de l'Ile-de-France
var routes = JSON.parse(routesJson);


function init(){
    // instantiation de la carte openlayers
const map = new ol.Map({
    // l'id de l'element html de la carte
    target: "map",
    layers: [

            new ol.layer.Tile({
                    source: new ol.source.OSM()
            })
    ],

    view: new ol.View({
            center: ol.proj.fromLonLat([2.1281018, 48.6931363]),
            zoom: 8.0
    }),

    controls: ol.control.defaults().extend([
            // Plein-écran
            new ol.control.FullScreen(),
            // Echelle
            new ol.control.ScaleLine(),
            // position du curseur
            new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(2),
                    projection: "EPSG:4326",
                    className: "",
                    target: document.getElementById("mouse-position")
            })
    ])
});


// Ajout du geojson des departements de l'Ile de france
var features = new ol.format.GeoJSON().readFeatures(departements, {
    featureProjection: "EPSG:3857"
});
// Créer une source de données de type vecteur
var source = new ol.source.Vector({
    // la liste des features
    features: features
});

//Creation d'une fonction style pour les departements
var styleFunction = function (feature) {
    // on récupére la propriété 'code_dept'
    var featureId = feature.get("code_dept");

    // Correspondance code_dept -> couleur
    var colors = {
        77: [56, 107, 201, 0.2],
        78: [195, 235, 21, 0.2],
        94: [56, 186, 56, 0.2],
        92: [173, 244, 42, 0.2],
        75: [174, 46, 245, 0.2],
        95: [105, 45, 243, 0.2],
        91: [177, 147, 41, 0.2],
        93: [178, 248, 249, 0.2]
    };

    // vérifier si la couleur correspond au code du département 
    var couleurFeature = colors[featureId];

    if (!couleurFeature) {
        couleurFeature = "gray";
    }

    // retourner un objet de type Style
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "black",
            width: 1
        }),
        fill: new ol.style.Fill({
            color: couleurFeature
        })
    });
};

var departmentLayer = new ol.layer.Vector({
    id: "departement",
    source: source,
    style: styleFunction,
})


// couche invisible au démarrage
departmentLayer.setVisible(false);
// ajouter la couche à la carte
var depCheckBox = document.getElementById('departement');
depCheckBox.addEventListener('click', function (event) {
    departmentLayer.setVisible(event.target.checked);
});

/**
 * Affichage de notre couches des Routes de l'Ile de france
 */
var routeGJSON = new ol.format.GeoJSON().readFeatures(routes, {
    featureProjection: "EPSG:3857"
});
// Créer une source de données de type vecteur
var routesGJSONSource = new ol.source.Vector({
    // la liste des features
    features: routeGJSON
});
var routesGJSONLayer = new ol.layer.Vector({
    id: "routes",
    source: routesGJSONSource,
    style:new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "red",
            width: 2
        }),
        fill: new ol.style.Fill({
            color: "red"
        })
    })
});

// couche invisible au démarrage
routesGJSONLayer.setVisible(false);
// ajouter la couche à la carte
var routeCheckBox = document.getElementById('routes');
routeCheckBox.addEventListener('click', function (event) {
    routesGJSONLayer.setVisible(event.target.checked);
});


//chefs-lieux des départements d'Ile-de-france


class ChefLieu {
    constructor (name, code, population, lat, lon) {
        this.name = name;
        this.code = code;
        this.population = population;
        this.lat = lat;
        this.lon = lon;

    }

    // Methods of class ChefLieu
    getDetails () {
        return this.name + ', ' + this.code + '.</br> Population: ' + this.population + ' habitants.';
    }
    getPosition () {
        return {
            lon: this.lon,
            lat: this.lat
        }
    }
}

// Objets ChefLieu
var Paris = new ChefLieu('PARIS', 75, 22341, 48.86023255, 2.34467815);
var Nanterre = new ChefLieu('NANTERRE', 92, 90, 48.89071544, 2.20430308);
var Bobigny = new ChefLieu('BOBIGNY', 93, 485, 48.90961931, 2.43876012);
var Versailles = new ChefLieu('VERSAILLES', 78, 865, 48.80433562, 2.1337709);
var Evry = new ChefLieu('EVRY', 91, 524, 2.43006772, 48.62380565);
var Creteil = new ChefLieu('CRETEIL', 94, 894, 48.77748912, 2.45346123);
var Pontoise = new ChefLieu('PONTOISE', 95, 298, 49.050518, 2.10135742);
var Melun = new ChefLieu('MELUN', 77, 394, 48.53980472, 2.65870164);

// liste des villle avant transformation en Features 
var villes = [Paris,Nanterre,Bobigny,Versailles,Evry,Creteil,Pontoise, Melun];

    
// fonction pour inititialiser les Styles des points 
function createStyle (color){
    return new ol.style.Style({
        image: new ol.style.Icon({
            src: "/img/picture.png", 
            anchor: [0.5, 1], 
            color: color 
        })
    });
}

var StyleVert = createStyle('darkgreen'); 
var StyleBleu = createStyle('LightBlue'); 
var StyleRed = createStyle('red');

//transformer la liste des villes en Feature Openlayers
var listeVille = [];
for (var ville of villes){
    var lon = ville.lon;
    var lat = ville.lat;
    var coords = [lon, lat];
    var projectedCoords = ol.proj.fromLonLat(coords);

    var feature = new ol.Feature({
        geometry: new ol.geom.Point(projectedCoords),
        name: ville.name,
        details: ville.getDetails()
    });

    if (ville.name === 'PARIS'){
        feature.setStyle(StyleVert); 
    }
    else{
        feature.setStyle(StyleBleu);
    }
    listeVille.push(feature);
}

 // La source des données de type vecteur
var LayerVille = new ol.source.Vector({
    // la liste des features
    features: listeVille,
    name: "cities-source"
});
  
var ville= new ol.layer.Vector({
   
    source: LayerVille,
    id: "cities"
});

// couche invisible par défault au démarrage
ville.setVisible(false);

// lier l'événement à la checkbox     
var villeCheckBox = document.getElementById("chefs-lieux-idf");
villeCheckBox.addEventListener("click", function (event) {
    ville.setVisible(event.target.checked);
});

// création des pop up 
var popup = new ol.Overlay({
    // l'élément HTML de la popup
    element: document.getElementById('map-popup'),
    positioning: 'bottom-center',
    offset: [0, -45]
});
map.addOverlay(popup);

//fermer la pop up
function closePopup() {
    popup.setPosition(undefined);
}

// Ajouter l'événement clic à la carte
map.on("click", function (event) {
    
    closePopup();
    
    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        
        if (feature) {
            if (layer) {
                var layerId = layer.get("id");
                if (layerId === "cities") {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);
                    document.getElementById("map-popup-content").innerHTML = "<p> Ville : " + feature.get("details") + "</p>";
                }
            }
        }
    });
});




// Ajouter un raster arcgis
var tileSource = new ol.source.TileArcGISRest({
    url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
});

var tileArcgis = new ol.layer.Tile({
    source: tileSource,
    extent: [150000, 6120000, 400000, 6320000]
});

// couche invisible par défault au démarrage
tileArcgis.setVisible(false);

// ==============================================================================
/**
 * Ajouter l'évenement Arcgis à la checkbox
 */

var arcgisCheckBox = document.getElementById("base-map-esri");
arcgisCheckBox.addEventListener("click", function (event) {
    tileArcgis.setVisible(event.target.checked);
});

// ==============================================================================
/**
 * Ajouter les couches dans l'ordre
 */
map.addLayer(departmentLayer);
map.addLayer(routesGJSONLayer);
map.addLayer(tileArcgis);
map.addLayer(ville);
}
