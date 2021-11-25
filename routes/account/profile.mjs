import fs from "fs";
import handlebars from "handlebars";
import { DB } from "../../resource/resource.mjs";
import app from "../../app/config.mjs";

let Csession;

// User's Profile
app.get("/article/profile", (req, res) => {
    Csession = req.session;
    DB.users.findOne({
        username: Csession.userID ? Csession.userID : ""
    })
        .then(r => {
            if (!r || !r.username || !r.password)
                res.redirect("/login");
            else {
                fs.readFile("./pages/account/profile.html", (err, data) => {
                    if (err) throw err;
                    let template = handlebars.compile(data.toString());
                    res.write(template({
                        name: r.username,
                        pass: r.password
                    }));
                    return res.end();
                });
            }
        })
        .catch(err => {
            throw err;
        });
});
