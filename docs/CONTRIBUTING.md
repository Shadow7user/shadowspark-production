# Contributing to LOGISTICORE

Thank you for your interest in contributing to the LOGISTICORE Enterprise Platform! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/shadowspark-production.git
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build packages**:
   ```bash
   npm run build:packages
   ```

## Development Workflow

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update types in `@logisticore/data-models` when needed

### Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Run tests (when available)
npm run test
```

### Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add route optimization algorithm"
git commit -m "fix: correct distance calculation"
git commit -m "docs: update API reference"
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use conventional commit format:
- `feat: add delivery simulation API`
- `fix: resolve route optimization bug`

### PR Description

Include:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Approach taken
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Example PR Description

```markdown
## What
Adds a new route optimization algorithm using A* pathfinding

## Why
Current nearest-neighbor algorithm doesn't consider traffic conditions

## How
- Implemented A* algorithm in sim-engine
- Added traffic data integration
- Updated route optimizer to use new algorithm

## Testing
- Unit tests for A* implementation
- Integration test with real routes
- Performance comparison with old algorithm

## Results
- 15% improvement in route efficiency
- 20% reduction in delivery time
```

## Code Style

### TypeScript

- Use strict mode
- No `any` types (use `unknown` if needed)
- Prefer `interface` over `type` for object shapes
- Use `const` for immutable values

**Good**:
```typescript
interface Route {
  id: string;
  distance: number;
}

function optimizeRoute(route: Route): OptimizedRoute {
  // ...
}
```

**Bad**:
```typescript
function optimizeRoute(route: any) {
  // ...
}
```

### Naming Conventions

- **Files**: kebab-case (`route-optimizer.ts`)
- **Components**: PascalCase (`RouteOptimizer.tsx`)
- **Functions**: camelCase (`optimizeRoute`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ROUTE_LENGTH`)
- **Interfaces**: PascalCase (`RouteOptimizationOptions`)

### File Organization

```typescript
// 1. Imports
import type { Route } from '@logisticore/data-models';
import { calculateDistance } from '../utils/distance';

// 2. Types/Interfaces
export interface OptimizationResult {
  // ...
}

// 3. Constants
const DEFAULT_SPEED = 40;

// 4. Functions
export function optimizeRoute() {
  // ...
}
```

## Package-Specific Guidelines

### @logisticore/data-models

- All types must be exported from `src/index.ts`
- Include JSDoc comments for interfaces
- Add Zod schemas for runtime validation
- Keep types pure (no implementation logic)

### @logisticore/sim-engine

- Include JSDoc with examples
- Write pure functions when possible
- Add unit tests for algorithms
- Document time/space complexity

### Applications

- Use shared types from `@logisticore/data-models`
- Follow Next.js best practices
- Keep components small and focused
- Use React Server Components when possible

## Testing

### Unit Tests

```typescript
import { optimizeRoute } from './route-optimizer';

describe('optimizeRoute', () => {
  it('should optimize route with 3 waypoints', () => {
    const result = optimizeRoute({
      startLocation: { latitude: 0, longitude: 0 },
      endLocation: { latitude: 0, longitude: 0 },
      waypoints: [/* ... */]
    });
    
    expect(result.waypoints).toHaveLength(3);
    expect(result.totalDistance).toBeGreaterThan(0);
  });
});
```

### Integration Tests

Test package interactions:

```typescript
import { Shipment } from '@logisticore/data-models';
import { optimizeRoute } from '@logisticore/sim-engine';

describe('Route optimization integration', () => {
  it('should work with Shipment types', () => {
    // Test cross-package functionality
  });
});
```

## Documentation

### Code Comments

Use JSDoc for public APIs:

```typescript
/**
 * Optimizes a delivery route using nearest-neighbor algorithm
 * 
 * @param options - Configuration for route optimization
 * @returns Optimized route with waypoints and metrics
 * 
 * @example
 * ```typescript
 * const optimized = optimizeRoute({
 *   startLocation: warehouse,
 *   endLocation: warehouse,
 *   waypoints: deliveryPoints
 * });
 * ```
 */
export function optimizeRoute(options: OptimizationOptions): OptimizedRoute {
  // ...
}
```

### README Updates

Update relevant READMEs when:
- Adding new features
- Changing API signatures
- Adding new packages
- Modifying workflows

## Review Process

1. **Automated Checks**:
   - TypeScript compilation
   - Linting
   - Tests (when implemented)
   - Build verification

2. **Code Review**:
   - At least one approval required
   - Address all feedback
   - Keep discussions constructive

3. **Merge**:
   - Squash commits when merging
   - Delete branch after merge

## Need Help?

- Check existing documentation in `/docs`
- Review similar code in the codebase
- Ask questions in PR comments
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing! 🙏
