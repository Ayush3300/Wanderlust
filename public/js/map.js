maptilersdk.config.apiKey = mapToken;
const listing = JSON.parse(
  document.getElementById("listing-data").textContent
);
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates,
  zoom: 12,
});
new maptilersdk.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be shared after booking</p>`)
  )
  .addTo(map);