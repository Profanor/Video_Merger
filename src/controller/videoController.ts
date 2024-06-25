import { Request, Response } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage });

export const mergeVideos = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (files.length !== 2) {
        return res.status(400).send('You need to upload exactly 2 videos.');
    }

    const outputFilePath = path.join(__dirname, `../../uploads/output-${Date.now()}.mp4`);

    ffmpeg()
        .input(files[0].path)
        .input(files[1].path)
        .on('end', () => {
            res.download(outputFilePath);
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Error merging videos');
        })
        .mergeToFile(outputFilePath, path.join(__dirname, '../../uploads/tmp'));
};
