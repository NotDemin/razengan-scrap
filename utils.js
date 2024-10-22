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

export const decode_html_char_codes = str => {
    return str.replace(/(&#(\d+);)/g, (match, capture, charCode) => String.fromCharCode(charCode))
}

export const parse_args = () => {
    const KNOWN_ARGS = ["-j", "-s", "--output-json", "--separator"]

    const args = process.argv.slice(3)
    const args_obj = {}
    args.forEach((arg) => {
        if (KNOWN_ARGS.includes(arg)) {
            switch (true) {
                case arg === "--output-json" || arg === "-j":
                    args_obj["output_json"] = true
                    break
                case arg === "--separator" || arg === "-s":
                    args_obj["separator"] = true
                    break
            }
        }
    })

    args_obj["url"] = process.argv[2]

    return args_obj
}