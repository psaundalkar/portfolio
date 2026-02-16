# Fix 408 / 4.99 GiB push – fresh Git history

The large push fails because **old commits** still contain `node_modules` and `dist`.  
Use a **new Git history** with a single commit (no big files). Run everything from the project folder.

---

## 1. Save your remote URL (if you use HTTPS)

```bash
cd /Users/nobita/Developer/Portfolio
git remote get-url origin
```

Copy the URL (e.g. `https://github.com/psaundalkar/portfolio.git`). You’ll need it in step 5.

---

## 2. Delete the old Git history and start over

```bash
cd /Users/nobita/Developer/Portfolio
rm -rf .git
git init
```

---

## 3. One commit with only the right files

`.gitignore` already ignores `node_modules`, `server/node_modules`, and `dist`, so they won’t be added.

```bash
git add .
git status
```

Check that you do **not** see `node_modules`, `server/node_modules`, or `dist` in the list. If you do, stop and say so.

```bash
git commit -m "Initial commit: portfolio"
```

---

## 4. Use `main` and attach your GitHub repo

Use the **same URL** you copied in step 1 (replace if yours is different):

```bash
git branch -M main
git remote add origin https://github.com/psaundalkar/portfolio.git
```

---

## 5. Push (overwrites GitHub with the new history)

```bash
git push -u origin main --force
```

Use your **Personal Access Token** as the password if Git asks. The push should be small (a few MB) and succeed.

---

**Summary:** Remove `.git` → `git init` → `git add .` → `git commit` → `git remote add origin <url>` → `git push --force`. That replaces the repo’s history on GitHub with one clean, small commit.
