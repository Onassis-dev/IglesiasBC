import { Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const colors = {
    purple: 'p-3 rounded-xl size-12 bg-purple-background text-purple',
    cyan: 'p-3 rounded-xl size-12 bg-cyan-background text-cyan',
    orange: 'p-3 rounded-xl size-12 bg-orange-background text-orange',
    blue: 'p-3 rounded-xl size-12 bg-blue-background text-blue',
    green: 'p-3 rounded-xl size-12 bg-green-background text-green',
    yellow: 'p-3 rounded-xl size-12 bg-yellow-background text-yellow',
    gray: 'p-3 rounded-xl size-12 bg-gray-background text-gray',
    pink: 'p-3 rounded-xl size-12 bg-pink-background text-pink',
};

interface props {
    title: string;
    data: string | number;
    children: React.ReactNode;
    color: keyof typeof colors;
    href: string;
    perm: string;
}

const InfoCard2 = ({ title, data, children, color, href, perm }: props) => {
    const [isAvailable, setIsAvailable] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAvailable(localStorage.getItem(perm) === 'true');
    }, [data]);

    return (
        <button onClick={isAvailable ? () => navigate(href) : () => navigate('/pricing')} className="flex gap-3 text-left relative">
            {!isAvailable && <Award className="absolute top-1 -right-1 border-yellow text-yellow bg-yellow-background rounded-full p-1 size-7" />}
            <div className={colors[color]}>{children}</div>
            <div>
                <div className="text-sm text-muted-foreground ">{title}</div>
                <div className="text-xl font-semibold">{data || 0}</div>
            </div>
        </button>
    );
};

export default InfoCard2;
