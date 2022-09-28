import pc from 'picocolors'

export const logFilter = (message: string): string | undefined => {
  const match = message.match(/^.*(LOG:[\s\S]*?)\\".*$/s)
  if (match) {
    return `${pc.green(match[1])}\n`
  }
  return undefined
}
