import express, { Router } from 'express';
import {
  getCategories,
  getProductsFromCategory,
} from '../controllers/categories';

const categoryRouter: Router = express.Router();

categoryRouter.route('/list').get(getCategories);
categoryRouter.route('/category/:id').get(getProductsFromCategory);
export default categoryRouter;
