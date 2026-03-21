import fs from 'node:fs'
import path from 'node:path'

const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'
if (!isCi) {
  process.exit(0)
}

const packageJsonPath = path.resolve('package.json')
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const currentVersion = String(packageData.version ?? '0.0.0')
const baseVersion = currentVersion.split('-', 1)[0]

const sha = (process.env.GITHUB_SHA ?? '').slice(0, 8)
const runId = process.env.GITHUB_RUN_ID ?? ''
const runNumber = process.env.GITHUB_RUN_NUMBER ?? ''
const job = process.env.GITHUB_JOB ?? ''
const refName = process.env.GITHUB_REF_NAME ?? ''
const branch = refName.includes('/') ? refName.replaceAll('/', '-') : refName
const source = [runId, runNumber, job, branch, sha].filter(Boolean).join('.')
const nextVersion = source ? `${baseVersion}-ci.${source}` : `${baseVersion}-ci`

packageData.version = nextVersion
fs.writeFileSync(
  packageJsonPath,
  `${JSON.stringify(packageData, null, 2)}${'\\n'}`,
)

console.log(`[build-version] version updated -> ${nextVersion}`)
