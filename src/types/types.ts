
export interface Station {
    id: number;
    name: string;
    city: string;
}

export interface Journey {
    id: number;
    from: string;
    to: string;
    date: string;
    price: number;
    provider: string;
    currency: "TL";
}

export interface Seat {
    id: number;
    no: number;
    row: number;
    col: number;
    status: number;
    gender: number;
    price: number;
}

export interface CheckoutRequest {
    journeyId: number;
    seatIds: number[];
    passengerName: string;
    identityNumber: string;
    gender: number;
    creditCardNumber: string;
}

export interface TicketResult {
    isSuccess: boolean;
    message: string;
    pnrCode: string;
}
