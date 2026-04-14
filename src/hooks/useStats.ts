import { useState, useEffect } from 'react';

function useStats(transactions) {
    const [stats, setStats] = useState({ total: 0, average: 0, count: 0 });

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
            const average = total / transactions.length;
            setStats({ total, average, count: transactions.length });
        }
    }, [transactions]);

    return stats;
}

export default useStats;