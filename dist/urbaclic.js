/*! 12-04-2016 */
var urbaClic, urbaClicUtils = {};

urbaClicUtils.urlify = function(text) {
    if ("string" != typeof text) return text;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
}, urbaClicUtils.closestF = {
    distance: function(map, latlngA, latlngB) {
        return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB));
    },
    closest: function(map, layer, latlng, vertices) {
        "function" != typeof layer.getLatLngs && (layer = L.polyline(layer));
        var i, n, distance, latlngs = layer.getLatLngs(), mindist = 1 / 0, result = null;
        if (vertices) {
            for (i = 0, n = latlngs.length; n > i; i++) {
                var ll = latlngs[i];
                distance = urbaClicUtils.closestF.distance(map, latlng, ll), mindist > distance && (mindist = distance, 
                result = ll, result.distance = distance);
            }
            return result;
        }
        for (layer instanceof L.Polygon && latlngs.push(latlngs[0]), i = 0, n = latlngs.length; n - 1 > i; i++) {
            var latlngA = latlngs[i], latlngB = latlngs[i + 1];
            distance = urbaClicUtils.closestF.distanceSegment(map, latlng, latlngA, latlngB), 
            mindist >= distance && (mindist = distance, result = urbaClicUtils.closestF.closestOnSegment(map, latlng, latlngA, latlngB), 
            result.distance = distance);
        }
        return result;
    },
    closestLayer: function(map, layers, latlng) {
        for (var mindist = 1 / 0, result = null, ll = null, distance = 1 / 0, i = 0, n = layers.length; n > i; i++) {
            var layer = layers[i];
            if ("function" == typeof layer.getLatLng) ll = layer.getLatLng(), distance = urbaClicUtils.closestF.distance(map, latlng, ll); else if ("function" == typeof layer.getLayers) for (var mindist2 = 1 / 0, layers2 = layer.getLayers(), i2 = 0, n2 = layers2.length; n2 > i2; i2++) {
                var layer2 = layers2[i2];
                ll = urbaClicUtils.closestF.closest(map, layer2, latlng), ll && ll.distance < mindist2 && (distance = ll.distance, 
                mindist2 = distance);
            } else ll = urbaClicUtils.closestF.closest(map, layer, latlng), ll && (distance = ll.distance);
            mindist > distance && (mindist = distance, result = {
                layer: layer,
                latlng: ll,
                distance: distance
            });
        }
        return result;
    },
    distanceSegment: function(map, latlng, latlngA, latlngB) {
        var p = map.latLngToLayerPoint(latlng), p1 = map.latLngToLayerPoint(latlngA), p2 = map.latLngToLayerPoint(latlngB);
        return L.LineUtil.pointToSegmentDistance(p, p1, p2);
    },
    closestOnSegment: function(map, latlng, latlngA, latlngB) {
        var maxzoom = map.getMaxZoom();
        maxzoom === 1 / 0 && (maxzoom = map.getZoom());
        var p = map.project(latlng, maxzoom), p1 = map.project(latlngA, maxzoom), p2 = map.project(latlngB, maxzoom), closest = L.LineUtil.closestPointOnSegment(p, p1, p2);
        return map.unproject(closest, maxzoom);
    }
}, urbaClicUtils.baseLayers = {
    "OSM-Fr": {
        title: "OSM-Fr",
        url: "//tilecache.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
    },
    Positron: {
        title: "Positron",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    },
    Outdoors_OSM: {
        title: "Outdoors (OSM)",
        url: "//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
    },
    OSM_Roads: {
        title: "OSM Roads",
        url: "//korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
    },
    Dark_Matter: {
        title: "Dark Matter",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    },
    OpenStreetMap: {
        title: "OpenStreetMap",
        url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    Toner: {
        title: "Toner",
        url: "//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
    },
    Landscape: {
        title: "Landscape",
        url: "//{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"
    },
    Transport: {
        title: "Transport",
        url: "//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
    },
    MapQuest_Open: {
        title: "MapQuest Open",
        url: "//otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png"
    },
    HOTOSM_style: {
        title: "HOTOSM style",
        url: "//tilecache.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    OpenCycleMap: {
        title: "OpenCycleMap",
        url: "//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
    },
    Watercolor: {
        title: "Watercolor",
        url: "//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png"
    },
    hikebikemap: {
        title: "hikebikemap",
        url: "//toolserver.org/tiles/hikebike/{z}/{x}/{y}.png"
    },
    "OSM-monochrome": {
        title: "OSM-monochrome",
        url: "//www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png"
    },
    Hydda: {
        title: "Hydda",
        url: "//{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    },
    OpenTopoMap: {
        title: "OpenTopoMap",
        url: "//{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    OpenRiverboatMap: {
        title: "OpenRiverboatMap",
        url: "//tilecache.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png"
    }
}, urbaClicUtils.getModelLayer = function(m, ign_key) {
    var title = m;
    if (bl = urbaClicUtils.baseLayers[m], bl) return {
        title: bl.title,
        layer: new L.tileLayer(bl.url)
    };
    if (0 === m.search(/^IGN:/)) {
        m = m.replace(/^IGN:/, "");
        for (var matrixIds3857 = new Array(22), i = 0; 22 > i; i++) matrixIds3857[i] = {
            identifier: "" + i,
            topLeftCorner: new L.LatLng(20037508, -20037508)
        };
        var options = {
            layer: m,
            style: "normal",
            tilematrixSet: "PM",
            matrixIds: matrixIds3857,
            format: "image/jpeg",
            attribution: "&copy; <a href='http://www.ign.fr'>IGN</a>"
        };
        "CADASTRALPARCELS.PARCELS" == m && (options.format = "image/png", options.style = "bdparcellaire");
        var layer = new L.TileLayer.WMTS("http://wxs.ign.fr/" + ign_key + "/geoportail/wmts", options);
        return {
            title: i18n.t(title),
            layer: layer
        };
    }
    return console.log("baselayer model not found: " + m), !1;
}, jQuery(document).ready(function($) {
    var Templates = {}, sortDesc = !1;
    Templates.autocomplete = [ "{{#each features}}", '<li><a href="#" data-feature="{{jsonencode .}}" data-type="{{properties.type}}" tabindex="1000">', "   {{marks properties.label ../query}}", "   &nbsp;<i>{{_ properties.type}}</i>", "</a></li>", "{{/each}}" ], 
    Templates.shareLink = [ '<div class="uData-shareLink">', '<div class="linkDiv"><a href="#">intégrez cet outil de recherche sur votre site&nbsp;<i class="fa fa-share-alt"></i></a></div>', '<div class="hidden">', "   <h4>Vous pouvez intégrer cet outil de recherche de données sur votre site</h4>", "   <p>Pour ceci collez le code suivant dans le code HTML de votre page</p>", "   <pre>", "&lt;script&gt;window.jQuery || document.write(\"&lt;script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js'&gt;&lt;\\/script&gt;\")&lt;/script&gt;", "", "&lt;!-- chargement feuille de style font-awesome --&gt;", '&lt;link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"&gt;', "", '&lt;script src="{{baseUrl}}udata.js"&gt;&lt;/script&gt;', '&lt;div class="uData-data"', '   data-q="{{q}}"', '   data-organizations="{{organizationList}}"', '   data-organization="{{organization}}"', '   data-page_size="{{page_size}}"', "&gt&lt;/div&gt", "   </pre>", "   <p>vous pouvez trouver plus d'info sur cet outil et son paramétrage à cette adresse: <a href='https://github.com/DepthFrance/udata-js' target='_blank'>https://github.com/DepthFrance/udata-js</a></p>", "</div>", "</div>" ], 
    Templates.parcelleData = [ '{{#ifCond adresse "!=" null}}', '<div class="position">', "<h4>position</h4>", "<table>", "<tr>", '<th class="position">coordonnées marqueur</th>', '<th class="adresse">Adresse estimée</th>', "</tr>", "<tr>", '<td class="position">{{latlng.lat}}, {{latlng.lng}}</td>', "{{#with adresse}}", '<td class="adresse">{{name}} {{postcode}} {{city}}</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond cadastre "!=" undefined}}', "{{#with cadastre}}", '<div class="cadastre">', "<h4>cadastre</h4>", "<table>", "<tr>", '<th class="parcelle_id">ID</th>', '<th class="code_dep">code_dep</th>', '<th class="code_com">code_com</th>', '<th class="nom_com">nom_com</th>', '<th class="code_arr">code_arr</th>', '<th class="com_abs">com_abs</th>', '<th class="feuille">feuille</th>', '<th class="section">section</th>', '<th class="numero">numero</th>', '<th class="surface_parcelle">surface parcelle</th>', "</tr>", "<tr>", '<td class="parcelle_id">{{../parcelle_id}}</td>', '<td class="code_dep">{{code_dep}}</td>', '<td class="code_com">{{code_com}}</td>', '<td class="nom_com">{{nom_com}}</td>', '<td class="code_arr">{{code_arr}}</td>', '<td class="com_abs">{{com_abs}}</td>', '<td class="feuille">{{feuille}}</td>', '<td class="section">{{section}}</td>', '<td class="numero">{{numero}}</td>', '<td class="surface_parcelle">{{round surface_parcelle}}m²</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond plu "!=" null}}', "{{#with plu}}", '<div class="plu">', "<h4>PLU</h4>", "<table>", "<tr>", '<th class="libelle">Libellé</th>', '<th class="txt">Texte</th>', "</tr>", "<tr>", '<td class="libelle">{{LIBELLE}}</td>', '<td class="txt">{{TXT}}</td>', "</tr>", "</table>", "</div>", "{{/with}}", "{{/ifCond}}", '{{#ifCond servitudes "!=" null}}', '<div class="servitudes">', "<h4>servitudes</h4>", '{{#ifCount servitudes "==" 0}}', "<ul>", "<li>aucune</li>", "</ul>", "{{else}}", "<p>La parcelle est concernée par {{count servitudes}} servitudes</p>", "<table>", "<tr>", '<th class="servitude_id">ID</th>', '<th class="name">nom</th>', '<th class="type">type</th>', '<th class="code_merimee">Code Mérimée</th>', "</tr>", "{{#each servitudes}}", "<tr>", '<td class="servitude_id"><div class="map" data-servitudeid="{{_id}}" data-properties="{{jsonencode .}}"></div></td>', '<td class="name">{{nom}}</td>', '<td class="type">{{type}}</td>', '<td class="code_merimee"><a target=_blank href="http://www.culture.gouv.fr/public/mistral/mersri_fr?ACTION=CHERCHER&FIELD_1=REF&VALUE_1={{codeMerimee}}">{{codeMerimee}}</a></td>', "</tr>", "{{/each}}", "</table>", "</ul>", "{{/ifCount}}", "</div>", "{{/ifCond}}" ];
    var baseUrl = jQuery('script[src$="/main.js"]')[0].src.replace("/main.js", "/../dist/"), _urbaclic = {};
    urbaClic = function(obj, options) {
        var container = obj, map = null, current_citycode = null, layers = {
            adresse: null,
            marqueur: null,
            parcelle: null,
            servitudes: null,
            zones_servitudes: null
        }, modelLayerKey = [], backgroundLayers = {}, urbaClic_options = {
            show_map: !0,
            show_data: !0,
            get_adresse: !0,
            get_servitude: !0,
            get_plu: !0,
            sharelink: !1,
            autocomplete_limit: 20,
            leaflet_map_options: {},
            ign_key: null,
            background_layers: [ "OpenStreetMap", "MapQuest_Open", "OpenTopoMap" ],
            ban_api: "https://api-adresse.data.gouv.fr/",
            urba_api: "https://urbanisme.api.gouv.fr/",
            cadastre_api: "https://apicarto.sgmap.fr/"
        }, ban_query = null, cadastre_query = null, zoom_timeout = null, focusOff_timeout = null, loadParcelle_timeout = null, autocomplete_pos = -1, autocomplete_open = !1, current_parcelle = {
            loadings: []
        };
        urbaClic_options = jQuery.extend(urbaClic_options, options);
        var BAN_API = urbaClic_options.ban_api, URBA_API = urbaClic_options.urba_api, Cadastre_API = urbaClic_options.cadastre_api, autocomplete_params = {};
        for (var i in urbaClic_options) if (0 == i.search("autocomplete_")) {
            var k = i.substring("autocomplete_".length);
            autocomplete_params[k] = urbaClic_options[i];
        }
        0 == jQuery("#urbaclic-search").length && jQuery('<div id="urbaclic-autocomplete"><input type="text" id="urbaclic-search" placeholder="adresse de la parcelle"></div>').appendTo(container);
        var input = jQuery("#urbaclic-search"), ban_options = autocomplete_params, default_template = function(feature) {
            var html = "";
            return jQuery.each(feature.properties, function(k, v) {
                html += "<tr><th>" + k + "</th><td>" + urbaClicUtils.urlify(v) + "</td></tr>";
            }), html = '<table class="table table-hover table-bordered">' + html + "</table>";
        }, circle_pointToLayer = function(feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 5
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, updateLayerController = function() {
            var loadedLayers = [];
            for (var i in layers) null != layers[i] && (loadedLayers[i] = layers[i]);
            map.layerController.removeFrom(map), map.layerController = L.control.layers(backgroundLayers, loadedLayers).addTo(map);
        };
        _urbaclic.addBackground = function(title, layer, show) {
            backgroundLayers[title] = layer, show === !0 && layer.addTo(map), updateLayerController();
        };
        var autocomplete_press = function(val) {
            var ul = jQuery("#urbaclic-autocomplete ul"), updateStyle = function() {
                return ul.find("a.focus").removeClass("focus"), 0 > autocomplete_pos ? autocomplete_hide() : (autocomplete_pos >= 0 && jQuery(ul.find("a")[autocomplete_pos]).addClass("focus"), 
                void ul.animate({
                    scrollTop: jQuery(ul.find("a")[autocomplete_pos]).offset().top + ul.scrollTop() - ul.offset().top
                }, {
                    duration: 400,
                    queue: !1
                }));
            };
            autocomplete_open ? ("Esc" == val && autocomplete_hide(), "Enter" == val && initMarker(jQuery(ul.find("a")[autocomplete_pos]).data(), !0), 
            "Down" == val && autocomplete_pos < ul.find("a").length - 1 && autocomplete_pos++, 
            "Up" == val && autocomplete_pos--, "Down" != val && "Up" != val || updateStyle()) : "Down" == val && (autocomplete_show(), 
            autocomplete_pos = 0, updateStyle());
        }, autocomplete_show = function() {
            autocomplete_open = !0, autocomplete_pos = -1, clearTimeout(focusOff_timeout), jQuery("#urbaclic-autocomplete ul").slideDown();
        }, autocomplete_hide = function() {
            autocomplete_open = !1, autocomplete_pos = -1, jQuery("#urbaclic-autocomplete ul a.focus").removeClass("focus"), 
            clearTimeout(focusOff_timeout), focusOff_timeout = setTimeout(function() {
                jQuery("#urbaclic-autocomplete ul").slideUp();
            }, 200);
        }, autocomplete = function(loadFirst) {
            autocomplete_pos = -1;
            var ul = jQuery("#urbaclic-autocomplete ul");
            ban_query && ban_query.abort(), input.prop("tabindex", 1e3);
            var t = input.val();
            if (0 == t.search(/\d{1,2}(\.\d+)?,\s*\d{1,2}(\.\d+)/)) {
                console.log("load from latlng: " + t);
                var latlng = t.split(",");
                ul.length || (ul = jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide(), 
                ul.css("top", input.outerHeight() - 2));
                var data = {
                    query: "",
                    type: "FeatureCollection",
                    features: [ {
                        geometry: {
                            type: "Point",
                            coordinates: [ latlng[1], latlng[0] ]
                        },
                        properties: {
                            label: t,
                            type: "latlng"
                        },
                        type: "Feature"
                    } ]
                };
                return ul.html(Templates.autocomplete(data)).slideDown(), loadFirst === !0 && initMarker(jQuery("#urbaclic-autocomplete ul a").first().data()), 
                !1;
            }
            if (t.length > 1) {
                ul.length || (ul = jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide(), 
                ul.css("top", input.outerHeight() - 2));
                var url = BAN_API + "search/", params = ban_options;
                params.q = t, ban_query = jQuery.getJSON(url, params, function(data) {
                    ban_query = null, data.features.length ? (ul.html(Templates.autocomplete(data)).slideDown(), 
                    loadFirst === !0 && initMarker(jQuery("#urbaclic-autocomplete ul a").first().data())) : ul.html("").fadeOut();
                });
            } else jQuery("#urbaclic-autocomplete ul").html("").slideUp();
        }, initMap = function() {
            if (L.TileLayer.WMTS = L.TileLayer.extend({
                defaultWmtsParams: {
                    service: "WMTS",
                    request: "GetTile",
                    version: "1.0.0",
                    layer: "",
                    style: "",
                    tilematrixSet: "",
                    format: "image/jpeg"
                },
                initialize: function(url, options) {
                    this._url = url;
                    var wmtsParams = L.extend({}, this.defaultWmtsParams), tileSize = options.tileSize || this.options.tileSize;
                    options.detectRetina && L.Browser.retina ? wmtsParams.width = wmtsParams.height = 2 * tileSize : wmtsParams.width = wmtsParams.height = tileSize;
                    for (var i in options) this.options.hasOwnProperty(i) || "matrixIds" == i || (wmtsParams[i] = options[i]);
                    this.wmtsParams = wmtsParams, this.matrixIds = options.matrixIds, L.setOptions(this, options);
                },
                onAdd: function(map) {
                    L.TileLayer.prototype.onAdd.call(this, map);
                },
                getTileUrl: function(tilePoint, zoom) {
                    var map = this._map;
                    return crs = map.options.crs, tileSize = this.options.tileSize, nwPoint = tilePoint.multiplyBy(tileSize), 
                    nwPoint.x += 1, nwPoint.y -= 1, sePoint = nwPoint.add(new L.Point(tileSize, tileSize)), 
                    nw = crs.project(map.unproject(nwPoint, zoom)), se = crs.project(map.unproject(sePoint, zoom)), 
                    tilewidth = se.x - nw.x, zoom = map.getZoom(), ident = this.matrixIds[zoom].identifier, 
                    X0 = this.matrixIds[zoom].topLeftCorner.lng, Y0 = this.matrixIds[zoom].topLeftCorner.lat, 
                    tilecol = Math.floor((nw.x - X0) / tilewidth), tilerow = -Math.floor((nw.y - Y0) / tilewidth), 
                    url = L.Util.template(this._url, {
                        s: this._getSubdomain(tilePoint)
                    }), url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
                },
                setParams: function(params, noRedraw) {
                    return L.extend(this.wmtsParams, params), noRedraw || this.redraw(), this;
                }
            }), L.tileLayer.wtms = function(url, options) {
                return new L.TileLayer.WMTS(url, options);
            }, urbaClic_options.show_map) {
                jQuery(".urbaclic-map").length || jQuery('<div class="urbaclic-map"></div>').appendTo(container), 
                map = L.map(jQuery(".urbaclic-map")[0], urbaClic_options.leaflet_map_options).setView([ 46.6795944656402, 2.197265625 ], 4), 
                map.attributionControl.setPrefix(""), map.layerController = L.control.layers([], []).addTo(map);
                var first = !0;
                for (var i in urbaClic_options.background_layers) {
                    var bl = urbaClic_options.background_layers[i];
                    if ("string" == typeof bl) {
                        var l = urbaClicUtils.getModelLayer(bl, urbaClic_options.ign_key);
                        if (modelLayerKey[l.title] = bl, l) _urbaclic.addBackground(l.title, l.layer, 0 == i), 
                        first && (l.layer.addTo(map), first = !1); else try {
                            bl = eval(bl);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }
                }
            }
        }, addBanLayer = function(data) {
            layers.adresse && map.removeLayer(layers.adresse);
            var layer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    var html = default_template(feature);
                    layer.bindPopup(html);
                },
                pointToLayer: circle_pointToLayer,
                style: {
                    className: "adresse"
                }
            }).addTo(map);
            return layers.adresse = layer, updateLayerController(), layer;
        }, addMarqueurLayer = function(data) {
            layers.marqueur && map.removeLayer(layers.marqueur);
            var layer = L.marker([ data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0] ], {
                style: {
                    className: "adresse"
                },
                draggable: !0
            }).addTo(map);
            return layers.marqueur = layer, updateLayerController(), layer;
        }, loadFromUrl = function() {
            var url = decodeURIComponent(document.URL).replace(/\+/g, " ");
            if (url = url.split("#"), url.length > 1) {
                var t = url[1];
                input.val(t), autocomplete(!0);
            }
        };
        window.addEventListener("popstate", loadFromUrl);
        var pushHistory = function() {
            history.pushState(null, null, initial_url + "#" + encodeURIComponent(input.val().replace(/\s/g, "+")));
        }, initMarker = function(params, push) {
            null == map && initMap(), input.val(params.feature.properties.label), push && pushHistory(), 
            current_citycode = params.feature.properties.citycode, layers.marqueur && map.removeLayer(layers.marqueur);
            ({
                latlng: L.latLng(params.feature.geometry.coordinates[1], params.feature.geometry.coordinates[0])
            });
            autocomplete_hide(), zoom_timeout && clearTimeout(zoom_timeout);
            var adresse_json = {
                type: "FeatureCollection",
                features: [ params.feature ]
            };
            layers.marqueur = addMarqueurLayer(adresse_json), map.fitBounds(L.featureGroup([ layers.marqueur ]).getBounds()), 
            loadParcelle(!1, push), layers.marqueur.on("dragend", function(e) {
                clearTimeout(loadParcelle_timeout), loadParcelle_timeout = setTimeout(loadParcelle(!0, !0), 10);
            });
        }, loadParcelle = function(fromDrag, push) {
            var feature = layers.marqueur.toGeoJSON(), marker_pos = {
                latlng: layers.marqueur.getLatLng()
            };
            if (null != layers.servitudes && (map.removeLayer(layers.servitudes), layers.servitudes = null), 
            null != layers.zones_servitudes && (map.removeLayer(layers.zones_servitudes), layers.zones_servitudes = null), 
            1 == fromDrag) {
                input.val(marker_pos.latlng.lat + ", " + marker_pos.latlng.lng);
                ({
                    input: input.val(),
                    marker_pos: marker_pos,
                    feature: feature
                });
                push && pushHistory();
            }
            cadastre_query && cadastre_query.abort();
            var url = Cadastre_API + "cadastre/geometrie", qparams = {
                geom: JSON.stringify(feature)
            };
            cadastre_query = jQuery.getJSON(url, qparams, function(data) {
                if (data.features.length) {
                    layers.parcelle && map.removeLayer(layers.parcelle);
                    var layer = L.geoJson(data, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template(feature);
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "parcelle"
                        }
                    }).addTo(map);
                    map.fitBounds(layer.getBounds()), layers.parcelle = layer;
                    var parcelle_obj = layers.parcelle.getLayers()[0];
                    showData(parcelle_obj.feature, parcelle_obj, marker_pos);
                } else console.info("aucune parcelle trouvée à " + marker_pos.latlng.toString()), 
                loadClosest(marker_pos.latlng, current_citycode);
            });
        }, loadClosest = function(latlng, citycode) {
            console.info("recherche plus proche parcelle sur commune " + citycode), cadastre_query && cadastre_query.abort();
            var delta = 5e-4, bb = [ [ latlng.lat - delta, latlng.lng - delta ], [ latlng.lat + delta, latlng.lng + delta ] ], limit_geojson = L.rectangle(bb).toGeoJSON(), url = Cadastre_API + "cadastre/geometrie", qparams = (L.rectangle(map.getBounds()), 
            {
                geom: JSON.stringify(limit_geojson)
            });
            cadastre_query = jQuery.getJSON(url, qparams, function(data) {
                if (data.features.length) {
                    var layer = L.geoJson(data, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template(feature);
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "parcelle"
                        }
                    }), closest = urbaClicUtils.closestF.closestLayer(map, layer.getLayers(), latlng), parcelle = closest.layer;
                    if (parcelle) {
                        layers.parcelle && map.removeLayer(layers.parcelle), layers.parcelle = parcelle, 
                        parcelle.addTo(map), map.fitBounds(layers.parcelle.getBounds());
                        var marker_pos = {
                            latlng: closest.latlng
                        };
                        showData(parcelle.feature, parcelle, marker_pos);
                    }
                } else console.info("aucune parcelle trouvée");
            });
        }, getServitudesDetail = function() {
            var current_background = null;
            if (jQuery.each(backgroundLayers, function(t, l) {
                map.hasLayer(l) && (current_background = t);
            }), null == current_background) {
                var l = urbaClicUtils.getModelLayer(urbaClic_options.background_layers[0], urbaClic_options.ign_key);
                current_background = l.title;
            }
            current_background = modelLayerKey[current_background], container.find(".map[data-servitudeid]").each(function() {
                null == layers.servitudes && (layers.servitudes = L.layerGroup(), layers.servitudes.addTo(map), 
                updateLayerController()), null == layers.zones_servitudes && (layers.zones_servitudes = L.layerGroup(), 
                updateLayerController());
                var map_container = jQuery(this), servitude_id = map_container.data("servitudeid"), properties = map_container.data("properties"), options = jQuery.extend(urbaClic_options.leaflet_map_options, {
                    zoomControl: !1
                }), url = URBA_API + "servitudes/" + servitude_id, servitudes_map = L.map(map_container[0], options).setView([ 46.6795944656402, 2.197265625 ], 4);
                servitudes_map.attributionControl.setPrefix("");
                var l = urbaClicUtils.getModelLayer(current_background, urbaClic_options.ign_key);
                l.layer.addTo(servitudes_map), jQuery.getJSON(url, function(data) {
                    var geojson_generateur = {
                        type: "FeatureCollection",
                        features: [ {
                            type: "Feature",
                            properties: {},
                            geometry: data.generateur
                        } ]
                    }, layer_generateur = L.geoJson(geojson_generateur, {
                        style: {
                            className: "generateur"
                        },
                        clickable: !1
                    });
                    layer_generateur.addTo(servitudes_map), servitudes_map.fitBounds(layer_generateur.getBounds());
                    var geojson_assiette = {
                        type: "FeatureCollection",
                        features: [ {
                            type: "Feature",
                            properties: {},
                            geometry: data.assiette
                        } ]
                    }, layer_assiette = L.geoJson(geojson_assiette, {
                        style: {
                            className: "assiette"
                        },
                        clickable: !1
                    });
                    layer_assiette.addTo(servitudes_map);
                    var layer_generateur2 = L.geoJson(geojson_generateur, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template({
                                properties: properties
                            });
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "generateur"
                        }
                    });
                    layers.servitudes.addLayer(layer_generateur2);
                    var layer_assiette2 = L.geoJson(geojson_assiette, {
                        onEachFeature: function(feature, layer) {
                            var html = default_template({
                                properties: properties
                            });
                            layer.bindPopup(html);
                        },
                        style: {
                            className: "assiette"
                        },
                        clickable: !1
                    });
                    layers.zones_servitudes.addLayer(layer_assiette2);
                });
            });
        }, showData = function(feature, layer, evt) {
            map.fitBounds(layer.getBounds());
            var parcelleId = [ feature.properties.code_dep, feature.properties.code_com ];
            "000" != feature.properties.code_arr ? parcelleId.push(feature.properties.code_arr) : parcelleId.push(feature.properties.com_abs), 
            parcelleId.push(feature.properties.section), parcelleId.push(feature.properties.numero), 
            parcelleId = parcelleId.join(""), urbaClic_options.show_data && (jQuery(".urbaclic-data").length || jQuery('<div class="urbaclic-data"></div>').appendTo(container)), 
            current_parcelle.data = {
                latlng: evt.latlng,
                parcelle_id: parcelleId,
                cadastre: feature.properties,
                adresse: null,
                servitudes: null
            };
            for (var i in current_parcelle.loadings) current_parcelle.loadings[i].abort();
            if (jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)), 
            urbaClic_options.get_adresse) {
                var url = BAN_API + "reverse/", params = {
                    lon: current_parcelle.data.latlng.lng,
                    lat: current_parcelle.data.latlng.lat
                };
                current_parcelle.loadings.ban_query = jQuery.getJSON(url, params, function(data) {
                    addBanLayer(data), void 0 != data.features[0] && (current_parcelle.data.adresse = data.features[0].properties, 
                    jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)));
                });
            }
            if (urbaClic_options.get_servitude) {
                var geom = layer.toGeoJSON();
                geom = geom.geometry;
                var url = URBA_API + "servitudes", params = {
                    geom: geom
                };
                $.ajax({
                    url: url,
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {
                        current_parcelle.data.servitudes = data, jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)), 
                        getServitudesDetail();
                    }
                });
            }
            if (urbaClic_options.get_plu) {
                var plu_data = {
                    LIBELLE: "Espace urbanisé",
                    TXT: "Description"
                };
                current_parcelle.data.plu = plu_data, jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data));
            }
        }, initial_url = decodeURIComponent(document.URL);
        return initial_url.split("#").length > 1 ? (initial_url = initial_url.split("#")[0], 
        loadFromUrl()) : autocomplete(), input.keydown(function(e) {
            var c = e.keyCode;
            return 13 === c ? autocomplete_press("Enter") : 27 === c ? autocomplete_press("Esc") : 38 === c ? autocomplete_press("Up") : 40 === c ? autocomplete_press("Down") : void setTimeout(autocomplete, 10);
        }).focusin(autocomplete_show).focusout(autocomplete_hide), jQuery("#urbaclic-autocomplete").on("click", ".urbaclic-autocomplete [data-feature]", function(e) {
            e.preventDefault(), initMarker(jQuery(this).data(), !0);
        }).on("mouseover", ".urbaclic-autocomplete", function(e) {
            clearTimeout(focusOff_timeout);
        }).on("focusin", ".urbaclic-autocomplete *", function(e) {
            autocomplete_show();
        }).on("focusout", ".urbaclic-autocomplete *", function(e) {
            autocomplete_hide();
        }), _urbaclic.map = map, _urbaclic.loadParcelle = loadParcelle, _urbaclic.initMarker = initMarker, 
        _urbaclic;
    };
    var checklibs = function() {
        var dependences = {
            Handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.2/handlebars.min.js",
            i18n: "https://cdnjs.cloudflare.com/ajax/libs/i18next/1.6.3/i18next-1.6.3.min.js",
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"
        }, css = {
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css",
            css: baseUrl + "urbaclic.css"
        }, ready = !0;
        for (var i in css) 0 == jQuery('link[href="' + css[i] + '"]').length && jQuery('<link type="text/css" href="' + css[i] + '" rel="stylesheet">').appendTo("head");
        for (var i in dependences) "undefined" == typeof window[i] && (0 == jQuery('script[src="' + dependences[i] + '"]').length && jQuery('<script src="' + dependences[i] + '"></script>').appendTo("body"), 
        ready = !1);
        ready ? start() : setTimeout(checklibs, 100);
    }, start = function() {
        var container = _urbaclic.container;
        _urbaclic.lang = lang = "fr", i18n.init({
            resGetPath: baseUrl + "locales/urbaclic." + lang + ".json",
            lng: lang,
            load: "unspecific",
            interpolationPrefix: "{",
            interpolationSuffix: "}",
            fallbackLng: !1,
            fallbackOnEmpty: !0,
            fallbackOnNull: !0,
            nsseparator: "::",
            keyseparator: "$$"
        }, function(err, t) {}), Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("ifCount", function(v1, operator, v2, options) {
            var v1 = v1.length;
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("mark", function(text, key) {
            var match = text.match(new RegExp(key.trim(), "gi")), uniqueMatch = [];
            jQuery.each(match, function(i, el) {
                -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
            });
            for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("marks", function(text, key) {
            var keys = key.trim().split(" ");
            for (var i in keys) {
                key = keys[i];
                var match = text.match(new RegExp(key, "gi")), uniqueMatch = [];
                null != match && jQuery.each(match, function(i, el) {
                    -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
                });
                for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            }
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("paginate", function(n, total, page_size) {
            var res = "", nPage = Math.ceil(total / page_size);
            if (1 == nPage) return "";
            for (var i = 1; nPage >= i; ++i) res += "<li" + (i == n ? ' class="active"' : "") + ">", 
            res += '<a href="#" data-page=' + i + ">" + i + "</a></li>";
            return '<nav><ul class="pagination">' + res + "</ul></nav>";
        }), Handlebars.registerHelper("taglist", function(tags) {
            var res = "";
            for (var i in tags) res += "<span class='label label-primary' >" + tags[i] + "</span> ";
            return res;
        }), Handlebars.registerHelper("trimString", function(passedString) {
            if (passedString.length > 150) {
                var theString = passedString.substring(0, 150) + "...";
                return new Handlebars.SafeString(theString);
            }
            return passedString;
        }), Handlebars.registerHelper("uppercase", function(passedString) {
            return passedString.toUpperCase();
        }), Handlebars.registerHelper("round", function(passedString) {
            return Math.round(parseFloat(passedString));
        }), Handlebars.registerHelper("count", function(passedString) {
            return passedString.length;
        }), Handlebars.registerHelper("truncate", function(str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                return new_str = str.substr(0, len), new_str = str.substr(0, new_str.lastIndexOf(" ")), 
                new_str = new_str.length > 0 ? new_str : str.substr(0, len), new Handlebars.SafeString(new_str + "...");
            }
            return str;
        }), Handlebars.registerHelper("default", function(value, defaultValue) {
            return null != value ? value : defaultValue;
        }), Handlebars.registerHelper("dt", function(value, options) {
            return moment(value).format(options.hash.format || "LLL");
        }), Handlebars.registerHelper("placeholder", function(url, type) {
            return url ? url : baseUrl + "img/placeholders/" + type + ".png";
        }), Handlebars.registerHelper("_", function(value, options) {
            if (!value || "string" != typeof value) return "";
            options.hash.defaultValue = "???";
            var res = i18n.t(value, options.hash);
            return "???" == res && (value = value.charAt(0).toLowerCase() + value.slice(1), 
            res = i18n.t(value, options.hash), res = res.charAt(0).toUpperCase() + res.slice(1)), 
            "???" == res && (value = value.charAt(0).toUpperCase() + value.slice(1), res = i18n.t(value, options.hash), 
            res = res.charAt(0).toLowerCase() + res.slice(1)), "???" == res ? (console.warn('i18n "' + value + '" NOT FOUND'), 
            value) : res;
        }), Handlebars.registerHelper("md", function(value) {
            return new Handlebars.SafeString(marked(value));
        }), Handlebars.registerHelper("mdshort", function(value, length) {
            if (value) {
                var EXCERPT_TOKEN = "<!--- --- -->", DEFAULT_LENGTH = 128;
                "undefined" == typeof length && (length = DEFAULT_LENGTH);
                var text, ellipsis;
                return value.indexOf("<!--- excerpt -->") && (value = value.split(EXCERPT_TOKEN, 1)[0]), 
                ellipsis = value.length >= length ? "..." : "", text = marked(value.substring(0, length) + ellipsis), 
                text = text.replace("<a ", "<span ").replace("</a>", "</span>"), new Handlebars.SafeString(text);
            }
        }), Handlebars.registerHelper("theme", function(value) {
            return new Handlebars.SafeString(baseUrl + "" + value);
        }), Handlebars.registerHelper("fulllogo", function(value) {
            return new Handlebars.SafeString(value);
        }), Handlebars.registerHelper("jsonencode", function(value) {
            return JSON.stringify(value, null, 4);
        });
        for (var tmpl in Templates) {
            var template_surcharge_id = "udata_template_" + tmpl;
            console.info("load template: #" + template_surcharge_id);
            var t = jQuery("#" + template_surcharge_id).first();
            t.length ? (Templates[tmpl] = t.html(), console.info("loaded.")) : console.info("not found, use default template."), 
            "string" != typeof Templates[tmpl] && (Templates[tmpl] = Templates[tmpl].join("\n")), 
            Templates[tmpl] = Handlebars.compile(Templates[tmpl]);
        }
        container = jQuery("#urbaclic"), container.length && (window.urbaClic_autoload = [], 
        container.each(function() {
            var obj = jQuery(this);
            window.urbaClic_autoload.push(urbaClic(obj, obj.data()));
        }));
    };
    checklibs();
});