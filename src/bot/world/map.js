import { getRandomInt } from './utils.js';

export function getRandomMap(size) {
    let matrix = [];
    for(let i=0; i<size; i++) {
        matrix[i] = new Array(size);

        for(let j=0; j<size; j++) {
            matrix[i][j] = {
                terrain: getRandomInt(0,1) == 0 ? 'w' : 'p'
            }
        }
    }

    return matrix;
}

