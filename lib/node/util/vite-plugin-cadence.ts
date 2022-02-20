import * as path from 'path'
import * as fs from 'fs'

export interface VitePluginStringOptions {
  virtualName?: string
  basePath?: string
}

export function viteString(options: VitePluginStringOptions) {
  const virtualName = options.virtualName
  const defaultBasePath = '.'
  const extensions = ['cdc']

  const basePath = options.basePath ?? defaultBasePath
  const vFileId = `@${virtualName}/`
  return {
    name: 'virtual-string',
    resolveId(id: string) {
      if (id.indexOf(vFileId) === 0) {
        return id
      }
    },
    async load(id: string) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (extensions.includes(id.split('.').pop()!)) {
        const filePath = path.resolve(basePath, id.replace(vFileId, ''))
        const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' })
        if (virtualName) {
          return `export const ${virtualName} = ${JSON.stringify(content)}`
        } else {
          return `export default ${JSON.stringify(content)}`
        }
      }
    },
  }
}
