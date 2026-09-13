# Note de livraison — Refonte Les Clés de la Réussite

Cette note documente les choix, les adaptations de contenu et les points à confirmer avant une mise en production. Elle est volontairement tenue à l'écart des pages publiques.

## 1. Stack et hébergement — point d'attention important

Le site public actuel (lesclesdelareussite-conciergerie.com) est construit avec le générateur de site intégré de Hostinger (bundles `_astro-*`, `vue-router`, assets servis depuis `assets.zyrosite.com` / `cdn.zyrosite.com`) — l'offre communément appelée « Website Builder » (anciennement Zyro, puis Horizons). Ce n'est **pas** un hébergement fichiers/PHP classique.

La présente refonte est livrée en **HTML/CSS/JS statique + un script PHP pour le formulaire** (`contact.php`), pensée pour un hébergement fichiers classique (Apache/LiteSpeed, ce que propose aussi Hostinger sous d'autres formules). **Ces deux offres ne sont pas interchangeables** : le site livré ici ne peut pas être « importé » tel quel dans l'éditeur Website Builder actuel, et l'éditeur actuel ne permet pas d'héberger un `.htaccess` ou un script PHP personnalisé de la même façon. Avant la mise en production, il faut donc confirmer avec l'hébergeur/le client :
- soit un changement de formule Hostinger vers un hébergement web classique (mutualisé, avec accès fichiers/PHP) ;
- soit une reconstruction du contenu directement dans l'éditeur Website Builder actuel (auquel cas ce livrable sert de maquette de contenu et de référence visuelle, pas de fichiers à déployer tels quels).

## 2. Adaptations de contenu effectuées

- **Accueil** : les 9 prestations ont été reconstituées en cartes titre/description à partir des deux tableaux du document 1 (les émojis du tableau ont été remplacés par des pictogrammes linéaires cohérents avec la charte). La formulation « Vous n'habitez pas à proximité de votre logement ? » a été conservée telle quelle pour expliciter la gestion à distance.
- **Services** : le fond de la page n'a pas été changé, conformément au document 8. Les 12 prestations reprises sont celles réellement publiées sur la page `/nos-services` du site actuel (Création d'annonce, Photos professionnelles, Accueil voyageurs, Gestion des réservations, Assistance 7j/7, Ménage professionnel, Blanchisserie & consommables, Tarification dynamique, Maintenance & suivi, Optimisation des revenus, Expérience soignée, Gestion transparente) — et non la liste des 9 prestations de la page d'accueil, qui reste distincte. « Appartement » a été remplacé par « logement » dans le passage concerné, sans laisser la juxtaposition « appartement logement » présente dans le brouillon du document. **Formulations de résultat absolu adoucies** (signalé, pas inventé) : « Expérience 5 étoiles » → « Expérience soignée », « d'excellents avis voyageurs » → « de bons retours » — ces libellés promettaient un résultat garanti (note/avis) que rien ne permet d'assurer ; à valider avec le client si une formulation différente est souhaitée.
- **Tarifs** : grille et exemple (1 000 € × 18 % = 180 €, reste 820 €) repris tels que fournis, sans extrapolation ni calculateur automatisé.
- **FAQ** : les 17 questions/réponses ont été reprises dans l'ordre des 5 catégories imposé. **Adaptation éditoriale volontaire** (autorisée explicitement par le brief) : dans les questions 14 et 15, la promotion d'une couverture nationale et les références à Agde, l'Alsace et l'Ardèche ont été retirées, conformément au recentrage local demandé. Ce retrait est cohérent avec ce qui a été observé sur l'ancien site : la page « Nos logements 
» actuelle y présente justement des logements gérés à Cap d'Agde, à Volgelsheim (Alsace) et à Vagnas (Ardèche) — donc hors de la zone Guyancourt/SQY/Versailles mise en avant par la nouvelle stratégie éditoriale.
- **Zones d'intervention** : les trois longs textes du document 3 ont été répartis sur leurs pages dédiées, en conservant les nuances (« aucun revenu n'est garanti », « ne vous fiez pas aux moyennes »). Le tableau des 12 communes de SQY est présenté comme une description du territoire, pas comme une couverture opérationnelle garantie partout.
- **À propos** : texte de Saïd repris intégralement. Le bandeau partenaires (Airbnb, Booking, PriceLabs, Beds24, TTlook, Office de Tourisme Versailles Grand Parc) est accompagné d'une phrase précisant qu'il s'agit d'outils/références utilisés, pas de partenariats officiels.
- **Toutes les pages** : corrections de coquilles, de ponctuation et de répétitions ; suppression de toutes les annotations de brouillon (« mettre un bouton », « détail du bouton », « un bouton », formulations barrées, etc.).
- **Avis clients** : les extraits fournis (D.J., Alexis) sont repris fidèlement, **sans** ajouter de faux lien « Lire la suite » ni de note Google inventée, en l'absence des liens réels vers les avis (voir section 3).

