export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollDice(dice) {


    console.log(dice);

    const diceSplitted = dice.split('D'),
        number = diceSplitted[0],
        faces = diceSplitted[1];

    let result = 0;
    for(let i=0;i<number;i++){
        result += getRandomInt(1,faces);
    }

    return result;
}