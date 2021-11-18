//Промежуток времени
export class DateRange{
    start : Date;
    end : Date;

    constructor(start: Date, end : Date){
        this.start = start;
        this.end = end;
    }


    public Format(format : string = 'dd-MMM-yyyy') : string{
        return DateRange.Format(this.start, format);
    }
    public static Format(date : Date, format : string = 'dd-MMM-yyyy') : string{
        const months : string[] = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
        const monthsShort : string[] = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

        format = format.replace('dd', date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString());

        format = format.replace('MMMM', months[date.getMonth()]);
        format = format.replace('MMM', monthsShort[date.getMonth()]);
        format = format.replace('MM', date.getMonth().toString());

        format = format.replace('yyyy', date.getFullYear().toString());
        format = format.replace('mm', date.getMinutes().toString());
        format = format.replace('HH', date.getHours().toString());   

        return format;
    }

    public DiffSeconds() : number{
        const diff : number = this.start.getTime() - this.end.getTime();
        return diff / 1000;
    }
    public DiffMinutes() : number{
        const diff : number = this.start.getTime() - this.end.getTime();
        return diff / 1000 / 60;
    }
    public DiffHours() : number{
        const diff : number = this.start.getTime() - this.end.getTime();
        return diff / 1000 / 60 / 60;
    }
    public DiffDays() : number{
        const diff : number = this.start.getTime() - this.end.getTime();
        return diff / 1000 / 60 / 60 / 24;
    }

    public MonthYear() : string{
        return `${this.start.getMonth()} ${this.start.getFullYear()}`;
    }

    public Season() : Season{
        return DateRange.Season(this.start);
    }
    public static Season(date : Date) : Season{
        const month : number = date.getMonth();
        if(month >= 2 && month < 5){
            return Season.Spring;
        }
        else if(month >= 5 && month < 8){
            return Season.Summer;
        }
        else if(month >= 8 && month < 11){
            return Season.Autumn;
        }
        else{
            return Season.Winter;
        }
    }
}
export enum Season{
    Spring = "Весна",
    Summer = "Лето",
    Autumn = "Осень",
    Winter = "Зима"
}


export class NumRange{
    from : number;
    to : number;

    constructor(from : number, to : number){
        this.from = from;
        this.to = to;
    }
}