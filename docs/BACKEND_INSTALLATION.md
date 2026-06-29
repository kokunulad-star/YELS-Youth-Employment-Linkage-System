# YELS Backend Installation Guide

## Prerequisites

| Requirement | Linux | Windows |
|---|---|---|
| **Python** | `python3 --version` (3.10+) | [python.org](https://python.org) |
| **pip** | `pip3 --version` | Included with Python 3.4+ |
| **MySQL** | `mysql --version` (8.0+) | [MySQL Installer](https://dev.mysql.com/downloads/installer/) |
| **Git** (optional) | `git --version` | [git-scm.com](https://git-scm.com) |

---

## 1. Install MySQL Server

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo service mysql start
```

### Windows

1. Run the MySQL Installer → choose **Server only** or **Developer Default**
2. Set a **root password** during setup
3. Start the MySQL80 service:
   - `Win + R` → `services.msc` → find **MySQL80** → right-click → **Start**
   - Or: `net start MySQL80` in Command Prompt (Admin)

---

## 2. Create the Database

### Linux

**If root uses `auth_socket` (default on Ubuntu 24.04):**

```bash
sudo mysql
```

Inside the MySQL prompt, set a password and switch auth:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yels_password';
FLUSH PRIVILEGES;
EXIT;
```

Then import the schema:

```bash
mysql -u root -p < ../db/schema.sql
```

**If root already uses password auth:**

```bash
mysql -u root -p < ../db/schema.sql
```

Verify:

```bash
mysql -u root -p -e "USE yels_db; SHOW TABLES;"
```

### Windows

```cmd
mysql -u root -p < ..\db\schema.sql
```

Verify:

```cmd
mysql -u root -p -e "USE yels_db; SHOW TABLES;"
```

---

## 3. Navigate to Backend

```bash
cd /path/to/YELS-Youth-Employment-Linkage-System/backend
```

---

## 4. Create & Activate a Virtual Environment

### Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```cmd
python -m venv venv
venv\Scripts\activate
```

If you get an execution policy error on Windows, run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry `venv\Scripts\activate`.

Your prompt should now show `(venv)`.

---

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 6. Configure Environment

```bash
cp .env.example .env        # Linux
copy .env.example .env      # Windows
```

Edit `.env` with your MySQL credentials and a strong secret key:

```
DATABASE_URL=mysql+pymysql://root:yels_password@localhost:3306/yels_db
SECRET_KEY=<generate-a-strong-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
UPLOAD_DIR=uploads
```

Generate a secure `SECRET_KEY`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 7. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## 8. Verify

| Endpoint | URL |
|---|---|
| Health Check | http://localhost:8000/ |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

## Troubleshooting

| Error | Solution |
|---|---|
| `pip: command not found` | Linux: `sudo apt-get install python3-pip` — Windows: reinstall Python with "Add to PATH" |
| `Can't connect to MySQL server` | Linux: `sudo service mysql status` — Windows: `net start MySQL80` |
| `Access denied for user 'root'` | Check credentials in `.env`. On Ubuntu 24.04, run `sudo mysql` then `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';` |
| `'mysql' not recognized` (Windows) | Add MySQL `bin` to PATH (`C:\Program Files\MySQL\MySQL Server 8.0\bin`) |
| `Port 8000 already in use` | Change port: `uvicorn app.main:app --reload --port 8001` |
| Module not found | Ensure venv is activated and `pip install -r requirements.txt` completed |
| `Fatal error in launcher` (Windows) | Ensure the venv where deps were installed is the one activated |

## Stopping the Server

`Ctrl+C` then:

```bash
deactivate
```
