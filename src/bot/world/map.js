import { getRandomInt } from './utils.js';
import { uniqueNamesGenerator } from 'unique-names-generator';

export function getRandomMap(size) {
    let matrix = [];
    for(let i=0; i<size; i++) {
        matrix[i] = new Array(size);

        for(let j=0; j<size; j++) {
            matrix[i][j] = {
                terrain: getRandomInt(0,1) == 0 ? 'woods' : 'plains',
                picture: getRandomInt(1,5),
                name: uniqueNamesGenerator({ separator: ' ' })
            }
        }
    }

    return matrix;
}

