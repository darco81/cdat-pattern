# Changelog

All notable changes to CDAT Pattern will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-05-25

### Added

- **Cross-Cutting Guardians** - Major extension for environment health, i18n, and accessibility
  - Guardian Pattern: Full CDAT modules for cross-cutting concerns
  - Pre-flight validation: Health checks run before feature tests
  - ARIA-First Locator Policy: Never locate by translated text, always by ARIA role or data-testid
  - `_health` guardian module with complete C-D-A-T implementation

- **Guardian Implementation (_health module)**
  - Environment health validation (backend connectivity, response times)
  - i18n health checks (translation loading, raw key detection)
  - Accessibility validation (ARIA roles, keyboard navigation, accessible names)
  - Comprehensive health reporting with detailed failure context

- **Updated Architecture**
  - Extended 4-layer responsibility table to include Guardian concerns
  - Playwright project dependencies configuration for pre-flight checks
  - Guardian-aware test execution flow (health-check → features)
  
- **Enhanced Documentation**
  - New `CROSS-CUTTING-GUARDIANS.md` comprehensive guide
  - Updated `ARCHITECTURE.md` with Guardian patterns and Mermaid diagrams
  - Locator policy migration guide (text → ARIA/testid)
  - Guardian benefits and implementation examples

- **Example Updates**
  - `examples/basic/_health/` complete Guardian implementation
  - Updated Playwright config with project dependencies
  - Enhanced README with Guardian pattern explanation
  - New npm scripts for health-specific test runs

### Changed

- **Comparison Table**: Added cross-cutting concerns row (Classic POM vs CDAT Pattern)
- **Documentation Links**: Added Cross-Cutting Guardians to main documentation list
- **Layer Responsibilities**: Extended to include Guardian module responsibilities

### Migration Notes

- Existing CDAT implementations continue to work unchanged
- Guardian modules are optional but recommended for production applications
- Text-based locators should be migrated to ARIA-first approach for better i18n compatibility

## [1.1.0] - 2026-01-12

### Added

- **CRM/ERP Example Suite** - Production-ready patterns for enterprise applications
  - User management with advanced filtering and bulk operations
  - Complex multi-step form handling (user creation wizard)
  - Advanced data grid patterns (6 filter types, sorting, pagination)
  - Shared component library (data-grid, modal, navigation)
  
- **8 new Cdat utility methods** for CRM/ERP scenarios:
  - `waitForGridReload()` - Smart grid reload detection
  - `selectOption()` - Custom dropdown selection
  - `uploadFile()` - File upload handling
  - `waitForFormSubmit()` - Form submission with loading states
  - `hoverAndGetTooltip()` - Tooltip interaction
  - `containsText()` - Non-throwing text verification
  - `scrollIntoView()` - Enhanced scrolling with visibility check
  - `clickAndWaitForNavigation()` - Click with navigation waiting

- **CRM/ERP Documentation**
  - Patterns guide for enterprise applications
  - Advanced filtering documentation (6 filter types)
  - Complex forms and validation patterns

### Changed

- Total Cdat utility methods: 28 → 36 (added 8 CRM/ERP methods)
- Examples now cover both e-commerce AND enterprise domains

---

## [1.0.0] - 2025-11-30

### Added

- Initial public release of CDAT Pattern
- Core architecture documentation
- `@cdat/utils` package with 33 smart wait utilities
- Basic example (login feature)
- E-commerce example (homepage, product, cart, checkout)
- VS Code snippets for quick scaffolding
- GitHub Actions CI workflow
- Comprehensive documentation:
  - Architecture guide
  - Zero Rules explanation
  - Composition patterns
  - Smart waits reference
  - Migration guide from POM
  - Best practices
  - FAQ

### Architecture

- **C**omponents layer: locators and selectors only
- **D**ata layer: types, interfaces, and test data
- **A**ctions layer: business logic without assertions
- **T**ests layer: scenarios with assertions

### Zero Rules

- Zero `any` - strict TypeScript typing
- Zero `waitForTimeout` - smart waits via Cdat utility class
- Zero `else` - early return pattern

---

## Production History

This pattern evolved through **18 months** of production use across **9 business applications**:

### 2024

- **July 2024**: 🚗 **Automotive wholesale ERP/CRM** - Pattern origin
  - Large parent wholesale company with subsidiary management
  - Distribution network from warehouses to service points
  - Complex B2B relationships and inventory management

- **Q4 2024**: 🎪 **Event management system**
  - Concert and festival organization
  - Camp and retreat management
  - Booking, ticketing, and participant tracking

### 2024-2025

- **Dec 2024 - Jan 2025**: 🏫 **School management platform**
  - Catering service management
  - Payment processing and fee tracking
  - Extracurricular activities scheduling

### 2025

- **June 2025**: 🚚 **Enterprise logistics company**
  - Large-scale fleet management ERP
  - Route optimization and tracking
  - Multi-warehouse logistics operations

- **Aug - Dec 2025**: 🛒 **E-commerce platforms** (5 implementations)
  - 3× Standard e-commerce (vendor platform)
  - 2× Custom frontend e-commerce (headless)
  - Product catalog, cart, checkout flows

- **November 2025**: 🚀 **v1.0.0** - Initial open source release

- **January 2026**: 🏢 **v1.1.0** - CRM/ERP examples added

---

## Why CDAT?

After implementing the same patterns across 9 different production systems, it became clear that:

1. **Classic POM doesn't scale** - Page Objects become god objects
2. **Type safety matters** - `any` types hide bugs until production
3. **Smart waits are essential** - `waitForTimeout` causes flaky tests
4. **Clean code is maintainable** - Early returns beat nested conditionals

CDAT Pattern crystallizes 18 months of lessons learned into a reusable architecture.

---

[1.1.0]: https://github.com/dar-kow/cdat-pattern/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dar-kow/cdat-pattern/releases/tag/v1.0.0