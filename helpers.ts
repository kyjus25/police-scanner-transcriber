import { MAX_MODEL, type SilenceLog, type Transcript } from ".";
import { rmSync } from "fs";
import { spawn } from "child_process";

console.clear();

export const parseInterval = (data: any): SilenceLog | null => {
  const silence = data
    .toString()
    .split("\n")
    .filter((line: string) => line.includes("[silencedetect"))
    .map((line: string) => {
      const start = line.match(/silence_start: (\d+\.\d+)/);
      const end = line.match(/silence_end: (\d+\.\d+)/);
      //   return match ? parseFloat(match[1]) : null;
      if (start) {
        return { start: parseFloat(start[1]) };
      }
      if (end) {
        return { end: parseFloat(end[1]) };
      }
      return null;
    })
    .filter((time: string) => time !== null);
  return silence.length > 0 ? silence[0] : null;
};

export const deleteDownward = (to: number): void => {
  // Cannot delete less than zero
  if (to < 0) return;
  for (let i = to; i >= 0; i--) {
    rmSync(`out/tmp/${String(i).padStart(3, "0")}.mp3`, {
      force: true,
      recursive: true,
    });
  }
};

export const concatAudio = (from: number, to: number, index: string) => {
  const files = Array.from({ length: to - from + 1 })
    // Calculate a list of numbers between the two, inclusive
    .map((i, index) => from + index)
    // Add the pad start for ffmpeg filenames
    .map((i) => String(i).padStart(3, "0"))
    // Append the file path for ease
    .map((i) => `out/tmp/${i}.mp3`);

  spawn("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "panic",
    "-i",
    `concat:${files.join("|")}`,
    "-acodec",
    "pcm_s16le",    // Audio codec for 16-bit PCM
    "-ar",
    "16000",
    `out/speech/${index}.wav`,  // Change output file extension to .wav
  ]);
};

export const transcribe = (transcript: Transcript, index: string) => {
  // const MODEL = transcript.last - transcript.first < 10 ? MAX_MODEL : "tiny";
  const MODEL = MAX_MODEL;

  if (transcript.status !== "waiting") return;
  transcript.status = "pending";

  if (transcript.first === 0) {
    transcript.content = ["<Advertisement>"];
    transcript.status = "transcribed";
    return;
  }

  setTimeout(() => {
    const ls = spawn('.whisper/main', [
      '-m',
      '.whisper/models/ggml-large-v3.bin',
      '-f',
      `out/speech/${index}.wav`,
      '-of',
      `out/transcripts/${index}`,
      '-oj'
    ]);
    
    ls.on('close', async (code) => {
      try {
        const file = await Bun.file(`out/transcripts/${index}.json`).json();
        transcript.content = file.transcription.map((i: any) => i.text.trim());
        rmSync(`out/transcripts/${index}.json`, {
          force: true,
          recursive: true,
        });
      } catch (e) {
        transcript.content = [];
      }
      transcript.status = "transcribed";
    }); 
  }, 1000)
};
