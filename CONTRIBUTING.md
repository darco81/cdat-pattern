# Contributing to CDAT Pattern

Thank you for your interest in contributing to CDAT Pattern! This document provides guidelines and information about contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Code samples** if applicable
- **Environment details** (OS, Node.js version, Playwright version)

### Suggesting Features

Feature requests are welcome! Please:

- **Check existing issues** first
- **Describe the use case** - why is this feature needed?
- **Provide examples** of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** (see below)
3. **Add tests** if applicable
4. **Update documentation** if needed
5. **Ensure all tests pass**
6. **Create the pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cdat-pattern.git
cd cdat-pattern

# Install dependencies
npm install

# Run tests
npm test
```

## Coding Style

### TypeScript

- Use strict TypeScript configuration
- **No `any` types** - use proper types/interfaces
- Use `readonly` for immutable properties
- Prefer async/await over callbacks

### Naming Conventions

```typescript
// Classes - PascalCase
class LoginComponents {}

// Constants - UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT = 5000;

// Variables/functions - camelCase
const userName = 'test';
async function fillForm() {}

// Interfaces - PascalCase
interface UserData {}
```

### File Structure

- One class per file
- Use `kebab-case` for file names
- Group related files in feature folders

### Zero Rules

All contributions must follow the Three Zero Rules:

1. **Zero `any`** - All types must be explicit
2. **Zero `waitForTimeout`** - Use smart waits
3. **Zero `else`** - Use early returns

## Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(actions): add waitAndHover method
fix(components): correct selector composition
docs(readme): update quick start section
```

## Pull Request Process

1. Update the README.md if needed
2. Update CHANGELOG.md with your changes
3. Ensure CI passes
4. Request review from maintainers

## Questions?

Feel free to open an issue with the `question` label.

---

Thank you for contributing!
