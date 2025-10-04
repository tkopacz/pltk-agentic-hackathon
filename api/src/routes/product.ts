/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * 
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

import express from 'express';
import { Product } from '../models/product';
import { products as seedProducts } from '../seedData';

const router = express.Router();

let products: Product[] = [...seedProducts];

export const resetProducts = () => {
  products = [...seedProducts];
};

const parseProductId = (value: string) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const validateProductPayload = (payload: any): string[] => {
  const errors: string[] = [];
  if (typeof payload !== 'object' || payload === null) {
    errors.push('Payload must be an object');
    return errors;
  }

  const requiredFields: Array<keyof Product> = [
    'productId',
    'supplierId',
    'name',
    'description',
    'price',
    'sku',
    'unit',
    'imgName'
  ];

  requiredFields.forEach((field) => {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      errors.push(`${field} is required`);
    }
  });

  if (payload.price !== undefined && typeof payload.price !== 'number') {
    errors.push('price must be a number');
  }

  if (payload.productId !== undefined && typeof payload.productId !== 'number') {
    errors.push('productId must be a number');
  }

  if (payload.supplierId !== undefined && typeof payload.supplierId !== 'number') {
    errors.push('supplierId must be a number');
  }

  return errors;
};

// Create a new product
router.post('/', (req, res) => {
  const validationErrors = validateProductPayload(req.body);
  if (validationErrors.length) {
    res.status(422).json({ errors: validationErrors });
    return;
  }

  const newProduct: Product = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Get all products
router.get('/', (_req, res) => {
  res.json(products);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    res.status(400).send('Invalid product ID');
    return;
  }

  const product = products.find((p) => p.productId === id);
  if (product) {
    res.json(product);
    return;
  }

  res.status(404).send('Product not found');
});

// Update a product by ID
router.put('/:id', (req, res) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    res.status(400).send('Invalid product ID');
    return;
  }

  if (req.body?.productId !== id) {
    res.status(400).send('Product ID in path and body must match');
    return;
  }

  const validationErrors = validateProductPayload(req.body);
  if (validationErrors.length) {
    res.status(422).json({ errors: validationErrors });
    return;
  }

  const index = products.findIndex((p) => p.productId === id);
  if (index !== -1) {
    products[index] = req.body;
    res.json(products[index]);
    return;
  }

  res.status(404).send('Product not found');
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    res.status(400).send('Invalid product ID');
    return;
  }

  const index = products.findIndex((p) => p.productId === id);
  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send();
    return;
  }

  res.status(404).send('Product not found');
});

export default router;
