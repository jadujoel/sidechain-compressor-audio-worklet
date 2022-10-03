export interface ScopeWithoutSelf {
    sampleRate: number;
    currentTime: number;
    AudioWorkletProcessor(): void;
    registerProcessor: (name: string, Processor: AudioWorkletProcessor) => void;
}

export interface Scope extends ScopeWithoutSelf {
    self?: ScopeWithoutSelf
}
// export function Realm (this: any, scope: Scope, parentElement: HTMLElement) {
//     const frame = document.createElement('iframe')
//     frame.style.cssText = 'position:absolute;left:0;top:-999px;width:1px;height:1px;'
//     parentElement.appendChild(frame)
//     const win = frame.contentWindow
//     if (!win) {
//         return
//     }
//     const doc = win.document
//     let vars = 'var window,$hook'
//     for (const i in win) {
//         if (!(i in scope) && i !== 'eval') {
//             vars += ','
//             vars += i
//         }
//     }
//     for (const i in scope) {
//         vars += ','
//         vars += i
//         vars += '=self.'
//         vars += i
//     }
//     const script = doc.createElement('script')
//     script.appendChild(doc.createTextNode(
//         `function $hook(self,console) {"use strict";
//         ${vars};return function() {return eval(arguments[0])}}`
//     ))
//     doc.body.appendChild(script)
//     this.exec = (win as any).$hook.call(scope, scope, console)
// }


export class Realm {
    exec: any
    constructor(scope: Scope, parentElement: HTMLElement) {
        const frame = document.createElement('iframe')
        frame.style.cssText = 'position:absolute;left:0;top:-999px;width:1px;height:1px;'
        parentElement.appendChild(frame)
        const win = frame.contentWindow
        if (!win) {
            return
        }
        const doc = win.document
        let vars = 'var window,$hook'
        for (const i in win) {
            if (!(i in scope) && i !== 'eval') {
                vars += ','
                vars += i
            }
        }
        for (const i in scope) {
            vars += ','
            vars += i
            vars += '=self.'
            vars += i
        }
        const script = doc.createElement('script')
        script.appendChild(doc.createTextNode(
            `function $hook(self,console) {"use strict";
            ${vars};return function() {return eval(arguments[0])}}`
        ))
        doc.body.appendChild(script)
        this.exec = (win as any).$hook.call(scope, scope, console)
    }
}
