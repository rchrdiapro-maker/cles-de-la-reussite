<?php
/**
 * Test d'envoi SMTP en ligne de commande :  php tools/smtp-test.php [adresse-destinataire]
 * Utilise config.php ; affiche le dialogue SMTP (sans le mot de passe) pour diagnostiquer un échec.
 */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/../vendor/phpmailer/Exception.php';
require __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
require __DIR__ . '/../vendor/phpmailer/SMTP.php';

$file = __DIR__ . '/../config.php';
if (!is_file($file)) { fwrite(STDERR, "config.php introuvable : copiez config.example.php en config.php.\n"); exit(1); }
$cfg = require $file;
$to = $argv[1] ?? $cfg['to_email'];

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = static function ($str) { echo preg_replace('/^(CLIENT -> SERVER: )[A-Za-z0-9+\/=]{12,}$/m', '$1[identifiants masqués]', $str); };
    $mail->Host = $cfg['smtp_host'];
    $mail->Port = (int)$cfg['smtp_port'];
    $s = $cfg['smtp_secure'] ?? '';
    $mail->SMTPSecure = $s === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : ($s === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : '');
    if ($s === '') $mail->SMTPAutoTLS = false;
    $mail->SMTPAuth = ($cfg['smtp_user'] ?? '') !== '';
    $mail->Username = $cfg['smtp_user'] ?? '';
    $mail->Password = $cfg['smtp_pass'] ?? '';
    $mail->Timeout = 12;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($cfg['from_email'], $cfg['from_name']);
    $mail->addAddress($to);
    $mail->Subject = 'Test SMTP — site Les Clés de la Réussite';
    $mail->Body = "Ceci est un message de test du formulaire de contact.\nSi vous le lisez, l'envoi SMTP fonctionne.\n";
    $mail->send();
    echo "\nOK : message de test envoyé à {$to}.\n";
} catch (MailException $e) {
    echo "\nÉCHEC : " . $mail->ErrorInfo . "\n";
    exit(1);
}
