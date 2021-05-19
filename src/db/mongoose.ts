import * as mongoose from 'mongoose';
export const dbURL = 'mongodb://127.0.0.1:27017';
export const dbName = 'LunaRosa-bbdd';

mongoose.connect(`${dbURL}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to the database.');
}).catch(() => {
  console.log('Something went wrong when conecting to the database.');
});
