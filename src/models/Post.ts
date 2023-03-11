import { IPost } from "./modelInterfaces";
class Post implements IPost {
    public title: string;
    public description: string;
    public image: string | null;
    public slug: string;
    public uploadedAt: Date;
    static PostData: IPost[] = [];
    constructor (title:string, description:string, image: string | null = null, slug:string = `${title}-${Date.now()}`, uploadedAt = new Date()) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.slug = slug;
        this.uploadedAt = uploadedAt;
    };
};

export default Post;