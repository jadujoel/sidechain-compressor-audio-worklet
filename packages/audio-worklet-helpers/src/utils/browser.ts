import { hasOwnProperty } from "./object"

/**
 * Detect the Safari browser.
 *
 * @return {boolean} true or false. True if its a Safari
 */
export function isSafari(): boolean {
    return window.navigator.userAgent.indexOf("Safari") > -1
        && window.navigator.userAgent.indexOf("Chrome") < 0
}

/**
 * Detect the Firefox browser.
 *
 * @return {boolean} true or false. True if its a Firefox
 */
export function isFirefox(): boolean {
    return window.navigator.userAgent.indexOf("Firefox") !== -1
}

export function isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !hasOwnProperty(window, "MSStream")
}
