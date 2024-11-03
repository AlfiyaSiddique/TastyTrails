"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillOnSignal = void 0;
const operators_1 = require("rxjs/operators");
/**
 * Watches the main concurrently process for signals and sends the same signal down to each spawned
 * command.
 */
class KillOnSignal {
    process;
    abortController;
    constructor({ process, abortController, }) {
        this.process = process;
        this.abortController = abortController;
    }
    handle(commands) {
        let caughtSignal;
        ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
            this.process.on(signal, () => {
                caughtSignal = signal;
                this.abortController?.abort();
                commands.forEach((command) => command.kill(signal));
            });
        });
        return {
            commands: commands.map((command) => {
                const closeStream = command.close.pipe((0, operators_1.map)((exitInfo) => {
                    const exitCode = caughtSignal === 'SIGINT' ? 0 : exitInfo.exitCode;
                    return { ...exitInfo, exitCode };
                }));
                // Return a proxy so that mutations happen on the original Command object.
                // If either `Object.assign()` or `Object.create()` were used, it'd be hard to
                // reflect the mutations on Command objects referenced by previous flow controllers.
                return new Proxy(command, {
                    get(target, prop) {
                        return prop === 'close' ? closeStream : target[prop];
                    },
                });
            }),
        };
    }
}
exports.KillOnSignal = KillOnSignal;
