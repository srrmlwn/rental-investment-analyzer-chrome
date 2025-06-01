# Repository Information

## Overview
The Rental Investment Analyzer Chrome Extension is hosted at:
https://github.com/srrmlwn/rental-investment-analyzer-chrome

## Repository Structure
```
rental-investment-analyzer-chrome/
├── src/                    # Source code
│   ├── content/           # Content scripts
│   ├── background/        # Background scripts
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── constants/        # Constants and configs
│   └── manifest.json     # Extension manifest
├── public/               # Static assets
├── tests/               # Test files
├── docs/               # Documentation
├── scripts/            # Build scripts
├── package.json        # Project configuration
└── README.md          # Project overview
```

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- Feature branches - `feature/*`
- Bug fix branches - `fix/*`
- Release branches - `release/*`

### Commit Guidelines
- Use conventional commits format
- Include ticket/issue numbers when applicable
- Write clear, descriptive commit messages
- Keep commits focused and atomic

### Pull Request Process
1. Create feature/fix branch from `develop`
2. Make changes and commit following guidelines
3. Write tests if applicable
4. Update documentation
5. Create PR against `develop`
6. Address review comments
7. Merge after approval

## CI/CD

### GitHub Actions
- Automated testing
- Build verification
- Linting checks
- Security scanning

### Deployment
- Manual deployment to Chrome Web Store
- Version management through package.json
- Release notes in GitHub releases

## Issue Tracking

### Labels
- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Documentation updates
- `high-priority` - Urgent issues
- `help-wanted` - Good for contributors
- `in-progress` - Currently being worked on

### Milestones
- Version-based milestones
- Feature-based milestones
- Bug fix sprints

## Contributing

### Getting Started
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

### Development Setup
```bash
# Clone the repository
git clone https://github.com/srrmlwn/rental-investment-analyzer-chrome.git
cd rental-investment-analyzer-chrome

# Install dependencies
npm install

# Start development
npm run dev
```

### Code Review Process
1. Automated checks must pass
2. At least one review required
3. All comments must be addressed
4. Tests must pass
5. Documentation must be updated

## Security

### Reporting Issues
- Use GitHub Security Advisories
- Include detailed reproduction steps
- Provide environment information
- Suggest potential fixes if possible

### Security Measures
- Regular dependency updates
- Security scanning in CI
- Code review requirements
- Access control management

## Resources

### Documentation
- [README.md](../README.md)
- [Development Guide](../development.md)
- [Architecture Overview](./tech-architecture.md)
- [Component Injection](./component-injection.md)

### External Links
- [Chrome Web Store](https://chrome.google.com/webstore)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Material Design Guidelines](https://material.io/design) 