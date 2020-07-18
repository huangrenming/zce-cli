import { join } from 'path'
import { readdirSync } from 'fs'
import { Options, Context } from './parser'

export interface Command {
  readonly name: string
  readonly usage?: string
  readonly description?: string
  readonly alias?: string | string[]
  readonly hidden?: boolean
  // TODO: arguments
  // readonly arguments?: Arguments
  options?: Options
  readonly action: (ctx: Context) => Promise<void>
  readonly help?: string | ((ctx: Context) => Promise<void>)
  readonly examples?: string | string[]
  readonly suggestions?: string | string[]
}

/**
 * Load dir commands
 * @param dir dir to load
 */
export const loadCommands = (dir: string): Record<string, Command> => {
  const commandDir = join(__dirname, dir)

  // scanning commands
  return readdirSync(commandDir).reduce<Record<string, Command>>((cmds, item) => {
    try {
      const { default: mod } = require(join(commandDir, item))

      // ignore not command
      if (typeof mod === 'undefined' || typeof mod.name !== 'string' || typeof mod.action !== 'function') return cmds

      const cmd = mod as Command

      if (cmd.options == null) {
        cmd.options = {}
      }

      if (cmd.options.help == null) {
        cmd.options.help = {
          type: 'boolean',
          alias: 'h',
          description: 'output command help info'
        }
      }

      cmds[cmd.name] = cmd
      if (typeof cmd.alias === 'string') {
        cmds[cmd.alias] = cmd
      } else if (cmd.alias != null) {
        cmd.alias.forEach(a => {
          cmds[a] = cmd
        })
      }
    } catch {}
    // } catch (e) { console.error(e) }
    return cmds
  }, {})
}

/**
 * All commands
 */
export const commands: Record<string, Command> = {
  ...loadCommands('./commands'),
  ...loadCommands('../commands')
}

/**
 * Load command by name
 * @param name command name
 */
export const load = async (name?: string): Promise<Command> => {
  // try to load command
  if (name != null && Reflect.has(commands, name)) {
    return Reflect.get(commands, name)
  }

  // fallback unknown command
  return commands.unknown
}
