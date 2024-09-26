import {
    ElementRef,
    AfterViewInit,
    Directive,
    Host,
    Optional,
    Renderer2,
    Self,
    ViewContainerRef,
    Input,
    Output,
    EventEmitter,
  } from "@angular/core";
  import { MatPaginator } from "@angular/material/paginator";
  import { MatButton } from "@angular/material/button";
  
  export interface PageObject {
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex: number;
  }
  
  @Directive({
    selector: "[style-paginator]",
  })
  export class StylePaginatorDirective implements AfterViewInit {
    private _pageGapTxt = "...";
    private _rangeStart!: number;
    private _rangeEnd!: number;
    private _buttons:MatButton[] = [];
    private _curPageObj: PageObject = {
      length: 0,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0,
    };
  
    @Output() curPageObj = new EventEmitter<PageObject>();
    @Input()
    get pageSize(): number {
      return this._curPageObj.pageSize;
    }
    set pageSize(value: number) {
      if (value >= 1) {
        this._curPageObj.pageSize = value;
        this.initPageRange();
      } else {
        this._curPageObj.pageSize = 10;
        this.initPageRange();
      }
    }
    @Input()
    get length(): number {
      return this._curPageObj.length;
    }
    set length(value: number) {
      this._curPageObj.length = value;
      this._curPageObj.pageIndex = 0;
      this.initPageRange();
    }
    @Input()
    get showTotalPages(): number {
      return this._showTotalPages;
    }
    set showTotalPages(value: number) {
      this._showTotalPages = value % 2 == 0 ? value + 1 : value;
    }
    private _showTotalPages = 2;
  
    get inc(): number {
      return this._showTotalPages % 2 == 0
        ? this.showTotalPages / 2
        : (this.showTotalPages - 1) / 2;
    }
  
    get numOfPages(): number {
      return this.matPag.getNumberOfPages();
    }
  
    get lastPageIndex(): number {
      return this.matPag.getNumberOfPages() - 1;
    }
  
    @Input() get pageIndex(): number {
      return this._curPageObj.pageIndex;
    }
    set pageIndex(value: number) {
      this._curPageObj.pageIndex = value;
      this.initPageRange();
    }
  
    constructor(
      @Host() @Self() @Optional() private readonly matPag: MatPaginator,
      private vr: ViewContainerRef,
      private ren: Renderer2
    ) {
      console.log("directive is running");
  
      //to rerender buttons on items per page change and first, last, next and prior buttons
      this.matPag.page.subscribe((e: PageObject) => {
        console.log(e);
        if (
          this._curPageObj.pageSize != e.pageSize &&
          this._curPageObj.pageIndex != 0
        ) {
          e.pageIndex = 0;
          this._rangeStart = 0;
          this._rangeEnd = this._showTotalPages - 1;
        }
        this._curPageObj = e;
  
        this.initPageRange();
      });
    }
  
    private buildPageNumbers() {
      const actionContainer = this.vr.element.nativeElement.querySelector(
        "div.mat-mdc-paginator-range-actions"
      );
      const nextPageNode = this.vr.element.nativeElement.querySelector(
        "button.mat-mdc-paginator-navigation-next"
      );
      const prevButtonCount = this._buttons.length;
  
      // remove buttons before creating new ones
      if (this._buttons.length > 0) {
        this._buttons.forEach((button) => {
          this.ren.removeChild(actionContainer, button);
        });
        //Empty state array
        this._buttons.length = 0;
      }
  
      //initialize next page and last page buttons
      if (this._buttons.length == 0) {
        if (
          this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2]
        ) {
          const nodeArray =
            this.vr.element.nativeElement.childNodes[0].childNodes[0]
              .childNodes[2].childNodes;
          setTimeout(() => {
            for (let i = 0; i < nodeArray.length; i++) {
              const linkBtn: MatButton = this.ren.createElement("button");
              if (nodeArray[i].nodeName === "BUTTON") {
                if (
                  nodeArray[i].innerHTML.length > 100 &&
                  nodeArray[i].disabled
                ) {
                  this.ren.addClass(nodeArray[i], "mat-mdc-mini-fab");
                  this.ren.setStyle(nodeArray[i], "background-color", "#fff");
                  this.ren.setStyle(
                    nodeArray[i],
                    "transform",
                    "translate3d(0, 0, 0)"
                  );
                  this.ren.setStyle(
                    nodeArray[i],
                    "box-shadow",
                    "grey 2px 5px 9px"
                  );
                  this.ren.setStyle(nodeArray[i], "border", "1px solid #008CAC");
                  this.ren.setStyle(
                    nodeArray[i],
                    "color",
                    "rgba(0, 0, 0, 0.87);"
                  );
                  this.ren.setStyle(nodeArray[i], "margin", "5%");
                } else if (
                  nodeArray[i].innerHTML.length > 100 &&
                  !nodeArray[i].disabled
                ) {
                  this.ren.addClass(linkBtn, "mat-mdc-mini-fab"),
                    this.ren.setStyle(nodeArray[i], "background-color", "#fff");
                  this.ren.setStyle(
                    nodeArray[i],
                    "transform",
                    "translate3d(0, 0, 0)"
                  );
                  this.ren.setStyle(
                    nodeArray[i],
                    "box-shadow",
                    "grey 2px 5px 9px"
                  );
                  this.ren.setStyle(nodeArray[i], "border", "1px solid #008CAC");
                  this.ren.setStyle(
                    nodeArray[i],
                    "color",
                    "rgba(0, 0, 0, 0.87);"
                  );
                  // this.ren.setStyle(nodeArray[i], "margin", "5%");
                  // this.ren.setStyle(nodeArray[i], "height", "39px");
                } else if (nodeArray[i].disabled) {
                  this.ren.setStyle(nodeArray[i], "color", "white");
                  this.ren.setStyle(
                    nodeArray[i],
                    "background-image",
                    "linear-gradient(#008CAC, #008CAC)"
                  );
                }
              }
            }
          });
        }
      }
  
      for (let i = 0; i < this.numOfPages; i++) {
        if (i >= this._rangeStart && i <= this._rangeEnd) {
          this.ren.insertBefore(
            actionContainer,
            this.createButton(i, this.matPag.pageIndex),
            nextPageNode
          );
        }
  
        // if (i == this._rangeEnd) {
        //   this.ren.insertBefore(
        //     actionContainer,
        //     this.createButton(this._pageGapTxt, this._rangeEnd),
        //     nextPageNode
        //   );
        // }
      }
      this.curPageObj.emit(this._curPageObj);
    }
  
    private createButton(i: any, pageIndex: number): any {
      const linkBtn: MatButton = this.ren.createElement("button");
      this.ren.addClass(linkBtn, "mat-mdc-mini-fab");
      this.ren.setStyle(linkBtn, "margin", "2%");
      this.ren.setStyle(linkBtn, "background-color", "white");
  
      const pagingTxt = isNaN(i) ? this._pageGapTxt : +(i + 1);
      const text = this.ren.createText(pagingTxt + "");
  
      this.ren.addClass(linkBtn, "mat-mdc-custom-page");
      switch (i) {
        case pageIndex:
          this.ren.setAttribute(linkBtn, "disabled", "disabled");
          break;
        case this._pageGapTxt:
          let newIndex = this._curPageObj.pageIndex + this._showTotalPages;
  
          if (newIndex >= this.numOfPages) newIndex = this.lastPageIndex;
  
          if (pageIndex != this.lastPageIndex) {
            this.ren.listen(linkBtn, "click", () => {
              console.log("working: ", pageIndex);
              this.switchPage(newIndex);
            });
          }
  
          if (pageIndex == this.lastPageIndex) {
            this.ren.setAttribute(linkBtn, "disabled", "disabled");
          }
          break;
        default:
          this.ren.listen(linkBtn, "click", () => {
            this.switchPage(i);
          });
          break;
      }
  
      this.ren.appendChild(linkBtn, text);
      //Add button to private array for state
      this._buttons.push(linkBtn);
      return linkBtn;
    }
    //calculates the button range based on class input parameters and based on current page index value. Used to render new buttons after event.
    private initPageRange(): void {
      const middleIndex = (this._rangeStart + this._rangeEnd) / 2;
  
      this._rangeStart = this.calcRangeStart(middleIndex);
      this._rangeEnd = this.calcRangeEnd(middleIndex);
  
      this.buildPageNumbers();
    }
  
    //Helper function To calculate start of button range
    private calcRangeStart(middleIndex: number): number {
      switch (true) {
        case this._curPageObj.pageIndex == 0 && this._rangeStart != 0:
          return 0;
        case this._curPageObj.pageIndex > this._rangeEnd:
          return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
            ? this.lastPageIndex - this.inc * 2
            : this._curPageObj.pageIndex - this.inc;
        case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
          this._curPageObj.pageIndex > middleIndex &&
          this._rangeEnd < this.lastPageIndex:
          return this._rangeStart + 1;
        case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
          this._curPageObj.pageIndex < middleIndex &&
          this._rangeStart > 0:
          return this._rangeStart - 1;
        default:
          return this._rangeStart;
      }
    }
    //Helpter function to calculate end of button range
    private calcRangeEnd(middleIndex: number): number {
      switch (true) {
        case this._curPageObj.pageIndex == 0 &&
          this._rangeEnd != this._showTotalPages:
          return this._showTotalPages - 1;
        case this._curPageObj.pageIndex > this._rangeEnd:
          return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
            ? this.lastPageIndex
            : this._curPageObj.pageIndex + 1;
        case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
          this._curPageObj.pageIndex > middleIndex &&
          this._rangeEnd < this.lastPageIndex:
          return this._rangeEnd + 1;
        case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
          this._curPageObj.pageIndex < middleIndex &&
          this._rangeStart >= 0 &&
          this._rangeEnd > this._showTotalPages - 1:
          return this._rangeEnd - 1;
        default:
          return this._rangeEnd;
      }
    }
    //Helper function to switch page on non first, last, next and previous buttons only.
    private switchPage(i: number): void {
      console.log("switch", i);
      const previousPageIndex = this.matPag.pageIndex;
      this.matPag.pageIndex = i;
      this.matPag["_emitPageEvent"](previousPageIndex);
      this.initPageRange();
    }
    //Initialize default state after view init
    public ngAfterViewInit() {
      this._rangeStart = 0;
      this._rangeEnd = this._showTotalPages - 1;
      this.initPageRange();
    }
  }
  