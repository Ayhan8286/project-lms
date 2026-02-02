import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = 'PKR' | 'USD' | 'EUR';

interface CurrencyStore {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRates: Record<Currency, number>;
}

export const useCurrency = create<CurrencyStore>()(
    persist(
        (set) => ({
            currency: 'PKR',
            setCurrency: (currency) => set({ currency }),
            exchangeRates: {
                PKR: 1,
                USD: 0.0036, // Approx 1 PKR = 0.0036 USD (1 USD = 277 PKR)
                EUR: 0.0033
            }
        }),
        {
            name: 'currency-storage',
        }
    )
);
