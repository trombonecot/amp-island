import Telegraf from 'telegraf';
import { options } from './options';
import session  from 'telegraf/session';
import { addCharacterWizard } from './actions/characters';
import { moveWizard } from './actions/map';
import { encounterWizard } from './actions/encounters';

import Stage from 'telegraf/stage';

class Bot {

    constructor( token ) {
        this.bot = new Telegraf(token);
    }

    configure() {
        this.configureWizards();
        
        this.bot.start((ctx) => {
            ctx.reply('Welcome to Amp Island RPG!');
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

    configureWizards() {
        const stage = new Stage([
            addCharacterWizard(), 
            moveWizard(), 
            encounterWizard()], { ttl: 10 });

        this.bot.use(session());
        this.bot.use(stage.middleware())
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