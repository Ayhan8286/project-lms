"use client";

import { useCurrency } from "@/hooks/use-currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CurrencySelector = () => {
    const { currency, setCurrency } = useCurrency();

    return (
        <Select value={currency} onValueChange={(val: string) => setCurrency(val as any)}>
            <SelectTrigger className="w-[80px] h-9">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PKR">PKR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
        </Select>
    )
}
