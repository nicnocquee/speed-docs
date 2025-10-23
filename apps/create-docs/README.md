# speed-docs

A CLI tool to create and validate FumaDocs content structure.

## Installation

```bash
npm install -g speed-docs
```

## Usage

```bash
speed-docs <origin-directory>
```

### Example

```bash
speed-docs ./content-example
```

## What it does

This tool validates and copies content from an origin directory to a FumaDocs content structure:

1. **Validates** the origin directory structure:

   - Ensures `config.json` exists and is valid JSON
   - Ensures `docs` directory exists
   - Validates all JSON files in the docs directory and subdirectories

2. **Copies** content to the appropriate locations:
   - Copies all content files to the `content` directory
   - Copies image files (png, jpg, jpeg, gif, svg, webp, ico) to the `public` directory

## Requirements

- Node.js 18.0.0 or higher
- Valid FumaDocs content structure in the origin directory

## License

MIT
