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

export const check_env_vars = () => {
    if (!process.env.RAZENGAN_LOG || !process.env.RAZENGAN_PWD || !process.env.RAZENGAN_URL || !process.env.COOKIE_JSP_1 || !process.env.COOKIE_JSP_2) {
        const missing_vars = []
        const vars_to_check = ["RAZENGAN_LOG", "RAZENGAN_PWD", "RAZENGAN_URL", "COOKIE_JSP_1", "COOKIE_JSP_2"]

        vars_to_check.forEach(var_name => {
            if (!process.env[var_name]) {
                missing_vars.push(var_name)
            }
        })

        display_errors("Variables d'environnement manquantes: " + missing_vars.join(", "), OUTPUT_JSON)
        process.exit(1)
    }
}