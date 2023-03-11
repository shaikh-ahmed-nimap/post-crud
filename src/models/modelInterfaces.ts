export interface IPost {
    title: string;
    description: string;
    image: string | null;
    slug?:string;
    uploadedAt?: Date;
};

export interface IUser {
    firstName:string | null;
    lastName:string | null;
    username:string;
    email:string;
    password:string;
    profilePic:string | null;
};