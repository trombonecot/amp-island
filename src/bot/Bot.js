import Telegraf from 'telegraf';
import { leave } from 'telegraf/stage';
import { options } from './options';
import session  from 'telegraf/session';
import { addCharacterWizard } from './actions/characters';
import { moveScene } from './actions/map';
import { encounterScene } from './actions/encounters';

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

            db.findOne( { playerId: ctx.from.id }).then((game) => {
                ctx.session.game = game;
            });
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
            moveScene(),
            encounterScene()], { ttl: 10 }
        );

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