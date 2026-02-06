/**
 * FFmpeg Test Script - Phase 0 POC
 *
 * Validates FFmpeg capabilities for:
 * - Audio extraction from video files
 * - Video metadata retrieval (duration, dimensions, fps, codec)
 * - WAV format validation (sample rate, bit depth)
 *
 * Usage: tsx poc/day1/ffmpeg-test.ts [inputVideoPath]
 */

import ffmpeg from "fluent-ffmpeg";
import * as path from "path";
import { promises as fs } from "fs";

interface Metadata {
  duration: number; // in seconds
  width: number;
  height: number;
  fps: number;
  codec: string;
  format: string;
}

interface AudioFormat {
  sampleRate: number; // in Hz
  bitDepth: number; // in bits
  channels: number; // 1 = mono, 2 = stereo
  codec: string;
  format: string;
}

/**
 * Extract audio from video to WAV format
 * Configuration: PCM 16-bit, 16kHz, mono (Whisper compatible)
 *
 * @param inputPath - Path to input video file
 * @param outputPath - Path to output WAV file
 * @returns Promise resolving when extraction completes
 */
async function extractAudio(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  console.log(`\n[EXTRACT] Extracting audio from: ${inputPath}`);
  console.log(`[EXTRACT] Output path: ${outputPath}`);

  return new Promise((resolve, reject) => {
    const startTime = performance.now();

    ffmpeg(inputPath)
      .audioCodec("pcm_s16le") // 16-bit PCM
      .audioFrequency(16000) // 16 kHz sample rate
      .audioChannels(1) // Mono
      .format("wav")
      .output(outputPath)
      .on("start", (commandLine) => {
        console.log(`[EXTRACT] FFmpeg command: ${commandLine}`);
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`[EXTRACT] Progress: ${Math.round(progress.percent)}%`);
        }
      })
      .on("end", () => {
        const duration = performance.now() - startTime;
        console.log(`[EXTRACT] ✅ Complete (${duration.toFixed(2)}ms)`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`[EXTRACT] ❌ Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

/**
 * Retrieve video metadata using ffprobe
 *
 * @param inputPath - Path to video file
 * @returns Promise resolving to metadata object
 */
async function getVideoMetadata(inputPath: string): Promise<Metadata> {
  console.log(`\n[METADATA] Retrieving metadata from: ${inputPath}`);

  return new Promise((resolve, reject) => {
    const startTime = performance.now();

    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.error(`[METADATA] ❌ Error: ${err.message}`);
        reject(err);
        return;
      }

      try {
        const videoStream = metadata.streams.find(
          (s: any) => s.codec_type === "video",
        );

        if (!videoStream) {
          reject(new Error("No video stream found"));
          return;
        }

        const frameRateValue =
          typeof videoStream.r_frame_rate === "string"
            ? videoStream.r_frame_rate
            : "0";
        const [frameRateNumerator, frameRateDenominator] = frameRateValue
          .split("/")
          .map(Number);
        const frameRate = frameRateDenominator
          ? frameRateNumerator / frameRateDenominator
          : Number(frameRateValue) || 0;

        const result: Metadata = {
          duration: metadata.format.duration || 0,
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          fps: frameRate,
          codec: videoStream.codec_name || "unknown",
          format: metadata.format.format_name || "unknown",
        };

        const duration = performance.now() - startTime;
        console.log(`[METADATA] ✅ Complete (${duration.toFixed(2)}ms)`);
        console.log(`[METADATA] Duration: ${result.duration.toFixed(2)}s`);
        console.log(`[METADATA] Resolution: ${result.width}x${result.height}`);
        console.log(`[METADATA] FPS: ${result.fps.toFixed(2)}`);
        console.log(`[METADATA] Codec: ${result.codec}`);
        console.log(`[METADATA] Format: ${result.format}`);

        resolve(result);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

/**
 * Validate WAV file format using ffprobe
 *
 * @param filePath - Path to WAV file
 * @returns Promise resolving to validation result
 */
async function validateWavFormat(filePath: string): Promise<boolean> {
  console.log(`\n[VALIDATE] Checking WAV format: ${filePath}`);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error(`[VALIDATE] ❌ Error: ${err.message}`);
        reject(err);
        return;
      }

      try {
        const audioStream = metadata.streams.find(
          (s: any) => s.codec_type === "audio",
        );

        if (!audioStream) {
          console.error(`[VALIDATE] ❌ No audio stream found`);
          resolve(false);
          return;
        }

        const format: AudioFormat = {
          sampleRate: audioStream.sample_rate || 0,
          bitDepth: audioStream.bits_per_sample || 0,
          channels: audioStream.channels || 0,
          codec: audioStream.codec_name || "unknown",
          format: metadata.format.format_name || "unknown",
        };

        // Validate against expected format
        const isValidSampleRate = format.sampleRate === 16000;
        const isValidBitDepth = format.bitDepth === 16;
        const isValidChannels = format.channels === 1;
        const isValidCodec = format.codec === "pcm_s16le";

        console.log(
          `[VALIDATE] Sample Rate: ${format.sampleRate} Hz ${isValidSampleRate ? "✅" : "❌"}`,
        );
        console.log(
          `[VALIDATE] Bit Depth: ${format.bitDepth} bits ${isValidBitDepth ? "✅" : "❌"}`,
        );
        console.log(
          `[VALIDATE] Channels: ${format.channels} ${isValidChannels ? "✅" : "❌"}`,
        );
        console.log(
          `[VALIDATE] Codec: ${format.codec} ${isValidCodec ? "✅" : "❌"}`,
        );

        const isValid =
          isValidSampleRate &&
          isValidBitDepth &&
          isValidChannels &&
          isValidCodec;
        console.log(
          `[VALIDATE] ${isValid ? "✅ Valid WAV format" : "❌ Invalid WAV format"}`,
        );

        resolve(isValid);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

/**
 * Main test orchestrator
 */
async function runTest(): Promise<void> {
  console.log("╔═════════════════════════════════════════════════════════╗");
  console.log("║     FFmpeg Audio Extraction Test - Phase 0 POC         ║");
  console.log("╚═════════════════════════════════════════════════════════╝");

  const testStartTime = performance.now();

  try {
    // Create directories
    console.log("\n[SETUP] Creating directories...");
    const videosDir = path.join(process.cwd(), "poc", "day1", "temp", "videos");
    const outputsDir = path.join(
      process.cwd(),
      "poc",
      "day1",
      "temp",
      "outputs",
    );

    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(outputsDir, { recursive: true });
    console.log("[SETUP] ✅ Directories created");

    // Get input video path from command line or use default
    const inputArg = process.argv[2];
    const defaultVideo = path.join(videosDir, "test-video.mp4");
    const inputPath = inputArg || defaultVideo;

    // Check if input file exists
    const inputExists = await fs
      .access(inputPath)
      .then(() => true)
      .catch(() => false);

    if (!inputExists) {
      console.log(`\n⚠️  WARNING: Input video not found: ${inputPath}`);
      console.log("To test with a video file:");
      console.log(`  1. Place a video file at: ${inputPath}`);
      console.log(
        `  2. Or run: tsx poc/day1/ffmpeg-test.ts /path/to/your/video.mp4`,
      );
      console.log(
        "\nSkipping audio extraction test. Metadata extraction test requires a video file.",
      );
      return;
    }

    // Extract metadata
    console.log("\n═════════════════════════════════════════════════════════");
    console.log("  STEP 1: Video Metadata Extraction");
    console.log("═════════════════════════════════════════════════════════");

    const metadata = await getVideoMetadata(inputPath);

    // Extract audio
    console.log("\n═════════════════════════════════════════════════════════");
    console.log("  STEP 2: Audio Extraction");
    console.log("═════════════════════════════════════════════════════════");

    const outputPath = path.join(outputsDir, "extracted-audio.wav");
    await extractAudio(inputPath, outputPath);

    // Validate WAV format
    console.log("\n═════════════════════════════════════════════════════════");
    console.log("  STEP 3: WAV Format Validation");
    console.log("═════════════════════════════════════════════════════════");

    const isValid = await validateWavFormat(outputPath);

    // Summary
    const totalDuration = performance.now() - testStartTime;

    console.log(
      "\n╔═════════════════════════════════════════════════════════╗",
    );
    console.log("║                    TEST SUMMARY                         ║");
    console.log("╚═════════════════════════════════════════════════════════╝");
    console.log(`Total Time: ${totalDuration.toFixed(2)}ms`);
    console.log(`Input: ${inputPath}`);
    console.log(`Output: ${outputPath}`);
    console.log(`\nResults:`);
    console.log(
      `  ✅ Metadata extraction: ${metadata.duration.toFixed(2)}s, ${metadata.width}x${metadata.height}`,
    );
    console.log(`  ✅ Audio extraction: Complete`);
    console.log(
      `  ${isValid ? "✅" : "❌"} WAV format validation: ${isValid ? "PASSED" : "FAILED"}`,
    );

    if (isValid) {
      console.log("\n🎉 All tests PASSED! FFmpeg is ready for use.");
    } else {
      console.log("\n⚠️  WAV format validation failed. Check output file.");
    }
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error);
    process.exit(1);
  }
}

// Run the test
runTest().catch(console.error);
