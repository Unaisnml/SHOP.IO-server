import express from 'express'
import { createProducts } from '../controllers/productController';

const router = express.Router();

router.post('/products', createProducts)