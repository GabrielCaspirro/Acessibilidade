const express = require('express');
const ytdl = require('ytdl-core');
const multer = require('multer');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: 'public/uploads/', // Pasta onde os vídeos serão salvos
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send("URL do vídeo é necessária.");
    }

    try {
        // Se for um link do YouTube, baixa com ytdl-core
        if (ytdl.validateURL(videoUrl)) {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
            return ytdl(videoUrl, { format: 'mp4' }).pipe(res);
        }

        // Para links diretos, faz o download normal
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.send(Buffer.from(await blob.arrayBuffer()));

    } catch (error) {
        res.status(500).send("Erro ao baixar o vídeo.");
    }
});

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
