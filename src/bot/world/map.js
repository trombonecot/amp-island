import { getRandomInt } from './utils.js';
import { uniqueNamesGenerator } from 'unique-names-generator';
import { SIZE } from '../../constants';

export function getRandomMap() {
    let matrix = [];
    for(let i=0; i<SIZE; i++) {
        matrix[i] = new Array(SIZE);

        for(let j=0; j<SIZE; j++) {
            matrix[i][j] = {
                terrain: getRandomInt(0,1) == 0 ? 'woods' : 'plains',
                picture: getRandomInt(1,5),
                name: uniqueNamesGenerator({ separator: ' ', length: 2 })
            }
        }
    }

    return matrix;
}

