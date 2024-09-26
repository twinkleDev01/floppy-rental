import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HomeService } from "../../services/home.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-landing-page",
  
    template: ` <div class="dialog-container">
    <div class="dialog-header">
      <h2>{{ selectedCategory?.classificationName }}</h2>
      <i class="fa fa-times close-icon" (click)="closeDialog()"></i>
    </div>
<div class="row mt-4 justify-content-center">
              <div class="col-sm-3" *ngFor="let subcategory of subcategoryData">
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
  export class ServiceDialogComponent implements OnInit{
    selectedCategory:any;
    subcategoryData:any;

    constructor(public dialogRef: MatDialogRef<ServiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private homeService: HomeService, private router:Router){
console.log(data,'dialog')
      this.selectedCategory = data.item
      console.log(data,'37')
    }

    ngOnInit() {
      this.fetchSubCategories(this.data.item.mainId);
    }

    fetchSubCategories(categoryId: number) {
      this.homeService.getSubCategories(categoryId).subscribe(
        (response: any) => {
          this.subcategoryData = response.data; 
          console.log(this.subcategoryData,'49')
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
      console.log('56', subcategory);
      // this.router.navigate(
      //   [
      //     `/services/category/${subcategory?.SubClassificationName?.toString()
      //       ?.trim()
      //       ?.replace(/\s+/g, '-')
      //       ?.toLowerCase()}/${subcategory.MainId}`,
      //   ]
      // );
      this.router.navigate([`/services/category/${subcategory?.SubClassificationName.replaceAll("/","&")}/${subcategory.MainId}`]);
      this.dialogRef.close();
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

  }