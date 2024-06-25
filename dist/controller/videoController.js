"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeVideos = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const mergeVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (files.length !== 2) {
        return res.status(400).send('You need to upload exactly 2 videos.');
    }
    const outputFilePath = path_1.default.join(__dirname, `../../uploads/output-${Date.now()}.mp4`);
    (0, fluent_ffmpeg_1.default)()
        .input(files[0].path)
        .input(files[1].path)
        .on('end', () => {
        res.download(outputFilePath);
    })
        .on('error', (err) => {
        console.error(err);
        res.status(500).send('Error merging videos');
    })
        .mergeToFile(outputFilePath, path_1.default.join(__dirname, '../../uploads/tmp'));
});
exports.mergeVideos = mergeVideos;
