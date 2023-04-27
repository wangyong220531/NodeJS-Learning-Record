const handleDate = e => {
    const dt = new Date(e)
    const Y = dt.getFullYear()
    const M = padZero(dt.getMonth())
    const D = padZero(dt.getDay())
    const h = padZero(dt.getHours())
    const m = padZero(dt.getMinutes())
    const s = padZero(dt.getSeconds())
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

const padZero = e => {
    return e > 9 ? e : "0" + e
}

module.exports = {
    handleDate
} 