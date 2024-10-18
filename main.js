import axios from 'axios';
import 'dotenv/config';
import querystring from 'querystring';
import { display_errors, validate_url } from './utils.js';

const MAIN_URL_EXTRACT = process.argv[2]
const OUTPUT_JSON = process.argv[3]?.toLowerCase() === "true" ? true : false

const get_anime_name = (html) => {
    const title_start = html.indexOf("Protégé : Liens")
    const title_end = html.indexOf('(', title_start)

    const anime_name = html.substring(title_start + "Protégé : Liens".length, title_end - 1)

    return (anime_name || "").trim()
}

const check_env_vars = () => {
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

const login = async () => {
    const data_login = {
        'log': process.env.RAZENGAN_LOG,
        'pwd': process.env.RAZENGAN_PWD,
        'rememberme': 'forever',
        'wp-submit': 'Se connecter',
        'redirect_to': `${process.env.RAZENGAN_URL}wp-admin/`,
        'testcookie': 1,
        'apbct_visible_fields': process.env.COOKIE_JSP_1,
        'ct_no_cookie_hidden_field': process.env.COOKIE_JSP_2
    }

    const login_res = await axios.post(
        `${process.env.RAZENGAN_URL}wp-login.php`,
        querystring.stringify(data_login)
    )

    let token = ""
    login_res.headers['set-cookie'].forEach(cookie => {
        const cookieName = cookie.split(';')[0].split('=')[0]
        if (cookieName.includes('wordpress_logged_in')) {
            const cookieValue = cookie.split(';')[0].split('=')[1]
            token = `${cookieName}=${cookieValue}`
        }
    })

    return token
}

const get_password = async (token) => {

    let password_res
    try {
        password_res = await axios.get(MAIN_URL_EXTRACT, 
            {   
                headers: {
                    'Cookie': token
                },
                withCredentials: true
            }
        );
    } catch (e) {
        if (e.status === 404) {
            display_errors("Page non trouvée", OUTPUT_JSON)
        } else {
            display_errors("Erreur HTTP: " + e.status, OUTPUT_JSON)
        }
        process.exit(1)
    }

    if (!OUTPUT_JSON) console.log("Nom de l'anime:", get_anime_name(password_res.data))
    
    const regex = /(mot de passe)/g
    const pwd_start = password_res.data.search(regex)
    const pwd_end = password_res.data.indexOf('»', pwd_start)

    const final_str = password_res.data.substring(pwd_start, pwd_end + 1)

    const start = "«"
    const end = "»";  

    const start_extract_pwd = final_str.indexOf(start)
    const end_extract_pwd = final_str.indexOf(end, start_extract_pwd)

    let password_clean
    if (start_extract_pwd !== -1 && end_extract_pwd !== -1) {
        password_clean = final_str.substring(start_extract_pwd + start.length, end_extract_pwd)
    } else {
        display_errors("Les caractères spécifiés ne sont pas présents. Vérifiez qu'il s'agit bien d'une page a mot de passe", OUTPUT_JSON)
        process.exit(1)
    }

    return (password_clean || "").trim()
}

const get_1fichier_page = async (password, token) => {
    let links_response
    const data_password = {
        'post_password': password,
        'Submit': 'Valider',
        'apbct_visible_fields': process.env.COOKIE_JSP_1,
        'ct_no_cookie_hidden_field': process.env.COOKIE_JSP_2
    }

    try {
        links_response = await axios.post(
            `${process.env.RAZENGAN_URL}wp-login.php?action=postpass`, 
            querystring.stringify(data_password),
            {   
                headers: {
                    'Cookie': token
                },
                withCredentials: true
            }
        );
    } catch (e) {
        if (e.status === 404) {
            display_errors("Page non trouvée", OUTPUT_JSON)
        } else {
            display_errors("Erreur HTTP: " + e.status, OUTPUT_JSON)
        }
        process.exit(1)
    }

    let password_cookie = ""
    links_response.headers['set-cookie'].forEach(cookie => {
        const cookieName = cookie.split(';')[0].split('=')[0]
        if (cookieName.includes("wp-postpass_")) {
            password_cookie = cookie
        }
    })

    let links_after_pwd
    try {
        links_after_pwd = await axios.get(
            MAIN_URL_EXTRACT,
            {   
                headers: {
                    'Cookie': token + "; " + password_cookie
                },
                withCredentials: true
            }
        );
    } catch (e) {
        if (e.status === 404) {
            display_errors("Page non trouvée", OUTPUT_JSON)
        } else {
            display_errors("Erreur HTTP: " + e.status, OUTPUT_JSON)
        }
        process.exit(1)
    }

    if (!links_after_pwd.data.includes("1fichier")) {
        display_errors("Aucun lien 1fichier trouvé", OUTPUT_JSON)
        process.exit(1)
    }

    const regex = /https:\/\/1fichier\.com\/\?[^"]+/g
    const matches = links_after_pwd.data.match(regex)

    return matches
}

const main = async () => {

    if (!validate_url(MAIN_URL_EXTRACT)) {
        display_errors("URL non valide", OUTPUT_JSON)
        process.exit(1)
    }

    const token = await login()

    if (!token) {
        display_errors("Impossible de récupérer le token", OUTPUT_JSON)
        process.exit(1)
    }

    const password_clean = await get_password(token)

    if (!OUTPUT_JSON) console.log("Mot de passe:", password_clean)

    if (!password_clean) {
        display_errors("Impossible de récupérer le mot de passe", OUTPUT_JSON)
        process.exit(1)
    }

    const links = await get_1fichier_page(password_clean, token)

    if (OUTPUT_JSON) { 
        console.log(JSON.stringify({links: links}))
    } else {
        console.log("Liens 1fichier:")
        links.forEach(link => {
            console.log(link)
        })
    }

}

check_env_vars()
await main()
process.exit(0)