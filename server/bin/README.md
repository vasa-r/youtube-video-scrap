# Using yt-dlp in Your Project

This guide walks you through installing and using `yt-dlp` inside your project directory for fetching YouTube video information.

---

## ✅ 1. Download yt-dlp Inside Your Project

Run the following commands inside your project directory:

```sh
mkdir -p bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod +x bin/yt-dlp
```

This will create a `bin/` folder in your project and place the `yt-dlp` binary inside it.

---

## ✅ 2. Update .gitignore (Optional)

Since `yt-dlp` is a binary file, you may or may not want to commit it to Git.

- **To keep it in the repository** (for easy deployment), do nothing.
- **To exclude it**, add the following to `.gitignore`:

```bash
bin/yt-dlp
```

---

## ✅ 3. Modify Your Code to Use Local yt-dlp

Modify your `youtube-dl-exec` call to explicitly use the local `yt-dlp` binary:

```ts
const rawInfo = await youtubeDl(url, {
  dumpSingleJson: true,
  noWarnings: true,
  preferFreeFormats: true,
  noCheckCertificates: true, // just to bypass ssl certificate issue
  exec: "./bin/yt-dlp", // Use locally stored yt-dlp
});
```

This ensures that `youtube-dl-exec` will use the project-specific binary.

---

## ✅ 4. Deploying with yt-dlp

Since `yt-dlp` is now inside `bin/`, your deployment process must include this folder.

### **For Docker Deployments**

If using Docker, make sure your `Dockerfile` includes:

```dockerfile
COPY bin/yt-dlp /app/bin/yt-dlp
RUN chmod +x /app/bin/yt-dlp
```

### **For Vercel/Heroku Deployments**

Ensure `bin/yt-dlp` is uploaded as part of the deployment.

---

## 🎉 Done!

You are now ready to use `yt-dlp` within your project.
