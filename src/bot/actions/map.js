
import Markup from 'telegraf/markup';
import Scene from 'telegraf/scenes/base';
import { leave } from 'telegraf/stage';

import db from '../../bd';
import fs from 'fs';
import { SIZE } from '../../constants.js';
import { moveCharacter, getMovements } from '../../game/world';
import { generateEncounter } from '../../game/world/encounters';


export function moveScene() {
    const moveScene = new Scene('moveScene');

    moveScene.enter((ctx) => {
            const game = ctx.session.game;
            const terrainName = game.world.map[game.world.position.x][game.world.position.y].name;
            
            ctx.reply(`You are currently in a ${terrainName}. Where do you want to go?`, Markup.keyboard(getMovements(game)).extra()).then(() => {
                seeMap(ctx);
            });
    });

    moveScene.on('message', (ctx) => {
        const game = ctx.session.game;

        moveCharacter(ctx.message.text, game);

        const tile = game.world.map[game.world.position.x][game.world.position.y];

        ctx.replyWithPhoto(
            {source: fs.createReadStream(`src/resources/terrain/${tile.terrain}/${tile.picture}.jpg`),},
            Object.assign( 
                Markup.removeKeyboard().extra(),
                { caption: `You arrive to ${tile.name} ${tile.terrain}.` }
            )
            
        ).then(() => {
            ctx.session.encounter = generateEncounter(game);
            ctx.scene.enter('encounterScene');
        });
        

        return leave();
    });
    
    return moveScene;
};

export function seeMap(ctx) {
    db.findOne( { playerId: ctx.from.id }).then((game) => {
        let map = '';
        for(let i=0; i<SIZE; i++) {
            for(let j=0; j<SIZE; j++) {

                const terrain = game.world.map[i][j].terrain == 'woods' ? '🌳' : '🏕️'; 

                if (game.world.position.x == i && game.world.position.y == j) {
                    map += '🚶';
                } else {
                    map += !!game.world.map[i][j].visited ? terrain : '❓';
                }
            }
            map += '\n';
        }

        ctx.reply(map);
    });
}

export function move(ctx) {
    db.findOne( { playerId: ctx.from.id }).then((game) => {
        ctx.session.game = game
        ctx.scene.enter('moveScene', game);
    });
}