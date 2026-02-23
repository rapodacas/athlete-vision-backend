// lib/eventDetection.js
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import supabase from "./supabase.js";
import { callModel } from "./providers/index.js";

// Extract frames
export async function extractFrames(videoPath, fps = 3) {
  const outDir = `/tmp/frames-${Date.now()}`;
  await fs.mkdir(outDir, { recursive: true });

  await new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", [
      "-i", videoPath,
      "-vf", `fps=${fps}`,
      path.join(outDir, "frame-%04d.jpg")
    ]);

    ff.on("close", code => code === 0 ? resolve() : reject());
  });

  const files = await fs.readdir(outDir);
  return files
    .filter(f => f.endsWith(".jpg"))
    .map(f => path.join(outDir, f))
    .sort();
}

// Build prompt
function buildPrompt(category) {
  return `
Identify whether a ${category} event is occurring.
Return JSON: { "event": true | false }
`;
}

// Classify frames
async function classifyFrames(frames, category) {
  const prompt = buildPrompt(category);
  const windowSize = 5;
  const results = [];

  for (let i = 0; i < frames.length; i += windowSize) {
    const window = frames.slice(i, i + windowSize);
    const images = await Promise.all(window.map(f => fs.readFile(f)));

    const resp = await callModel({ prompt, images });
    const isEvent = resp?.event === true;

    for (let j = 0; j < window.length; j++) results.push(isEvent);
  }

  return results;
}

// Convert booleans → timestamps
function boundaries(frameEvents, fps) {
  const events = [];
  let inEvent = false;
  let start = 0;
  let idx = 1;

  for (let i = 0; i < frameEvents.length; i++) {
    if (frameEvents[i] && !inEvent) {
      inEvent = true;
      start = i;
    }
    if (!frameEvents[i] && inEvent) {
      inEvent = false;
      events.push({
        index: idx++,
        start: start / fps,
        end: (i - 1) / fps
      });
    }
  }

  if (inEvent) {
    events.push({
      index: idx++,
      start: start / fps,
      end: (frameEvents.length - 1) / fps
    });
  }

  return events;
}

// Main
export async function detectEventsFromVideo(supabasePath, category) {
  const { data } = await supabase.storage.from("media").download(supabasePath);
  const tmp = `/tmp/input-${Date.now()}.mp4`;
  await fs.writeFile(tmp, Buffer.from(await data.arrayBuffer()));

  const fps = 3;
  const frames = await extractFrames(tmp, fps);
  const frameEvents = await classifyFrames(frames, category);
  return boundaries(frameEvents, fps);
}
