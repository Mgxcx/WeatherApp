var mymap = L.map("worldmap", {
  center: [48.866667, 2.333333],
  zoom: 4,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mymap);

var lonlat = document.getElementsByClassName("lonlat");

for (i = 0; i < lonlat.length; i++) {
  var name = lonlat[i].dataset.name;
  var lon = lonlat[i].dataset.lon;
  var lat = lonlat[i].dataset.lat;

  var customIcon = L.icon({
    iconUrl: "images/leaf-green.png",
    shadowUrl: "images/leaf-shadow.png",

    iconSize: [38, 95],
    shadowSize: [50, 64],

    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],

    popupAnchor: [-3, -76],
  });

  L.marker([lat, lon], { icon: customIcon }).addTo(mymap).bindPopup(name);
}
