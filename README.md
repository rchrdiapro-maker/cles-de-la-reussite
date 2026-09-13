# Les Clés de la Réussite — site vitrine

Refonte du site de la conciergerie **Les Clés de la Réussite** (Guyancourt, Saint-Quentin-en-Yvelines, Versailles).

Site multipage statique — HTML pré-rendu, CSS et JavaScript vanilla (aucun framework, aucune étape de build requise). Compatible avec un hébergement mutualisé classique (Hostinger, fichiers + PHP). Voir [`NOTE-DE-LIVRAISON.md`](./NOTE-DE-LIVRAISON.md) pour les adaptations de contenu et les points à confirmer avant mise en production.

## Lancer la prévisualisation en local

Aucune installation n'est nécessaire (pas de `npm install`). Le script utilise PowerShell (inclus sous Windows).

```bash
cd cles-de-la-reussite-site
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Puis ouvrir [http://localhost:8900](http://localhost:8900). Le port peut être changé via la variable d'environnement `PORT`.

Ce serveur local sert les fichiers statiques, simule `contact.php` (aucun e-mail n'est envoyé, la soumission est seulement journalisée dans la console) et applique les mêmes redirections 301 / statut 410 que `.htaccess` en production.

## Structure du projet

```
cles-de-la-reussite-site/
├── index.html                          # Accueil
├── nos-services/index.html
├── tarifs/index.html
├── zones-intervention/index.html       # hub des zones
├── conciergerie-guyancourt/index.html
├── conciergerie-saint-quentin-en-yvelines/index.html
├── conciergerie-versailles/index.html
├── faq/index.html
├── a-propos/index.html
├── contact/index.html                  # formulaire + ancre #estimation
├── mentions-legales/index.html
├── politique-confidentialite/index.html
├── politique-cookies/index.html
├── nos-logements/index.html            # page retirée (410, voir .htaccess)
├── about/index.html                    # redirection vers /a-propos
├── 404.html
├── contact.php                         # traitement serveur du formulaire (Hostinger)
├── .htaccess                           # redirections, 410, 404, en-têtes
├── robots.txt
├── sitemap.xml
├── serve.ps1                           # serveur de prévisualisation locale
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/logo/ (logo-vert.png, logo-blanc.png)
```

## Déploiement (hébergement fichiers/PHP, ex. Hostinger)

1. Téléverser l'intégralité du dossier `cles-de-la-reussite-site/` à la racine du domaine (via le gestionnaire de fichiers Hostinger ou FTP).
2. Vérifier que `.htaccess` est bien pris en compte (hébergement Apache/LiteSpeed classique — **pas** compatible avec l'offre "Website Builder / Horizons" utilisée par le site actuel, voir note de livraison).
3. Confirmer l'adresse e-mail de destination dans `contact.php` (constante `DEST_EMAIL`) avant d'activer le formulaire.
4. Confirmer que le serveur autorise la fonction PHP `mail()`, ou remplacer par un envoi SMTP authentifié si la délivrabilité l'exige.
5. Mettre à jour les URL absolues (`https://lesclesdelareussite-conciergerie.com/...`) dans les balises `canonical`, Open Graph, `sitemap.xml` et `robots.txt` si le nom de domaine venait à changer.

Aucune commande de build n'est nécessaire : les fichiers livrés sont directement déployables tels quels.
