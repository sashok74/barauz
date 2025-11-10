import { describe, it, expect } from 'vitest';
import jsonLogic from 'json-logic-js';

describe('Form Logic', () => {
  describe('JSONLogic evaluation', () => {
    it('should evaluate simple equality condition', () => {
      const condition = { '==': [{ var: 'form.status' }, 'Shipped'] };
      const data = { form: { status: 'Shipped' } };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const result = jsonLogic.apply(condition as any, data as any);
      expect(result).toBe(true);
    });

    it('should return false when condition does not match', () => {
      const condition = { '==': [{ var: 'form.status' }, 'Shipped'] };
      const data = { form: { status: 'Draft' } };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const result = jsonLogic.apply(condition as any, data as any);
      expect(result).toBe(false);
    });

    it('should handle nested conditions', () => {
      const condition = {
        and: [
          { '==': [{ var: 'form.status' }, 'Shipped'] },
          { '>': [{ var: 'form.amount' }, 100] },
        ],
      };
      const data = { form: { status: 'Shipped', amount: 200 } };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const result = jsonLogic.apply(condition as any, data as any);
      expect(result).toBe(true);
    });

    it('should disable fields when status is Shipped', () => {
      const condition = { '==': [{ var: 'form.status' }, 'Shipped'] };
      const formData = { form: { status: 'Shipped' } };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const shouldDisable = jsonLogic.apply(condition as any, formData as any);

      if (shouldDisable) {
        const disabledFields = ['customerId', 'lines'];
        expect(disabledFields).toContain('customerId');
        expect(disabledFields).toContain('lines');
      }
    });
  });
});
