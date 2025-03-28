import { useEffect, useState } from 'react';
import OwnerDashboard from './OwnerDashboard';
import Dashboard from './Dashboard';

const SelectDashboard = () => {
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    useEffect(() => {
        const owner = localStorage.getItem('owner') === 'true';
        setIsOwner(owner);
    }, []);

    if (isOwner === null) return null;

    return isOwner ? <OwnerDashboard /> : <Dashboard />;
};

export default SelectDashboard;
