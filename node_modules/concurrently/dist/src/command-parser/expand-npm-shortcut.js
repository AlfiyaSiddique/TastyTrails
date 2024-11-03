"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandNpmShortcut = void 0;
/**
 * Expands commands prefixed with `node:`, `npm:`, `yarn:`, `pnpm:`, or `bun:` into the full version `npm run <command>` and so on.
 */
class ExpandNpmShortcut {
    parse(commandInfo) {
        const [, npmCmd, cmdName, args] = commandInfo.command.match(/^(node|npm|yarn|pnpm|bun):(\S+)(.*)/) || [];
        if (!cmdName) {
            return commandInfo;
        }
        const runCmd = npmCmd === 'node' ? '--run' : 'run';
        return {
            ...commandInfo,
            name: commandInfo.name || cmdName,
            command: `${npmCmd} ${runCmd} ${cmdName}${args}`,
        };
    }
}
exports.ExpandNpmShortcut = ExpandNpmShortcut;
