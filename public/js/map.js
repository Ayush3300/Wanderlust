maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 12,
});

// console.log(coordinates)
const marker = new maptilersdk.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
    new maptilersdk.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4> <p>Exact Location will be shared after booking</p>`) // You can pass listing title from EJS too
  )
    .addTo(map);