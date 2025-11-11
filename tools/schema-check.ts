import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const SCHEMAS_DIR = path.join(ROOT_DIR, 'schemas');
const SCHEMA_DEFS_DIR = path.join(ROOT_DIR, 'packages/schemas');

function loadSchemaDefinitions(): Record<string, unknown> {
  const schemas: Record<string, unknown> = {};
  const files = fs.readdirSync(SCHEMA_DEFS_DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(SCHEMA_DEFS_DIR, file), 'utf-8');
    const schema = JSON.parse(content) as unknown;
    schemas[file] = schema;
  }

  return schemas;
}

function validateSchemaFiles(): boolean {
  console.log('🔍 Validating schema files...\n');

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: false,
    validateFormats: false,
  });
  addFormats(ajv);

  // Load schema definitions
  const schemaDefs = loadSchemaDefinitions();
  for (const [filename, schema] of Object.entries(schemaDefs)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    ajv.addSchema(schema as any, filename);
  }

  // Get schemas for validation
  const pageSchema = schemaDefs['page.schema.json'];
  const rbacSchema = schemaDefs['rbac.schema.json'];

  if (!pageSchema) {
    console.error('❌ page.schema.json not found!');
    return false;
  }

  const validatePage = ajv.compile(pageSchema);
  const validateRBAC = rbacSchema ? ajv.compile(rbacSchema) : null;

  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.log('⚠️  No schemas directory found, creating it...');
    fs.mkdirSync(SCHEMAS_DIR, { recursive: true });
    return true;
  }

  const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith('.json'));

  if (schemaFiles.length === 0) {
    console.log('⚠️  No schema files found in /schemas directory');
    return true;
  }

  let allValid = true;

  for (const file of schemaFiles) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    try {
      const data = JSON.parse(content) as unknown;

      // Determine which validator to use based on filename
      let validate;
      if (file.includes('rbac')) {
        validate = validateRBAC;
        if (!validate) {
          console.log(`⊘ Skipped ${file} (no RBAC schema validator)`);
          continue;
        }
      } else {
        validate = validatePage;
      }

      const valid = validate(data);

      if (valid) {
        console.log(`✓ ${file}`);
      } else {
        console.error(`✗ ${file}`);
        console.error('  Errors:', validate.errors);
        allValid = false;
      }
    } catch (error) {
      console.error(`✗ ${file} - JSON parse error:`, error);
      allValid = false;
    }
  }

  console.log(allValid ? '\n✅ All schemas valid!' : '\n❌ Schema validation failed!');
  return allValid;
}

const success = validateSchemaFiles();
process.exit(success ? 0 : 1);
