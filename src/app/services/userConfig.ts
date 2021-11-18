import { Random, ChancedAction } from "./random";
import { IGroupsCollection, Group } from "./group";
import { IRsConfig } from "./rumine";
import UserJson from './users.json';
import { User, UserStat } from "./user";



class UserData{
    nick : string;
}

//Создание пользователей
export interface IUserCreator{
    amount : number;
    CreateList(date : Date, groups : IGroupsCollection, amount? : number) : User[];
    CreateUser(date : Date, groups : IGroupsCollection) : User;
}

export class LegacyUserCreator implements IUserCreator, IRsConfig{
    private random : Random;
    private minDate : Date;
    private freeNicks : string[];
    amount : number;

    constructor(random : Random, minDate : Date) {
        this.amount = 50;
        this.random = random;
        this.minDate = minDate;
        this.SetNicks();
    }
    private SetNicks(){
        const data : UserData[] = UserJson;
        this.freeNicks = data.map(u => u.nick);
    }


    public CreateList(date : Date, groups : IGroupsCollection, amount : number = -1) : User[]{
        let users : User[] = [];
        if(amount === -1){
            amount = this.amount;
        }
        for (let i = 0; i < amount; i++) {
            const user = this.CreateUser(date, groups);
            users.push(user);
        }

        return users;
    }

    public CreateUser(date : Date, groups : IGroupsCollection) : User{
        const nick : string = this.TakeNick(this.random.NextInt(0,1000).toString());
        const registration : Date = this.CreateRegistration(date);
        const statistics : UserStat = this.CreateStatistics(date, registration);
        const user : User = new User(nick, registration, statistics);

        this.CreateCharacter(user);
        this.CreateState(user, groups);

        return user;
    }


    private TakeNick(notFound : string = "Пользователь") : string{
        const nick : string = this.freeNicks.length > 0 ? this.random.ElementRandom(this.freeNicks) as string : notFound;
        this.freeNicks.splice(this.freeNicks.indexOf(nick), 1);
        return nick;
    }
    private CreateRegistration(date : Date) : Date{
        return this.random.NextDate(this.minDate, date);
    }
    private CreateStatistics(now : Date, registration : Date) : UserStat{
        let posts : number = 0;
        let likes : number = 0;
        let news : number;
        let comments : number;

        const action1 = new ChancedAction(0.4, () => {
            posts = this.random.NextInt(1, 1000);
            likes = this.random.NextInt(1, 1000);
        })
        const action2 = new ChancedAction(0.3, () => {
            posts = this.random.NextInt(1, 3000);
            likes = this.random.NextInt(1, 2000);
        })
        const action3 = new ChancedAction(0.2, () => {
            posts = this.random.NextInt(1, 8000);
            likes = this.random.NextInt(1, 8000);
        })
        const action4 = new ChancedAction(0.1, () => {
            posts = this.random.NextInt(1, 12000);
            likes = this.random.NextInt(1, 12000);
        })

        this.random.InvokeActions([action1, action2, action3, action4]);

        return new UserStat(posts, likes);
    }

    private CreateCharacter(user : User) : void{
        const changeChance = this.random.Next(0.25, 0.75);
        const leaveChance = this.random.Next(0.01, 0.25);
        const activeChance = this.random.Next(0.2, 0.9);

        user.chanceToChange = changeChance;
        user.chanceToLeave = leaveChance;
        user.chanceToActive = activeChance;

    }
    private CreateState(user : User, groups : IGroupsCollection){

        const group : Group = groups.changer.GetStart();

        const isRak = this.random.CheckChance(0.15);
        const isBanned = this.random.CheckChance(0.05);
        const isActive = this.random.CheckChance(0.8);

        user.group = group;
        user.rak = isRak;
        user.banned = isBanned;
        user.active = isActive;
    }
}
