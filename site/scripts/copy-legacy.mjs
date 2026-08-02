import { access, cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = resolve(scriptDirectory, '..')
const legacySource = resolve(projectDirectory, '..', 'legacy')
const legacyOutput = resolve(projectDirectory, 'dist', 'legacy')

await access(resolve(legacySource, 'index.html'))
await rm(legacyOutput, { recursive: true, force: true })
await mkdir(dirname(legacyOutput), { recursive: true })
await cp(legacySource, legacyOutput, { recursive: true })

console.log(`Copied legacy site to ${legacyOutput}`)