## 3. Points à confirmer avant activation commerciale

| Sujet | Détail | Où |
|---|---|---|
| **Photo de Saïd** | Aucune photo n'a été fournie dans les 8 DOCX. Un emplacement réservé (icône + légende explicite) a été laissé sur la page À propos. Ne pas la remplacer par une photo de banque d'images. | `/a-propos` |
| **Liens avis Google** | Aucune URL d'avis ni de fiche Google fournie. Les extraits sont affichés sans lien externe ni note globale inventée. | `/` et `/a-propos` |
| **E-mail destinataire du formulaire** | Deux adresses existent dans les sources (`contact@lesclesdelareussite-conciergerie.com` publique, `ccr78280@gmail.com` dans les documents légaux). `contact.php` utilise `ccr78280@gmail.com` par défaut (constante `DEST_EMAIL`) : à confirmer avant mise en ligne. | `contact.php` |
| **Logos partenaires** | Orthographe et identité de marque de « TTlook » non revérifiées indépendamment ; à confirmer avec le client avant publication (droits d'usage des logos Airbnb/Booking/PriceLabs/Beds24 également à valider). | `/a-propos` |
| **Statistiques locales** | Les chiffres AirDNA (Guyancourt, août 2026), les données économiques de Saint-Quentin-en-Yvelines (emplois/établissements), les chiffres de fréquentation de Versailles et le calendrier de la ligne 18 proviennent des DOCX fournis (déjà sourcés par le client). Je n'ai pas pu les revérifier en direct dans cette session (recherche externe limitée) : ils sont conservés avec leur attribution d'origine, sans conversion de devise et sans affirmer que la ligne 18 est en service. **À faire vérifier par le client/l'équipe marketing avant publication.** | `/conciergerie-guyancourt`, `/conciergerie-saint-quentin-en-yvelines`, `/conciergerie-versailles` |
| **Identité légale / hébergeur** | Saïd (fondateur) et Mme MEZIANE (directrice de publication) sont deux rôles distincts, conservés tels quels. L'hébergeur indiqué (Hostinger) est à reconfirmer si l'offre d'hébergement change (voir section 1). | `/mentions-legales` |
| **Cookies / traceurs** | Aucun traceur soumis à consentement n'a été ajouté dans cette refonte (pas d'Analytics, Maps, pixels, reCAPTCHA). Seul Google Fonts est chargé (ressource externe, pas un cookie identifié). Aucun bandeau de consentement n'a donc été ajouté — en ajouter un si un futur outil soumis à consentement est intégré. Le détail de ce qui a été observé sur l'ancien site (bandeau générique, scripts Google Consent Mode) figure sur la page dédiée. | `/politique-cookies` |
| **Photographies** | Aucune photo réelle des logements ou de l'accueil n'a été intégrée : des illustrations vectorielles sobres (maison/clé) tiennent lieu de repères visuels, avec une légende explicite « à remplacer ». Ne jamais présenter une photo de logement géré sans confirmation qu'il s'agit bien d'un bien réellement suivi par la conciergerie. | Toutes les pages avec visuel |
| **Ambiguïté 600 €/601 €** | Le document Tarifs indique 601 € comme début du 2ᵉ palier ; la FAQ (document 4) indique 600 €. Les deux formulations d'origine ont été conservées telles quelles dans leurs pages respectives plutôt que d'inventer une réconciliation. À trancher avec le client. | `/tarifs` vs `/faq` |
| **Assiette de la commission** | HT/TTC et inclusion ou non du linge dans l'assiette : les documents sources ne sont pas parfaitement explicites. Rien n'a été ajouté au-delà de ce que les documents précisaient. | `/tarifs`, `/faq` |

## 4. Plan de migration des URL

| Ancienne URL (site actuel) | Nouvelle URL | Traitement |
|---|---|---|
| `/` | `/` | Inchangé |
| `/nos-services` | `/nos-services` | Inchangé (conservé tel quel comme demandé) |
| `/about` | `/a-propos` | Redirection 301 (`.htaccess`) |
| `/privacy-policy` | `/politique-confidentialite` | Redirection 301 (page réellement équivalente sur le fond) |
| `/terms-and-conditions` | `/mentions-legales` | Redirection 301 — **choix éditorial** : le contenu d'origine était un CGU générique du constructeur de site (cookies, propriété du contenu), pas des mentions légales à proprement parler ; en l'absence d'une page CGU dédiée dans la nouvelle arborescence, l'ancien emplacement du footer « Conditions générales » est redirigé vers l'équivalent légal le plus proche demandé par le brief (§4). À confirmer avec le client si une vraie page CGU séparée est souhaitée. |
| `/nos-logements` | *(aucune)* | **Statut 410 Gone** — page définitivement retirée (le brief exclut tout catalogue de logements). Pas de redirection générale vers l'accueil. |
| — | `/tarifs`, `/zones-intervention`, `/conciergerie-guyancourt`, `/conciergerie-saint-quentin-en-yvelines`, `/conciergerie-versailles`, `/faq`, `/contact`, `/politique-cookies` | Nouvelles pages, aucune migration nécessaire |

