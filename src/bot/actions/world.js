import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import fs from 'fs';

export function encounterWizard() {
    let game = {};

    const encounterWizard = new WizardScene('encounter',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                const terrain = game.world.map[game.world.position.x][game.world.position.y].terrain,
                    movements = [];

                game.world.position.y != 0 && movements.push('North');
                game.world.position.y != 3 && movements.push('South');
                game.world.position.x != 0 && movements.push('West');
                game.world.position.x != 3 && movements.push('East');

                ctx.reply(`You are currently in a ${terrain}. Where do you want to go?`, Markup.keyboard(movements).extra());
           });

           return ctx.wizard.next()
        },
        (ctx) => {
            const direction = ctx.message.text;
            
            direction == 'North' && game.world.position.y--;
            direction == 'South' && game.world.position.y++;
            direction == 'West' && game.world.position.x--;
            direction == 'East' && game.world.position.x++;

        
                console.log(game.world.position);
                db.update({playerId: ctx.from.id}, game);

                const tile = game.world.map[game.world.position.x][game.world.position.y];

                ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/terrain/${tile.terrain}/${tile.picture}.jpg`) });

                ctx.reply(`You arrive to a ${tile.terrain}.`, Markup.removeKeyboard().extra());
                ctx.scene.enter('encounter');

                return ctx.scene.leave();
        }
    );

    return encounterWizard;
}

export function moveWizard() {
    let game = {};

    const moveWizard = new WizardScene('move-character',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                const terrain = game.world.map[game.world.position.x][game.world.position.y].terrain,
                    movements = [];

                game.world.position.y != 0 && movements.push('North');
                game.world.position.y != 3 && movements.push('South');
                game.world.position.x != 0 && movements.push('West');
                game.world.position.x != 3 && movements.push('East');

                ctx.reply(`You are currently in a ${terrain}. Where do you want to go?`, Markup.keyboard(movements).extra());
           });

           return ctx.wizard.next()
        },
        (ctx) => {
            const direction = ctx.message.text;
            
            direction == 'North' && game.world.position.y--;
            direction == 'South' && game.world.position.y++;
            direction == 'West' && game.world.position.x--;
            direction == 'East' && game.world.position.x++;

        
                console.log(game.world.position);
                db.update({playerId: ctx.from.id}, game);

                const tile = game.world.map[game.world.position.x][game.world.position.y];

                ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/terrain/${tile.terrain}/${tile.picture}.jpg`) });

                ctx.reply(`You arrive to ${tile.name} ${tile.terrain}.`, Markup.removeKeyboard().extra());
                ctx.scene.enter('encounter');

                return ctx.scene.leave();
        }
    );

    return moveWizard;
}

export function move(ctx) {
    ctx.scene.enter('move-character')
}