import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import fs from 'fs';

import { SIZE } from '../../constants.js'

import { getRandomInt } from '../world/utils.js';

function getRandomEnounter(game) {

    const dice = getRandomInt(0, 100);

    switch(dice){
        case 99-95:
            console.log("");
    }
}

export function encounterWizard() {
    let game = {};

    const encounterWizard = new WizardScene('encounter',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                const text = `You arrive to the ${name}`;

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

                game.world.position.x != 0 && movements.push('North');
                game.world.position.x != 2 && movements.push('South');
                game.world.position.y != 0 && movements.push('West');
                game.world.position.y != 2 && movements.push('East');

                ctx.reply(`You are currently in a ${terrain}. Where do you want to go?`, Markup.keyboard(movements).extra());
           });

           return ctx.wizard.next()
        },
        (ctx) => {
            const direction = ctx.message.text;
            
            direction == 'North' && game.world.position.x--;
            direction == 'South' && game.world.position.x++;
            direction == 'West' && game.world.position.y--;
            direction == 'East' && game.world.position.y++;

            game.world.map[game.world.position.x][game.world.position.y].visited = true;

            db.update({playerId: ctx.from.id}, game);

            const tile = game.world.map[game.world.position.x][game.world.position.y];

            ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/terrain/${tile.terrain}/${tile.picture}.jpg`) });

            ctx.reply(`You arrive to ${tile.name} ${tile.terrain}.`, Markup.removeKeyboard().extra());
            //ctx.scene.enter('encounter');

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