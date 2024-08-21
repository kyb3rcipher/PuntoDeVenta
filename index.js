import express from 'express';
import layouts from 'express-ejs-layouts';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Initialize express
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);
app.set('layout', join(__dirname, 'views/layouts/layout'));

// Routes
import indexRouter from './routes/index.js';
app.use(indexRouter);

// Static files
app.use(express.static(join(__dirname, 'resources')));

app.listen(3000);
console.log('Server on port ' + 3000);