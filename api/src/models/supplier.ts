/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplierId
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the supplier
 */
export interface Supplier {
    supplierId: number;
    name: string;
    description: string;
    contactPerson: string;
    email: string;
    phone: string;
}
