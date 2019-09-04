
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import fs from 'fs';

import Scene from 'telegraf/scenes/base';
import { leave } from 'telegraf/stage';

import { rollDice } from '../../game/utils';

import db from '../../bd';
import { createContext } from 'vm';

function atac(a, b) {

}

export function encounterScene() {
    const encounterScene = new Scene('encounterScene');

    encounterScene.enter((ctx) => {
        const encounter = ctx.session.encounter;

        console.log(encounter);
    
        if (!!encounter.actions) {
            ctx.reply(encounter.description, Markup.keyboard(encounter.actions).extra());
        } else {
            ctx.reply(encounter.description);
        }
    });

    encounterScene.hears('Attack', (ctx) => {
        const game = ctx.session.game,
            encounter = ctx.session.encounter;

        const monster1 = encounter.monsters[0].individuals[0],
            character = game.character;


        const playerAttack = rollDice("1D100") < (character.stats.str*2) - (monster1.stats.dex/5);
        if (playerAttack) {
            const damage = rollDice("1D6") + 1;
            monster1.status.life -= damage;

            ctx.reply(`${character.name} does ${damage} points of damage to ${monster1.name}`).then(() => {
                if ( monster1.status.life <= 0 ) {
                    encounter.monsters[0].individuals.pop();
                    ctx.reply(`${character.name} kills ${monster1.name}`);
                }
            });
        } else {
            ctx.reply(`${character.name} doesnt do damage to ${monster1.name}`);
        }
        
        encounter.monsters[0].individuals.forEach((monster) => {
            const monsterAttack = rollDice("1D100") < (monster.stats.str*2) - (character.stats.dex/5);

            if (monsterAttack ) {
                const damage = rollDice("1D3") + 1;
                character.status.life -= damage;
    
                ctx.reply(`${monster.name} does ${damage} points of damage to ${character.name}`).then(() => {
                    if ( character.status.life <= 0 ) {
                        ctx.reply(`${monster.name} kills ${character.name}`);
                    }
                })
                
            } else {
                ctx.reply(`${monster.name} doesnt do damage to ${character.name}`);
            }
        });

        encounter.description = 'The goblins have a desire to kill you';
        encounter.actions = ['Attack', 'Leave'];

        ctx.session.game = game,
        ctx.session.encounter = encounter;
        db.update({playerId: game.playerId}, game).then

        ctx.scene.reenter();
    });

    encounterScene.hears('Sneak & Steal', (ctx) => {
        const game = ctx.session.game,
            encounter = ctx.session.encounter;

        console.log("sneaking");
        ctx.reply("Seanking", Markup.removeKeyboard().extra());

        return leave();
    });

    encounterScene.hears('Leave', (ctx) => {
        const game = ctx.session.game,
            encounter = ctx.session.encounter;

        console.log("you leave the premises without being noticed");
        ctx.reply("You leave the premises without being seen", Markup.removeKeyboard().extra());

        return leave();
    });

    
    return encounterScene;
};