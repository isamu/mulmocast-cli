"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttsOpenaiAgent = void 0;
const openai_1 = __importDefault(require("openai"));
const ttsOpenaiAgent = async ({ namedInputs, params }) => {
    const { text } = namedInputs;
    const { apiKey, model, voice, throwError, instructions } = params;
    const openai = new openai_1.default({ apiKey });
    try {
        const tts_options = {
            model: model ?? "gpt-4o-mini-tts", // "tts-1",
            voice: voice ?? "shimmer",
            input: text,
        };
        if (instructions) {
            tts_options["instructions"] = instructions;
        }
        console.log("ttsOptions", tts_options);
        const response = await openai.audio.speech.create(tts_options);
        const buffer = Buffer.from(await response.arrayBuffer());
        return { buffer };
    }
    catch (e) {
        if (throwError) {
            console.error(e);
            throw new Error("TTS OpenAI Error");
        }
        return {
            error: e,
        };
    }
};
exports.ttsOpenaiAgent = ttsOpenaiAgent;
const ttsOpenaiAgentInfo = {
    name: "ttsOpenaiAgent",
    agent: exports.ttsOpenaiAgent,
    mock: exports.ttsOpenaiAgent,
    samples: [],
    description: "OpenAI TTS agent",
    category: ["tts"],
    author: "Receptron Team",
    repository: "https://github.com/receptron/graphai-agents/tree/main/tts/tts-openai-agent",
    license: "MIT",
    environmentVariables: ["OPENAI_API_KEY"],
};
exports.default = ttsOpenaiAgentInfo;
