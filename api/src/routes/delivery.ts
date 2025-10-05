/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 * 
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import express from 'express';
import { Delivery } from '../models/delivery';
import { deliveries as seedDeliveries } from '../seedData';
import { execFile } from 'child_process';
import shellQuote from 'shell-quote';

const router = express.Router();

let deliveries: Delivery[] = [...seedDeliveries];

// Create a new delivery
router.post('/', (req, res) => {
  const newDelivery: Delivery = req.body;
  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
});

// Get all deliveries
router.get('/', (req, res) => {
  res.json(deliveries);
});

// Get a delivery by ID
router.get('/:id', (req, res) => {
  const delivery = deliveries.find(d => d.deliveryId === parseInt(req.params.id));
  if (delivery) {
    res.json(delivery);
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Update delivery status and trigger system notification
router.put('/:id/status', (req, res) => {
  const { status, notifyCommand } = req.body;
  const delivery = deliveries.find(d => d.deliveryId === parseInt(req.params.id));

  // Allowlist of safe system commands to run for notifications
  const allowedCommands = new Set(['notify-send']);

  if (delivery) {
    delivery.status = status;

    if (notifyCommand) {
      // Safely parse the notifyCommand string into [command, ...args]
      let parsed;
      try {
        parsed = shellQuote.parse(notifyCommand);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid notifyCommand format.' });
      }
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return res.status(400).json({ error: 'Command is empty.' });
      }

      const command = parsed[0];
      const args = parsed.slice(1);

      if (!allowedCommands.has(command)) {
        return res.status(400).json({ error: 'Command not allowed.' });
      }

      execFile(command, args, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return res.status(500).json({ error: error.message });
        }
        res.json({ delivery, commandOutput: stdout });
      });
    } else {
      res.json(delivery);
    }
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Update a delivery by ID
router.put('/:id', (req, res) => {
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(req.params.id));
  if (index !== -1) {
    deliveries[index] = req.body;
    res.json(deliveries[index]);
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Delete a delivery by ID
router.delete('/:id', (req, res) => {
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(req.params.id));
  if (index !== -1) {
    deliveries.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Delivery not found');
  }
});

export default router;
