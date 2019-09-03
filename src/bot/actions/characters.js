import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import db from '../../bd';
import { getRandomMap } from '../world/map';
import { getRandomStats } from '../world/characters';
import fs from 'fs';

export function printCharacter(ctx) {
    db.findOne( { playerId: ctx.from.id }).then((game) => {
        const c = game.character;
        const sheet = `Name: ${c.name}\n` +
                `Race: ${c.race}\n` +
                `Stamina: ${c.status.life}/${c.stats.stamina}\n` +
                `Strength: ${c.stats.str}\n` +
                `Dextrety: ${c.stats.dex}\n` +
                `Inteligence: ${c.stats.int}\n`;

        ctx.reply(sheet);
    });
}

export function addCharacter() {
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
            character.stats = getRandomStats(character.race);
            character.status = {
                life: character.stats.stamina,
                xp: 0,
                level: 1
            };
            const game = {
                character,
                world: {
                    position: {
                        x: 0,
                        y: 0
                    },
                    map: getRandomMap(3)
                },
                playerId: ctx.from.id
            }

            db.insert(game);
            ctx.session.game = game;
            ctx.reply('Character created!');
            ctx.reply(`Welcome to AMP Island, ${character.name}\nSTR:${character.stats.str}\nDEX:${character.stats.dex}\nINT:${character.stats.int}`, Markup.removeKeyboard().extra());

            ctx.replyWithPhoto({ source: fs.createReadStream(`src/resources/${character.race}-${character.gender}.jpg`) });
            return ctx.scene.leave()
        }
    );

    return addWizard;
}

export function add(ctx) {
    ctx.scene.enter('add-character')
}