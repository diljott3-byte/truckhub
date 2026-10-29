#!/usr/bin/env python3
"""Prepare production metadata with Python's standard library (no packages needed).
Run from any directory: python tools/prepare_production_seo.py https://your-verified-domain.com
"""
from pathlib import Path
from urllib.parse import urlsplit, quote
import sys
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'inventory.html', 'finance.html', 'about.html', 'contact.html']
TRAILERS = ['TH-T001', 'TH-T002', 'TH-T003']


def set_tag_attribute(html, tag_regex, attr, value):
    def rewrite_tag(m):
        tag = m.group(0)
        new_attr = f'{attr}="{value}"'
        if re.search(r'\b' + re.escape(attr) + r'="[^"]*"', tag):
            return re.sub(r'\b' + re.escape(attr) + r'="[^"]*"', new_attr, tag, count=1)
        return tag[:-1] + ' ' + new_attr + '>'
    return re.sub(tag_regex, rewrite_tag, html, count=1, flags=re.I)


def main(origin):
    site = origin.rstrip('/')
    parts = urlsplit(site)
    if parts.scheme != 'https' or not parts.hostname or parts.path not in ('', '/') or parts.query or parts.fragment:
        raise SystemExit('Use your verified HTTPS origin only, e.g. https://www.your-domain.com')
    for page in PAGES + ['truck.html']:
        path = ROOT / page
        html = path.read_text()
        url = site + ('/' if page == 'index.html' else '/' + page)
        html = set_tag_attribute(html, r'<link\b[^>]*\brel="canonical"[^>]*>', 'href', url)
        html = set_tag_attribute(html, r'<meta\b[^>]*\bproperty="og:image"[^>]*>', 'content', site + '/assets/images/og-truck-hub.jpg')
        if re.search(r'<meta\b[^>]*\bproperty="og:url"[^>]*>', html, flags=re.I):
            html = set_tag_attribute(html, r'<meta\b[^>]*\bproperty="og:url"[^>]*>', 'content', url)
        else:
            html = re.sub(r'</head\s*>', f'  <meta property="og:url" content="{url}">\n</head>', html, count=1, flags=re.I)
        path.write_text(html)
    ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root = ET.Element(ns + 'urlset')
    paths = ['/', '/inventory.html', '/finance.html', '/about.html', '/contact.html']
    paths += ['/truck.html?id=' + quote(item) for item in TRAILERS]
    for p in paths:
        url = ET.SubElement(root, ns + 'url')
        ET.SubElement(url, ns + 'loc').text = site + p
    ET.indent(root)
    (ROOT / 'sitemap.xml').write_bytes(ET.tostring(root, encoding='utf-8', xml_declaration=True))
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + site + '/sitemap.xml\n')
    config = ROOT / 'assets/js/config.js'
    config.write_text(re.sub(r"siteUrl: '[^']*'", "siteUrl: '" + site + "'", config.read_text()))
    print('Production SEO prepared for ' + site + ' (8 sitemap URLs).')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python tools/prepare_production_seo.py https://your-real-domain.com')
    main(sys.argv[1])
