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
    const args_obj = {}
    args_obj["url"] = process.argv[2]
    const args = process.argv.slice(3)

    const KNOWN_ARGS = {
        "-j": { output_json: true },
        "--output-json": { output_json: true },
        "-s": { separator: true },
        "--separator": { separator: true },
        "-js": { output_json: true, separator: true },
        "-sj": { output_json: true, separator: true }
    }

    args.forEach((arg) => {
        if (KNOWN_ARGS[arg]) {
            Object.assign(args_obj, KNOWN_ARGS[arg])
        }
    })

    return args_obj
}