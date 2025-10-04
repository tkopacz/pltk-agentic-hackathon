import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 99,
            name: 'Galaxy Cat Supplies Co.',
            description: 'High-tech cat gear from outer space.',
            contactPerson: 'Luna Starsong',
            email: 'luna@galaxycat.co',
            phone: '555-0199'
        };

        const response = await request(app).post('/suppliers').send(newSupplier);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedSuppliers.length);
        response.body.forEach((supplier: any, index: number) => {
            expect(supplier).toMatchObject(seedSuppliers[index]);
        });
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'PurrTech Innovations Unlimited',
            supplierId: 1
        };

        const response = await request(app).put('/suppliers/1').send(updatedSupplier);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedSupplier);
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');

        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');

        expect(response.status).toBe(404);
    });

    it('should return 400 for malformed supplier ID', async () => {
        const response = await request(app).get('/suppliers/invalid-id');

        expect(response.status).toBe(400);
    });

    it('should return 400 when supplier ID in body does not match path', async () => {
        const mismatchedSupplier = {
            ...seedSuppliers[0],
            supplierId: 2
        };

        const response = await request(app).put('/suppliers/1').send(mismatchedSupplier);

        expect(response.status).toBe(400);
    });

    it('should return 422 for invalid supplier payload', async () => {
        const response = await request(app).post('/suppliers').send({});

        expect(response.status).toBe(422);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });
});