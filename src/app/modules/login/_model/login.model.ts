// Define an interface for the registration payload
export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string; // You may want to specify its format more strictly
    password: string;
}

// Define an interface for the response from the registration API
export interface RegistrationResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        token: string;
    };
}

export interface LoginPayload {
    email: string | null; // This will hold either an email or a phone number
    password: string;      // The user's password
    mobileNumber?: string | null; // Optional mobile number; can be included if needed
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        token: string;
    };
}

export interface CountryModel{
        name:string;
        flag:string;
        code:string;
}