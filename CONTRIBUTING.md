# Contributing to PiKVM Node.js Library

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/anishkny/pikvm.git
cd pikvm
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Project Structure

```
pikvm/
├── src/              # TypeScript source files
│   └── index.ts      # Main library implementation
├── examples/         # Example scripts
├── dist/             # Compiled JavaScript (generated)
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # Documentation
```

## Development Workflow

1. Make your changes in the `src/` directory
2. Build the project: `npm run build`
3. Test your changes using the examples
4. Ensure types are properly exported

## Code Style

- Use TypeScript for all source code
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions focused and small

## Adding New Features

When adding new PiKVM API endpoints:

1. Add proper TypeScript interfaces for request/response types
2. Add the method to the `PiKVMClient` class
3. Include JSDoc documentation
4. Update the README with usage examples
5. Consider adding an example script

## Testing

Since this library interacts with real hardware:

- Integration tests require a running PiKVM instance
- Test manually using the provided examples
- Ensure error handling is robust
- Test with various configuration options

## Documentation

- Keep README.md up to date
- Add examples for new features
- Document all public APIs with JSDoc
- Include error handling examples

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with:
   - Clear description of changes
   - Examples of usage (if applicable)
   - Any breaking changes noted

## Questions or Issues

- Open an issue for bugs or feature requests
- Provide as much detail as possible
- Include PiKVM version if relevant

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
