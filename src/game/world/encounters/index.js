import { getRandomInt, rollDice } from '../../utils';
import ENCOUNTERS from './encounters.json';
import MONSTERS from './monsters.json';

export function generateEncounter(game) {
    const rand = getRandomInt(0,1),
        encounter = ENCOUNTERS['1'][rand];

    if (!!encounter.monsters) {
        encounter.monsters.forEach(monster => {
            monster.individuals = [];

            for (let i=0; i<rollDice(monster.num);i++) {
                monster.individuals.push(MONSTERS[monster.race]);
            };
        });
    }
 
    return encounter;
}