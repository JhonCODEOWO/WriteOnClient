export interface PaginateRecord {
    /**
     * Dynamic key to store a url with the scroll state
     */
    [route: string]: StateRecord | undefined;
}

interface StateRecord {
    /**
     * Scroll Top to store (px)
     */
    location: number;
}