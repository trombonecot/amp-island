
import { sayHi, sayQtal, getAll } from '../actions';
import { add } from '../actions/add';

export const options = [
    {
        name: "sticker",
        type: "on",
        description: "Send an sticker and i'll answer",
        action: sayQtal
    },
    {
        name: "hi",
        type: "hears",
        description: "Say hi and i'll reply",
        action: sayHi
    },
    {
        name: "new",
        type: "command",
        description: "New Character",
        action: add
    },
    {
        name: "get",
        type: "command",
        description: "Veure tots els restaurants",
        action: getAll
    }
];