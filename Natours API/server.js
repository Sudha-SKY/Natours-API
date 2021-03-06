//db configurations, env variable, error handling comes in this file

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
// console.log(process.env);

// START SERVER
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
