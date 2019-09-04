import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import { initializeWorld } from '../../game/world';
import { intializeCharacter } from '../../game/characters';
import fs from 'fs';

function printPortait(ctx, c) {
    ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/${c.race}-${c.gender}.jpg`) });
}

function createGame(character, userId) {
    const game = {
        character: intializeCharacter(character),
        world: initializeWorld(),
        playerId: userId
    };

    console.log(game);

    db.insert(game);
}

export function printCharacter(ctx) {
    db.findOne( { playerId: ctx.from.id }).then((game) => {
        const c = game.character;
        const sheet = `Name: ${c.name}\n` +
                `Race: ${c.race}\n` +
                `Gender: ${c.gender}\n` +
                `Stamina: ${c.status.life}/${c.stats.stamina}\n` +
                `Strength: ${c.stats.str}\n` +
                `Dextrety: ${c.stats.dex}\n` +
                `Inteligence: ${c.stats.int}\n` +
                `Level: ${c.status.level} (${c.status.xp})\n`;

        ctx.reply(sheet);
        printPortait(ctx, c);
    });
}

export function addCharacterWizard() {
    let character = {};

    const addWizard = new WizardScene('add-character',
        (ctx) => {
           db.findOne( { playerId: ctx.from.id }).then((game) => {
               if (game != null) {
                    ctx.reply(`You cannot create a new adventurer, as you are playing with ${game.character.name}`);
                    return ctx.scene.leave()
               } else {
                    character = {};
                    ctx.reply('New Adventurer.\nChoose name:');
                    return ctx.wizard.next()
               }
           })
        },
        (ctx) => {
            character.name = ctx.message.text;
            character.id = ctx.message.text.toLowerCase();

            ctx.reply('Choose gender.', Markup.keyboard(['male', 'female']).extra());
            return ctx.wizard.next()
        },
        (ctx) => {
            character.gender = ctx.message.text;

            ctx.reply('Choose race.', Markup.keyboard(['human', 'ash', 'dwarf']).extra());
            return ctx.wizard.next()
        },
        (ctx) => {
            character.race = ctx.message.text;

            createGame(character, ctx.from.id);

            ctx.reply('Character created!');
            ctx.reply(`Welcome to AMP Island, ${character.name}\nSTR:${character.stats.str}\nDEX:${character.stats.dex}\nINT:${character.stats.int}`, Markup.removeKeyboard().extra());

            printPortait(ctx, character);
            return ctx.scene.leave()
        }
    );

    return addWizard;
}

export function add(ctx) {
    ctx.scene.enter('add-character')
}