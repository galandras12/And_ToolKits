/**
 * A gyökér and-toolkit.php előállítása a generátorból (src/utils/pluginTemplate.ts + RELEASE_STATE).
 * Futtatás: npm run build:plugin
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RELEASE_STATE, generateWordPressPluginPhp } from '../src/utils/toolkitLogic.ts';

const target = fileURLToPath(new URL('../and-toolkit.php', import.meta.url));
writeFileSync(target, generateWordPressPluginPhp(RELEASE_STATE), 'utf8');
console.log(`Written: ${target}`);
