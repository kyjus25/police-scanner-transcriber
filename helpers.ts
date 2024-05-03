import { type SilenceLog } from ".";
import { rmSync } from "fs";
import { execSync } from "child_process";

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
  execSync(
    `ffmpeg -hide_banner -loglevel panic -i "concat:${files.join(
      "|"
    )}" out/speech/${index}.mp3`
  );
};
