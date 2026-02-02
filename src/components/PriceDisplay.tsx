"use client";

import { useCurrency } from "@/hooks/use-currency";
import { useEffect, useState } from "react";

interface PriceDisplayProps {
    value: number;
    className?: string;
}

export const PriceDisplay = ({ value, className }: PriceDisplayProps) => {
    const { currency, exchangeRates } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className={className}>PKR {value.toLocaleString()}</span>;
    }

    const rate = exchangeRates[currency];
    const convertedValue = value * rate;

    return (
        <span className={className}>
            {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
            }).format(convertedValue)}
        </span>
    );
};
