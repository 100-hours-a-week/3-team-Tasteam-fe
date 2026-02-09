import fs from 'node:fs'
import path from 'node:path'

const ROOT_DIR = path.resolve('src')
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const layerRank = new Map(layers.map((layer, index) => [layer, index]))

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, out)
      continue
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) continue
    if (entry.name.endsWith('.d.ts')) continue
    out.push(fullPath)
  }

  return out
}

const files = walk(ROOT_DIR)
const importRegex = /(?:import|export)\s+(?:[^'"`]+?\s+from\s+)?['"]([^'"]+)['"]/g
const dynamicImportRegex = /import\(\s*['"]([^'"]+)['"]\s*\)/g
const violations = []

function collectSpecifiers(sourceText) {
  const specifiers = []

  for (const regex of [importRegex, dynamicImportRegex]) {
    regex.lastIndex = 0
    let match
    while ((match = regex.exec(sourceText)) !== null) {
      specifiers.push(match[1])
    }
  }

  return specifiers
}

for (const filePath of files) {
  const relativePath = path.relative(process.cwd(), filePath).replaceAll(path.sep, '/')
  const fromLayer = relativePath.split('/')[1]
  if (!layerRank.has(fromLayer)) continue

  const code = fs.readFileSync(filePath, 'utf8')
  const specifiers = collectSpecifiers(code)

  for (const specifier of specifiers) {
    if (!specifier.startsWith('@/')) continue

    const toLayer = specifier.slice(2).split('/')[0]
    if (!layerRank.has(toLayer)) continue

    if (layerRank.get(fromLayer) > layerRank.get(toLayer)) {
      violations.push({
        file: relativePath,
        importPath: specifier,
        fromLayer,
        toLayer,
      })
    }
  }
}

if (violations.length > 0) {
  console.error(`FSD boundary violations: ${violations.length}`)
  for (const violation of violations) {
    console.error(
      `- ${violation.file}: ${violation.importPath} (${violation.fromLayer} -> ${violation.toLayer})`,
    )
  }
  process.exit(1)
}

console.log(`FSD boundary check passed (${files.length} files scanned)`)
