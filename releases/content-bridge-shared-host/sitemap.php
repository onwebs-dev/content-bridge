<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';
[$siteUrl] = cb_site_context(0);
header('Content-Type: application/xml; charset=utf-8');
$fa = cb_e($siteUrl . '/');
$en = cb_e($siteUrl . '/en/');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc><?= $fa ?></loc><xhtml:link rel="alternate" hreflang="fa-IR" href="<?= $fa ?>"/><xhtml:link rel="alternate" hreflang="en-US" href="<?= $en ?>"/><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc><?= $en ?></loc><xhtml:link rel="alternate" hreflang="fa-IR" href="<?= $fa ?>"/><xhtml:link rel="alternate" hreflang="en-US" href="<?= $en ?>"/><changefreq>monthly</changefreq><priority>0.9</priority></url>
</urlset>
