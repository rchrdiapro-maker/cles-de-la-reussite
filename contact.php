<?php
/**
 * Les Clés de la Réussite — traitement du formulaire de contact / estimation.
 *
 * CONFIGURATION À CONFIRMER AVANT MISE EN PRODUCTION :
 * - Adresse de destination : deux adresses figurent dans les sources du client
 *   (contact@lesclesdelareussite-conciergerie.com sur le site public,
 *   ccr78280@gmail.com dans les documents légaux). Confirmer laquelle doit
 *   recevoir les demandes commerciales avant d'activer ce script en production.
 * - Ce script utilise mail() (fonction native PHP, disponible sur la plupart
 *   des hébergements Hostinger). Selon la configuration DNS/SPF du domaine,
 *   il peut être préférable de passer par SMTP authentifié pour la délivrabilité.
 */

header('Content-Type: application/json; charset=utf-8');

const DEST_EMAIL = 'ccr78280@gmail.com'; // à confirmer avec le client avant mise en production
const SITE_NAME = 'Les Clés de la Réussite';

function respond(bool $success, string $message): void {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Méthode non autorisée.');
}

// Piège à robots : si rempli, on répond succès sans rien envoyer (ne pas alerter le bot).
if (!empty($_POST['site-web'])) {
    respond(true, 'Merci.');
}

$nom = trim((string)($_POST['nom'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$telephone = trim((string)($_POST['telephone'] ?? ''));
$commune = trim((string)($_POST['commune'] ?? ''));
$typeLogement = trim((string)($_POST['type_logement'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$errors = [];
if ($nom === '') $errors[] = 'nom';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($commune === '') $errors[] = 'commune';
if ($typeLogement === '') $errors[] = 'type_logement';
if ($message === '') $errors[] = 'message';

if (!empty($errors)) {
    http_response_code(422);
    respond(false, 'Certains champs sont manquants ou invalides : ' . implode(', ', $errors));
}

$subject = 'Nouvelle demande d\'estimation — ' . SITE_NAME;
$body = "Nouvelle demande reçue depuis le site :\n\n"
    . "Nom : {$nom}\n"
    . "E-mail : {$email}\n"
    . "Téléphone : " . ($telephone !== '' ? $telephone : 'non renseigné') . "\n"
    . "Commune du logement : {$commune}\n"
    . "Type de logement : {$typeLogement}\n\n"
    . "Message :\n{$message}\n";

$headers = [
    'From: ' . SITE_NAME . ' <no-reply@lesclesdelareussite-conciergerie.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=utf-8',
];

$sent = @mail(DEST_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Votre demande a bien été envoyée.');
}

http_response_code(502);
respond(false, "L'envoi a échoué. Merci de réessayer ou de nous appeler directement.");
