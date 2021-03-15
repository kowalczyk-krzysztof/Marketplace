import express, { Router } from 'express';

import {
  getCategories,
  getCategory,
  getPathToRoot,
} from '../controllers/categories';

const categoryRouter: Router = express.Router();

categoryRouter.route('/list').get(getCategories);
categoryRouter.route('/category/find/:id').get(getCategory);
categoryRouter.route('/category/root/:id').get(getPathToRoot);
export default categoryRouter;
