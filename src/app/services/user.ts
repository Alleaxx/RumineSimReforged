import { Random, ChancedAction } from "./random";
import { IGroupsCollection, Group } from "./group";
import { IRsConfig } from "./rumine";
import UserJson from './users.json';



//Коллекция пользователей
export class UserCollection{
    collection : User[];


    //Список модераторов, раков, инвертированные версии

    constructor(users : User[]){
        this.collection = users;
    }
    
    public Amount(){
        return this.collection.length;
    }
    public AmountRak() : number{
        return this.collection.filter(u => u.rak).length;
    }
    public AmountModer() : number{
        return this.collection.filter(u => u.IsModer).length;
    }
    public AmountActive() : number{
        return this.collection.filter(u => u.active).length;
    }
    public AmountBanned() : number{
        return this.collection.filter(u => u.banned).length;
    }
}


//Пользователь
export class User{
    public toString() : string{
        return `${this.nick} - ${this.group.name}`
    }

    nick: string;
    registration : Date;

    messages : number;
    likes: number;

    news : number | undefined;
    comments: number | undefined;

    active : boolean;
    banned : boolean;
    rak : boolean;

    group : Group

    chanceToLeave : number;
    chanceToChange : number;
    chanceToActive : number;


    //Случайное обращение
    
    public get IsModer(){
        return this.group.mod;
    }
    constructor(user : string, registration : Date, stat: UserStat){
        this.nick = user;
        this.registration = registration;

        this.active = false;
        this.banned = false;
        this.rak = false;
        this.chanceToLeave = 0;
        this.chanceToChange = 0;
        this.chanceToActive = 0;


        this.news = stat.news;
        this.comments = stat.comments;
        this.messages = stat.posts;
        this.likes = stat.likes;
    }

    public CreateCategories() : UserCate[]{
        let cates : UserCate[] = [UserCate.All];

        const rak = this.rak ? UserCate.Raks : UserCate.Adeq;
        const moder = this.IsModer ? UserCate.Moders : UserCate.Usual;
        const active = this.active ? UserCate.Active : UserCate.Left;
        const health = this.banned ? UserCate.Banned : UserCate.Healthy;

        cates.push(rak);
        cates.push(moder);
        cates.push(active);
        cates.push(health);

        return cates;
    }
}
export class UserStat{
    posts: number;
    likes : number;
    news? : number;
    comments? : number;

    constructor(posts : number, likes : number, news? : number, comments? : number){
        this.posts = posts;
        this.likes = likes;
        this.news = news;
        this.comments = comments;
    }
}
export enum UserCate{
    All = "Все",
    Usual = "Обычные",
    Raks = "Раки",
    Adeq = "Адекватные",
    Moders = "Модератор",
    Active = "Активные",
    Left = "Ушедшие",
    Banned = "Забаненые",
    Healthy = "Здоровые"
}