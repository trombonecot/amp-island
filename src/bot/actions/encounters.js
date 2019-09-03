
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import fs from 'fs';

import db from '../../bd';
import { generateEncounter } from '../../game/world/encounters';

export function encounterWizard() {
    let game = {};

    const encounterWizard = new WizardScene('encounter',
        (ctx) => {

           db.findOne( { playerId: ctx.from.id }).then((g) => {
                game = g;

                const encounter = generateEncounter(game);

                if (!!encounter.monsters) {
                    const actions = ['Atack', 'Sneak & Steal', 'Leave'];
                    ctx.reply(encounter.description, Markup.keyboard(actions).extra());
                } else {
                    ctx.reply(encounter.description);
                }
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