export interface IPost {
    title: string;
    description: string;
    image: string | null;
    slug?:string;
    uploadedAt?: string;
}