# Brewer's Toolkit on GitHub (free): hosting + automatic news

The app is hosted by GitHub Pages. A GitHub Action fetches the news feeds every ~30 minutes and saves them to news.json,
which the app reads. No other accounts or services are needed.

## One-time setup
1. **Create a GitHub account** at github.com (free).
2. **Create a repository:** click + (top right) > New repository. Name it `brewers-toolkit`, choose **Public**, click Create repository.
3. **Upload the app files:** unzip brewers-toolkit-app.zip. In your repo click **Add file > Upload files** and drag in
   index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png, feeds.json, news.json, README.md and the `scripts` folder.
   Click **Commit changes**.
4. **Add the automation file:** click **Add file > Create new file**. In the name box type
   `.github/workflows/update-news.yml` (typing the slashes creates the folders). Paste in the contents of the separate update-news.yml file (it is also inside the zip, in the hidden .github/workflows folder),
   then **Commit changes**. (Done this way because hidden folders like .github often don't upload by drag-and-drop.)
5. **Allow the automation to save:** Settings > Actions > General > Workflow permissions > **Read and write permissions** > Save.
6. **Turn on the website:** Settings > Pages > Build and deployment > Source: **Deploy from a branch** >
   Branch: **main**, folder **/ (root)** > Save. After a minute or two the address appears at the top:
   `https://YOUR-USERNAME.github.io/brewers-toolkit/`
7. **Run the news update once:** Actions tab > **Update news** > Run workflow > Run workflow. When it turns green (about a minute),
   open news.json in the repo; it should now contain articles. After that it runs on its own.
   If it turns red, open the run: the log lists which feeds say FAILED (usually a wrong feed address; fix it in feeds.json).
8. **Install on your phone:** open the website address on your phone.
   iPhone (Safari): Share > Add to Home Screen. Android (Chrome): menu > Install app (or Add to Home screen).
   In the app, Home > See More Articles shows "news updated ..." when it is working.

## Everyday use
- **Add or change a news source:** open feeds.json in your repo, click the pencil, add a line like
  `{"n":"Source Name","u":"https://example.com/feed/"},` (keep the commas between entries), Commit.
  It appears in the app after the next update (or run the workflow by hand). Removing a source in the app only hides it on that device;
  to remove it everywhere, delete its line from feeds.json.
- **Update the app itself:** upload a new index.html with Add file > Upload files (same name replaces the old one).
- If news stops updating, check the Actions tab: GitHub can pause scheduled runs on repos with no activity for about 60 days;
  re-enable the workflow there, or run it by hand.
