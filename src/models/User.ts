import { IUser } from "./modelInterfaces";

class User implements IUser {
    public firstName:string | null;
    public lastName:string | null;
    public username:string;
    public email:string;
    public password:string;
    public profilePic:string | null;
    static UserData:IUser[] = [];
    constructor (userData:IUser) {
        this.firstName = userData.firstName ? userData.firstName : null;
        this.lastName =  userData.lastName ? userData.lastName : null;
        this.username =  userData.username;
        this.email =     userData.email;
        this.password =  userData.password;
        this.profilePic = userData.profilePic ? userData.profilePic : null;
    };
};

export default User;