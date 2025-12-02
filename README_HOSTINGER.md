Hostinger deployment checklist

This project is a static front-end + PHP API app (no Node required for production).
Follow these steps to deploy on Hostinger (Apache + PHP + MySQL):

1) Upload files
- Upload the repository files to `public_html/` (or desired subfolder) via FTP/File Manager.
- Recommended: move `config.php` outside `public_html` for security (e.g. to `~/config/`) and update `require_once` paths in `api/*.php` accordingly.

2) Create MySQL database
- In Hostinger control panel -> Databases -> MySQL Databases, create a database and user.
- Note the database name, user and password.

3) Update `config.php`
- Edit `config.php` and set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` to the values from Hostinger.

4) Import DB schema
- Open phpMyAdmin (Hostinger panel) and import `database.sql` provided in the repo.
- If you prefer, the PHP endpoints attempt to create the table automatically, but importing is recommended.

5) File permissions
- Ensure files are 644 and directories 755. In most upload tools this is automatic.

6) .htaccess (optional)
- If you host in a subfolder or use rewrites, use a permissive .htaccess that preserves existing files. See provided `.htaccess`.

7) Test endpoints
- Open in browser: `https://your-domain.tld/`
- Check admin panel: `https://your-domain.tld/admin.html`
- If the site is blank, open browser DevTools → Console and Network and paste any errors here.

8) Common fixes
- If API calls fail (fetch), check that `api/*.php` are reachable: `https://your-domain.tld/api/rsvp.php` should return a JSON error when called with GET.
- If QR code doesn't render, ensure internet/CDN access is allowed and the QR CDN is reachable.

Notes
- This project contains some Node files (`server.js`, `database.js`, `package.json`) used for local development. These are not required on Hostinger and can be ignored/removed on the server.
- For extra security, place `config.php` outside the webroot and update `require_once` paths in `api/*.php`.

If you want, I can:
- Generate a ready `.htaccess` and patch `api/*.php` to attempt loading `config.php` from an external path if present.
- Remove Node-related files from the deployment bundle.

Tell me which of these you'd like me to apply now.
