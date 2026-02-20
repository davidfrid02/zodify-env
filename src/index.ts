#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'util';

console.log('🚀 Starting zodify-env...');

// 1. Parse command-line arguments natively
const { values } = parseArgs({
  options: {
    input: {
      type: 'string',
      short: 'i',
      default: '.env.example',
    },
    output: {
      type: 'string',
      short: 'o',
      default: 'env.schema.ts',
    },
  },
});

// 2. Resolve paths based on the directory where the user runs the command (process.cwd())
const currentDir = process.cwd();
const envFilePath = path.resolve(currentDir, values.input as string);
const outputPath = path.resolve(currentDir, values.output as string);

// 3. Check if the input file exists
if (!fs.existsSync(envFilePath)) {
  console.error(`❌ Error: Could not find the input file at ${envFilePath}`);
  console.error(`💡 Tip: Make sure the file exists, or specify a different path using --input`);
  process.exit(1);
}

// 4. Read the file
const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
const lines = envFileContent.split('\n');

let zodSchemaString = `import { z } from 'zod';\n\nexport const envSchema = z.object({\n`;

// 5. Parse the variables and infer types
for (const line of lines) {
  const trimmedLine = line.trim();
  
  if (!trimmedLine || trimmedLine.startsWith('#')) continue;

  const [key, ...valueParts] = trimmedLine.split('=');
  const value = valueParts.join('=').trim(); 
  const cleanKey = key.trim();

  if (!cleanKey) continue;

  let zodType = 'z.string()'; 
  
  if (value === 'true' || value === 'false') {
    zodType = 'z.coerce.boolean()'; 
  } else if (!isNaN(Number(value)) && value !== '') {
    zodType = 'z.coerce.number()';
  }

  zodSchemaString += `  ${cleanKey}: ${zodType},\n`;
}

zodSchemaString += `});\n\n`;
zodSchemaString += `export type Env = z.infer<typeof envSchema>;\n`;

// 6. Write the schema to the target output path
fs.writeFileSync(outputPath, zodSchemaString);
console.log(`✅ Success! Zod schema generated at ${outputPath}`);