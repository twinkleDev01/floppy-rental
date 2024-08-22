import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HomeService } from "../../services/home.service";

@Component({
    selector: "app-landing-page",
  
    template: ` <div class="dialog-container">
    <div class="dialog-header">
      <h2>{{ selectedCategory?.classificationName }}</h2>
      <i class="fa fa-times close-icon" (click)="closeDialog()"></i>
    </div>
<div class="row mt-4">
              <div class="col-sm-3" *ngFor="let subcategory of subcategoryData">
                  <div class="dialog-card text-center clickable">
                    <div class="dialog_card_img mx-auto">
                      <img src="images/ac-servicing.png" [alt]="subcategory.SubClassificationName"/>
                    </div>
                    <h3 class="card_h3">{{subcategory.SubClassificationName}}</h3>
                  </div>
                </div>
              </div>
                        </div>

  
      `,
    styleUrls: ["./home.component.scss"],
  })
  export class ServiceDialogComponent {
    selectedCategory:any;
    subcategoryData:any;

    constructor(public dialogRef: MatDialogRef<ServiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private homeService: HomeService,){
console.log(data,'dialog')
      this.selectedCategory = data.item
    }

    ngOnInit() {
      this.fetchSubCategories(this.data.item.mainId);
    }

    fetchSubCategories(categoryId: number) {
      this.homeService.getSubCategories(categoryId).subscribe(
        (response: any) => {
          this.subcategoryData = response.data; // Adjust according to your API's response structure
          console.log(this.subcategoryData)
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

  }