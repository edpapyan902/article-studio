import {
    DB,
    ArticleTemplate,
    ScriptTemplate,
    Header,
    InitCategory,
    SortByComponent
} from "../../resource/resource.mjs";
import app from "../../app/config.mjs";
import fs from "fs";

let Csession;
// Homepage
// https://localhost/article

app.get("/article", async (req, res) => {
    Csession = req.session;
	// Search all articles which belongs to current user
	const r = await DB.sites.find({});
    res.write(fs.readFileSync("./pages/article/article.html").toString().trim().replace(/\<\/html\>/, "").replace(/\<\/body\>/, ""));
    let script = "";
    /**
     * @type {{content: string, views: number, author: string, votes: number}[]}
     */
    let article = [];
    // Init hidden data
    res.write(`
        <span style="display: none">${Csession.userID}</span>
        <span style="display: none">Discover</span>
    `)
    // All lists of articles link
    res.write(SortByComponent(!!Csession.userID));
    // Header
    res.write(Header("Discover"));
    // Created articles
    res.write("<div id='created-article'>");
    for (let i of r) {
        article.push({
            content: ArticleTemplate(i),
            views: i.views ?? 0,
            author: i.user,
            votes: i.votes
        });
        script += ScriptTemplate(i);
    }

    // Init articles
    article = InitCategory("views", article);
    for (let atc of article)
        res.write(atc.content);
    // Close created article div
    res.write("</div>");

    // Load javascript in webpage
    res.write(`<script src="/javascripts/homepage/navbuttons.js"></script>`);
    res.write(`<script>${script}</script>`);
    res.end('<script src="/javascripts/homepage/endscript.js"></script>');
});

// Most Vote
// https://localhost/mostvote

app.get("/mostvote", async (req, res) => {
    Csession = req.session;
	// Search all articles which belongs to current user
	const r = await DB.sites.find({});
    res.write(fs.readFileSync("./pages/article/article.html").toString().trim().replace(/\<\/html\>/, "").replace(/\<\/body\>/, ""));
    let script = "";
    /**
     * @type {{content: string, views: number, author: string, votes: number}[]}
     */
    let article = [];
    // Init data
    res.write(`
        <span style="display: none">${Csession?.userID}</span>
        <span style="display: none">Most Voted</span>
    `)
    // All lists of articles link
    res.write(SortByComponent(!!Csession.userID))
    // Header
    res.write(Header("Most Voted"));
    // Created article
    res.write("<div id='created-article'>");
    // Add articles from database
    for (let i of r) {
        article.push({
            content: ArticleTemplate(i),
            views: i.views ?? 0,
            author: i.user,
            votes: i.votes
        });
        script += ScriptTemplate(i);
    }

    // Init articles
    article = InitCategory("votes", article);
    for (let atc of article)
        res.write(atc.content);
    // End of articles block
    res.write("</div>");

    // Load javascript in webpage
    res.write(`<script src="/javascripts/homepage/navbuttons.js"></script>`);
    // All scripts
    res.write(`<script>${script}</script>`);
    // End scripts
    res.end('<script src="/javascripts/homepage/endscript.js"></script>');
});