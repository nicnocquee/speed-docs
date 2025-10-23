#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import os from "os";
import chalk from "chalk";
import { Command } from "commander";
import fetch from "node-fetch";
import tar from "tar";
import chokidar from "chokidar";

const TEMPLATE_REPO_URL =
  "https://github.com/nicnocquee/speed-docs/archive/refs/heads/main.tar.gz";
const TEMPLATE_SUBDIR = "speed-docs-main/apps/template-fumadocs-static";

/**
 * Downloads the template from GitHub to a temporary directory
 */
async function downloadTemplate(templateUrl?: string): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "speed-docs-"));
  const tarPath = path.join(tmpDir, "template.tar.gz");

  const repoUrl = templateUrl || TEMPLATE_REPO_URL;
  console.log(chalk.blue(`📥 Downloading template from: ${repoUrl}`));

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(tarPath, Buffer.from(buffer));

    console.log(chalk.green("✅ Template downloaded successfully"));

    // Extract the tar file
    console.log(chalk.blue("📦 Extracting template..."));
    await tar.extract({
      file: tarPath,
      cwd: tmpDir,
    });

    const templatePath = path.join(tmpDir, TEMPLATE_SUBDIR);
    if (!fs.existsSync(templatePath)) {
      throw new Error(
        "Template extraction failed - template directory not found"
      );
    }

    console.log(chalk.green("✅ Template extracted successfully"));

    // Clean up tar file
    fs.unlinkSync(tarPath);

    return templatePath;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error downloading template: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    );
    throw error;
  }
}

/**
 * Validates and copies content from origin directory to template content directory
 */
async function validateAndCopyContent(
  originDir: string,
  templatePath: string
): Promise<void> {
  try {
    console.log(
      chalk.blue(`🔍 Validating and copying content from: ${originDir}`)
    );

    // Step 1: Check if origin directory exists
    if (!fs.existsSync(originDir)) {
      throw new Error(`❌ Origin directory does not exist: ${originDir}`);
    }

    console.log(chalk.green(`✅ Origin directory exists: ${originDir}`));

    // Step 2: Create/clean content directory (in template)
    const contentDir = path.join(templatePath, "content");

    if (fs.existsSync(contentDir)) {
      console.log(chalk.yellow(`🗑️  Removing existing content directory...`));
      fs.rmSync(contentDir, { recursive: true, force: true });
    }

    console.log(chalk.blue(`📁 Creating new content directory...`));
    fs.mkdirSync(contentDir, { recursive: true });

    // Step 3: Validate origin directory content
    await validateOriginDirectory(originDir);

    // Step 4: Copy all contents from origin to content directory
    console.log(
      chalk.blue(`📋 Copying contents from ${originDir} to ${contentDir}...`)
    );
    await copyDirectory(originDir, contentDir);

    console.log(chalk.green(`✅ Successfully validated and copied content!`));
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    throw error;
  }
}

/**
 * Validates the origin directory structure and content
 */
async function validateOriginDirectory(originDir: string): Promise<void> {
  console.log(chalk.blue(`🔍 Validating origin directory structure...`));

  // Check if config.json exists and is valid JSON
  const configPath = path.join(originDir, "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("config.json file is missing in origin directory");
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf8");
    JSON.parse(configContent);
    console.log(chalk.green(`✅ config.json is valid JSON`));
  } catch (error) {
    throw new Error(
      `config.json is not valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Check if docs directory exists
  const docsPath = path.join(originDir, "docs");
  if (!fs.existsSync(docsPath)) {
    throw new Error("docs directory is missing in origin directory");
  }

  if (!fs.statSync(docsPath).isDirectory()) {
    throw new Error("docs exists but is not a directory");
  }

  console.log(chalk.green(`✅ docs directory exists`));

  // Validate all JSON files in docs directory and subdirectories
  await validateJsonFilesInDirectory(docsPath);
}

/**
 * Recursively validates all JSON files in a directory
 */
async function validateJsonFilesInDirectory(dirPath: string): Promise<void> {
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
          chalk.green(
            `✅ Valid JSON file: ${path.relative(process.cwd(), itemPath)}`
          )
        );
      } catch (error) {
        throw new Error(
          `Invalid JSON file ${itemPath}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }
}

/**
 * Recursively copies a directory from source to destination
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
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
      // Copy image files to public directory (in template)
      const publicDir = path.join(path.dirname(dest), "..", "public");
      const fileName = path.basename(src);
      const publicDestPath = path.join(publicDir, fileName);

      // Ensure public directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      fs.copyFileSync(src, publicDestPath);
      console.log(
        chalk.blue(`📸 Copied image: ${fileName} to public directory`)
      );
    } else {
      // Copy non-image files to content directory
      fs.copyFileSync(src, dest);
    }
  }
}

/**
 * Runs npm install in the template directory
 */
async function installDependencies(templatePath: string): Promise<void> {
  console.log(chalk.blue("📦 Installing dependencies..."));

  try {
    execSync("npm install", {
      cwd: templatePath,
      stdio: "inherit",
    });
    console.log(chalk.green("✅ Dependencies installed successfully"));
  } catch (error) {
    console.error(chalk.red("❌ Failed to install dependencies"));
    throw error;
  }
}

/**
 * Runs npm run dev in the template directory
 */
function runDevMode(templatePath: string): void {
  console.log(chalk.blue("🚀 Starting development server..."));

  const devProcess = spawn("npm", ["run", "dev"], {
    cwd: templatePath,
    stdio: "inherit",
    shell: true,
  });

  devProcess.on("error", (error) => {
    console.error(chalk.red(`❌ Failed to start dev server: ${error.message}`));
    process.exit(1);
  });

  devProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(chalk.red(`❌ Dev server exited with code ${code}`));
      process.exit(1);
    }
  });
}

