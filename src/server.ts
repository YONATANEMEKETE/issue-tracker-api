import { config } from './shared/configs/env.js';
import { app } from './app.js';

app.listen(config.PORT, () => {
  console.log(
    `Server is running on port ${config.PORT}, http://localhost:${config.PORT}`,
  );
});
