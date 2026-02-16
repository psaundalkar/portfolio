# Push This Project to GitHub

Your project already has **git initialized**. Follow these steps to push to GitHub.

## 1. Remove any stale lock (if you see "index.lock" errors)

```bash
rm -f .git/index.lock
```

## 2. Stage and commit (if you don’t have a commit yet)

```bash
cd /Users/nobita/Developer/Portfolio

git add .
git status   # optional: check what will be committed

git commit -m "Initial commit: Portfolio with gallery, courses, contact"
```

## 3. Create a new repo on GitHub

1. Open [github.com/new](https://github.com/new).
2. Set **Repository name** (e.g. `portfolio` or `astrophotography-portfolio`).
3. Choose **Public**.
4. **Do not** add a README, .gitignore, or license (you already have them).
5. Click **Create repository**.

## 4. Rename branch to `main` and add remote (optional but common)

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and the repo name you chose.

## 5. Push to GitHub

```bash
git push -u origin main
```

If GitHub asks for login, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens) or use SSH (e.g. `git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git` as remote).

---

**Summary:** Run the commands in 2, then create the repo (3), then run 4 and 5 with your real repo URL.
