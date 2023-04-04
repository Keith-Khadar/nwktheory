// Variables
const backend_url = 'https://nwk.tehe.xyz:3000/';
export {backend_url}


// interfaces for http requests
export interface User{
    Name: string,
    Email: string,
    Connections: [];
}
export interface ProfilePic{
    ProfilePic: string
}
export interface Connection{
    from: string,
    to: string,
}

// Classes for storing data
export class UserData implements User{
    Name: string;
    Email: string;
    Connections: [];

    constructor() {
        this.Name = "";
        this.Email = "";
        this.Connections =[];
    }
}
export class ConnectionData implements Connection{
    from: string;
    to: string;

    constructor(){
        this.from = "";
        this.to = "";
    }
}
export class ProfilePicData implements ProfilePic{
    ProfilePic: string;
    constructor(){
        this.ProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
}