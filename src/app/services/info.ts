// Variables
const backend_url = 'https://nwk.tehe.xyz:3000/';
export {backend_url}


// interfaces for http requests
export interface User{
    Name: string,
    Email: string,
    ProfilePic: string,
    Connections: [];
    Channels: [];
}
export interface ProfilePic{
    ProfilePic: string
}
export interface image{
    image: string
}
export interface Connection{
    from: string,
    to: string,
}
export interface Message{
    User: string,
    Channel: string,
    Message: string
}


// pusher environment variables
export const environment = {
    production: false,
    pusher: {
      key: '37edea490ece53aa7ed1',
      cluster: 'mt1',
    },
  };

// Classes for storing data
export class UserData implements User{
    Name: string;
    Email: string;
    ProfilePic: string;
    Connections: [];
    Channels: [];

    constructor() {
        this.Name = "";
        this.Email = "";
        this.ProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        this.Connections =[];
        this.Channels = [];
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
export class MessageData implements Message{
    User: string;
    Channel: string;
    Message: string;

    constructor(){
        this.User = "";
        this.Channel = "";
        this.Message = "";
    }
}


export class ProfilePicData implements ProfilePic{
    ProfilePic: string;
    constructor(){
        this.ProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
}

export class ImageData implements image{
    image: string;
    constructor(){
        this.image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }
}

