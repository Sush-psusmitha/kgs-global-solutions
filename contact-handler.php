<?php
/**
 * Contact form handler — validates the submission and emails it to
 * the sales inbox. Returns JSON so the front-end (js/contact-form.js)
 * can show the success/error state without a page reload.
 *
 * Requires a server with a working mail transport (sendmail/SMTP)
 * configured in php.ini for mail() to actually deliver.
 */

header('Content-Type: application/json; charset=utf-8');

/* Safety net: if a fatal error occurs anywhere below (missing PHP extension,
   etc.), still return JSON instead of a blank 500. Details go to the server
   log only — never to the client. */
register_shutdown_function(function () {
  $err = error_get_last();
  if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
    error_log('Contact form fatal error: ' . $err['message'] . ' in ' . $err['file'] . ':' . $err['line']);
    if (!headers_sent()) {
      http_response_code(500);
    }
    echo json_encode([
      'success' => false,
      'message' => 'We could not send your message right now. Please try again shortly.',
    ]);
  }
});

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
  exit;
}

function field($key) {
  return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

/* mb_strlen() requires the mbstring extension, which isn't guaranteed on
   every host — fall back to strlen() rather than fatal-erroring the whole request. */
function str_len($str) {
  return function_exists('mb_strlen') ? mb_strlen($str, 'UTF-8') : strlen($str);
}

$fullName = field('full_name');
$email    = field('email');
$country  = field('country');
$phone    = field('phone');
$service  = field('service');
$message  = field('message');
$agree    = isset($_POST['agree']) && $_POST['agree'] !== '';
$captcha  = field('captcha');
$captchaExpected = field('captcha_expected');

$errors = [];

if ($fullName === '' || str_len($fullName) < 2) {
  $errors['full_name'] = 'Please enter a valid full name.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors['email'] = 'Please enter a valid email address.';
}

if ($country === '') {
  $errors['country'] = 'Please select your country.';
}

$phoneDigits = preg_replace('/\D/', '', $phone);
if ($phone === '' || strlen($phoneDigits) < 7 || strlen($phoneDigits) > 15) {
  $errors['phone'] = 'Please enter a valid phone number.';
}

if ($message === '' || str_len($message) < 10) {
  $errors['message'] = 'Message should be at least 10 characters.';
}

if (!$agree) {
  $errors['agree'] = 'You must agree to the Privacy Policy.';
}

/* The CAPTCHA is generated and rendered client-side (js/contact-form.js draws
   it on a <canvas>); the generated code travels along as a hidden field so
   we can re-check it here. This is a spam-friction check, not a hardened
   bot defense — a hidden field is readable in the page source, so a scripted
   submitter that reads the DOM can satisfy it. */
if ($captcha === '' || $captchaExpected === '' || strcasecmp($captcha, $captchaExpected) !== 0) {
  $errors['captcha'] = 'Incorrect code. Please try again.';
}

if (!empty($errors)) {
  http_response_code(422);
  echo json_encode([
    'success' => false,
    'message' => 'Please check the highlighted fields.',
    'errors' => $errors,
  ]);
  exit;
}

$to        = 'sushsusmitha13@gmail.com';
$subject   = 'New Contact Form Submission - Kotnani Global Solutions';
$fromEmail = 'no-reply@kotnaniglobal.com';
$fromName  = 'Kotnani Global Solutions Website';

/* Escape for safe interpolation into the HTML body below */
function clean_html($str) {
  return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

/* Header injection guard: strip CR/LF from anything interpolated into a
   header, even though $email is already filter_var()-validated and
   FILTER_VALIDATE_EMAIL rejects control characters — belt and suspenders. */
$safeReplyName  = str_replace(["\r", "\n"], '', $fullName);
$safeReplyEmail = str_replace(["\r", "\n"], '', $email);
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$safeReplyName} <{$safeReplyEmail}>\r\n";
$headers .= "Return-Path: {$fromEmail}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$body = "
<html>
<body style='font-family:Arial,sans-serif'>

<h3>New Website Enquiry</h3>

<p><strong>Full Name:</strong> " . clean_html($fullName) . "</p>
<p><strong>Email:</strong> " . clean_html($email) . "</p>
<p><strong>Country:</strong> " . clean_html($country) . "</p>
<p><strong>Phone Number:</strong> " . clean_html($phone) . "</p>
<p><strong>Service Interested:</strong> " . clean_html($service !== '' ? $service : 'Not specified') . "</p>
<p><strong>Message:</strong></p>
<p>" . nl2br(clean_html($message)) . "</p>

<br>

<p style='font-size:12px;color:#777'>
This message was sent from the Kotnani Global Solutions website contact form.
</p>

</body>
</html>
";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
  echo json_encode([
    'success' => true,
    'message' => 'Your message has been sent successfully!',
  ]);
} else {
  $lastError = error_get_last();
  $debugReason = $lastError ? $lastError['message'] : 'no error info available (mail() may be disabled or sendmail is not configured on this server)';
  error_log('Contact form mail() failed: ' . $debugReason);
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'We could not send your message right now. Please try again shortly.',
  ]);
}
