import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrl: './location-dialog.component.scss'
})
export class LocationDialogComponent {

  mapOptions: google.maps.MapOptions = {
    center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
    zoom: 12,
  };
  markerPosition: google.maps.LatLngLiteral | null = null;
  address: string = '';

  constructor(public dialogRef: MatDialogRef<LocationDialogComponent>) {}

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.address = `Lat: ${this.markerPosition.lat}, Lng: ${this.markerPosition.lng}`;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(this.address);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}