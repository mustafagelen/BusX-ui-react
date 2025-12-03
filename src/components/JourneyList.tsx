import { useEffect, useState } from 'react';
import { Clock, Bus, Wifi, Tv, Plug } from 'lucide-react';
import type { Journey } from '@/types/types';
import { api } from '@/lib/api';
import { useBooking } from '@/context/BookingContext';
import { Spinner } from '@/components/ui/spinner';
import JourneyDetail from './JourneyDetail';

const JourneyList = () => {
    const { fromId, toId, date } = useBooking();
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedJourneyId, setExpandedJourneyId] = useState<number | null>(null);

    useEffect(() => {
        const fetchJourneys = async () => {
            if (fromId && toId && date) {
                setLoading(true);
                try {
                    const data = await api.searchJourneys(fromId, toId, date);
                    setJourneys(data);
                } catch (error) {
                    console.error("Seferler yüklenirken hata oluştu:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchJourneys();
    }, [fromId, toId, date]);

    if (!fromId || !toId) {
        return null;
    }

    if (loading) {
        return (
            <div className="container mx-auto py-12">
                <Spinner size={40} />
            </div>
        );
    }

    if (journeys.length === 0) {
        return <div className="text-center py-8">Sefer bulunamadı.</div>;
    }

    const handleSeatSelect = (journeyId: number) => {
        setExpandedJourneyId(expandedJourneyId === journeyId ? null : journeyId);
    };

    console.log(journeys);
    return (
        <div className="container mx-auto py-6 !mt-4 space-y-4">
            {journeys.map((journey) => (
                <div key={journey.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center justify-between">
                        <div className="w-48">
                            <div className="font-bold text-lg text-gray-800">{journey.provider}</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                <Clock size={18} className="text-gray-400" />
                                <span>
                                    {new Date(journey.date).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <div className="flex items-start w-full gap-2 text-gray-500 font-normal text-sm">

                                <span>
                                    {new Date(journey.date).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </span>
                            </div>

                        </div>


                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <Bus size={16} />
                                <span>2+1</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {journey.from} <span className="mx-1">›</span> {journey.to}
                            </div>
                        </div>

                        <div className="text-xl font-bold text-gray-800">
                            {journey.price} {journey.currency}
                        </div>

                        <div>
                            <button
                                onClick={() => handleSeatSelect(journey.id)}
                                className="bg-[#d13b38] cursor-pointer hover:bg-[#b92b29] text-white font-semibold px-6 py-2 rounded text-sm transition-colors"
                            >
                                {expandedJourneyId === journey.id ? 'KAPAT' : 'KOLTUK SEÇ'}
                            </button>
                        </div>
                    </div>

                    <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                                <Bus size={12} />
                                Şehir İçi Servis
                            </span>
                            <div className="flex items-center gap-2 text-gray-400 ml-2">
                                <Wifi size={14} />
                                <Tv size={14} />
                                <Plug size={14} />
                            </div>
                        </div>

                    </div>

                    {/* Expandable Seat Selection */}
                    {expandedJourneyId === journey.id && (
                        <div className="p-4 border-t border-gray-200">
                            <JourneyDetail
                                journeyId={journey.id}
                                onClose={() => setExpandedJourneyId(null)}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default JourneyList;
