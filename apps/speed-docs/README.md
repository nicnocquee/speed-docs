# speed-docs

A powerful CLI tool to quickly create and deploy online documentation from your content directory using FumaDocs.

## Installation

```bash
npm install -g speed-docs
```

## Usage

### Prepare your content directory

Your content directory should have this structure:

```
content/
├── config.json          # Documentation configuration
└── docs/                # Your documentation content
    ├── index.mdx
    ├── getting-started/
    │   ├── meta.json
    │   └── content.mdx
    └── api/
        ├── meta.json
        └── reference.mdx
```

The config.json file should contain your documentation configuration:

```json
{
  "nav": {
    "title": "My Documentation",
    "image": "/logo.png"
  }
}
```

Put the images in the root of content directory. In the example above, put the images in `content` directory.

### Initialize Docs Directory

```bash
speed-docs init [--dir <path>]
```

This command downloads the docs directory template from GitHub and initializes it in the specified directory (or current working directory if not specified). The CNAME file is automatically removed.

```bash
# Initialize in current directory
speed-docs init

# Initialize in a specific directory
speed-docs init --dir ./my-docs
```

### Basic Usage

```bash
speed-docs <origin-directory>
```

### Development Mode (with file watching)

```bash
speed-docs <origin-directory> --dev
```

### Custom Template

```bash
speed-docs <origin-directory> --template <template-url>
```

### Custom Download Directory

```bash
speed-docs <origin-directory> --download-dir <path>
```

### Examples

```bash
# Initialize a new docs directory
speed-docs init
speed-docs init --dir ./my-docs

# Build static documentation
speed-docs ./my-content

# Run in development mode with live reload
speed-docs ./my-content --dev

# Use a custom template
speed-docs ./my-content --template https://github.com/user/custom-template/archive/main.tar.gz

# Use a custom download/cache directory
speed-docs ./my-content --download-dir /path/to/custom/cache

# Combine multiple options
speed-docs ./my-content --dev --download-dir /tmp/my-cache --force
```

## What it does

Speed-docs automates the entire documentation creation process:

### 1. **Template Management**

- Downloads a pre-configured FumaDocs template from GitHub
- Supports custom template URLs
- Automatically extracts and sets up the template
- Caches templates in `~/.speed-docs/cache` by default
- Supports custom download/cache directories via `--download-dir`

### 2. **Content Validation**

- Validates your origin directory structure:
  - Ensures `config.json` exists and contains valid JSON
  - Ensures `docs` directory exists
  - Validates all JSON files in the docs directory and subdirectories
- Provides detailed error messages for invalid content

### 3. **Content Processing**

- Copies all content files to the template's `content` directory
- Automatically moves image files (png, jpg, jpeg, gif, svg, webp, ico) to the `public` directory
- Maintains directory structure and file organization

### 4. **Development Mode** (`--dev`)

- Starts a development server with live reload
- Watches your origin directory for changes
- Automatically updates the documentation when files change
- Provides real-time feedback on file modifications

### 5. **Production Build**

- Installs all necessary dependencies
- Builds optimized static documentation
- Outputs the built documentation to a `docs-output` directory
- Ready for deployment to any static hosting service

## Commands

### `init`

Initialize a docs directory from the template.

| Option         | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `--dir <path>` | Target directory to initialize docs (defaults to current directory) |

### Main Command

Build documentation from a content directory.

| Option                  | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `<origin-directory>`    | Path to your content directory (required)               |
| `--dev`                 | Run in development mode with file watching              |
| `--template <url>`      | Override the default template repository URL            |
| `--force`               | Force redownload and reinstall template (ignores cache) |
| `--download-dir <path>` | Override the default download/cache directory           |
| `--base-path <path>`    | Override the default base path                          |
| `--include-hidden`      | Include hidden files and directories                    |

## Features

- ✅ **Zero Configuration**: Works out of the box with sensible defaults
- ✅ **Live Development**: File watching and hot reload in dev mode
- ✅ **Content Validation**: Comprehensive validation of your content structure
- ✅ **Image Handling**: Automatic image optimization and placement
- ✅ **Template Flexibility**: Support for custom templates
- ✅ **Custom Cache Directory**: Override default download/cache location
- ✅ **Production Ready**: Optimized builds for deployment
- ✅ **Cross Platform**: Works on Windows, macOS, and Linux

## Requirements

- Node.js 18.0.0 or higher
- Valid content directory with `config.json` and `docs/` folder
- Internet connection for template download

## License

MIT
