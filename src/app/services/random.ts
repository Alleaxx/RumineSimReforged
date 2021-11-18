import { NumRange } from "./ranges";

//Объект, имеющий вероятность
export interface IChance<T>{
    Chance() : number;
    Source() : T;
}
export class Chanced<T> implements IChance<T>{
    private object : T;
    private chance : number;

    public Chance() : number{
        return this.chance;
    }
    public Source() : T{
        return this.object;
    }

    constructor(chance : number, object : T){
        this.chance = chance;
        this.object = object;
    }
}
export class ChancedAction extends Chanced<() => void>{
    constructor(chance : number,action :  () => void){
        super(chance, action);
    }
}



export class Random{
    public NextDouble() : number{
        return Math.random();
    }


    //Дробное число в диапазоне
    public Next(from : number, to : number) : number{
        const doubleNum : number = this.NextDouble();
        const rnd = (to - from) * doubleNum;
        const result = from + rnd;
        return result;
    }
    //Целое число в диапазоне
    public NextInt(from : number, to : number) : number{
        const result = this.Next(from, to);
        return Math.round(result);
    }
    //Вернуть дату в диапазоне
    public NextDate(from : Date, to : Date) : Date{
        const fromTicks : number = from.getTime();
        const toTicks : number = to.getTime();
        const difference : number = (toTicks - fromTicks);
        const rndAdd : number = this.Next(0, difference);
        const newDate = new Date(fromTicks + rndAdd);
        return newDate;
    }


    //Проверить шанс, сработает или нет
    public CheckChance(chance : number) : boolean{
        const rnd = this.NextDouble();
        return chance >= rnd;
    }
    //Вернуть случайный элемент из списка
    public ElementRandom<T>(elements : T[]) : T | null{
        const oneChance = 1 / elements.length;
        const chances = elements.map(e => oneChance);
        return this.ElementWithChances(elements, chances);
    }
    //Вернуть случайный элемент из списка
    public ElementChanced<T>(elements : IChance<T>[]) : T | null{
        const chances = elements.map(e => e.Chance());
        const result = this.ElementWithChances(elements, chances);
        if(result != null){
            return result.Source();
        }
        else{
            return null;
        }
    }
    //Вернуть случайный элемент из списка по шансам
    public ElementWithChances<T>(elements : T[], receivedChances : number[]) : T | null{
        const result = this.CheckChancesNoQuarantee(receivedChances);
        return result >= 0 ? elements[result] : null;
    }

    //Проверить каждую вероятность из списка и вернуть результат
    public ElementsChanced<T>(elements : Chanced<T>[]) : T[]{
        let fitElements : T[] = elements.filter(e => this.CheckChance(e.Chance())).map(e => e.Source());
        return fitElements;
    }


    //Выполнить случайное действие (выполнение не гарантировано)
    public InvokeActions(elements : ChancedAction[], quarantee : boolean = false) : number{
        const chances = elements.map(e => e.Chance());
        const method = quarantee ? this.CheckChancesQuarantee : this.CheckChancesNoQuarantee;

        const result = method.call(this, chances);
        if(result >= 0){
            elements[result].Source()();
        }
        return result;
    }


    //Проверить вероятности. Одна из них сработает с гарантией
    public CheckChancesQuarantee(chances : number[]) : number{
        const newChances = this.CreateQuarenteeChances(chances);
        const table = this.CreateTable(newChances);
        const result = this.GetRndFromTable(table);
        if(result < 0){
            throw new Error("Ни один из шансов не сработал");
        }
        return result;
    }
    //Проверить вероятности. Ни одна из них может не сработать
    public CheckChancesNoQuarantee(chances : number[]) : number{
        const table = this.CreateTable(chances);
        const result = this.GetRndFromTable(table);
        return result;
    }


    private CreateQuarenteeChances(chances : number[]) : number[]{
        let sum : number = chances.reduce((sum, chance) => sum += chance);
        let mod = sum / 1;
        return chances.map(c => c / mod);
    }
    private CreateTable(chances : number[]) : NumRange[]{
        let counter : number = 0;
        return chances.map(c => {
            const from : number = counter;
            const to : number = counter + c;
            counter = to;
            return new NumRange(from, to);
        });
    }
    private GetRndFromTable(table : NumRange[]) : number{
        const rnd : number = this.NextDouble();
        for (let i = 0; i < table.length; i++) {
            const element = table[i];
            if(rnd >= element.from && rnd < element.to){
                return i;
            }
        }
        return -1;
    }
}