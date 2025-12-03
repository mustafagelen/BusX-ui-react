import { useState, useEffect } from 'react';
import { Users, X, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Seat, CheckoutRequest, TicketResult } from '@/types/types';
import { CgBoy } from "react-icons/cg";
import { CgGirl } from "react-icons/cg";


interface JourneyDetailProps {
    journeyId: number;
}

const JourneyDetail = ({ journeyId }: JourneyDetailProps) => {
    const [journeyData, setJourneyData] = useState<Seat[] | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<{ id: number; gender: number }[]>([]);
    const [warningMessage, setWarningMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Backend'den veriyi çekiyoruz
                const data = await api.getSeats(journeyId);
                setJourneyData(data.seats);
            } catch (error) {
                console.error("Sefer detayları yüklenirken hata:", error);
                setWarningMessage("Veri yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        if (journeyId) fetchDetails();
    }, [journeyId]);

    const handleSeatSelect = (seat: Seat, gender: number) => {
        if (!journeyData) return;

        // Check max seats
        if (selectedSeats.length >= 4) {
            setWarningMessage('Maksimum 4 koltuk seçebilirsiniz.');
            return;
        }

        // Check adjacent seat constraints
        const rowSeats = journeyData.filter(s => s.row === seat.row);

        // Find all potential neighbors (col +/- 1)
        const potentialNeighbors = rowSeats.filter(s => Math.abs(s.col - seat.col) === 1);

        // Filter valid neighbors (not across aisle)
        const validNeighbors = potentialNeighbors.filter(neighbor => {
            // Check if they are on the same side of the aisle
            // Left side: col <= 2
            // Right side: col > 2
            const seatSide = seat.col <= 2 ? 'left' : 'right';
            const neighborSide = neighbor.col <= 2 ? 'left' : 'right';
            return seatSide === neighborSide;
        });

        // Check constraints for all valid neighbors
        for (const neighbor of validNeighbors) {
            if (neighbor.status === 2) {
                if (neighbor.gender === 1 && gender === 2) {
                    setWarningMessage('Erkek yanına kadın yolcu seçilemez.');
                    return;
                }
                if (neighbor.gender === 2 && gender === 1) {
                    setWarningMessage('Kadın yanına erkek yolcu seçilemez.');
                    return;
                }
            }
        }

        setSelectedSeats([...selectedSeats, { id: seat.id, gender }]);
        setWarningMessage('');
    };

    const handleSeatRemove = (seatId: number) => {
        setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
        setWarningMessage('');
    };

    const handleBuyTicket = async () => {
        if (selectedSeats.length === 0) return;

        setLoading(true);
        try {
            const request: CheckoutRequest = {
                journeyId: journeyId,
                seatIds: selectedSeats.map(s => s.id),
                passengerName: "Test Passenger",
                identityNumber: "11111111111",
                gender: selectedSeats[0].gender,
                creditCardNumber: "1111222233334444"
            };

            const result = await api.buyTicket(request);

            if (result.isSuccess) {
                alert(`Bilet başarıyla alındı! PNR: ${result.pnrCode}`);
                setSelectedSeats([]);
            } else {
                setWarningMessage(result.message || "İşlem başarısız.");
            }
        } catch (error) {
            console.error("Bilet alma hatası:", error);
            setWarningMessage("İşlem sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const getSeatColor = (seat: Seat, isSelected: boolean, selectedGender?: number) => {
        if (isSelected) {
            return selectedGender === 1
                ? 'bg-[#abdbc1]  text-white'
                : 'bg-[#abdbc1] cursor-pointer text-white';
        }

        if (seat.status === 2) {
            return seat.gender === 1
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-pink-100 border-pink-300 text-pink-800';
        }

        return 'bg-white border-gray-300 cursor-pointer hover:shadow-md text-gray-700';
    };

    const calculateTotal = () => {
        if (!journeyData) return 0;
        return selectedSeats.reduce((sum, selection) => {
            const seat = journeyData.find(s => s.id === selection.id);
            return sum + (seat?.price || 0);
        }, 0);
    };

    const renderSeatGrid = () => {
        if (!journeyData) return null;

        const maxRow = Math.max(...journeyData.map(s => s.row));
        const grid = [];

        for (let row = 1; row <= maxRow; row++) {
            const rowSeats = journeyData.filter(s => s.row === row).sort((a, b) => a.col - b.col);

            grid.push(
                <div key={row} className="flex flex-col justify-between h-full min-w-[3rem]">
                    <div className="flex flex-col gap-1.5 mb-6">
                        {rowSeats.filter(s => s.col > 2).reverse().map(seat => {
                            const selection = selectedSeats.find(s => s.id === seat.id);
                            const isSelected = !!selection;

                            if (seat.status === 2) {
                                return (
                                    <div
                                        key={seat.id}
                                        className={`w-8 h-8 rounded-md border-[1.5px] font-bold text-xs flex items-center justify-center ${getSeatColor(seat, false)} cursor-not-allowed opacity-80`}
                                    >
                                        {seat.no}
                                    </div>
                                );
                            }

                            return (
                                <Popover key={seat.id}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className={`w-8 h-8 rounded-md border-[1.5px] font-bold text-xs transition-all flex items-center justify-center ${getSeatColor(seat, isSelected, selection?.gender)} ${isSelected ? 'ring-2 ring-offset-1 ring-gray-300' : 'hover:border-orange-400 hover:shadow-md'}`}
                                            onClick={() => {
                                                if (isSelected) handleSeatRemove(seat.id);
                                            }}
                                        >
                                            {seat.no}
                                        </button>
                                    </PopoverTrigger>
                                    {!isSelected && (
                                        <PopoverContent className="w-fit p-2">
                                            <div className="flex flex-row gap-2">
                                                <button
                                                    onClick={() => handleSeatSelect(seat, 2)}
                                                    className={`cursor-pointer flex flex-col text-[#d18a9e] items-center gap-2 w-full p-2 hover:bg-pink-50 rounded text-sm font-medium transition-colors`}
                                                >
                                                    <CgGirl style={{ width: '32px', height: '32px' }} />

                                                    Kadın
                                                </button>
                                                <button
                                                    onClick={() => handleSeatSelect(seat, 1)}
                                                    className={`cursor-pointer flex flex-col items-center gap-2 w-full p-2 hover:bg-blue-50 rounded text-[#6c8aa8] text-sm font-medium transition-colors`}
                                                >
                                                    <CgBoy style={{ width: '32px', height: '32px' }} />
                                                    Erkek
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    )}
                                </Popover>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {rowSeats.filter(s => s.col <= 2).reverse().map(seat => {
                            const selection = selectedSeats.find(s => s.id === seat.id);
                            const isSelected = !!selection;

                            if (seat.status === 2) {
                                return (
                                    <div
                                        key={seat.id}
                                        className={`w-8 h-8 rounded-md border-[1.5px] font-bold text-xs flex items-center justify-center ${getSeatColor(seat, false)} cursor-not-allowed opacity-80`}
                                    >
                                        {seat.no}
                                    </div>
                                );
                            }

                            return (
                                <Popover key={seat.id}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className={`w-8 h-8 rounded-md border-[1.5px] font-bold text-xs transition-all flex items-center justify-center ${getSeatColor(seat, isSelected, selection?.gender)} ${isSelected ? 'ring-2 ring-offset-1 ring-gray-300' : 'hover:border-orange-400 hover:shadow-md'}`}
                                            onClick={() => {
                                                if (isSelected) handleSeatRemove(seat.id);
                                            }}
                                        >
                                            {seat.no}
                                        </button>
                                    </PopoverTrigger>
                                    {!isSelected && (
                                        <PopoverContent className="w-fit p-2">
                                            <div className="flex flex-row gap-2">
                                                <button
                                                    onClick={() => handleSeatSelect(seat, 2)}
                                                    className={`cursor-pointer flex flex-col text-[#d18a9e] items-center gap-2 w-full p-2 hover:bg-pink-50 rounded text-sm font-medium transition-colors`}
                                                >
                                                    <CgGirl style={{ width: '32px', height: '32px' }} />

                                                    Kadın
                                                </button>
                                                <button
                                                    onClick={() => handleSeatSelect(seat, 1)}
                                                    className={`cursor-pointer flex flex-col items-center gap-2 w-full p-2 hover:bg-blue-50 rounded text-[#6c8aa8] text-sm font-medium transition-colors`}
                                                >
                                                    <CgBoy style={{ width: '32px', height: '32px' }} />
                                                    Erkek
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    )}
                                </Popover>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return grid;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-12 flex justify-center items-center">
                <Spinner size={40} className="text-orange-500" />
            </div>
        );
    }

    if (!journeyData) return null;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

            <div className="p-4">
                <div className="bg-orange-50 text-orange-800 rounded-lg p-3 text-center font-medium mb-6 border border-orange-100 flex items-center justify-center gap-2">
                    <Info size={18} />
                    Koltuk Seçimi
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-max">
                            <div className="relative border-2 border-gray-300 rounded-[2.5rem] rounded-r-2xl p-4 pr-10 bg-white inline-block">
                                <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-100 rounded-l-[2.5rem] bg-gradient-to-r from-gray-50 to-white pointer-events-none"></div>
                                <div className="flex gap-6 relative z-10">
                                    <div className="flex flex-col justify-end pr-4 pl-1 py-1 border-r border-dashed border-gray-200">
                                        <div className="w-10 h-10 border-4 border-gray-300 rounded-full flex items-center justify-center bg-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400">KAPTAN</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pb-1">
                                        {renderSeatGrid()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {warningMessage && (
                            <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100 animate-pulse text-center">
                                {warningMessage}
                            </div>
                        )}
                        <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-600 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-blue-100 border border-blue-300 rounded"></div>
                                <span>Erkek (Dolu)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-pink-100 border border-pink-300 rounded"></div>
                                <span>Kadın (Dolu)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                                <span>Boş</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-[#abdbc1] border border-[#abdbc1] rounded"></div>
                                <span>Seçili </span>
                            </div>

                        </div>
                    </div>

                    <div className="w-full lg:w-1/4 flex flex-col  gap-3">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                <Users size={16} />
                                Seçilen Koltuklar
                            </h3>

                            {selectedSeats.length === 0 ? (
                                <div className="text-gray-400 text-xs text-center py-3 italic">
                                    Henüz koltuk seçmediniz.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedSeats.map(selection => {
                                        const seat = journeyData.find(s => s.id === selection.id);
                                        return (
                                            <span key={selection.id} className={`px-2 py-0.5 rounded-md text-xs font-bold border ${selection.gender === 1 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>
                                                No: {seat?.no}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-3 mt-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600 text-xs">Toplam</span>
                                    <span className="text-lg font-bold font-bold text-black">{calculateTotal()} TL</span>
                                </div>

                                <button
                                    onClick={handleBuyTicket}
                                    disabled={selectedSeats.length === 0}
                                    className={`w-full py-2.5 cursor-pointer rounded-lg font-bold text-sm transition-all shadow-sm ${selectedSeats.length > 0
                                        ? 'bg-[#0bb386] text-white transform hover:-translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 !cursor-not-allowed'
                                        }`}
                                >
                                    BİLETİ SATIN AL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneyDetail;