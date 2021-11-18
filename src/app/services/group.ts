import { IGroupChanger, GroupRules } from "./groupConfig";

export interface IGroupsCollection{
    groups : Group[]
    changer : IGroupChanger;
}
export class GroupsCollection implements IGroupsCollection{
    groups : Group[];
    changer : IGroupChanger;

    //Сделать доступ к группам через []
    constructor(groupRules : GroupRules){
        this.groups = groupRules.groups;
        this.changer = groupRules.changer;
    }
}

export class Group{
    name : string;
    color: string;
    mod : boolean;
    chance : number;

    constructor(name : string, color: string, chance : number){
        this.name = name;
        this.color = color;
        this.chance = chance;
        this.mod = name === "Модератор";
    }
}
