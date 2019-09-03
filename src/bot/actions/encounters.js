
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import fs from 'fs';

import db from '../../bd';
import { getRandomInt } from '../../game/utils';

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
            return ctx.scene.leave();
        }
    );

    return encounterWizard;
}

export function move(ctx) {
    ctx.scene.enter('move-character')
}