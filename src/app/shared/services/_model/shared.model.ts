// Define the Testimonial interface
export interface Testimonial {
    id: number;
    custumerName: string;
    customerDesigination: string;
    image: string;
    rate: number;
    review: string;
    status: number;
    compid: number;
    userId: number;
    branchId: number;
    yearId: string;
  }
  
  // Define the TestimonialResponse interface
 export interface TestimonialResponse {
    success: boolean;
    message: string;
    data: Testimonial[];
  }
  
  // Define interface for address payload (if needed)
  export interface AddressPayload {
    userId: string | null;
    addressType: string;
    location: string;
    city: string;
    state: string;
    pinCode: string;
    area: string;
    country: string;
    stateCode: string | null;
    countryCode: string | null;
  }
  
  
  // Example for Coupon List response
  export interface Coupon {
    id: number;
    code: string;
    discount: number;
  }
  
  export  interface CouponListResponse {
    success: boolean;
    message: string;
    data: Coupon[];
  }

 export interface FooterItem {
    id: number;
    name: string;
    link: string;
  }
  
 export interface FooterListResponse {
    success: boolean;
    message: string;
    data: FooterItem[];
  }

 export interface AddressResponse {
    success: boolean;
    message: string;
    data: string; 
  }

  export interface Address {
    id: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  }
  
  export interface AddressListResponse {
    success: boolean;
    message: string;
    data: AddressObj[];
  }
  
  export interface MetaTag {
    title: string;
    description: string;
    keywords: string;
  }
  
  export interface MetaTagResponse {
    success: boolean;
    message: string;
    data: MetaTag;
  }
  
  export interface AddressObj {
    userId: number;           // Assuming userId is always a number
    addressType: string;      // Type of the address (e.g., Home, Work, etc.)
    location: string;         // Full address string
    city: string;             // City name
    state: string;            // State name
    stateCode: string;        // State code (e.g., CT)
    pinCode: string;          // Postal/ZIP code
    area: string;             // Area name
    country: string;          // Country name
    countryCode: string;      // Country code (e.g., IN)
}


// Define an interface for the API Response
export interface AddressesResponse {
    success: boolean;
    message: string;
    data: AddressObj[]; // Array of Address objects
}


  