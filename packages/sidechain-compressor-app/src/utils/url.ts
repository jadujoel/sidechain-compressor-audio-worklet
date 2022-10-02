export function concatAndResolveUrl(url: string, concat: string) {
    const url1 = url.split('/')
    const url2 = concat.split('/')
    const url3 = [ ]
    for (let i = 0, l = url1.length; i < l; i ++) {
        if (url1[i] === '..') {
            url3.pop()
        }
        else if (url1[i] === '.') {
            continue
        }
        else {
            url3.push(url1[i])
        }
    }
    for (let i = 0, l = url2.length; i < l; i ++) {
        if (url2[i] === '..') {
            url3.pop()
        }
        else if (url2[i] === '.') {
            continue
        }
        else {
            url3.push(url2[i])
        }
    }
    return url3.join('/')
}
