import { exec, ExecException } from "child_process"
import { Compiler } from "webpack"

interface ExecWebpackPluginOptions {
    before?: string
    during?: string
    duringWatch?: string
    after?: string
}
export class ExecWebpackPlugin {
    pluginName = "audio-webpack-plugin"
    options: ExecWebpackPluginOptions

    constructor(options: ExecWebpackPluginOptions) {
        this.options = options
    }

    apply<T extends Compiler>(compiler: T): void {
        compiler.hooks.beforeCompile.tap(this.pluginName, (_compiler) => {
            this.options.before && exec(this.options.before, execPrint)
        })
        compiler.hooks.run.tapAsync(this.pluginName, (_compiler, cb) => {
            this.options.during && exec(this.options.during, execPrint)
            cb()
        })
        compiler.hooks.watchRun.tapAsync(this.pluginName, (_compiler, cb) => {
            if (this.options.duringWatch) {
                exec(this.options.duringWatch, execPrint)
            }
            else if (this.options.during) {
                exec(this.options.during, execPrint)
            }
            cb()
        })
        compiler.hooks.afterCompile.tap(this.pluginName, (_compiler) => {
            this.options.after && exec(this.options.after, execPrint)
        })
    }
}

function execPrint(error: ExecException | null, stdout: string, stderr: string) {
    console.log("stdout:", stdout)
    if (stderr.length > 1) {
        console.log("stderr:", stderr)
    }
    if (error !== null) {
        console.log("exec error:", error)
    }
}
