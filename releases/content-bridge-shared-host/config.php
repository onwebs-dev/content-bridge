<?php
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

return [
    'smtp_host' => 'mail.onwebs.ir',
    'smtp_port' => 465,
    'smtp_username' => 'ceo@onwebs.ir',
    // رمز واقعی SMTP را فقط بین دو کوتیشن زیر وارد کنید.
    'smtp_password' => '',
    'from_name' => 'ویرا وب آریا',
    'from_email' => 'ceo@onwebs.ir',
    'to_email' => 'ftsepi@gmail.com',
];
