# Render persistent storage setup for Easy Store

The server supports storing runtime data and uploaded images outside the deploy directory. This is required because files written to a normal Render Web Service filesystem can be lost during a new deploy or instance replacement.

## 1. Add a Persistent Disk in Render

1. Open the Easy Store Web Service in the Render Dashboard.
2. Open **Disks** and add a disk with mount path `/var/data`.
3. Persistent Disks require a paid Render Web Service plan; if the service is Free, use a supported external database/object-storage service instead.

## 2. Add these Environment Variables

In **Environment** for the Web Service, add:

- `EASYSTORE_DATA_DIR` = `/var/data/data`
- `EASYSTORE_UPLOADS_DIR` = `/var/data/uploads`
- `EASYSTORE_BACKUPS_DIR` = `/var/data/backups`

Save changes and deploy the service. The server creates these folders automatically.

## 3. Back up and restore existing data

Before changing the storage mount, sign in to the Admin Panel and use the backup/export function in Settings to download a full Easy Store backup. After the new deployment starts, restore that backup from the Admin Panel. This is important because adding a disk does not automatically copy files from the old ephemeral filesystem.

## 4. What is stored where?

- `data/site.json`: store settings, products, categories, orders, messages, customers and configuration.
- `uploads/`: images uploaded from the Admin Panel.
- `backups/`: backup files, including automatic daily backups where supported by the app.

The repository now includes `data/seed.json`, so a fresh instance can initialize with the bundled product/category/settings data rather than an empty store.

## Important notes

- Do not put passwords, API secrets, or customer data in GitHub.
- Keep a separate backup outside the Render service too.
- This setup persists the app's existing JSON-based data store. It does **not** migrate the app to PostgreSQL. A PostgreSQL migration would require separate code changes and data migration.
- Static banner images committed to the GitHub repository are versioned with the code; banners uploaded through the Admin Panel are stored under the uploads directory and need the Persistent Disk (or external object storage) to survive redeploys.
