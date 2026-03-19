# PSW Scheduling API

This project is built using **FastAPI** and uses a local **SQLite** database.

---

## 1. Setup Instructions

Before you can run the server, you need to set up your Python environment and install the required packages.

**Step 1: Open your terminal and navigate to the backend folder**
Make sure your terminal is inside the `backend` directory before running any commands:
```bash
cd back-end
```
^ if you open at the root level of the repo

**Step 2: Create a Virtual Environment**
A virtual environment keeps this project's packages separate from the rest of your computer. You ONLY NEED TO DO THIS ONCE, AT THE START OF YOUR PROJECT!
* **Mac/Linux:** `python3 -m venv venv`
* **Windows:** `python -m venv venv`

**Step 3: Activate the Virtual Environment**
You must do this *every time* you open a new terminal to work on this project!
* **Mac/Linux:** `source venv/bin/activate`
* **Windows:** `venv\Scripts\activate`
*(You will know it worked if you see a green `(venv)` at the beginning of your terminal prompt).*

**Step 4: Install Dependencies**
Install FastAPI, the web server (Uvicorn), and our database tools.
```bash
pip install -r requirements.txt
```
^this recursively (`-r`) goes through all the dependencies through requirements.txt file, and installs the packages.

Any time you add a new dependency that wasnt previously download (i.e., anytime you use pip to install another package), use this command:
```bash
pip freeze > requirements.txt
```
This freezes all the packages in your environments, and funnels them into the requirements.txt so that anyone else can install the same packages in their environment.

---

## 2. Running the Server

To start your backend server, run the following command from inside your `backend` folder:

```bash
uvicorn app.main:app --reload
```
* `app.main:app` tells the server to look inside the `app` folder, open the `main.py` file, and run the `app` variable.
* `--reload` means the server will automatically restart every time you save a Python file!

---

## 3. Testing Your API (The Documentation as you write more endpoints)

You don't need a frontend to test your API! FastAPI automatically generates a beautiful interactive testing page for you.

1. Once your server is running, open your web browser and go to: **http://localhost:8000/docs**
2. Click on the **POST `/schedule/`** dropdown and click **"Try it out"**.
3. Type in a task and patient name, then click **Execute**.
4. Now, look at your VS Code terminal! You will see the **raw SQL** that was generated and sent to the database.
5. Try using the **POST `/schedule/{task_id}/complete`** endpoint to see how data is moved from the Schedule table to the History table using SQL transactions.

---

## 4. Project Structure (What do these files do?)

Here is a map of your project. Pay close attention to the **"Should I touch this?"** notes!

```text
backend/
├── requirements.txt      # Lists the Python packages needed. (Do not change)
├── venv/                 # Your virtual environment. (Do not touch)
├── app.db                # Auto-generated SQLite database! (Do not touch manually)
│
└── app/                  # The actual application folder
    ├── main.py           # Starts the server and plugs in your routers. (should stay light!)
    ├── database.py       # Connects to SQLite and prints SQL to your terminal. (Do not touch)
    ├── models.py         # Tells the app what your database tables look like. (Touch to add new tables)
    │
    └── routers/          # Your API Controllers!
        ├── schedule.py   # all endpoints to do with the schedule
        ├── history.py    # all endpoints to do with the history
```

You can feel free change the routers to be patients and psws if you want! It is your design at the end of the day :)

---

## Pro-Tip: Viewing Your Database
If you click on `app.db` in VS Code, it will look like gibberish. To actually see the data inside your tables, go to the VS Code Extensions tab and install **SQLite Viewer**. Once installed, clicking `app.db` will open a clean spreadsheet view of your database!