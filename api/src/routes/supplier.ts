/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 * 
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */

import express from 'express';
import { Supplier } from '../models/supplier';
import { suppliers as seedSuppliers } from '../seedData';
import { withSupplierObservability } from '../observability/supplierObservability';

const router = express.Router();

let suppliers: Supplier[] = [...seedSuppliers];

export const resetSuppliers = () => {
    suppliers = [...seedSuppliers];
};

const parseSupplierId = (value: string) => {
    const id = parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const validateSupplierPayload = (payload: any): string[] => {
    const errors: string[] = [];
    if (typeof payload !== 'object' || payload === null) {
        errors.push('Payload must be an object');
        return errors;
    }

    if (payload.supplierId === undefined || payload.supplierId === null) {
        errors.push('supplierId is required');
    } else if (typeof payload.supplierId !== 'number') {
        errors.push('supplierId must be a number');
    }

    if (!payload.name) {
        errors.push('name is required');
    }

    return errors;
};

// Create a new supplier
router.post('/', withSupplierObservability('create', (req, res) => {
    const validationErrors = validateSupplierPayload(req.body);
    if (validationErrors.length) {
        res.status(422).json({ errors: validationErrors });
        return;
    }

    const newSupplier = req.body as Supplier;
    suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
}));

// Get all suppliers
router.get('/', withSupplierObservability('list', (_req, res) => {
    res.json(suppliers);
}));

// Get a supplier by ID
router.get('/:id', withSupplierObservability('get', (req, res) => {
    const id = parseSupplierId(req.params.id);
    if (id === null) {
        res.status(400).send('Invalid supplier ID');
        return;
    }

    const supplier = suppliers.find(s => s.supplierId === id);
    if (supplier) {
        res.json(supplier);
        return;
    }

    res.status(404).send('Supplier not found');
}));

// Update a supplier by ID
router.put('/:id', withSupplierObservability('update', (req, res) => {
    const id = parseSupplierId(req.params.id);
    if (id === null) {
        res.status(400).send('Invalid supplier ID');
        return;
    }

    if (req.body?.supplierId !== id) {
        res.status(400).send('Supplier ID in path and body must match');
        return;
    }

    const validationErrors = validateSupplierPayload(req.body);
    if (validationErrors.length) {
        res.status(422).json({ errors: validationErrors });
        return;
    }

    const index = suppliers.findIndex(s => s.supplierId === id);
    if (index !== -1) {
        suppliers[index] = req.body;
        res.json(suppliers[index]);
        return;
    }

    res.status(404).send('Supplier not found');
}));

// Delete a supplier by ID
router.delete('/:id', withSupplierObservability('delete', (req, res) => {
    const id = parseSupplierId(req.params.id);
    if (id === null) {
        res.status(400).send('Invalid supplier ID');
        return;
    }

    const index = suppliers.findIndex(s => s.supplierId === id);
    if (index !== -1) {
        suppliers.splice(index, 1);
        res.status(204).send();
        return;
    }

    res.status(404).send('Supplier not found');
}));

export default router;