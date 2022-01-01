import { config } from 'dotenv';

// Load ENV
config();

// Load passport.js
import "./loaders/passport.mjs";

// Next server config
import { next } from './loaders/servers.mjs';
await next.prepare();

// Connect to database
import mongoose from 'mongoose';
await mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(console.log);

// Socket connection
import "../routes/socket/connect.mjs";

// Display articles
import '../routes/article/collections.mjs';
import '../routes/article/homepage.mjs';

// Editor
import '../routes/editor/editor.mjs';

// Article content
import '../routes/content/read.mjs';
import '../routes/content/discuss.mjs';

// Account
import '../routes/account/login.mjs';
import '../routes/account/profile.mjs';
import '../routes/account/verify.mjs';

// Delete
import '../routes/delete/delete.mjs';

// 404 Error
import '../routes/404/404.mjs';