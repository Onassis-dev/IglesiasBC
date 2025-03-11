export interface Website {
    style: string;
    structure: string;
    title: string;
    logo?: string;
    pastors?: string;
    pastorsImg?: string;
    servicesDates?: string;
    facebookLink?: string;
    instagramLink?: string;
    youtubeLink?: string;
    preachLink?: string;
    donationLink?: string;
    whatsappLink?: any;
    mission?: string;
    mapsLink?: any;
    images?: Image[];
    events: Event[];
    posts: Post[];
    activities?: Activity[];
    description?: string;
    color?: string;
    language: "es" | "en";
    about?: string;
    coverImg?: string;
    ubication?: string;
    animations: number;
    blog: unknown;
}

export interface Activity {
    title: string;
    text: string;
    img: string;
}
export interface Event {
    title: string;
    img: string;
    date: string | Date;
}

export interface Post {
    title: string;
    img: string;
    publication: string | Date;
}
export interface Image {
    img: string;
}
