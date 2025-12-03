import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface BookingContextType {
    fromId: number | null;
    toId: number | null;
    date: string;
    journeyId: number | null;
    seatsIds: number[];
    setFromId: (id: number | null) => void;
    setToId: (id: number | null) => void;
    setDate: (date: string) => void;
    setJourneyId: (id: number | null) => void;
    setSeatsIds: (ids: number[]) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [fromId, setFromId] = useState<number | null>(null);
    const [toId, setToId] = useState<number | null>(null);
    const [date, setDate] = useState<string>(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [journeyId, setJourneyId] = useState<number | null>(null);
    const [seatsIds, setSeatsIds] = useState<number[]>([]);

    return (
        <BookingContext.Provider value={{
            fromId,
            toId,
            date,
            journeyId,
            seatsIds,
            setFromId,
            setToId,
            setDate,
            setJourneyId,
            setSeatsIds
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking provider not found');
    }
    return context;
};
