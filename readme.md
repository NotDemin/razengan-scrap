# RAZENGAN SCRAP

## Code pour scrap les liens 1fichiers sur le site razengan

Comment installer :
>`git clone https://github.com/NotDemin/razengan-scrap.git` 

>`npm i`

Pour utiliser : 
>Avoir un compte razengan.club (https://razengan.club/)

>Se connecter

>Ouvrir l'onglet network de votre navigateur (réseau)

>Filtrer en tapant `wp-login.php` dans la barre de filtre

>Aller dans payload et récuperer les deux cookies

![Comme ceci](https://cdn.discordapp.com/attachments/870433433996890193/1296747353725997076/tesdzqzd.png?ex=67136995&is=67121815&hm=ff5ab397634db66e433c6d7f662e0585db61415d3d4761c1294902beca90b4cb&)

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

>Récuperer la page que l'on souhaite scrap (ex : https://razengan.club/?page_id=5297) 
>IL FAUT BIEN LA PAGE AVEC LA DEMANDE DE MOT DE PASSE

>`node main.js URL`

Il est possible de passer un param = 'true' pour obtenir une sortie formaté en JSON. 
>`node main.js URL true` (non sensible a la casse)