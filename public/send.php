<?php
declare(strict_types=1);

/** Contact and partnership enquiries. Configuration: docs/DEPLOYMENT.md. */
$recipient = getenv('ERK_MAIL_TO') ?: 'info@erkdynamics.com';
$sender = getenv('ERK_MAIL_FROM') ?: 'no-reply@erkdynamics.com';

function respond(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Method not allowed.']);
}
// Browser cross-site submissions are rejected. This supplements host rate limits;
// Origin is not authentication and can be forged by non-browser clients.
$allowedOrigins = array_map('trim', explode(',', getenv('ERK_ALLOWED_ORIGINS') ?: 'https://www.erkdynamics.com,https://erkdynamics.com'));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (($origin !== '' && !in_array($origin, $allowedOrigins, true)) ||
    ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') {
    respond(403, ['error' => 'This origin is not allowed.']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    respond(413, ['error' => 'The enquiry is too large.']);
}
if (!empty($_FILES)) {
    respond(422, ['error' => 'File attachments are not supported.']);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if (!in_array($contentType, ['', 'application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'], true)) {
    respond(415, ['error' => 'Unsupported content type.']);
}
$data = $_POST;
if ($contentType === 'application/json') {
    $body = file_get_contents('php://input', false, null, 0, 65537);
    if ($body === false) respond(400, ['error' => 'Unable to read the request.']);
    if (strlen($body) > 65536) respond(413, ['error' => 'The enquiry is too large.']);
    $object = json_decode($body);
    if (!$object instanceof stdClass) respond(400, ['error' => 'Invalid JSON object.']);
    $data = (array) $object;
}
foreach ($data as $value) {
    if (!is_string($value)) {
        respond(422, ['error' => 'Form fields must contain text.']);
    }
}
$data = array_map(static fn ($value) => trim((string) $value), $data);

// Silently discard honeypot submissions without sending mail.
if (!empty($data['website'])) respond(200, ['ok' => true]);

$isPartner = ($data['type'] ?? '') === 'partner';
$required = $isPartner
    ? ['name', 'email', 'company', 'region', 'organizationType']
    : ['name', 'email', 'company', 'country', 'interest'];
foreach ($required as $field) {
    if (empty($data[$field])) respond(422, ['error' => 'Please complete all required fields.']);
}
if (preg_match('/[\x00-\x1F\x7F]/', $data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, ['error' => 'Please provide a valid email address.']);
}
foreach ($data as $key => $value) {
    if (strlen($value) > ($key === 'message' ? 10000 : 500)) {
        respond(422, ['error' => 'One or more form fields are too long.']);
    }
}
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($sender, FILTER_VALIDATE_EMAIL)) {
    respond(500, ['error' => 'Mail delivery is not configured.']);
}

$labels = [
    'name' => 'Full name', 'email' => 'Email', 'company' => 'Company', 'phone' => 'Phone',
    'country' => 'Country / region', 'region' => 'Country / region',
    'organizationType' => 'Organization type', 'interest' => 'Reason for contact',
    'product' => 'Product category', 'intent' => 'Intent', 'message' => 'Message',
    'reference' => 'Reference',
];
$lines = [
    'New ' . ($isPartner ? 'partnership application' : 'enquiry') . ' from the ERK Dynamics website',
    str_repeat('-', 44),
];
foreach ($labels as $key => $label) {
    if (!empty($data[$key])) {
        $lines[] = $label . ': ' . str_replace(["\r\n", "\r", "\n"], ' / ', $data[$key]);
    }
}
$lines[] = 'Submitted (UTC): ' . gmdate('Y-m-d H:i:s');

// Build headers and subject on the server; ignore client-provided subjects.
$subject = ($isPartner ? 'Partnership application' : 'Website enquiry') . ' - ERK Dynamics';
$headers = [
    'From: ERK Dynamics Website <' . $sender . '>',
    'Reply-To: ' . $data['email'],
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
];
$accepted = false;
try {
    // Log transport diagnostics server-side; never leak warnings into the response.
    $accepted = @mail($recipient, $subject, implode("\r\n", $lines), implode("\r\n", $headers));
} catch (Throwable $error) {
    error_log('ERK enquiry mail transport failed.');
}
if (!$accepted) {
    respond(500, ['error' => 'Unable to send the message. Please try again later.']);
}
// Acceptance by the local mail service does not guarantee final inbox delivery.
respond(200, ['ok' => true]);
