// Type Interface for ads

export interface BaseAd {
    title: string;
    price: number;
    currency: "GEL" | "USD";
    location: string;
    description: string;
    source: "TELEGRAM_AD" | "SITE_AD";
}
