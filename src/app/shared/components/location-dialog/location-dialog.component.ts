import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrl: './location-dialog.component.scss'
})
export class LocationDialogComponent {

  // mapOptions: google.maps.MapOptions = {
  //   center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  //   zoom: 12,
  // };
  // markerPosition: google.maps.LatLngLiteral | null = null;
  // Address Variables
  selectedAddressType = 'Home';
  countries: string[] = ['India', 'Kenya', 'USA', 'Canada'];
  country = 'India';
  area = '';
  building = '';
  apartment = '';
  address = '';
  lat: number =0; // Add lat property
  lng: number =0; // Add lng property

   // Map Variables
   markerPosition: google.maps.LatLngLiteral | undefined;
   mapOptions: google.maps.MapOptions = {
     center: { lat: -1.286389, lng: 36.817223 }, // Default location (example: Nairobi)
     zoom: 15
   };

  constructor(public dialogRef: MatDialogRef<LocationDialogComponent>) {}

  // onMapClick(event: google.maps.MapMouseEvent): void {
  //   if (event.latLng) {
  //     this.markerPosition = event.latLng.toJSON();
  //     this.address = `Lat: ${this.markerPosition.lat}, Lng: ${this.markerPosition.lng}`;
  //   }
  //   console.log("25")
  // }

   // Function to handle map clicks and set marker position
   onMapClick(event: google.maps.MapMouseEvent) {
    this.markerPosition = event.latLng?.toJSON();
    this.updateAddressFromCoordinates(this.markerPosition?.lat, this.markerPosition?.lng);
  }

  onConfirm(): void {
     // Gather all the form data and pass it back
     const addressData = {
      addressType: this.selectedAddressType,
      country: this.country,
      area: this.area,
      building: this.building,
      apartment: this.apartment,
      markerPosition: this.markerPosition,
      address: this.address
    };
    this.dialogRef.close(addressData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  // Use Current Location
  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.markerPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.updateAddressFromCoordinates(this.markerPosition.lat, this.markerPosition.lng);
      });
    }
  }

  // Update Address from Coordinates (Mock, can use a service to reverse geocode)
  updateAddressFromCoordinates(lat: number | undefined, lng: number | undefined) {
    if (lat && lng) {
      // Placeholder for reverse geocoding logic
      this.address = `Latitude: ${lat}, Longitude: ${lng}`;
    }
  }

  // getAddress(latitude: number, longitude: number) {
  //   const geocoder = new google.maps.Geocoder();
  //   const latlng = { lat: latitude, lng: longitude };

  //   geocoder.geocode({ location: latlng }, (results, status) => {
  //     if (status === "OK" && results[0]) {
  //       this.address = results[0].formatted_address;
  //       this.patchValue(
  //         "address.gPSLocation.formattedAddress",
  //         this.address
  //       );
  //       this.patchValue("address.locationDescription", this.address);
  //       console.log(this.address, "formattedAddress");
  //     } else {
  //       console.error("Geocode was not successful: " + status);
  //     }
  //   });
  // }
}