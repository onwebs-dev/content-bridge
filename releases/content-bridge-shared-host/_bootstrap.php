<?php
declare(strict_types=1);

function cb_e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function cb_site_context(int $levelsUp = 0): array {
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
    $basePath = dirname($scriptName);
    for ($i = 0; $i < $levelsUp; $i++) {
        $basePath = dirname($basePath);
    }
    $basePath = rtrim(str_replace('\\', '/', $basePath), '/');
    if ($basePath === '.' || $basePath === '/') {
        $basePath = '';
    }

    $forwardedProto = strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https';
    $scheme = $isHttps ? 'https' : 'http';
    $host = (string)($_SERVER['HTTP_HOST'] ?? 'localhost');
    $host = preg_replace('/[^A-Za-z0-9.\-:\[\]]/', '', $host) ?: 'localhost';
    return [$scheme . '://' . $host . $basePath, $basePath];
}
