import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Sakura backend listening at http://localhost:${config.port}`);
});
