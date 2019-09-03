import { getRandomMap } from './map';
import { SIZE } from '../../constants';
import db from '../../bd';

const NORTH = 'North';
const SOUTH = 'South';
const EAST = 'East';
const WEST = 'West';

export function initializeWorld() {
    return {
        position: {
            x: 0,
            y: 0
        },
        map: getRandomMap()
    };
}

export function getMovements(game) {
    const movements = [];

    game.world.position.x != 0 && movements.push(NORTH);
    game.world.position.x != (SIZE-1) && movements.push(SOUTH);
    game.world.position.y != 0 && movements.push(WEST);
    game.world.position.y != (SIZE-1) && movements.push(EAST);

    return movements;
}

export function moveCharacter(direction, game) {
    direction == NORTH && game.world.position.x--;
    direction == SOUTH && game.world.position.x++;
    direction == WEST && game.world.position.y--;
    direction == EAST && game.world.position.y++;

    game.world.map[game.world.position.x][game.world.position.y].visited = true;

    db.update({playerId: game.playerId}, game);
}