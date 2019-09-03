import { getRandomInt } from './utils.js';

export function getRandomStats(race) {

    let stats = {};

    stats.str = getRandomInt(1,6) + getRandomInt(1,6) + getRandomInt(1,6);
    stats.dex = getRandomInt(1,6) + getRandomInt(1,6) + getRandomInt(1,6);
    stats.int = getRandomInt(1,6) + getRandomInt(1,6) + getRandomInt(1,6);
    stats.stamina = stats.str*3 + stats.dex;

    if ( race == 'ash' ) {
        stats.int += 3;
        stats.str -= 3;
    } else if ( race == 'dwarf' ) {
        stats.str += 3;
        stats.dex -= 3;
    }

    return stats;
}

