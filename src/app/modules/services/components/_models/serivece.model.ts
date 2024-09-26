export interface Review {
    profileImg?: string;
    name: string;
    address?: string;
    rating: number;
    review: string;
  }

 export interface CartItemPayload {
    itemId: number;
    id: number;
    itemName: string;
    itemRate: number;
    price: number;
    quantity: number;
    userId: number;
    processStatus: string;
    discountPercent: number;
    discountAmount: number;
    tax: number;
    image: string;
  }

 export interface AddCartItemResponse {
  success: boolean;
  message: string;
  data: boolean;
}

  
  
  