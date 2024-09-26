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
    imagepath?: string; 
    itemName: string;
    specicationname: string;
    showOnDastboard?: number; 
  }
  
  export interface ItemList {
    itemList: Item[];
  }
  export interface SliderItem {
    Image: string;
    URL: string;
    Tittle: string;
    Status: number;
    Seqno: number;
  }
  
  export interface SliderData {
    Middle: SliderItem[];
    Bottom: SliderItem[];
    ServiceSideImage: SliderItem[];
    Top: SliderItem[];
  }
  
  export interface SliderResponse {
    success: boolean;
    message: string;
    data: SliderData;
  }

 
  
  