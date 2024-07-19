import { spawn } from "child_process";
import { rmSync, mkdirSync } from "fs";
import dayjs from 'dayjs/esm';

import {
  concatAudio,
  deleteDownward,
  parseInterval,
  transcribe,
} from "./helpers";

export interface SilenceLog {
  start?: number;
  end?: number;
}

export interface Transcript {
  status: "waiting" | "pending" | "transcribed" | "logged";
  start: number;
  end: number;
  first: number;
  last: number;
  content?: string[] | undefined;
}

const STREAM: string = "https://broadcastify.cdnstream1.com/3831"; // Charleston
// const STREAM: string = "https://broadcastify.cdnstream1.com/1814"; // Champaign

const CHUNK_SECONDS: number = 1;
export const MAX_MODEL: "tiny" | "medium" | "large" = "large";
const START_TIME = dayjs();
const SILENT_MODE: boolean = !!process.argv.find(i => i === '--silent');

rmSync("out", { force: true, recursive: true });
mkdirSync("out/tmp", { recursive: true });
mkdirSync("out/speech", { recursive: true });
mkdirSync("out/transcripts", { recursive: true });

const detectSilence = spawn("ffmpeg", [
  "-i",
  STREAM,
  "-af",
  "silencedetect=noise=-40dB:d=1.0",
  "-f",
  "segment",
  "-segment_time",
  CHUNK_SECONDS.toString(),
  "-segment_format",
  "mp3",
  `out/tmp/%03d.mp3`,
]);

// Initialize assuming someone is talking
let transcripts: Transcript[] = [];
let currLog: number = 0;
const queue: SilenceLog[] = [{ end: 0 }];

detectSilence.stderr.on("data", (data: any) => {
  const silence: SilenceLog | null = parseInterval(data);
  // Check queue every out
  checkQueue();
  checkLog();
  // Nothing captured in this output
  if (!silence) return;
  // Push log onto queue for records
  queue.push(silence);
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

      // Concat audio into speech files
      concatAudio(
        firstFile,
        lastFile,
        String(transcripts.length).padStart(3, "0")
      );

      // Push transcript log into main array
      transcripts.push({
        status: "waiting",
        start: silence.end as number,
        end: next.start as number,
        first: firstFile,
        last: lastFile,
      });

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

const checkLog = async () => {
  const transcript = transcripts[currLog];

  const index = String(currLog).padStart(3, "0");
  if (transcript && transcript.status === "waiting") {
    transcribe(transcript, index);
  }

  if (transcript && transcript.content && transcript.status === "transcribed") {
    console.log(
      "# Audio detected on files",
      transcript.first,
      "to",
      transcript.last,
      "(" + index + ")",
      "[" + START_TIME.add(transcript.start, 'seconds').format('M/D/YY h:m:sA') + "]"
    );
    transcript.content.forEach((i) => console.log(`- ${i}`));
    console.log("");
    if (transcript.first !== 0 && !SILENT_MODE) {
      spawn("mplayer", [`out/speech/${index}.wav`]);
    }
    transcript.status = "logged";
    currLog++;
  }
};

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    if (new URL(req.url).pathname.indexOf('.wav') !== -1) {
      const filePath = 'out/speech' + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    }
    return new Response(JSON.stringify(transcripts.map((i, index) => ({
      status: i.status,
      start: {
        timestampSeconds: i.start,
        readable: START_TIME.add(i.start, 'seconds').format('M/D/YY h:m:sA'),
        epochMS: START_TIME.add(i.start, 'seconds').valueOf(),
      },
      end: {
        timestampSeconds: i.end,
        readable: START_TIME.add(i.end, 'seconds').format('M/D/YY h:m:sA'),
        epochMS: START_TIME.add(i.end, 'seconds').valueOf(),
      },
      content: i.content,
      audio: `${req.headers.get('host')}/${String(index).padStart(3, "0")}.wav`
    }))));
  },
});
console.log(`Webserver listening on ${server.url}`);
console.log('')
