import { printCharacter, add, inventory } from '../actions/characters';
import { move } from '../actions/world';

export const options = [
    {
        name: "new",
        type: "command",
        description: "New Character",
        action: add
    },
    {
        name: "stats",
        type: "command",
        description: "See Current Character",
        action: printCharacter
    },
    {
        name: "move",
        type: "command",
        description: "See Current Character",
        action: move
    },
    {
        name: "inventory",
        type: "command",
        description: "See Current Character",
        action: printCharacter
    }
];