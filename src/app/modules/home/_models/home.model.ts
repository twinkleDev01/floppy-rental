export interface SubCategories {
    subcategories:[
    {
        subClassificationName:string,
        image:string,
        subId: number,
        mainId: number,
    }],
    classificationName:string
  }
  export interface Item {
    imagepath?: string; // Optional, as it can be undefined
    itemName: string;
    specicationname: string;
    showOnDastboard?: number; // Optional, based on usage in the HTML
  }
  
  export interface ItemList {
    itemList: Item[];
  }