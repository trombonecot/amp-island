import Telegraf from 'telegraf';
import { options } from './options';
import session  from 'telegraf/session';
import { addCharacter } from './actions/characters';
import { moveWizard, encounterWizard } from './actions/world';
import Stage from 'telegraf/stage';

class Bot {

    constructor( token ) {
        this.bot = new Telegraf(token);
    }

    configure() {
        const stage = new Stage([addCharacter(),moveWizard(), encounterWizard()], { ttl: 10 });

        this.bot.use(session());
        this.bot.use(stage.middleware())
        this.bot.start((ctx) => {
            ctx.reply('Welcome to Amp Island!');
            ctx.scene.enter('add-character');
        });

        this.bot.help((ctx) => ctx.reply(this.getHelpMessage()));

        for (let i = 0, len = options.length; i < len; i++) {
            const option = options[i];

            if ( option.type === 'on' ) {
                this.bot.on(option.name, (ctx) => option.action(ctx));
            } else if ( option.type === 'command' ) {
                this.bot.command(option.name, option.action );
            } else {
                this.bot.hears(option.name, (ctx) => option.action(ctx));
            }
        }   
    }

    getHelpMessage() {
        let heplMessage = "";
        
        for (let i = 0, len = options.length; i < len; i++) {
            let option = options[i];
            heplMessage += `${option.name}: ${option.description}\n`;
        }

        return heplMessage;
    }

    start() {
        this.bot.startPolling();

    }

}

export default Bot;