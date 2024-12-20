import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HomeService } from "../../services/home.service";
import { Router } from "@angular/router";

@Component({
    selector: "service-dialog",
  
    template: ` <div class="dialog-container">
    <div class="dialog-header">
      <h2>{{ selectedCategory?.classificationName }}</h2>
      <i class="fa fa-times close-icon" (click)="closeDialog()"></i>
    </div>
<div class="row mt-4 justify-content-center">
              <div class="col-sm-3"    [ngClass]="{
        'col-sm-3': subcategoryData.length >= 4, 
        'col-sm-4': subcategoryData.length === 3, 
        'col-sm-6': subcategoryData.length === 2, 
        'col-sm-12': subcategoryData.length === 1
     }" *ngFor="let subcategory of subcategoryData">
                  <div class="dialog-card text-center clickable" (click)="goCategory(subcategory)">
                    <div class="dialog_card_img mx-auto">
                      <img [src]="subcategory.Image ||'images/No_Image_Available.jpg'" [alt]="subcategory.SubClassificationName"/>
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

    constructor(public dialogRef: MatDialogRef<ServiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private homeService: HomeService, private router:Router){
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

    // goCategory(subcategory: any){
    //   console.log("56",subcategory)
    //   this.router.navigate([`/services/category/${subcategory?.GoogleName?.toString()?.trim()?.replace(/\s+/g, '-')?.toLowerCase()}`], {
    //     state: {
    //       serviceId: subcategory.MainId,
    //       subId: subcategory.SubId
    //     }
    //   });
    //   this.dialogRef.close();
    // }

    goCategory(subcategory: any) {
      console.log('72', subcategory.Categoryseourl);
      // this.router.navigate(
      //   [
      //     `/services/category/${subcategory?.SubClassificationName?.toString()
      //       ?.trim()
      //       ?.replace(/\s+/g, '-')
      //       ?.toLowerCase()}/${subcategory.MainId}`,
      //   ]
      // );
      localStorage.setItem('myState', JSON.stringify(true));

      this.router.navigate([`${subcategory?.Categoryseourl}`],
      {
        state: { myState: true,subcategory:subcategory?.SubId }  // You can pass any state if required
      }
    );
      this.dialogRef.close();
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

  }