Le sitemap XML de l'ancien site contient par ailleurs une vingtaine d'URL de pages-modèles orpheline (ex. `/group-fitness-class`, `/wooden-chair`, `/hand-soap`…) manifestement issues du thème du constructeur de site et sans rapport avec l'activité réelle. Elles ne sont ni migrées ni redirigées ; il est recommandé de les faire disparaître de l'index de recherche au niveau de l'outil d'hébergement d'origine.

## 5. Tests réalisés dans cette session

- **Toutes les 13 routes** vérifiées automatiquement : statut HTTP 200, balise `<title>` unique, un seul `<h1>` par page.
- **Tous les liens internes** de chaque page crawlés automatiquement : aucun lien mort détecté.
- **Redirections** `/about`, `/privacy-policy`, `/terms-and-conditions` : vérifiées jusqu'à destination finale (bon titre de page affiché).
- **Page « Nos logements »** : statut 410 confirmé. **Page inconnue** : statut 404 confirmé (page personnalisée).
- **FAQ** : 17 `<details>` répartis sur 5 catégories confirmés par le DOM ; accordéons natifs (`<details>/<summary>`), donc utilisables au clavier nativement.
- **Formulaire de contact** : validation côté client (champs requis, format e-mail), pré-remplissage de la commune via `?commune=` depuis les pages locales, soumission réussie et affichage du message de succès, remise à zéro du formulaire après envoi, honeypot anti-spam vérifié. Simulation locale uniquement — **aucun e-mail réel n'a été envoyé** pendant les tests (le serveur de prévisualisation journalise la requête sans la transmettre).
- **Accessibilité couleur** : tous les couples texte/fond utilisés ont été vérifiés (calcul du ratio de contraste WCAG). Un problème réel a été détecté et corrigé en cours de session : la couleur laiton utilisée pour les petits libellés (« eyebrows ») n'atteignait que 4,06:1 sur fond ivoire (sous le seuil AA de 4,5:1 pour du texte de petite taille) — la teinte a été assombrie (`#7C6640`) pour atteindre 4,99:1 (ivoire) et 5,48:1 (blanc).
- **Responsive** : vérifié à 390 px (mobile) et 1440 px (desktop). Correction apportée : l'ordre visuel du bloc d'accueil (image passant avant le titre sur mobile) a été corrigé pour respecter le brief (titre et CTA avant l'image sur mobile).
- **Menu mobile** : ouverture/fermeture du menu hamburger vérifiée via le DOM (attribut `aria-expanded`, classe `open`).

### Non testé / non vérifiable dans cet environnement

- **Envoi réel d'e-mail via `contact.php`** : nécessite un serveur PHP réel (Hostinger) ; non exécutable dans cet environnement de prévisualisation Windows/PowerShell. À tester en environnement de recette avant mise en production.
- **Rendu des redirections et du statut 410 via un vrai `.htaccess` Apache** : le fichier `.htaccess` a été écrit selon la syntaxe Apache standard mais n'a pu être exécuté que via une simulation PowerShell équivalente ; à valider sur l'hébergement réel.
- **Polices Google Fonts en conditions réelles de réseau de production** (chargement, FOUT/FOIT) : testées uniquement en local.
- **Lecteurs d'écran réels** (NVDA/VoiceOver) : la structure sémantique (landmarks, labels, `aria-current`, alt text) a été vérifiée dans le code et via l'arbre d'accessibilité, mais pas testée avec un lecteur d'écran réel.
- **Statistiques tierces citées** (AirDNA, données SQY/Versailles, calendrier ligne 18) : non revérifiées par une recherche web indépendante dans cette session (voir section 3).

## 6. Dépendances bloquant une activation en production

1. Confirmer la formule d'hébergement (voir section 1) — sans hébergement fichiers/PHP, ni `.htaccess` ni `contact.php` ne peuvent fonctionner.
2. Confirmer l'adresse e-mail destinataire du formulaire et tester un envoi réel en conditions de recette.
3. Fournir une photographie réelle de Saïd (ou valider l'emplacement réservé pour une intégration ultérieure).
4. Fournir les liens réels vers les avis Google (ou accepter l'absence de lien externe en l'état).
5. Faire revalider par le client les statistiques tierces (AirDNA, SQY, Versailles, ligne 18) et l'orthographe/l'identité de la marque « TTlook ».
6. Décider du sort des URL orphelines de l'ancien sitemap (pages-modèles sans rapport avec l'activité).
