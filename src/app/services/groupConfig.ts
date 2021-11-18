import { Group } from "./group";
import { Chanced } from "./random";
import { Random } from "./random";
import { IRsConfig } from "./rumine";
import GroupsJson from "./groups.json"



class GroupData{
    name : string;
    color : string;
}

export type GroupRules = { changer : IGroupChanger, groups : Group[] }
export interface IGroupsCreator{
    Create(random : Random) : GroupRules;
}
export class LegacyGroupCreator implements IGroupsCreator, IRsConfig{
    constructor() {
        
    }
    public Create(random : Random) : GroupRules{
        const groupsData : GroupData[] = GroupsJson;
        const groups = groupsData.map(g => new Group(g.name, g.color, 1));
        const changer : IGroupChanger = new LegacyGroupChanger(random, groups);
        return { groups, changer };
    }


}

export interface IGroupChanger{
    Upgrade(group : Group) : Group;
    Downgrade(group : Group) : Group;
    GetStart() : Group;
}
export class LegacyGroupChanger implements IGroupChanger{
    private random : Random;
    private groups : Group[];

    private Start : Chanced<Group>[];
    private Upgrades : Map<Group, Chanced<Group>[]>;
    private Downgrades : Map<Group, Chanced<Group>[]>;

    constructor(random : Random, groups : Group[]){
        this.groups = groups;
        this.random = random;
        this.Start = [];
        this.Upgrades = new Map<Group, Chanced<Group>[]>();
        this.Downgrades = new Map<Group, Chanced<Group>[]>();
        this.groups.forEach(g => {
            this.Upgrades.set(g, [new Chanced<Group>(0.1, g)]);
            this.Downgrades.set(g, [new Chanced<Group>(0.1, g)]);
        })

        this.SetUpgrades();
    }

    private SetUpgrades(){
        const poset : Group = this.groups.find(g => g.name === "Посетитель");
        const goodPeople : Group = this.groups.find(g => g.name === "Просто хорошие люди");
        const moderBezdna : Group = this.groups.find(g => g.name === "Модератор бездны");
        const journalist : Group = this.groups.find(g => g.name === "Журналист");
        const xxxl : Group = this.groups.find(g => g.name === "XXXL ПХЛ");
        const oldfag : Group = this.groups.find(g => g.name === "Олдфаг");
        const journalistOldfag : Group = this.groups.find(g => g.name === "Журналист-олдфаг");
        const moder : Group = this.groups.find(g => g.name === "Модератор");


        const SetStart = () => {
            //Стартовые шансы
            this.SetChance(poset, 0.16);
            this.SetChance(goodPeople, 0.25);
            this.SetChance(moderBezdna, 0.08);
            this.SetChance(journalist, 0.08);
            this.SetChance(xxxl, 0.16);
            this.SetChance(oldfag, 0.16);
            this.SetChance(journalistOldfag, 0.08);
            this.SetChance(moder, 0.05);
        };
        const SetUpgrades = () => {
            //Повышения
            this.AddUpgrade(goodPeople, 0.5, poset);
            this.AddUpgrade(moderBezdna, 0.5, poset);
    
            this.AddUpgrade(journalist, 0.5, goodPeople, moderBezdna);
            this.AddUpgrade(xxxl, 0.5, goodPeople, moderBezdna);
            this.AddUpgrade(oldfag, 1, journalist, xxxl);
    
            this.AddUpgrade(journalistOldfag, 1, oldfag);
        };
        const SetDowngrades = () => {
            //Понижения
            this.AddDowngrade(xxxl, 0.25, journalistOldfag);
            this.AddDowngrade(oldfag, 0.25, journalistOldfag);
            this.AddDowngrade(moderBezdna, 0.25, journalistOldfag);
            this.AddDowngrade(journalist, 0.25, journalistOldfag);
    
            this.AddDowngrade(goodPeople, 0.5, oldfag, moderBezdna, journalist);
            this.AddDowngrade(xxxl, 0.5, oldfag, moderBezdna, journalist);
            this.AddDowngrade(poset, 1, goodPeople, xxxl);
        };

        SetStart();
        SetUpgrades();
        SetDowngrades();
    }

    private SetChance(group : Group, chance : number){
        this.Start.push(new Chanced<Group>(chance, group));
    }
    private AddUpgrade(group : Group, chance : number, ...forGroups : Group[]){
        forGroups.forEach(g => {
            if(!this.Upgrades.has(g)){
                this.Upgrades.set(g, []);
            }
            this.Upgrades.get(g).push(new Chanced(chance, group));
        });
    }
    private AddDowngrade(group : Group, chance : number, ...forGroups : Group[]){
        forGroups.forEach(g => {
            if(!this.Downgrades.has(g)){
                this.Downgrades.set(g, []);
            }
            this.Downgrades.get(g).push(new Chanced(chance, group));
        });
    }


    public Upgrade(group : Group) : Group{
        return this.random.ElementChanced(this.Upgrades.get(group)) as Group;
    }
    public Downgrade(group : Group) : Group{
        return this.random.ElementChanced(this.Downgrades.get(group)) as Group;
    }
    public GetStart() : Group{
        return this.random.ElementChanced(this.Start);
    }
}

enum GroupType{
    Poset,
    GoodPeople,
    ModBezdna,
    Journalist,
    XXXL,
    Oldfag,
    JournalistOldfag,
    Mod,
}