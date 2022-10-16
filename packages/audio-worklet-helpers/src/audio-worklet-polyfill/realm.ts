export interface ScopeWithoutSelf {
    sampleRate: number;
    currentTime: number;
    AudioWorkletProcessor(): void;
    registerProcessor: (name: string, Processor: AudioWorkletProcessor) => void;
}

export interface Scope extends ScopeWithoutSelf {
    self?: ScopeWithoutSelf
}

type $Hook = (self: Scope, console: Console) => ReturnType<typeof eval>

export class Realm {
    // exec?: ReturnType<typeof eval>
    exec?: ReturnType<$Hook['call']> | any

    constructor(scope: Scope, parentElement: HTMLElement) {

        const frame = document.createElement('iframe')
        const hide = 'position:absolute;left:0;top:-999px;width:1px;height:1px;'
        frame.style.cssText = hide
        parentElement.appendChild(frame)

        const win = frame.contentWindow
        if (!win) {
            return
        }

        const doc = win.document

        let vars = 'var window,$hook'
        for (const i in win) {
            if (!(i in scope) && i !== 'eval') {
                vars += `,${i}`
            }
        }
        for (const i in scope) {
            vars += `,${i}=self.${i}`
        }

        // need this to run eval
        const script = doc.createElement('script')
        script.appendChild(doc.createTextNode(
            `function $hook(self,console) {"use strict";
            ${vars};return function() {return eval(arguments[0])}}`
        ))
        doc.body.appendChild(script)

        this.exec = (win as Window & { $hook: (self: Scope, console: Console) => void })
            .$hook
            .call(scope, scope, console)
    }
}
