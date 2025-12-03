import { Bus, Plane, Car } from 'lucide-react';

interface JourneyTypeProps {
    activeType?: string;
    onTypeChange?: (type: string) => void;
}

const JourneyType = ({ activeType = 'bus', onTypeChange }: JourneyTypeProps) => {
    const journeyTypes = [
        { id: 'bus', label: 'Otobüs', icon: Bus },
        { id: 'plane', label: 'Uçak', icon: Plane },
        { id: 'car', label: 'Araç', icon: Car },
    ];

    return (
        <div className="container !pt-8 flex gap-3 items-center">
            {journeyTypes.map((type) => {
                const Icon = type.icon;
                const isActive = activeType === type.id;

                return (
                    <button
                        key={type.id}
                        onClick={() => onTypeChange?.(type.id)}
                        className={`
              flex items-center !gap-2 !px-6 !py-2.5 rounded-full
              transition-all duration-200 cursor-pointer
              ${isActive
                                ? 'bg-[#d13b38] text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                            }
            `}
                    >
                        <Icon size={20} />
                        <span className="font-medium">{type.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default JourneyType;
