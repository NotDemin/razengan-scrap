export const display_errors = (msg_error, json) => {
    if (json) {
        console.log(JSON.stringify({error: msg_error}))
    } else {
        console.error(msg_error)
    }
}

export const validate_url = (url) => {
    const regex_url = /^https:\/\/razengan\.club\/\?page_id=\d+$/g
    return regex_url.test(url)
}