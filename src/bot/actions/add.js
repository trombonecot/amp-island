import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import { getRandomMap } from '../world/map';
import { getRandomStats } from '../world/characters';
import fs from 'fs';



export function addCharacter() {
    let character = {};

    const addWizard = new WizardScene('add-character',
        (ctx) => {
            character = {};
            ctx.reply('New Adventurer. \n Choose name:');
            return ctx.wizard.next()
        },
        (ctx) => {
            character.name = ctx.message.text;
            character.id = ctx.message.text.toLowerCase();

            ctx.reply('Choose race.', Markup.keyboard(['human', 'ash', 'dwarf']).extra());
            return ctx.wizard.next()
        },
        (ctx) => {
            character.race = ctx.message.text;
            character.user = ctx.from;
            character.stats = getRandomStats(character.race);
            character.world = {
                position: {
                    x: 0,
                    y: 0
                },
                map: getRandomMap(3)
            }

            db.insert(character);
            ctx.reply('Character created!', Markup.removeKeyboard().extra());
            ctx.reply(`Welcome to AMP Island, ${character.name}`);
            ctx.reply("STRENGTH: " + character.stats.str);
            ctx.reply("DEXTRETY: " + character.stats.dex);
            ctx.reply("INTELIGENCE: " + character.stats.int);
            ctx.reply("STAMINA: " + character.stats.stamina);

            ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/${character.race}.jpg`) });
            return ctx.scene.leave()
        }
    );

    return addWizard;
}

export function add(ctx) {
    ctx.scene.enter('add-character')
}