import { useEffect, useState } from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { api } from '@/lib/api';
import { useBooking } from '@/context/BookingContext';
import { Spinner } from '@/components/ui/spinner';

interface Station {
    city: string;
    name: string;
    id: number;
}

const JourneySearch = () => {
    const { setFromId, setToId, setDate } = useBooking();
    const [fromStationId, setFromStationId] = useState<number>(1);
    const [toStationId, setToStationId] = useState<number>(2);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [dateOption, setDateOption] = useState<'today' | 'tomorrow'>('today');
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStations = async () => {
            setLoading(true);
            try {
                const data = await api.getStations();
                setStations(data);
            } catch (error) {
                console.error("Failed to fetch stations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStations();
    }, []);

    const handleSwap = () => {
        const temp = fromStationId;
        setFromStationId(toStationId);
        setToStationId(temp);
    };

    const handleSearch = () => {
        setFromId(fromStationId);
        setToId(toStationId);
        const d = selectedDate;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDate(`${year}-${month}-${day}`);
    };

    const getAvailableStations = (excludeId: number) => {
        return stations.filter(station => station.id !== excludeId);
    };

    const getStationById = (id: number) => {
        return stations.find(station => station.id === id);
    };

    if (loading) {
        return (
            <div className='!bg-[#d13b38] w-full !mt-2 border'>
                <div className="container !py-4 mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center min-h-[120px]">
                        <Spinner size={32} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='!bg-[#d13b38] w-full !mt-2 border'>
            <div className="container !py-4 mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-[#f5f5f5] rounded-2xl !px-4 !py-2 h-[80px] flex flex-col justify-center">
                            <label className="text-sm text-gray-500 mb-1 block">Nereden</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left outline-none">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-800">
                                            {getStationById(fromStationId)?.city}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    {getAvailableStations(toStationId).map((station) => (
                                        <DropdownMenuItem
                                            key={station.id}
                                            onClick={() => setFromStationId(station.id)}
                                            className="cursor-pointer"
                                        >
                                            {station.city}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <button
                            onClick={handleSwap}
                            className="p-3 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all "
                            aria-label="Swap locations"
                        >
                            <ArrowLeftRight size={20} className="text-gray-600" />
                        </button>

                        <div className="flex-1 bg-[#f5f5f5] rounded-2xl !px-4 !py-2 h-[80px] flex flex-col justify-center">

                            <label className="text-sm text-gray-500 mb-1 block">Nereye</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left outline-none">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-800">
                                            {getStationById(toStationId)?.city}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    {getAvailableStations(fromStationId).map((station) => (
                                        <DropdownMenuItem
                                            key={station.id}
                                            onClick={() => setToStationId(station.id)}
                                            className="cursor-pointer"
                                        >
                                            {station.city}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex-1 bg-[#f5f5f5] rounded-2xl !px-4 !py-2 h-[80px] flex flex-col items-center justify-center">
                            <label className="text-sm text-gray-500 mb-1 block">Gidiş Tarihi</label>
                            <Popover>
                                <PopoverTrigger className="w-full text-center outline-none">
                                    <div className="flex items-center justify-center gap-2 cursor-pointer">
                                        <div>
                                            <div className="text-lg font-semibold text-gray-800">
                                                {format(selectedDate, 'd MMM', { locale: tr })}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {format(selectedDate, 'EEEE', { locale: tr })}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        lang='TR'
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-2 ">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="dateOption"
                                    checked={dateOption === 'today'}
                                    onChange={() => {
                                        setDateOption('today');
                                        setSelectedDate(new Date());
                                    }}
                                    className="w-4 h-4 text-[#d13b38] focus:ring-[#d13b38]"
                                />
                                <span className="text-sm text-gray-700">Bugün</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="dateOption"
                                    checked={dateOption === 'tomorrow'}
                                    onChange={() => {
                                        setDateOption('tomorrow');
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        setSelectedDate(tomorrow);
                                    }}
                                    className="w-4 h-4 text-[#d13b38] focus:ring-[#d13b38]"
                                />
                                <span className="text-sm text-gray-700">Yarın</span>
                            </label>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            Otobüs Ara
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneySearch;
