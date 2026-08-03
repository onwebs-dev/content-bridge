<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(string $message, int $status = 200): never {
    http_response_code($status);
    echo json_encode(['message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function limited_text(mixed $value, int $length): string {
    if (!is_string($value)) return '';
    $value = trim($value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $length, 'UTF-8') : substr($value, 0, $length);
}

function smtp_read($socket): array {
    $lines = [];
    while (($line = fgets($socket, 2048)) !== false) {
        $lines[] = rtrim($line, "\r\n");
        if (preg_match('/^(\d{3}) /', $line, $match)) {
            return [(int)$match[1], implode("\n", $lines)];
        }
    }
    throw new RuntimeException('SMTP connection closed unexpectedly');
}

function smtp_expect($socket, array $expected): void {
    [$code] = smtp_read($socket);
    if (!in_array($code, $expected, true)) {
        throw new RuntimeException('SMTP rejected the request: ' . $code);
    }
}

function smtp_command($socket, string $command, array $expected): void {
    if (fwrite($socket, $command . "\r\n") === false) {
        throw new RuntimeException('Could not write to SMTP connection');
    }
    smtp_expect($socket, $expected);
}

function encoded_header(string $value): string {
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function send_smtp(array $config, string $subject, string $replyTo, string $html): void {
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
            'SNI_enabled' => true,
            'peer_name' => $config['smtp_host'],
        ],
    ]);
    $socket = @stream_socket_client(
        'ssl://' . $config['smtp_host'] . ':' . $config['smtp_port'],
        $errorNumber,
        $errorMessage,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) throw new RuntimeException('SMTP connection failed: ' . $errorNumber);
    stream_set_timeout($socket, 15);

    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO contentbridge.local', [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($config['smtp_username']), [334]);
        smtp_command($socket, base64_encode($config['smtp_password']), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $config['from_email'] . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $config['to_email'] . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $headers = [
            'From: ' . encoded_header($config['from_name']) . ' <' . $config['from_email'] . '>',
            'To: <' . $config['to_email'] . '>',
            'Reply-To: <' . $replyTo . '>',
            'Subject: ' . encoded_header($subject),
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@onwebs.ir>',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($html), 76, "\r\n"),
        ];
        $message = implode("\r\n", $headers);
        if (fwrite($socket, $message . "\r\n.\r\n") === false) {
            throw new RuntimeException('Could not send SMTP message');
        }
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond('Method not allowed.', 405);
$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);
if (!is_array($payload)) respond('Invalid request.', 400);

$isEnglish = limited_text($payload['locale'] ?? '', 2) === 'en';
$t = static fn(string $fa, string $en): string => $isEnglish ? $en : $fa;
if (limited_text($payload['company_site'] ?? '', 100) !== '') respond($t('درخواست شما ثبت شد.', 'Your request has been received.'));

$startedAt = (int)($payload['startedAt'] ?? 0);
$nowMs = (int)round(microtime(true) * 1000);
if ($startedAt < 1 || ($nowMs - $startedAt) < 1800) respond($t('لطفاً فرم را با دقت کامل کنید.', 'Please take a moment to complete the form carefully.'), 400);

$name = limited_text($payload['name'] ?? '', 80);
$phone = limited_text($payload['phone'] ?? '', 30);
$email = strtolower(limited_text($payload['email'] ?? '', 120));
$website = limited_text($payload['website'] ?? '', 160);
$plan = limited_text($payload['plan'] ?? '', 60) ?: $t('نیاز به مشاوره', 'Needs consultation');
$geoValue = strtolower(limited_text($payload['geo'] ?? '', 10));
$geo = in_array($geoValue, ['بله', 'yes'], true) ? 'بله (+۱۰ میلیون تومان)' : 'خیر';
$notes = limited_text($payload['message'] ?? '', 1200);

if (strlen($name) < 2 || strlen($phone) < 7 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond($t('لطفاً نام، شماره تماس و ایمیل معتبر وارد کنید.', 'Please enter a valid name, phone number and email address.'), 400);
}

$config = require __DIR__ . '/config.php';
if (trim((string)$config['smtp_password']) === '') {
    respond($t('رمز SMTP هنوز در فایل config.php تنظیم نشده است.', 'The SMTP password has not been added to config.php yet.'), 503);
}

$e = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$html = '<!doctype html><html lang="fa" dir="rtl"><body style="margin:0;background:#faf8f3;font-family:Tahoma,Arial,sans-serif;color:#171614"><div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e7e2d8;border-radius:16px;overflow:hidden"><div style="background:#1e211f;color:#fff;padding:28px 32px"><div style="color:#e9a48c;font-size:12px">Content Bridge</div><h1 style="font-size:22px;margin:6px 0 0">درخواست جدید شروع پروژه</h1></div><div style="padding:30px 32px"><table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.8"><tr><td style="padding:8px 0;color:#6c6963;width:145px">نام</td><td style="padding:8px 0;font-weight:bold">' . $e($name) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">شماره تماس</td><td style="padding:8px 0" dir="ltr">' . $e($phone) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">ایمیل</td><td style="padding:8px 0" dir="ltr">' . $e($email) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">وب‌سایت</td><td style="padding:8px 0" dir="ltr">' . $e($website ?: '—') . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">پلن</td><td style="padding:8px 0">' . $e($plan) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">افزودنی GEO</td><td style="padding:8px 0">' . $geo . '</td></tr></table><div style="margin-top:20px;padding:18px;background:#f6e7df;border-radius:10px"><div style="font-size:11px;color:#a94f34;font-weight:bold;margin-bottom:6px">توضیحات متقاضی</div><div style="white-space:pre-wrap;font-size:14px">' . $e($notes ?: 'توضیحی ثبت نشده است.') . '</div></div></div></div></body></html>';

try {
    send_smtp($config, 'درخواست ' . $plan . ' — ' . $name, $email, $html);
    respond($t('درخواست شما با موفقیت ارسال شد.', 'Your request was sent successfully.'));
} catch (Throwable $error) {
    error_log('Content Bridge SMTP: ' . $error->getMessage());
    respond($t('ارسال فرم موقتاً انجام نشد؛ لطفاً چند دقیقه دیگر دوباره تلاش کنید.', 'We could not send the form right now. Please try again in a few minutes.'), 502);
}
