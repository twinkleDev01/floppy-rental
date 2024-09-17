import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Country, State } from 'country-state-city';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent implements AfterViewInit {
  // @ViewChild('googleMap', { static: false }) googleMapElement: any;
  @ViewChild('googleMap', { static: false })
  set googleMapElement(content: any) {
    if (content  && this.showAddLocationForm) {
      this.initMap(content);
    }
  }
  selectedAddressType = 'Home';
  countries: string[] = ['India', 'Kenya', 'USA', 'Canada'];
  country = 'India';
  area = '';
  building = '';
  apartment = '';
  address = '';
  lat: number = 0;
  lng: number = 0;
  selectedCountry:any;
  selectedCountryCode:any

  mapOptions: google.maps.MapOptions = {
    center: { lat: -1.286389, lng: 36.817223 }, // Default location
    zoom: 15,
  };
  map!: google.maps.Map;
  marker!: google.maps.Marker; // Use google.maps.Marker instead

  constructor(public dialogRef: MatDialogRef<LocationDialogComponent>) {}

  ngAfterViewInit(): void {
    // this.initMap();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  onCountryChange() {
    // Get selected country code
    const selectedCountry = Country.getAllCountries().find(c => c.name === this.selectedCountry);
    if (selectedCountry) {
      this.selectedCountryCode = selectedCountry.isoCode;
      console.log('Selected Country Code:', this.selectedCountryCode); // Check the value
    } else {
      this.selectedCountryCode = undefined;
    }
  }
  

  initMap(content:any): void {
    if (!content || !content.nativeElement) {
      console.error('Google Map element is not available.');
      return;
    }

    this.map = new google.maps.Map(content.nativeElement, this.mapOptions);

    // Initialize marker only if the map is available
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.mapOptions.center,
      title: 'Selected Location'
    });

    // Add click listener to map
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.onMapClick(event);
    });
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };

      // Check if marker exists before updating position
      if (this.marker) {
        this.marker.setPosition(newPosition);
        this.updateAddressFromCoordinates(newPosition.lat, newPosition.lng);
      } else {
        console.error('Marker is not initialized.');
      }
    }
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        const newLatLng = { lat: this.lat, lng: this.lng };
        
        // Set the map's center to the new location
        if (this.map) {
          this.map.setCenter(newLatLng);
        }

        // Update marker position if initialized
        if (this.marker) {
          this.marker.setPosition(newLatLng);
        }

        this.updateAddressFromCoordinates(this.lat, this.lng);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onConfirm(): void {
    const addressData = {
      addressType: this.selectedAddressType,
      country: this.country,
      area: this.area,
      building: this.building,
      apartment: this.apartment,
      address: this.address,
      countryCode: this.selectedCountryCode,
      state: this.selectedState,
      selectedStateCode: this.selectedStateCode,
      zipCode: this.zipCode
    };
    this.showAddLocationForm = false;
    this.dialogRef.close(addressData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateAddressFromCoordinates(lat: number, lng: number): void {
    this.address = `Latitude: ${lat}, Longitude: ${lng}`;
    this.getAddress(lat, lng);
  }

  getAddress(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };
    console.log(this.lat,this.lng)
  
    geocoder.geocode(
      { location: latlng },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results && results[0]) {
            this.address = results[0].formatted_address;
            console.log('Formatted address:', this.address);
  
            this.parseAddressComponents(results[0].address_components);
  
            // Use the place ID to get more details
            const placeId = results[0].place_id;
            if (placeId) {
              this.getPlaceDetails(placeId);
            }
          } else {
            console.error('No results found');
          }
        } else {
          console.error('Geocode was not successful: ' + status);
        }
      }
    );
  }
  
  getPlaceDetails(placeId: string): void {
    const service = new google.maps.places.PlacesService(this.map);
    
    service.getDetails(
      { placeId: placeId },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log('Place details:', place);
  
          // Update your fields with more precise information
          if (place.name) {
            this.building = place.name; // Get building name if available
          }
          
          if (place.address_components) {
            this.parseAddressComponents(place.address_components); // Parse again for additional details
          }
        } else {
          console.error('Failed to get place details: ' + status);
        }
      }
    );
  }
  
  selectedState:any;
  selectedStateCode:any;
  zipCode:any
  parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): void {
    components.forEach((component) => {
      const types = component.types;

      if (types.includes('sublocality') || types.includes('locality')) {
        this.area = component.long_name;
      } else if (types.includes('route')) {
        this.building = component.long_name;
      } else if (types.includes('street_number')) {
        this.apartment = component.long_name;
      } else if (types.includes('country')) {
        this.selectedCountry = component.long_name;
      // You might also need the country code to update the state dropdown
      this.selectedCountryCode = component.short_name;;
      } else if (types.includes('administrative_area_level_1')) {
        this.selectedState = component.long_name
         // Find the state code based on the state name
      const state = State.getStatesOfCountry(this.selectedCountryCode || '').find(s => s.name === this.selectedState);
      if (state) {
        this.selectedStateCode = state.isoCode;
        // this.loadCities(this.selectedStateCode); // Load cities when state is determined
      }
        // this.onStateChange(); // Trigger state change handling
      } else if (types.includes('postal_code')) {
        this.zipCode = component.long_name;
      }
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  showAddLocationForm = false;

  // Method to toggle the visibility
  addNewLocation() {
    this.showAddLocationForm = true;
  }


  loadCountries() {
    // Get all countries
    const allCountries = Country.getAllCountries();
    this.countries = allCountries.map(country => country.name);
  }
  
}
