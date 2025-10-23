# Publishing Guide for Speed Docs GitHub Action

This guide explains how to publish new versions of the `speed-docs-github-action`.

## Overview

The GitHub Action is **fully automated** for publishing. You only need to create a GitHub release, and everything else happens automatically:

1. **Version Sync**: `package.json` version is automatically updated to match the release tag
2. **Build & Publish**: The action is automatically built and published
3. **Availability**: The action becomes available as `nicnocquee/speed-docs-github-action@vX.X.X`

## Quick Start (Automated)

### Simple Release Process

1. **Create a GitHub Release**:

   - Go to [GitHub Releases](https://github.com/nicnocquee/speed-docs/releases)
   - Click "Create a new release"
   - Create tag: `vX.X.X` (e.g., `v1.1.0`)
   - Add release notes
   - Publish the release

2. **Everything else is automatic**:
   - ✅ Version automatically updated in `package.json`
   - ✅ Action built and published
   - ✅ Available as `nicnocquee/speed-docs-github-action@vX.X.X`

### Using the Helper Script

```bash
npm run release-action
```

This script provides guidance and can optionally update the version manually.

## Automated Workflows

The publishing process uses three automated workflows:

### 1. Pre-Release Validation (`.github/workflows/pre-release-validation.yml`)

- **Triggers**: When a tag is pushed (e.g., `v1.1.0`)
- **Purpose**: Validates the release tag and checks readiness
- **Actions**:
  - Extracts version from tag
  - Checks package.json version
  - Validates action.yml
  - Verifies build readiness

### 2. Auto-Update Version (`.github/workflows/auto-update-version.yml`)

- **Triggers**: When a release is published
- **Purpose**: Automatically syncs package.json version with release tag
- **Actions**:
  - Extracts version from release tag
  - Updates package.json
  - Commits the change
  - Verifies version sync

### 3. Release Action (`.github/workflows/release-action.yml`)

- **Triggers**: After auto-update-version completes successfully
- **Purpose**: Builds and publishes the action
- **Actions**:
  - Verifies version matches release
  - Installs dependencies
  - Builds the action
  - Creates release asset
  - Publishes to GitHub

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, small improvements
- **Minor** (`1.0.0` → `1.1.0`): New features, backward compatible
- **Major** (`1.0.0` → `2.0.0`): Breaking changes

## Manual Version Management (Optional)

If you prefer to manage versions manually:

```bash
# Update package.json version
cd apps/speed-docs-github-action
npm version patch  # or minor, major

# Commit and push
git add package.json
git commit -m "chore: bump action version to X.X.X"
git push
```

## Action Structure

The published action includes:

```
speed-docs-github-action/
├── action.yml          # Action metadata
├── dist/              # Built JavaScript
├── README.md          # Documentation
└── package.json       # Package metadata
```

## Testing Before Release

1. **Local Testing**:

   ```bash
   cd apps/speed-docs-github-action
   npm run build
   node dist/index.js
   ```

2. **Workflow Testing**:

   - Create a test repository
   - Use the local action path: `./apps/speed-docs-github-action`
   - Verify it works correctly

3. **Build Verification**:
   - Check the build workflow passes
   - Verify all tests pass

## Release Notes Template

When creating a release, include:

```markdown
## What's New

- New features or improvements

## Bug Fixes

- Fixed issues

## Breaking Changes

- Any breaking changes (if major version)

## Migration Guide

- How to upgrade (if needed)
```

## Troubleshooting

### Build Failures

1. **Check TypeScript compilation**:

   ```bash
   cd apps/speed-docs-github-action
   npm run build
   ```

2. **Verify dependencies**:

   ```bash
   npm ci
   ```

3. **Check workflow logs**:
   - Go to Actions tab
   - Check build workflow logs

### Publishing Issues

1. **Verify release tag format**: Must be `vX.X.X`
2. **Check release workflow**: Ensure it runs successfully
3. **Verify action.yml**: Check for syntax errors

### Version Sync Issues

1. **Check auto-update workflow**: Ensure it runs after release
2. **Verify package.json**: Check if version was updated
3. **Check commit history**: Look for version update commits

## Security Considerations

- **Dependencies**: Keep dependencies up to date
- **Secrets**: Never commit secrets to the repository
- **Permissions**: Use minimal required permissions in workflows

## Support

For issues with publishing:

1. Check the [Issues](https://github.com/nicnocquee/speed-docs/issues) page
2. Review workflow logs
3. Verify action configuration

## Best Practices

1. **Test thoroughly** before releasing
2. **Use semantic versioning**
3. **Write clear release notes**
4. **Keep dependencies updated**
5. **Monitor action usage** after release
6. **Let automation handle versioning** - don't manually update package.json unless necessary
