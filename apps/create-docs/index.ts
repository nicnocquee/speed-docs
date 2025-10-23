#!/usr/bin/env node

import fs from "fs";
import path from "path";

/**
 * Validates and copies content from origin directory to content directory
 * @param {string} originDir - The origin directory path
 */
async function validateAndCopyContent(originDir) {
  try {
    console.log(`🔍 Validating and copying content from: ${originDir}`);

    // Step 1: Check if origin directory exists
    if (!fs.existsSync(originDir)) {
      throw new Error(`❌ Origin directory does not exist: ${originDir}`);
    }

    console.log(`✅ Origin directory exists: ${originDir}`);

    // Step 2: Create/clean content directory (in docs app)
    const contentDir = path.join(process.cwd(), "..", "docs", "content");

    if (fs.existsSync(contentDir)) {
      console.log(`🗑️  Removing existing content directory...`);
      fs.rmSync(contentDir, { recursive: true, force: true });
    }

    console.log(`📁 Creating new content directory...`);
    fs.mkdirSync(contentDir, { recursive: true });

    // Step 3: Validate origin directory content
    await validateOriginDirectory(originDir);

    // Step 4: Copy all contents from origin to content directory
    console.log(`📋 Copying contents from ${originDir} to ${contentDir}...`);
    await copyDirectory(originDir, contentDir);

    console.log(`✅ Successfully validated and copied content!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Validates the origin directory structure and content
 * @param {string} originDir - The origin directory path
 */
async function validateOriginDirectory(originDir) {
  console.log(`🔍 Validating origin directory structure...`);

  // Check if config.json exists and is valid JSON
  const configPath = path.join(originDir, "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("config.json file is missing in origin directory");
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf8");
    JSON.parse(configContent);
    console.log(`✅ config.json is valid JSON`);
  } catch (error) {
    throw new Error(`config.json is not valid JSON: ${error.message}`);
  }

  // Check if docs directory exists
  const docsPath = path.join(originDir, "docs");
  if (!fs.existsSync(docsPath)) {
    throw new Error("docs directory is missing in origin directory");
  }

  if (!fs.statSync(docsPath).isDirectory()) {
    throw new Error("docs exists but is not a directory");
  }

  console.log(`✅ docs directory exists`);

  // Validate all JSON files in docs directory and subdirectories
  await validateJsonFilesInDirectory(docsPath);
}

/**
 * Recursively validates all JSON files in a directory
 * @param {string} dirPath - The directory path to validate
 */
async function validateJsonFilesInDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Recursively validate subdirectories
      await validateJsonFilesInDirectory(itemPath);
    } else if (item.endsWith(".json")) {
      // Validate JSON files
      try {
        const content = fs.readFileSync(itemPath, "utf8");
        JSON.parse(content);
        console.log(
          `✅ Valid JSON file: ${path.relative(process.cwd(), itemPath)}`
        );
      } catch (error) {
        throw new Error(`Invalid JSON file ${itemPath}: ${error.message}`);
      }
    }
  }
}

/**
 * Recursively copies a directory from source to destination
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 */
async function copyDirectory(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    // Copy all items in the directory
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      await copyDirectory(srcPath, destPath);
    }
  } else {
    // Check if it's an image file
    const imageExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".webp",
      ".ico",
    ];
    const isImageFile = imageExtensions.some((ext) =>
      src.toLowerCase().endsWith(ext)
    );

    if (isImageFile) {
      // Copy image files to public directory (in docs app)
      const publicDir = path.join(process.cwd(), "..", "docs", "public");
      const fileName = path.basename(src);
      const publicDestPath = path.join(publicDir, fileName);

      // Ensure public directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      fs.copyFileSync(src, publicDestPath);
      console.log(`📸 Copied image: ${fileName} to public directory`);
    } else {
      // Copy non-image files to content directory
      fs.copyFileSync(src, dest);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "❌ Usage: node validate-and-copy-content.js <origin-directory>"
    );
    console.error(
      "Example: node validate-and-copy-content.js ../../content-example"
    );
    process.exit(1);
  }

  const originDir = path.resolve(args[0]);
  await validateAndCopyContent(originDir);
}

// Run the script only when executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`❌ Script failed: ${error.message}`);
    process.exit(1);
  });
}

export { validateAndCopyContent };
