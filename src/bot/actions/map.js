import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import fs from 'fs';
import { SIZE } from '../../constants.js';
import { moveCharacter, getMovements } from '../../game/world';

export function moveWizard() {
    let game = {};

    const moveWizard = new WizardScene('move-character',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                const terrain = game.world.map[game.world.position.x][game.world.position.y].terrain,
                    movements = [];

                

                ctx.reply(`You are currently in a ${terrain}. Where do you want to go?`, Markup.keyboard(getMovements(game)).extra());
           });

           return ctx.wizard.next()
        },
        (ctx) => {
            moveCharacter(ctx.message.text, game);

            const tile = game.world.map[game.world.position.x][game.world.position.y];

            ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/terrain/${tile.terrain}/${tile.picture}.jpg`) });

            ctx.reply(`You arrive to ${tile.name} ${tile.terrain}.`, Markup.removeKeyboard().extra());
            ctx.scene.enter('encounter');

            return ctx.scene.leave();
        }
    );

    return moveWizard;
}

export function seeMap(ctx) {
    db.findOne( { playerId: ctx.from.id }).then((game) => {
        let map = '';
        for(let i=0; i<SIZE; i++) {
            for(let j=0; j<SIZE; j++) {

                const terrain = game.world.map[i][j].terrain == 'woods' ? '🌳' : '🏕️'; 
                const name = !!game.world.map[i][j].visited ? game.world.map[i][j].name + terrain : '?';
                map += ' | ' + name;
            }
            map += '\n';
        }

        ctx.reply(map);
    });
}

export function move(ctx) {
    ctx.scene.enter('move-character')
}