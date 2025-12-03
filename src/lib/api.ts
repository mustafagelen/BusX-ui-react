import axios from 'axios';
import type { Station, Journey, Seat, CheckoutRequest, TicketResult } from "../types/types.js";

const apiClient = axios.create({
    baseURL: "http://localhost:5112/api",
    headers: {
        "Content-Type": "application/json"
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {

        const message = error.response?.data?.message || "Bir hata oluştu.";
        console.error("API Hatası:", message);
        return Promise.reject(new Error(message));
    }
);

export const api = {
    getStations: async (): Promise<Station[]> => {
        const response = await apiClient.get<Station[]>('/journeys/stations');
        return response.data;
    },

    searchJourneys: async (fromId: number, toId: number, date: string): Promise<Journey[]> => {
        const response = await apiClient.get<Journey[]>('/journeys', {
            params: { fromId, toId, date }
        });
        return response.data;
    },

    getSeats: async (journeyId: number): Promise<{ seats: Seat[] }> => {
        const response = await apiClient.get<{ seats: Seat[] }>(`/journeys/${journeyId}/seats`);
        return response.data;
    },

    buyTicket: async (request: CheckoutRequest): Promise<TicketResult> => {
        try {
            const response = await apiClient.post<TicketResult>('/tickets/checkout', request);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return error.response.data as TicketResult;
            }
            throw error;
        }
    },

    getTicketByPnr: async (pnr: string): Promise<any> => {
        const response = await apiClient.get(`/tickets/${pnr}`);
        return response.data;
    }
};