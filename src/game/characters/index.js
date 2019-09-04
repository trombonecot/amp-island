import { getRandomInt } from '../utils';

export function getRandomStats(race) {

    let stats = {};

    stats.str = getRandomInt(20,40) + getRandomInt(1,10) + getRandomInt(1,6);
    stats.dex = getRandomInt(20,40) + getRandomInt(1,10) + getRandomInt(1,6);
    stats.int = getRandomInt(20,40) + getRandomInt(1,10) + getRandomInt(1,6);
    stats.stamina = stats.str/3 + stats.dex;

    if ( race == 'ash' ) {
        stats.int += getRandomInt(5,10);
        stats.str -= getRandomInt(5,10);
    } else if ( race == 'dwarf' ) {
        stats.str += getRandomInt(5,10);
        stats.dex -= getRandomInt(5,10);
    }

    return stats;
}

export function intializeCharacter(character) {
    character.stats = getRandomStats(character.race);
    character.status = {
        life: character.stats.stamina,
        xp: 0,
        level: 1
    };

    return character;
}
