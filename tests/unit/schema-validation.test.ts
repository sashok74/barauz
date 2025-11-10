import { describe, it, expect } from 'vitest';
import { isValidPageSchema, isValidRBACSchema } from '../../src/dsl/validate';
import salesOrdersPage from '../../schemas/sales_orders.page.json';
import mfgGanttPage from '../../schemas/mfg_gantt.page.json';
import rbacConfig from '../../schemas/rbac.json';

describe('Schema Validation', () => {
  describe('Page Schema Validation', () => {
    it('should validate sales_orders.page.json', () => {
      const result = isValidPageSchema(salesOrdersPage);
      expect(result).toBe(true);
    });

    it('should validate mfg_gantt.page.json', () => {
      const result = isValidPageSchema(mfgGanttPage);
      expect(result).toBe(true);
    });

    it('should reject invalid page schema', () => {
      const invalidSchema = {
        type: 'Page',
        id: 'test',
        // missing required fields: title, layout, blocks
      };
      const result = isValidPageSchema(invalidSchema);
      expect(result).toBe(false);
    });
  });

  describe('RBAC Schema Validation', () => {
    it('should validate rbac.json', () => {
      const result = isValidRBACSchema(rbacConfig);
      expect(result).toBe(true);
    });

    it('should reject invalid RBAC schema', () => {
      const invalidSchema = {
        // missing required field: roles
      };
      const result = isValidRBACSchema(invalidSchema);
      expect(result).toBe(false);
    });
  });
});
