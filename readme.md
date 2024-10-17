# RAZENGAN SCRAP

## Code pour scrap les liens 1fichiers sur le site razengan

Comment installer :
> `git clone https://github.com/NotDemin/razengan-scrap.git` 

> `npm i`

Pour utiliser : 
>Avoir un compte razengan.club (https://razengan.club/)

>Se connecter

>Récuperer la page que l'on souhaite scrap (ex : https://razengan.club/?page_id=5297) 
> IL FAUT BIEN LA PAGE AVEC LA DEMANDE DE MOT DE PASSE

>Remplir un fichier .env dans le dossier avec les infos suivantes : 
>(.env.template)
```
RAZENGAN_URL=https://razengan.club/

RAZENGAN_LOG=votre_login
RAZENGAN_PWD=votre_mdp

COOKIE_JSP_1=valeur récuperer en se connectant la premiere fois (onglet network du navigateur)
- apbct_visible_fields
COOKIE_JSP_2=idem
- ct_no_cookie_hidden_field
```

>`node script_razengan.js URL`

Il est possible de passer un param = 'true' pour obtenir une sortie formaté en JSON. 
>`node script_razengan.js URL true` (non sensible a la casse)