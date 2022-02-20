import chalk from 'chalk'

export const logFilter = (message: string): string | undefined => {
  const match = message.match(/^.*(LOG:[\s\S]*?)\\".*$/s)
  if (match) {
    return `${chalk.green(match[1])}\n`
  }
  return undefined
}
