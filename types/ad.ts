// Type Interface for ads
export interface Location {
    country: string;
    city: string;
    location: string | null;
}
export interface BaseAd {
    userId: string;
    title: string;
    description: string;
    price: number;
    currency: "GEL" | "USD";
    location: Location;
    source: "TELEGRAM_AD" | "SITE_AD";
}
export interface Image {
    url: string;
}
