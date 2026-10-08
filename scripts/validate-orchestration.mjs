import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULT_REGISTRY_REF } from '../cli/src/registry.js';
import { validateContractAgainstRegistry } from './orchestration-validator.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export async function validateFile(filePath, {
  registryPath = path.join(root, 'compass-components/registry/registry.json'),
  registryRef = DEFAULT_REGISTRY_REF,
} = {}) {
  const absolutePath = path.resolve(filePath);
  let contract;
  let registry;
  try {
    contract = JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    return { errors: [`cannot read contract JSON: ${error.message}`], warnings: [], affectedDecisions: [] };
  }
  try {
    registry = JSON.parse(await readFile(registryPath, 'utf8'));
  } catch (error) {
    return { errors: [`cannot read local Components registry: ${error.message}`], warnings: [], affectedDecisions: [] };
  }
  return validateContractAgainstRegistry(contract, registry, registryRef);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    console.error('Usage: node scripts/validate-orchestration.mjs [contract.json]');
    process.exitCode = 1;
    return;
  }

  const filePath = args[0] ? path.resolve(args[0]) : path.join(root, 'examples/orchestration/data-load-monitoring-dashboard/compass.json');
  const result = await validateFile(filePath);
  if (result.errors.length) {
    for (const error of result.errors) console.error(`FAIL: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`PASS: ${path.relative(process.cwd(), filePath)} conforms to Compass Orchestration schema 1.0.0 and local Components registry ${DEFAULT_REGISTRY_REF}`);
  for (const warning of result.warnings) console.warn(`WARN: ${warning}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