/**
 * Watches the origin directory for changes and copies content when files change
 */
function watchOriginDirectory(originDir: string, templatePath: string): void {
  console.log(chalk.blue(`👀 Watching for changes in: ${originDir}`));

  const watcher = chokidar.watch(originDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher.on("change", async (filePath: string) => {
    console.log(
      chalk.yellow(`📝 File changed: ${path.relative(originDir, filePath)}`)
    );
    try {
      await validateAndCopyContent(originDir, templatePath);
      console.log(chalk.green("✅ Content updated successfully"));
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error updating content: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }
  });

  watcher.on("add", async (filePath: string) => {
    console.log(
      chalk.yellow(`➕ File added: ${path.relative(originDir, filePath)}`)
    );
    try {
      await validateAndCopyContent(originDir, templatePath);
      console.log(chalk.green("✅ Content updated successfully"));
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error updating content: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }
  });

  watcher.on("unlink", async (filePath: string) => {
    console.log(
      chalk.yellow(`➖ File removed: ${path.relative(originDir, filePath)}`)
    );
    try {
      await validateAndCopyContent(originDir, templatePath);
      console.log(chalk.green("✅ Content updated successfully"));
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error updating content: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n🛑 Shutting down..."));
    watcher.close();
    process.exit(0);
  });
}

/**
 * Runs npm run build and copies the out directory to current directory
 */
async function buildAndCopyOutput(templatePath: string): Promise<void> {
  console.log(chalk.blue("🔨 Building documentation..."));

  try {
    execSync("npm run build", {
      cwd: templatePath,
      stdio: "inherit",
    });
    console.log(chalk.green("✅ Build completed successfully"));

    // Copy out directory to current directory
    const outDir = path.join(templatePath, "out");
    const currentDir = process.cwd();

    if (!fs.existsSync(outDir)) {
      throw new Error("Build output directory not found");
    }

    console.log(chalk.blue("📋 Copying build output to current directory..."));

    // Create a safe output directory instead of overwriting current directory
    const outputDir = path.join(currentDir, "docs-output");

    // Remove existing output directory if it exists
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    // Copy all contents from out directory to docs-output
    const outContents = fs.readdirSync(outDir);
    console.log(
      chalk.blue(`📁 Found ${outContents.length} items in out directory`)
    );

    for (const item of outContents) {
      const srcPath = path.join(outDir, item);
      const destPath = path.join(outputDir, item);

      try {
        // Check if source exists and copy immediately
        if (fs.existsSync(srcPath)) {
          console.log(chalk.blue(`📋 Copying: ${item}`));
          await copyDirectory(srcPath, destPath);
        } else {
          console.log(chalk.yellow(`⚠️  Skipping missing file: ${item}`));
        }
      } catch (error) {
        console.log(
          chalk.yellow(
            `⚠️  Error copying ${item}: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        );
        // Continue with other files
      }
    }

    console.log(chalk.green("✅ Documentation built and copied successfully!"));
    console.log(
      chalk.green(
        `🌐 Your documentation is ready in the 'docs-output' directory!`
      )
    );
    console.log(chalk.blue(`📁 Output location: ${outputDir}`));
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Build failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    );
    throw error;
  }
}

// CLI setup
const program = new Command();

program
  .name("speed-docs")
  .description("A CLI tool to create online documentation quickly")
  .version("1.0.0");

program
  .argument(
    "<origin-directory>",
    "Path to the directory containing your content (config.json and docs/)"
  )
  .option("--dev", "Run in development mode with file watching")
  .option("--template <url>", "Override the default template repository URL")
  .action(
    async (
      originDir: string,
      options: { dev?: boolean; template?: string }
    ) => {
      try {
        const resolvedOriginDir = path.resolve(originDir);

        console.log(chalk.blue("🚀 Speed Docs CLI"));
        console.log(chalk.blue("=================="));

        // Download template
        const templatePath = await downloadTemplate(options.template);

        // Install dependencies
        await installDependencies(templatePath);

        // Copy content
        await validateAndCopyContent(resolvedOriginDir, templatePath);

        if (options.dev) {
          // Development mode
          console.log(chalk.green("🔧 Starting development mode..."));
          console.log(chalk.yellow("Press Ctrl+C to stop"));

          // Start file watching
          watchOriginDirectory(resolvedOriginDir, templatePath);

          // Start dev server
          runDevMode(templatePath);
        } else {
          // Production mode
          console.log(chalk.green("🏗️  Building for production..."));
          await buildAndCopyOutput(templatePath);
        }
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Error: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        );
        process.exit(1);
      }
    }
  );

// Parse command line arguments
program.parse();

export { validateAndCopyContent };
