import Datastore from 'nedb-promises';

const db = new Datastore({filename: 'database', autoload: true});

export default db;