import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import pageSchema from '../../packages/schemas/page.schema.json';
import tableSchema from '../../packages/schemas/table.schema.json';
import formSchema from '../../packages/schemas/form.schema.json';
import datasourceSchema from '../../packages/schemas/datasource.schema.json';
import actionsSchema from '../../packages/schemas/actions.schema.json';
import rbacSchema from '../../packages/schemas/rbac.schema.json';
import type { PageSchema, RBACSchema } from './types';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  validateSchema: false,
  validateFormats: false,
});
addFormats(ajv);

// Add all schema definitions
ajv.addSchema(datasourceSchema, 'datasource.schema.json');
ajv.addSchema(actionsSchema, 'actions.schema.json');
ajv.addSchema(tableSchema, 'table.schema.json');
ajv.addSchema(formSchema, 'form.schema.json');
ajv.addSchema(pageSchema, 'page.schema.json');
ajv.addSchema(rbacSchema, 'rbac.schema.json');

export const validatePageSchema: ValidateFunction<PageSchema> = ajv.compile(pageSchema);
export const validateRBACSchema: ValidateFunction<RBACSchema> = ajv.compile(rbacSchema);

export function isValidPageSchema(data: unknown): data is PageSchema {
  return validatePageSchema(data);
}

export function isValidRBACSchema(data: unknown): data is RBACSchema {
  return validateRBACSchema(data);
}
