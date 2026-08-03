<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';
[$siteUrl] = cb_site_context(0);
header('Content-Type: text/plain; charset=utf-8');
echo "User-agent: *\nAllow: /\nDisallow: " . parse_url($siteUrl, PHP_URL_PATH) . "/contact.php\nSitemap: " . $siteUrl . "/sitemap.xml\n";
