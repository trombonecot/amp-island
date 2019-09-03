import db from '../../bd';


export function sayHi(ctx) {
    ctx.reply(`hi man ${ctx.from.first_name}!`);
}

export function sayQtal(ctx) {
    ctx.reply(`hey, q tal ${ctx.from.first_name}?`);
}

export function getAll(ctx) {
    db.find().then((restaurants) => {
        let msg = '';
        for (let i = 0, len = restaurants.length; i < len; i++) {
            let restaurant = restaurants[i];
            msg += `${restaurant.title}: ${restaurant.nota} (${restaurant.user.first_name})\n`;
        }

        ctx.reply(msg);
    });
}