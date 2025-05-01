"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movie = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const methods_1 = require("../methods");
const file_1 = require("../utils/file");
const PORTRAIT_SIZE = {
    width: 720,
    height: 1280,
};
const LANDSCAPE_SIZE = {
    width: 1280, // not 1920
    height: 720, // not 1080
};
const createVideo = (audioPath, outputVideoPath, studio, canvasInfo) => {
    const start = performance.now();
    let command = (0, fluent_ffmpeg_1.default)();
    if (studio.beats.some((beat) => !beat.image)) {
        console.error("beat.image is not set. Please run `yarn run images ${file}` ");
        return;
    }
    // Add each image input
    studio.beats.forEach((beat) => {
        command = command.input(beat.image); // HACK
    });
    const imageCount = studio.beats.length;
    const filterComplexParts = [];
    studio.beats.forEach((beat, index) => {
        // Resize background image to match canvas dimensions
        const duration = beat.duration + (index === 0 ? methods_1.MulmoScriptMethods.getPadding(studio.script) / 1000 : 0);
        const parts = `[${index}:v]loop=loop=-1:size=1:start=0,` +
            `trim=duration=${duration},` +
            `fps=30,` +
            `setpts=PTS-STARTPTS,` +
            `scale=${canvasInfo.width}:${canvasInfo.height},` +
            `setsar=1,format=yuv420p` +
            `[v${index}]`;
        // console.log(parts);
        filterComplexParts.push(parts);
    });
    // Concatenate the trimmed images
    const concatInput = studio.beats.map((_, index) => `[v${index}]`).join("");
    filterComplexParts.push(`${concatInput}concat=n=${imageCount}:v=1:a=0[v]`);
    // Apply the filter complex for concatenation and map audio input
    command
        .complexFilter(filterComplexParts)
        .input(audioPath) // Add audio input
        .outputOptions([
        "-preset veryfast", // Faster encoding
        "-map [v]", // Map the video stream
        `-map ${imageCount /* + captionCount*/}:a`, // Map the audio stream (audio is the next input after all images)
        "-c:v h264_videotoolbox", // Set video codec
        "-threads 8",
        "-filter_threads 8",
        "-b:v 5M", // bitrate (only for videotoolbox)
        "-bufsize",
        "10M", // Add buffer size for better quality
        "-maxrate",
        "7M", // Maximum bitrate
        "-r 30", // Set frame rate
        "-pix_fmt yuv420p", // Set pixel format for better compatibility
    ])
        .on("start", (__cmdLine) => {
        console.log("Started FFmpeg ..."); // with command:', cmdLine);
    })
        .on("error", (err, stdout, stderr) => {
        console.error("Error occurred:", err);
        console.error("FFmpeg stdout:", stdout);
        console.error("FFmpeg stderr:", stderr);
    })
        .on("end", () => {
        const end = performance.now();
        console.log(`Video created successfully! ${Math.round(end - start) / 1000} sec`);
    })
        .output(outputVideoPath)
        .run();
};
const movie = async (studio) => {
    const canvasInfo = studio.script.imageParams?.aspectRatio === "9:16" ? PORTRAIT_SIZE : LANDSCAPE_SIZE;
    const audioPath = (0, file_1.getOutputFilePath)(studio.filename + "_bgm.mp3");
    const outputVideoPath = (0, file_1.getOutputFilePath)(studio.filename + ".mp4");
    createVideo(audioPath, outputVideoPath, studio, canvasInfo);
};
exports.movie = movie;
