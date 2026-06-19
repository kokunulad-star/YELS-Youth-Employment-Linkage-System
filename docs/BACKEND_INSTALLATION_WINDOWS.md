# YELS Backend Installation Guide — Windows

## Prerequisites

- **Python 3.10+** — download from [python.org](https://python.org)
- **MySQL 8.0+** — download from [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/)
- **Git** — optional, download from [git-scm.com](https://git-scm.com)

Ensure Python and MySQL are added to your system `PATH` during installation.

## Step 1: Install MySQL Server

1. Run the MySQL Installer and choose **Server only** or **Developer Default**
2. Set a **root password** during setup (note it down)
3. Ensure the **MySQL80** service is running:
   - Open **Services** (`Win + R`, type `services.msc`)
   - Find **MySQL80**, right-click → **Start** if not running

## Step 2: Create the Database

Open **MySQL Command Line Client** or **Command Prompt**:

```cmd
mysql -u root -p < ..\db\schema.sql
```

Enter your root password when prompted.

Verify:

```cmd
mysql -u root -p -e "USE yels_db; SHOW TABLES;"
```

## Step 3: Navigate to the Backend Directory

```cmd
cd C:\path\to\YELS-Youth-Employment-Linkage-System\backend
```

## Step 4: Create and Activate a Virtual Environment

```cmd
python -m venv venv
venv\Scripts\activate
```

Your prompt should now show `(venv)`.

If you get an execution policy error, run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry `venv\Scripts\activate`.

## Step 5: Install Python Dependencies

```cmd
pip install -r requirements.txt
```

## Step 6: Configure Environment Variables

```cmd
copy .env.example .env
```

Edit `.env` in a text editor (Notepad, VS Code, etc.) with your MySQL credentials:

```
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/yels_db
SECRET_KEY=generate-a-strong-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
UPLOAD_DIR=uploads
```

Generate a secure `SECRET_KEY`:

```cmd
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Step 7: Start the Development Server

```cmd
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
| `'pip' is not recognized` | Ensure Python is in PATH, or use `python -m pip install -r requirements.txt` |
| `'mysql' is not recognized` | Add MySQL `bin` folder to PATH (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`) |
| `Can't connect to MySQL server` | Start MySQL service: `net start MySQL80` |
| `Access denied for user 'root'` | Check password in `.env`. Reset if needed: `mysqladmin -u root -p password` |
| `Port 8000 already in use` | Change port: `uvicorn app.main:app --reload --port 8001` |
| `Fatal error in launcher: Unable to create process` | Ensure the venv is the one where dependencies were installed |
| Module not found | Ensure venv is activated and `pip install -r requirements.txt` completed |

## Stopping the Server

Press `Ctrl+C` in the terminal. Deactivate the venv:

```cmd
deactivate
```
