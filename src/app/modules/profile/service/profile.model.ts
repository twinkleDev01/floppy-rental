export interface Country {
    name: string;    // Represents the common name of the country
    code: string;    // Represents the country code
    flag: string;    // Represents the URL of the country's flag
    iso2: string;    // Represents the ISO 3166-1 alpha-2 code of the country
}
  export interface State {
    name: string;          
    isoCode: string;      
    countryCode: string;  
    latitude: string;     
    longitude: string;    
  }

  export interface selectedCountry {
    name: string;   
    code: string;   
    flag: string;
    iso2: string;   
}
export interface selectedState {
    name: string;         
    isoCode: string;      
    countryCode: string;  
    latitude: string;     
    longitude: string;    
}

export interface ProfileDetails {
    id: number;
    login: string | null;
    password: string;
    name: string;
    userType: string | null;
    no: string | null;
    loggedIn: string | null;
    menuId: string | null;
    branchId: string | null;
    utype: string | null;
    branches: string | null;
    accountCode: string | null;
    pwdDate: string | null;
    authPwd: string | null;
    schoolId: string | null;
    compid: number;
    userIds: string | null;
    dateTimeTempNo: number;
    dateTimeTempDate: string; // Adjust type based on actual date format used
    emailId: string;
    regId: string | null;
    godown: string | null;
    godownId: string | null;
    deviceId: string | null;
    oldMobileNo: string | null;
    companyId: string | null;
    companies: string | null;
    profileID: string | null;
    mobileVerifyStatus: string | null;
    profileStatus: string | null;
    loginStatus: number;
    forgotOtp: string | null;
    token: string;
    appBranchId: string | null;
    loginBy: string | null;
    registrationId: string | null;
    userId: number;
    mobileNo: string;
    image: string;
    address: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
}

export interface ApiResponsegetProfileDetailsById {
    success: boolean;
    message: string;
    data: ProfileDetails;
}

export interface UpdateUserProfilePayload {
    userId: number;
    name: string;
    phone: string;
    pincode: string;
    locality: string;
    address: string;
    state: string;
    city: string;
    image: string;
}

export interface UpdateUserProfileResponse {
    success: boolean;
    message: string;
    data: boolean; 
}

export interface CartItem {
    id: number;
    itemId: number;
    itemName: string;
    itemRate: number;
    quantity: number;
    price: number;
    userId: number;
    processStatus: string;
    tax: number;
    discountPercent: number;
    discountAmount: number;
    image: string;
    subCategoryName: string;
    categoryName: string;
}
export interface ApiResponse {
    success: boolean;     // Indicates whether the operation was successful
    message: string;      // A message providing information about the operation
    data: boolean;        // Indicates the status of the data (in this case, true or false)
}



  export type StatesArray = State[]; 
  
  export type CountriesArray = Country[];
  
 
