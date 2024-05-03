import { spawnSync } from "bun";
import { spawn, exec } from "child_process";
import { rmSync, mkdirSync } from "fs";
import { concatAudio, deleteDownward, parseInterval } from "./helpers";

export interface SilenceLog {
  start?: number;
  end?: number;
}

export interface Transcript {
  start: number;
  end: number;
  content?: string;
}

const STREAM: string = "https://broadcastify.cdnstream1.com/3831";
const CHUNK_SECONDS: number = 1;

rmSync("out", { force: true, recursive: true });
mkdirSync("out/tmp", { recursive: true });
mkdirSync("out/speech", { recursive: true });

// Command to split the stream based on silence
const splitStreamCommand = (
  inputFile: string,
  outputFile: string,
  start: number,
  duration: number
) => `
  ffmpeg -i ${inputFile} -ss ${start} -t ${duration} -acodec copy ${outputFile}`;

const detectSilence = spawn("ffmpeg", [
  "-i",
  STREAM,
  "-af",
  "silencedetect=noise=-30dB:d=1.0",
  "-f",
  "segment",
  "-segment_time",
  CHUNK_SECONDS.toString(),
  "-segment_format",
  "mp3",
  `out/tmp/%03d.mp3`,
]);

// Initialize assuming someone is talking
let transcript: Transcript[] = [];
const queue: SilenceLog[] = [{ end: 0 }];

detectSilence.stderr.on("data", (data: any) => {
  const silence: SilenceLog | null = parseInterval(data);
  // Check queue every out
  checkQueue();
  // Nothing captured in this output
  if (!silence) return;
  // Push log onto queue for records
  queue.push(silence);
  //   console.log("SILENCE", silenceIntervals);
});

const checkQueue = async () => {
  // Check the top of queue
  const silence = queue[0];
  if (silence && silence.hasOwnProperty("end")) {
    // Identify which file has start of speech
    let firstFile: number = Math.ceil(silence.end as number) / CHUNK_SECONDS;
    firstFile = Math.ceil(firstFile - 1);
    firstFile = firstFile < 0 ? 0 : firstFile;

    // Remove all the files where there was silence to this point
    deleteDownward(firstFile - 1);

    // Identify which file has the end of speech
    const next = queue[1];
    if (next && next.hasOwnProperty("start")) {
      let lastFile: number = Math.ceil(next.start as number) / CHUNK_SECONDS;
      lastFile = Math.ceil(lastFile) - 1;

      console.log("Talking captured from", firstFile, "to", lastFile);

      // Concat audio into speech files
      concatAudio(
        firstFile,
        lastFile,
        String(transcript.length).padStart(3, "0")
      );

      // Push transcript log into main array
      transcript.push({
        start: silence.end as number,
        end: next.start as number,
      });

      console.log(transcript);

      queue.shift();
    }
    // Edge case for talking at start of recording (2 ends in a row)
    if (next && next.hasOwnProperty("end")) {
      queue.shift();
    }
  }
  if (silence && silence.start) {
    // End is unimportant without an associated end
    queue.shift();
  }
  // Do nothing until we have more to go on
};
