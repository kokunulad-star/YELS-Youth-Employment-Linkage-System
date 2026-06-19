# Database Installation & Configuration

This guide covers MySQL database installation for both Linux and Windows, how the YELS backend uses database credentials, and how to manage the database with Beekeeper Studio.

---

## 1. MySQL Installation

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo service mysql start
```

Verify it's running:

```bash
sudo service mysql status
```

### Windows

1. Download the **MySQL Installer** from https://dev.mysql.com/downloads/installer/
2. Run the installer and choose **Server only** or **Developer Default**
3. During setup:
   - Set a **root password** — save this for later
   - Choose **Use Strong Password Encryption**
4. Start the MySQL service:
   - `Win + R` → `services.msc` → right-click **MySQL80** → **Start**
   - Or: `net start MySQL80` in Command Prompt (Admin)

---

## 2. How Database Credentials Work in YELS

The backend connects to MySQL using credentials stored in the `.env` file in the `backend/` directory.

### The `.env` entry

```
DATABASE_URL=mysql+pymysql://root:yels_password@localhost:3306/yels_db
```

Broken down:

| Part | Meaning |
|---|---|
| `mysql+pymysql` | Database driver (MySQL via PyMySQL library) |
| `root` | MySQL username |
| `yels_password` | MySQL user password |
| `localhost` | Database host (same machine) |
| `3306` | Default MySQL port |
| `yels_db` | Database name (created by `schema.sql`) |

### Where credentials are loaded

- `backend/app/config.py` reads `DATABASE_URL` from `.env` using `pydantic-settings`
- `backend/app/database.py` passes the URL to SQLAlchemy's `create_engine()`
- All models and queries use this engine to connect

### Changing credentials

If you change your MySQL password, update only the password portion in `DATABASE_URL`:

```
DATABASE_URL=mysql+pymysql://root:new_password@localhost:3306/yels_db
```

No code changes needed.

---

## 3. Fixing MySQL Root Auth on Ubuntu 24.04+

Ubuntu 24.04 installs MySQL 8.0 with `auth_socket` by default — root can only log in via `sudo mysql` (no password). To enable password-based login:

```bash
sudo mysql
```

Inside the MySQL prompt:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yels_password';
FLUSH PRIVILEGES;
EXIT;
```

Now test:

```bash
mysql -u root -p
```

Enter `yels_password` when prompted.

---

## 4. Creating the YELS Database

Run the schema file to create the `yels_db` database and all 14 tables:

### Linux

```bash
mysql -u root -p < ../db/schema.sql
```

### Windows

```cmd
mysql -u root -p < ..\db\schema.sql
```

### Verify

```bash
mysql -u root -p -e "USE yels_db; SHOW TABLES;"
```

Expected tables:

```
applications
application_status_history
conversations
investor_profiles
messages
notifications
opportunities
opportunity_skills
organization_profiles
skills
users
youth_education
youth_profiles
youth_skills
```

---

## 5. How to Use the Database

### Via Command Line

Connect and run queries:

```bash
mysql -u root -p yels_db
```

Useful commands once inside `mysql>`:

| Command | Purpose |
|---|---|
| `SHOW TABLES;` | List all tables |
| `DESCRIBE users;` | Show columns of a table |
| `SELECT * FROM users;` | Query all users |
| `SELECT * FROM applications WHERE status = 'pending';` | Filter records |
| `EXIT;` | Quit the MySQL prompt |

### Reset / Rebuild the Database

```bash
mysql -u root -p -e "DROP DATABASE yels_db;"
mysql -u root -p < ../db/schema.sql
```

### Backup & Restore

```bash
# Backup
mysqldump -u root -p yels_db > yels_backup.sql

# Restore
mysql -u root -p yels_db < yels_backup.sql
```

---

## 6. Beekeeper Studio (GUI Tool)

Beekeeper Studio is a free, open-source GUI for managing databases visually.

### Installation

#### Linux (Ubuntu/Debian)

**Option A — .deb package:**

```bash
wget https://github.com/beekeeper-studio/beekeeper-studio/releases/latest/download/beekeeper-studio_*.deb
sudo dpkg -i beekeeper-studio_*.deb
sudo apt-get install -f
```

**Option B — Snap:**

```bash
sudo snap install beekeeper-studio
```

**Option C — AppImage:**

```bash
chmod +x Beekeeper-Studio-*.AppImage
./Beekeeper-Studio-*.AppImage
```

Launch via app menu or `beekeeper-studio`.

#### Windows

**Option A — Installer:**

1. Go to https://github.com/beekeeper-studio/beekeeper-studio/releases
2. Download `Beekeeper-Studio-Setup-*.exe`
3. Run the installer

**Option B — Portable:**

Download `Beekeeper-Studio-*-portable.exe` — no install needed.

**Option C — Winget:**

```powershell
winget install BeekeeperStudio.BeekeeperStudio
```

### Connecting to YELS Database

1. Open Beekeeper Studio
2. Click **New Connection** (or **+**)
3. Select **MySQL** as connection type
4. Fill in:

| Field | Value |
|---|---|
| Host | `localhost` or `127.0.0.1` |
| Port | `3306` |
| User | `root` |
| Password | The password from `.env` |
| Database | `yels_db` |
| Display Name | `YELS` (optional) |
| SSL | Disabled (local dev only) |

5. Click **Test Connection** → if successful, click **Save** → **Connect**

### Using Beekeeper Studio

| Feature | How To |
|---|---|
| **Browse tables** | Click a table name in the left sidebar |
| **Run SQL queries** | Click **SQL Query** tab → type SQL → `Ctrl+Enter` |
| **View table structure** | Right-click a table → **View Columns** |
| **Export data** | Right-click results → **Export** → CSV / JSON / Excel |
| **ER diagram** | Right-click a table → **View Diagram** |
| **Filter rows** | Click the filter icon in the table toolbar |

---

## 7. Common Issues

| Problem | Cause | Fix |
|---|---|---|
| `Can't connect to MySQL server` | MySQL service not running | Linux: `sudo service mysql start` — Windows: `net start MySQL80` |
| `Access denied for user 'root'@'localhost'` | Wrong password or `auth_socket` | See Section 3 above |
| `Unknown database 'yels_db'` | Schema not imported | Run `mysql -u root -p < ../db/schema.sql` |
| `Port 3306 already in use` | Another MySQL instance running | Check with `sudo lsof -i :3306` (Linux) or `netstat -ano | findstr :3306` (Windows) |
| `.env` not being read | File missing or wrong directory | Ensure `.env` exists in `backend/` (not just `.env.example`) |
