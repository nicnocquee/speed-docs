# speed-docs

A powerful CLI tool to quickly create and deploy online documentation from your content directory using FumaDocs.

## Installation

```bash
npm install -g speed-docs
```

## Usage

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

### Examples

```bash
# Build static documentation
speed-docs ./my-content

# Run in development mode with live reload
speed-docs ./my-content --dev

# Use a custom template
speed-docs ./my-content --template https://github.com/user/custom-template/archive/main.tar.gz
```

## What it does

Speed-docs automates the entire documentation creation process:

### 1. **Template Management**

- Downloads a pre-configured FumaDocs template from GitHub
- Supports custom template URLs
- Automatically extracts and sets up the template

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

## Directory Structure

Your origin directory should have this structure:

```
my-content/
├── config.json          # Documentation configuration
└── docs/                # Your documentation content
    ├── getting-started/
    │   ├── page.json
    │   └── content.md
    └── api/
        ├── page.json
        └── reference.md
```

## Features

- ✅ **Zero Configuration**: Works out of the box with sensible defaults
- ✅ **Live Development**: File watching and hot reload in dev mode
- ✅ **Content Validation**: Comprehensive validation of your content structure
- ✅ **Image Handling**: Automatic image optimization and placement
- ✅ **Template Flexibility**: Support for custom templates
- ✅ **Production Ready**: Optimized builds for deployment
- ✅ **Cross Platform**: Works on Windows, macOS, and Linux

## Requirements

- Node.js 18.0.0 or higher
- Valid content directory with `config.json` and `docs/` folder
- Internet connection for template download

## License

MIT
