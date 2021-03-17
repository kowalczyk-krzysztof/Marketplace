import express, { Router } from 'express';

import {
  getRootCategories,
  getCategory,
  getPathToRoot,
  getDirectChildren,
} from '../controllers/categories';

const categoryRouter: Router = express.Router();

categoryRouter.route('/roots').get(getRootCategories);
categoryRouter.route('/category/find/:id').get(getCategory);
categoryRouter.route('/category/root/').get(getPathToRoot);
categoryRouter.route('/category/children/:id').get(getDirectChildren);
export default categoryRouter;
