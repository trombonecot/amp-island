
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import fs from 'fs';

import db from '../../bd';
import { generateEncounter } from '../../game/world/encounters';

function processAction(action) {
    if (action === 'Attack') {
        ctx.reply('Yuo atack!');
    } else if ( action === 'Sneak & Steal') {
        ctx.reply('You sneak into camp.');
    } else if ( action === 'Leave') {
        ctx.reply('You leave the location without being seen.');
    } else {
        ctx.wizard.back()
    }
}

export function encounterWizard() {
    let game = {},
        encounter = null;

    const encounterWizard = new WizardScene('encounter',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                encounter = generateEncounter(game);

                if (!!encounter.monsters) {
                    ctx.reply(encounter.description, Markup.keyboard(encounter.actions).extra());
                } else {
                    ctx.reply(encounter.description);
                }
           });

           return ctx.wizard.next()
        },
        (ctx) => {
            const action = ctx.message.text;

            processAction(action, encounter);

            return ctx.scene.leave();
        }
    );

    return encounterWizard;
}

export function move(ctx) {
    ctx.scene.enter('move-character')
}