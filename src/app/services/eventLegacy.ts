import { StoryContext } from "./story";
import { Random } from "./random";
import { User } from "./user";
import { Event, EventTypes } from "./event";
import { EventOption } from "./eventOption";
import { GroupsCollection, IGroupsCollection } from "./group";
import { IRsConfig, IRumine } from "./rumine";

//Создание событий на основе активности и даты
export interface IEventCreator{
    ChanceFor(pages : number) : number;
    Create(context : StoryContext, groups : IGroupsCollection) : Event[];
}
export class LegacyEvents implements IEventCreator, IRsConfig {
    random : Random;
    constructor(random : Random) {
        this.random = random;
    }

    public Chance(context : StoryContext) : number{
        const chance = 1 / (8 - context.activity.pages / 10);
        return Math.max(0.01, chance);
    }
    public ChanceFor(pages : number) : number{
        const chance = 1 / (8 - pages / 10);
        return Math.max(0.01, chance);
    }
    public Create(context : StoryContext, groups : IGroupsCollection) : Event[]{
        const chance = this.Chance(context);
        if(this.random.CheckChance(chance) && context.active.length > 0){
            return this.СhooseEvents(context, groups);
        }
        else{
            return [];
        }
    }


    private СhooseEvents(context : StoryContext, groups : IGroupsCollection) : Event[]{
        const creator : User = this.random.ElementRandom(context.active) as User;
        const eve : Event = new Event(creator, context.dates);


        //Активный пользователь
        const activeDanger = new EventOption(0.33).AddOptions(
            //БАН РАКА
            new EventOption(1).OfType(EventTypes.Ban).SetCheck((eve, context) => !eve.creator.banned && !eve.creator.IsModer && eve.creator.rak).AddOptions(
                new EventOption(0.34).Info(0.02, "Бан рака", `Забанили рака ${creator.nick}`, () => creator.banned = true),
                new EventOption(0.33).Info(0.05, "Бан активного", `Рак ${creator.nick} агрессивно срачился, но все-таки был забанен`, () => creator.banned = true),
                new EventOption(0.33).Info(0.00, "Рак без бана", `Раку ${creator.nick} чудом удалось избежать бана`)
            ),

            //БАН ПОЛЬЗОВАТЕЛЯ
            new EventOption(0.5).OfType(EventTypes.Ban).SetCheck((eve, context) => !eve.creator.banned && !eve.creator.IsModer && !eve.creator.rak).AddOptions(
                new EventOption(0.34).Info(-0.03, "Злые модеры", `Злобные модераторы забанили ${creator.nick}`, () => creator.banned = true),
                new EventOption(0.33).Info(0.01, "Безумие олдфага", `Олдфагис ${creator.nick} нарывался на бан своим безумством`),
                new EventOption(0.33).Info(0.03, "Восстания против модеров", `${creator.nick} активно восставал против модеров`)
            ),

            //РАЗБАН ПОЛЬЗОВАТЕЛЯ
            new EventOption(1).OfType(EventTypes.Unban).SetCheck((eve, context) => eve.creator.banned && !eve.creator.IsModer && eve.creator.rak).AddOptions(
                new EventOption(0.34).Info(0.01, "Удачный разбан", `Благополучно разбанили ${creator.nick}`, () => creator.banned = false),
                new EventOption(0.33).Info(0.02, "Разбан юзера с разборками", `${creator.nick} с ором и проклятиями вытребовал разбана у админов`, () => creator.banned = false),
                new EventOption(0.33).Info(-0.01, "Неудачный разбан юзера", `Забаненый ${creator.nick} хотел добиться разбана, но не вышло`)
            ),

            //РАЗБАН РАКА
            new EventOption(1).OfType(EventTypes.Unban).SetCheck((eve, context) => eve.creator.banned && !eve.creator.IsModer && !eve.creator.rak).AddOptions(
                new EventOption(0.34).Info(-0.02, "Разбан рака", `К сожалению разбанили ${creator.nick}`, () => creator.banned = false),
                new EventOption(0.33).Info(0.02, "Попытка выбраться из бани", `Рак ${creator.nick} попытался выбраться из бани, но не смог`),
                new EventOption(0.33).Info(-0.01, "Продление бана", `${creator.nick} вследствие своей раковитости добился продления своего бана!`)
            ),

            //БУЙСТВО МОДЕРОВ
            new EventOption(1).OfType(EventTypes.MadModer).SetCheck((eve, context) => !eve.creator.banned && eve.creator.IsModer).AddOptions(
                new EventOption(0.34).Info(-0.04, "Бешеный модер", `Модератор ${creator.nick} бесился и грозил олдфагам их баном.`),
                new EventOption(0.33).Info(-0.03, "Ненависть к модерам", `Модератор ${creator.nick} вызывает всё больше ненависти у юзеров`),
                new EventOption(0.33).Info(-0.03, "Закрытие флудилок", `Модератор ${creator.nick} закрыл кучу флудилок и был весьма доволен этим.`)
            ),

            //РАЗНОЕ
            new EventOption(1).OfType(EventTypes.UserMisc).AddOptions(
                new EventOption(0.34).Info(0.01, "Хвальба мессагами", `Пользователь ${creator.nick} гордится своими сообщениями в размере ${creator.messages} штук.`),
                new EventOption(0.33).Info(-0.01, "Вирус Андрежа", `Юзер ${creator.nick} заразился вирусом Андрежа.`),
                new EventOption(0.33).Info(-0.03, "Майнкрафтмания", `Пользователь ${creator.nick} основал манию на майнкрафт.`)
            ),
        );
        const activeSafe = new EventOption(0.67).AddOptions(
            //УХОД
            new EventOption(0.4).OfType(EventTypes.UserLeave).AddOptions(
                new EventOption(1).SetCheck((eve, context) => this.random.CheckChance(eve.creator.chanceToLeave)).AddOptions(
                    new EventOption(0.5).Info(-0.03, "Незаметный уход", `С Румайна по-тихому ушел ${creator.nick}.`, () => creator.active = false),
                    new EventOption(0.5).Info(-0.05, "Громкий уход", `Юзер ${creator.nick} свалил с румайна после гигантского срача.`, () => creator.active = false)
                ),
                new EventOption(1).Info(0.01, "Неудавшийся уход", `${creator.nick} заявил во всеуслышанье, что не хочет уходить с румайна.`)
            ),

            //ИЗМЕНЕНИЕ ПОЛЬЗОВАТЕЛЯ
            new EventOption(0.2).OfType(EventTypes.UserChange).AddOptions(
                new EventOption(1).SetCheck((eve, context) => this.random.CheckChance(eve.creator.chanceToChange)).AddOptions(
                    new EventOption(1).Info(-0.04, "Скатился", `${creator.nick} стал раком.`, () => creator.rak = true)
                        .SetCheck((eve, context) => !eve.creator.rak),
                    new EventOption(1).Info(-0.04, "Скатился", `Модератор ${creator.nick} явно начал скатываться.`)
                        .SetCheck((eve, context) => !eve.creator.rak && eve.creator.IsModer),
                    new EventOption(1).Info(0.03, "Модер из пучины рака", `Модератор ${creator.nick} вылез из пучины рака.`, () => creator.rak = false)
                        .SetCheck((eve, context) => eve.creator.rak && eve.creator.IsModer),
                    new EventOption(1).Info(0.04, "Возврат из раков", `Стал адекватом ${creator.nick}.`, () => creator.rak = false)
                        .SetCheck((eve, context) => eve.creator.rak),
                ),
                new EventOption(1).AddOptions(
                    new EventOption(1).Info(0.02, "Срач", `${creator.nick} провел хороший срач.`)
                        .SetCheck((eve, context) => context.activity.pages >= 15),
                    new EventOption(1).Info(-0.02, "Нытье", `Юзер ${creator.nick} ноет про активность (${context.activity.pages} страниц)`)
                        .SetCheck((eve, context) => context.activity.pages < 15),
                )
            ),

            //ДН ДД
            new EventOption(0.2).OfType(EventTypes.Celebration).AddOptions(
                new EventOption(0.2).SetCheck((eve, context) => context.activity.pages > 20).AddOptions(
                    new EventOption(0.5).Info(0.08, "ДД", `${creator.nick} провел День Добра!`),
                    new EventOption(0.5).Info(0.08, "ДН", `${creator.nick} провел День Насвая!`)
                ),
                new EventOption(1).Info(-0.03, "Тщеславие", `У пользователя ${creator.nick} попытка основать День в Свою честь провалилась.`)
            ),


            //ПОЛУЧЕНИЕ ГРУППЫ
            new EventOption(0.2).OfType(EventTypes.Group).AddOptions(
                new EventOption(0.5).Info(0.01, "Повышение", `Пользователь ${creator.nick} получил новую группу (была ${creator.group.name})!`,
                 () => {
                      const newGroup = groups.changer.Upgrade(creator.group);
                     if(newGroup !== null){
                         creator.group = newGroup;
                        }
                     }),
                new EventOption(0.5).Info(-0.005, "Понижение", `Пользователь ${creator.nick} понижен! Прежде он был ${creator.group.name}!`,
                 () => { 
                    const newGroup = groups.changer.Downgrade(creator.group);
                   if(newGroup !== null){
                       creator.group = newGroup;
                      } }
            )),

            //РАЗНОЕ
            new EventOption(0.18).OfType(EventTypes.UserMisc).AddOptions(
                new EventOption(0.34).Info(0.01, "Хвальба группой", `Пользователь ${creator.nick} явно хотел обратить внимание на свою группу - ${creator.group.name}.`),
                new EventOption(0.33).Info(0.03, "В ударе", `Юзер ${creator.nick} в ударе!`),
                new EventOption(0.33).Info(0.01, "Мечты о группе", `Пользователь ${creator.nick} мечтает о новой группе.`),
            ),
        );

        const active = new EventOption()
            .Info(0, "Активный пользователь", "")
            .SetCheck((eve, context) => eve.creator.active)
            .OfType(EventTypes.UserActive)
            .AddOptions(activeDanger, activeSafe);
        //---


        //Неактивный пользователь
        const inactiveThink = new EventOption(0.5).AddOptions(
            new EventOption().SetCheck((eve, context) => eve.creator.IsModer && !eve.creator.rak).AddOptions(                    
                new EventOption(1).Info(-0.02, "Неактивный модер", `Пользователи недобрым словом поминали неактивного модера ${creator.nick} с модера`),    
                new EventOption(1).Info(-0.02, "Зря ушедший модер", `Юзеры с грустью вспоминают ушедшего модера ${creator.nick}!`),
            ),
            new EventOption().SetCheck((eve, context) => eve.creator.IsModer && eve.creator.rak).AddOptions(                    
                new EventOption(1).Info(-0.01, "Воспоминания о раке-модере", `Пользователи рады тому, что неадекватный модератор ${creator.nick} больше не проявляет себя`),    
                new EventOption(1).Info(-0.02, "Труп не отдает модера", `Юзеры с ором и восстаниями требуют снять умершего неадеквата ${creator.nick} с модера`),
            ),
            new EventOption().Info(0.01, "Радость от ухода", `В флудилке радовались уходу ${creator.nick}`),
        );
        const inactiveReturn = new EventOption(0.25).Info(-0.03, "Возвращение пользователя", `Пользователь ${creator.nick} вернулся на сайт!`, () => creator.active = true);
        const inactiveMemories = new EventOption(0.25).Info(-0.01, "Воспоминания", `В флудилке вспоминали ушедшего ${creator.nick}`);
        
        //----
        const inactive = new EventOption()
            .OfType(EventTypes.InactiveUser)
            .Info(0, "Неактивный пользователь", "")
            .SetCheck((eve, context) => !eve.creator.active)
            .AddOptions(inactiveThink, inactiveReturn, inactiveMemories);

        const mainChoice = new EventOption(1).Info(0, "Событие", "Нет описания").AddOptions(active, inactive);
        mainChoice.Invoke(this.random, eve, context);

        return [eve];
    }
}

export class KnanepNewsEvents implements IEventCreator, IRsConfig{
    random : Random;
    public ChanceFor(pages : number) : number{
        return 1;
    }
    constructor(random : Random){
        this.random = random;
    }
    
    public Create(context : StoryContext, groups : IGroupsCollection) : Event[]{
        if(context.active.length > 0){
            const rndUser : User = this.random.ElementRandom(context.active);
            return [
                new Event(rndUser, context.dates).SetInfluence(0).SetType(EventTypes.Newspaper)
                .SetInfo(`Газета ${rndUser.nick}`,`Газета ${rndUser.nick}: сегодня ничего не произошло.`)
            ];
        }
        else{
            return [];
        }
    }
}
