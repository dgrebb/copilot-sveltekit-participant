# VS Code Extension Implementation Guidelines

When building the VS Code extension:

1. **Build Tooling**:
   - Use either webpack or esbuild consistently (not both)
   - Configure proper bundling for VS Code extensions
   - Minimize dependencies to reduce extension size
   - Optimize build performance with appropriate configurations

2. **Project Structure**:
   - Maintain clear separation of concerns
   - Follow established extension patterns
   - Use consistent naming conventions
   - Organize the codebase for maintainability
