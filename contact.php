<?php
/**
 * Les Clés de la Réussite — traitement du formulaire de contact / estimation (envoi par SMTP).
 *
 * Prérequis : hébergement PHP 7.4+ et fichier config.php (voir config.example.php).
 * Les identifiants SMTP ne sont jamais dans le navigateur ni dans Git.
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/phpmailer/Exception.php';
require __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/SMTP.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

function respond(bool $success, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function clean(string $value, int $max): string
{
    $value = trim(str_replace(["\r", "\n", "\0"], ' ', $value));
    return mb_substr($value, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Méthode non autorisée.', 405);
}

// Même site uniquement (si le navigateur envoie l'en-tête Origin ou Referer)
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (!empty($_SERVER[$h])) {
        $from = strtolower((string)parse_url((string)$_SERVER[$h], PHP_URL_HOST));
        if ($from !== '' && $from !== preg_replace('/:\d+$/', '', $host)) {
            respond(false, 'Requête refusée.', 403);
        }
        break;
    }
}

// Piège à robots : champ invisible rempli = robot ; on répond « succès » sans rien envoyer
if (!empty($_POST['site-web'])) {
    respond(true, 'Merci.');
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    error_log('[contact.php] config.php introuvable : copier config.example.php en config.php.');
    respond(false, "Le formulaire n'est pas encore disponible. Merci de nous appeler au 07 46 28 69 10.", 503);
}
$cfg = require $configFile;

$nom = clean((string)($_POST['nom'] ?? ''), 120);
$email = clean((string)($_POST['email'] ?? ''), 160);
$telephone = clean((string)($_POST['telephone'] ?? ''), 40);
$commune = clean((string)($_POST['commune'] ?? ''), 80);
$typeLogement = clean((string)($_POST['type_logement'] ?? ''), 80);
$message = trim(str_replace("\0", '', (string)($_POST['message'] ?? '')));
$message = mb_substr($message, 0, 5000);

$errors = [];
if ($nom === '') $errors[] = 'nom';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($commune === '') $errors[] = 'commune';
if ($typeLogement === '') $errors[] = 'type_logement';
if ($message === '') $errors[] = 'message';
if ($telephone !== '' && !preg_match('/^[0-9 +().\-]{6,40}$/', $telephone)) $errors[] = 'telephone';
if ($errors) {
    respond(false, 'Certains champs sont manquants ou invalides : ' . implode(', ', $errors) . '.', 422);
}

// Limitation du nombre d'envois par IP (fichier temporaire, aucune donnée personnelle conservée : IP hachée)
$limit = (int)($cfg['rate_limit_per_hour'] ?? 5);
if ($limit > 0) {
    $file = sys_get_temp_dir() . '/clr-contact-' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'x') . __DIR__) . '.json';
    $now = time();
    $hits = is_file($file) ? (json_decode((string)file_get_contents($file), true) ?: []) : [];
    $hits = array_values(array_filter($hits, static fn($t) => is_int($t) && $t > $now - 3600));
    if (count($hits) >= $limit) {
        respond(false, 'Trop de demandes envoyées. Merci de réessayer plus tard ou de nous appeler au 07 46 28 69 10.', 429);
    }
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = (string)$cfg['smtp_host'];
    $mail->Port = (int)$cfg['smtp_port'];
    $secure = (string)($cfg['smtp_secure'] ?? '');
    if ($secure === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($secure === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    }
    $mail->SMTPAuth = ((string)($cfg['smtp_user'] ?? '')) !== '';
    $mail->Username = (string)($cfg['smtp_user'] ?? '');
    $mail->Password = (string)($cfg['smtp_pass'] ?? '');
    $mail->Timeout = 12;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $mail->setFrom((string)$cfg['from_email'], (string)($cfg['from_name'] ?? 'Site web'));
    $mail->addAddress((string)$cfg['to_email'], (string)($cfg['to_name'] ?? ''));
    if (!empty($cfg['bcc_email'])) {
        $mail->addBCC((string)$cfg['bcc_email']);
    }
    $mail->addReplyTo($email, $nom);

    $mail->Subject = "Nouvelle demande d'estimation — {$commune} ({$typeLogement})";
    $mail->Body = "Nouvelle demande reçue depuis le site :\n\n"
        . "Nom : {$nom}\n"
        . "E-mail : {$email}\n"
        . 'Téléphone : ' . ($telephone !== '' ? $telephone : 'non renseigné') . "\n"
        . "Commune du logement : {$commune}\n"
        . "Type de logement : {$typeLogement}\n\n"
        . "Message :\n{$message}\n\n"
        . "—\nPour répondre, utilisez simplement « Répondre » : la réponse part vers {$email}.\n";
    $mail->isHTML(false);
    $mail->send();
} catch (MailException $e) {
    // Le détail technique (sans mot de passe) va dans le journal d'erreurs PHP de l'hébergement
    error_log('[contact.php] Échec SMTP : ' . $mail->ErrorInfo);
    respond(false, "L'envoi a échoué. Merci de réessayer ou de nous appeler directement au 07 46 28 69 10.", 502);
}

if ($limit > 0) {
    $hits[] = time();
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}

respond(true, 'Votre demande a bien été envoyée. Nous revenons vers vous rapidement.');
