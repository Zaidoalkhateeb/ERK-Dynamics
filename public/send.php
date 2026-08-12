<?php
/**
 * ERK Dynamics — contact / partner form mail handler.
 * Receives a form POST and emails the submission to the company inbox.
 * Works on standard Apache + PHP hosting (e.g. VestaCP with Exim).
 *
 * Configure the recipient below if it ever changes.
 */

$COMPANY_INBOX = 'info@erkdynamics.com';
// "From" must be an address on your own domain or mail servers may reject it.
$FROM_ADDRESS  = 'no-reply@erkdynamics.com';
$FROM_NAME     = 'ERK Dynamics Website';

header('Content-Type: application/json; charset=utf-8');

// Only accept POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Support both form-encoded/multipart ($_POST) and JSON bodies.
$data = $_POST;
if (empty($data)) {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    if (is_array($json)) {
        $data = $json;
    }
}

// Honeypot: bots fill hidden "website" field. Pretend success, send nothing.
if (!empty($data['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// Basic sanitiser for header-relevant values.
function clean_header($value) {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string) $value));
}

$clientEmail = filter_var(clean_header($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = clean_header($data['_subject'] ?? 'New website enquiry — ERK Dynamics');

// Human-friendly labels for known fields; anything else is included as-is.
$labels = [
    'name' => 'Full name', 'firstName' => 'First name', 'lastName' => 'Last name',
    'email' => 'Email', 'company' => 'Company', 'organization' => 'Organization',
    'phone' => 'Phone', 'country' => 'Country / region', 'region' => 'Country / region',
    'organizationType' => 'Organization type', 'interest' => 'Interest', 'intent' => 'Intent',
    'reason' => 'Reason for contact', 'category' => 'Category', 'message' => 'Message',
    'reference' => 'Reference',
];
$skip = ['website', '_subject', 'type'];

$lines = [];
$lines[] = 'New submission from the ERK Dynamics website';
$lines[] = str_repeat('-', 44);
foreach ($data as $key => $value) {
    if (in_array($key, $skip, true)) continue;
    if (is_array($value)) $value = implode(', ', $value);
    $value = trim((string) $value);
    if ($value === '') continue;
    $label = $labels[$key] ?? ucfirst($key);
    $lines[] = $label . ': ' . str_replace(["\r\n", "\r", "\n"], ' / ', $value);
}
// Note any uploaded files by name (attachments are not forwarded).
if (!empty($_FILES)) {
    foreach ($_FILES as $file) {
        if (!empty($file['name'])) $lines[] = 'Attached file: ' . clean_header($file['name']);
    }
}
$lines[] = str_repeat('-', 44);
$lines[] = 'Submitted: ' . date('Y-m-d H:i:s');

$body = implode("\r\n", $lines);

$headers = [];
$headers[] = 'From: ' . $FROM_NAME . ' <' . $FROM_ADDRESS . '>';
$headers[] = 'Reply-To: ' . ($clientEmail ?: $FROM_ADDRESS);
$headers[] = 'Content-Type: text/plain; charset=utf-8';
$headers[] = 'MIME-Version: 1.0';

$sent = @mail($COMPANY_INBOX, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to send the message.']);
}
