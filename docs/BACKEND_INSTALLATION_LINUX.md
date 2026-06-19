# YELS Backend Installation Guide — Linux

## Prerequisites

- **Python 3.10+** — verify with `python3 --version`
- **pip** — verify with `pip3 --version`
- **MySQL 8.0+** — verify with `mysql --version`
- **Git** — optional, for cloning

## Step 1: Install MySQL Server (if not already installed)

```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo service mysql start
```

Secure the installation (optional but recommended):

```bash
sudo mysql_secure_installation
```

## Step 2: Create the Database

```bash
mysql -u root -p < ../db/schema.sql
```

This creates the `yels_db` database and all 14 tables.

Verify:

```bash
mysql -u root -p -e "USE yels_db; SHOW TABLES;"
```

## Step 3: Navigate to the Backend Directory

```bash
cd /path/to/YELS-Youth-Employment-Linkage-System/backend
```

## Step 4: Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

Your prompt should now show `(venv)`.

## Step 5: Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Step 6: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/yels_db
SECRET_KEY=generate-a-strong-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
UPLOAD_DIR=uploads
```

Generate a secure `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Step 7: Start the Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 8: Verify the API

| Endpoint | URL |
|---|---|
| Health Check | http://localhost:8000/ |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

## Troubleshooting

| Error | Solution |
|---|---|
| `pip: command not found` | Install pip: `sudo apt-get install -y python3-pip` |
| `Can't connect to MySQL server` | Ensure MySQL is running: `sudo service mysql status` |
| `Access denied for user 'root'` | Check credentials in `.env` or reset root password: `sudo mysql` then `ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';` |
| `Port 8000 already in use` | Change port: `uvicorn app.main:app --reload --port 8001` |
| Module not found | Ensure venv is activated and `pip install -r requirements.txt` completed |

## Stopping the Server

Press `Ctrl+C` in the terminal. Deactivate the venv:

```bash
deactivate
```
