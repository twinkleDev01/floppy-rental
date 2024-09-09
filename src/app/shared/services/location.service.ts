import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locationsRef = {
    latitude: 0, longitude: 0
  }
  constructor() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      const {latitude, longitude} = position.coords;
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };
      this.locationsRef = {latitude, longitude}

      geocoder.geocode(
        { location: latlng },
        (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results && results[0]) {
              console.log(results[0])
            } else {
              console.error('No results found');
            }
          } else {
            console.error('Geocode was not successful: ' + status);
          }
        }
      );
    })
   }
}
