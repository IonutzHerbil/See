let map;

window.initMap = function() {
    const mapElement = document.getElementById("map");

    if (!mapElement) {
        console.error("Map container not found!");
        return;
    }

    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(mapElement, {
        zoom: 14,
        center: { lat: 37.77, lng: -122.447 },
    });

    directionsRenderer.setMap(map);
    directionsRenderer.setDirections({ routes: [] });

    const originInput = document.getElementById("from");
    const destinationInput = document.getElementById("to");
    new google.maps.places.Autocomplete(originInput);
    new google.maps.places.Autocomplete(destinationInput);

    document.getElementById("calculate-route").addEventListener("click", () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    });
};

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const origin = document.getElementById("from").value;
    const destination = document.getElementById("to").value;
    const selectedMode = document.getElementById("mode").value;

    if (origin && destination) {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode[selectedMode],
        })
        .then((response) => {
            if (response.routes.length > 0) {
                directionsRenderer.setDirections(response);
                addMarkersOnRoute(response.routes[0]);
            } else {
                console.error("No routes found");
            }
        })
        .catch((e) => {
            console.error("Directions request failed: " + e.message);
        });
    } else {
        alert("Please enter both an origin and a destination.");
    }
}

function addMarkersOnRoute(route) {
    const service = new google.maps.places.PlacesService(map);

    route.legs.forEach(leg => {
        leg.steps.forEach(step => {
            const stepLocation = step.end_location;
            const request = {
                location: stepLocation,
                radius: 150,
                type: ['cafe', 'restaurant', 'store']
            };
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(place => {
                        new google.maps.Marker({
                            position: place.geometry.location,
                            map: map,
                            title: place.name
                        });
                    });
                } else {
                    console.error("Places service failed: " + status);
                }
            });
        });
    });
}
