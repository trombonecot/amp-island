import Datastore from 'nedb-promises';

const db = new Datastore({filename: 'database', autoload: true});

db.ensureIndex({fieldName: 'playerId', unique: true});

export default db;