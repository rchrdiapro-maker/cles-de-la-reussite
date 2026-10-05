<?php
/**
 * Configuration SMTP du formulaire de contact.
 *
 * MODE D'EMPLOI
 *  1. Copier ce fichier en « config.php » (même dossier que contact.php) : cp config.example.php config.php
 *  2. Renseigner les valeurs ci-dessous (surtout 'smtp_pass').
 *  3. Ne JAMAIS publier config.php (déjà exclu de Git et bloqué par .htaccess).
 *  4. Tester en ligne de commande : php tools/smtp-test.php
 *
 * OPTION A — Boîte e-mail Hostinger du domaine (recommandé : meilleure délivrabilité)
 *   Créer la boîte (ex. contact@lesclesdelareussite-conciergerie.com) dans hPanel > E-mails.
 *   smtp_host = smtp.hostinger.com, smtp_port = 465, smtp_secure = 'ssl'
 *   (variante : port 587 avec smtp_secure = 'tls')
 *
 * OPTION B — Compte Gmail (ccr78280@gmail.com)
 *   Activer la validation en deux étapes, puis créer un « mot de passe d'application »
 *   (compte Google > Sécurité > Mots de passe des applications). Le mot de passe normal ne marche pas.
 *   smtp_host = smtp.gmail.com, smtp_port = 465, smtp_secure = 'ssl'
 */
return [
    // Serveur d'envoi
    'smtp_host'   => 'smtp.hostinger.com',
    'smtp_port'   => 465,
    'smtp_secure' => 'ssl',          // 'ssl' (port 465), 'tls' (STARTTLS, port 587) ou '' (aucun : tests locaux uniquement)
    'smtp_user'   => 'contact@lesclesdelareussite-conciergerie.com',
    'smtp_pass'   => 'MOT_DE_PASSE_A_RENSEIGNER',

    // Expéditeur affiché : doit être l'adresse du compte SMTP (sinon rejet ou spam)
    'from_email'  => 'contact@lesclesdelareussite-conciergerie.com',
    'from_name'   => 'Site Les Clés de la Réussite',

    // Destinataire des demandes d'estimation (à confirmer avec le client)
    'to_email'    => 'ccr78280@gmail.com',
    'to_name'     => 'Les Clés de la Réussite',

    // Copie cachée facultative ('' pour désactiver)
    'bcc_email'   => '',

    // Anti-spam : nombre maximal de demandes par adresse IP et par heure
    'rate_limit_per_hour' => 5,
];
