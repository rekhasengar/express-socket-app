import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import { isProduction } from '@src/config';

const v1Router = Router();

const extension = isProduction ? 'js' : 'ts';

/* Routes */
fs.readdirSync(path.resolve(__dirname, '.')).forEach(async (file) => {
  if (file.includes(`.${extension}`) && !file.includes(`.${extension}.`) && !file.includes(`index.${extension}`)) {
    console.log(file);
    const { router, basePath } = require(`./${file}`);
    v1Router.use(`/v1/${basePath}`, router);
  }
});

export default v1Router;
