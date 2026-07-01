export type UserInfo = {
    username: string;
    password: string;
    roles: {name : string}[];
    permissions: [{
        name : string
    }];
}