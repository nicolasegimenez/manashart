# Testing Guide - Manashart Web3 Music Platform

Este documento explica cómo realizar testing en la aplicación Manashart, incluyendo tests de backend (Motoko), frontend (React), e integración end-to-end.

## 📋 Tabla de Contenidos

- [Estructura de Testing](#estructura-de-testing)
- [Setup Inicial](#setup-inicial)
- [Backend Testing (Motoko)](#backend-testing-motoko)
- [Frontend Testing (React)](#frontend-testing-react)
- [End-to-End Testing](#end-to-end-testing)
- [Comandos de Testing](#comandos-de-testing)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 📁 Estructura de Testing

```
tests/
├── backend/                 # Tests para canisters Motoko
│   ├── soul_profile_test.mo
│   ├── project_management_test.mo
│   ├── module_system_test.mo
│   └── test_runner.mo
├── frontend/                # Tests para componentes React
│   ├── SoulProfile.test.jsx
│   ├── ProjectManager.test.jsx
│   ├── setup.js
│   └── vitest.config.js
├── e2e/                     # Tests end-to-end con Playwright
│   ├── user_journey.test.js
│   └── playwright.config.js
├── utils/                   # Utilidades y helpers
│   └── test-helpers.js
└── TESTING.md              # Esta guía
```

## 🚀 Setup Inicial

### 1. Instalar Dependencias

```bash
# Frontend testing dependencies
cd src/manashart_frontend
npm install --save-dev \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom

# E2E testing dependencies
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Configurar Scripts de Package.json

Agrega estos scripts a `src/manashart_frontend/package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:backend": "dfx canister call test_runner runAllTests"
  }
}
```

### 3. Configurar dfx.json para Tests

Agrega la configuración de test canister en `dfx.json`:

```json
{
  "canisters": {
    "test_runner": {
      "type": "motoko",
      "main": "tests/backend/test_runner.mo"
    }
  }
}
```

## 🏗️ Backend Testing (Motoko)

### Estructura de Tests

Los tests de backend están escritos en Motoko y prueban directamente las funciones del canister.

### Ejecutar Tests de Backend

```bash
# 1. Iniciar dfx
dfx start --clean --background

# 2. Deployar el canister principal
dfx deploy manashart_backend

# 3. Deployar el test runner
dfx deploy test_runner

# 4. Ejecutar todos los tests
dfx canister call test_runner runAllTests

# 5. Ejecutar tests específicos
dfx canister call test_runner runSoulProfileTests
dfx canister call test_runner runProjectManagementTests
dfx canister call test_runner runModuleSystemTests
```

### Ejemplo de Test de Backend

```motoko
// tests/backend/soul_profile_test.mo
await it("should create a new soul profile", func () : async Bool {
  let result = await Manashart.createSoulProfile("TestUser123");
  switch (result) {
    case (#ok(profile)) {
      assert(profile.username == "TestUser123", "Username should match") and
      assert(profile.vibration == 50, "Initial vibration should be 50")
    };
    case (#err(error)) {
      false
    };
  }
});
```

### Tests Disponibles

1. **Soul Profile Tests** - Creación, consulta y gestión de perfiles
2. **Project Management Tests** - Creación y gestión de proyectos
3. **Module System Tests** - Sistema de desbloqueo de módulos

## ⚛️ Frontend Testing (React)

### Configuración

Los tests de frontend usan Vitest + Testing Library para probar componentes React.

### Ejecutar Tests de Frontend

```bash
cd src/manashart_frontend

# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch

# Generar reporte de coverage
npm run test:coverage

# Ejecutar tests específicos
npm test SoulProfile
npm test ProjectManager
```

### Ejemplo de Test de Frontend

```jsx
// tests/frontend/SoulProfile.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SoulProfile from '../../src/manashart_frontend/src/modules/soul/SoulProfile';

test('should create a new profile when form is submitted', async () => {
  const mockActor = {
    getSoulProfile: vi.fn().mockResolvedValue([]),
    createSoulProfile: vi.fn().mockResolvedValue({
      ok: { username: 'TestUser', vibration: 50 }
    })
  };

  render(<SoulProfile identity={mockIdentity} />);

  const usernameInput = screen.getByPlaceholderText('Enter username');
  const createButton = screen.getByText('Create Profile');

  fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(mockActor.createSoulProfile).toHaveBeenCalledWith('TestUser');
  });
});
```

### Mocking

Los tests utilizan mocks para:
- Actor service (comunicación con backend)
- Internet Identity
- LocalStorage
- Browser APIs (ResizeObserver, etc.)

## 🎭 End-to-End Testing

### Configuración

Los tests E2E usan Playwright para probar flujos completos de usuario.

### Ejecutar Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar con interfaz visual
npm run test:e2e:ui

# Ejecutar en browsers específicos
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar en modo debug
npx playwright test --debug
```

### Ejemplo de Test E2E

```javascript
// tests/e2e/user_journey.test.js
test('Complete user onboarding flow', async ({ page }) => {
  // 1. Usuario llega a la landing page
  await page.goto('http://localhost:8080');
  await expect(page.locator('text=Bienvenido al Universo MANASHART')).toBeVisible();

  // 2. Usuario se conecta
  await page.click('text=Iniciar Viaje');

  // 3. Usuario crea perfil
  await page.click('text=Soul');
  await page.fill('input[placeholder="Enter username"]', 'TestUser123');
  await page.click('text=Create Profile');

  // 4. Verificar perfil creado
  await expect(page.locator('text=TestUser123')).toBeVisible();
});
```

### Tests E2E Disponibles

1. **User Journey** - Flujo completo de onboarding
2. **Project Creation** - Creación de proyectos
3. **Module Unlocking** - Progresión de módulos
4. **Responsive Design** - Tests en móvil
5. **Error Handling** - Manejo de errores
6. **Performance** - Tiempos de carga

## 📋 Comandos de Testing

### Testing Completo

```bash
# Script para ejecutar todos los tests
#!/bin/bash

echo "🚀 Running Complete Test Suite"

# 1. Backend Tests
echo "📡 Testing Backend (Motoko)..."
dfx start --clean --background
dfx deploy
dfx canister call test_runner runAllTests

# 2. Frontend Tests
echo "⚛️ Testing Frontend (React)..."
cd src/manashart_frontend
npm test

# 3. E2E Tests
echo "🎭 Testing End-to-End (Playwright)..."
npm run test:e2e

echo "✅ All tests completed!"
```

### Tests por Categoría

```bash
# Solo backend
npm run test:backend

# Solo frontend
npm run test:frontend

# Solo E2E
npm run test:e2e

# Con coverage
npm run test:coverage
```

### Tests en CI/CD

```bash
# Para uso en GitHub Actions o similar
npm run test:ci  # Ejecuta todos los tests sin watch mode
```

## 🔧 Best Practices

### 1. Estructura de Tests

- **Arrange**: Configurar el estado inicial
- **Act**: Ejecutar la acción a probar
- **Assert**: Verificar el resultado

### 2. Naming Conventions

```javascript
describe('ComponentName', () => {
  describe('when user does X', () => {
    it('should do Y', () => {
      // test implementation
    });
  });
});
```

### 3. Mock Strategy

- Mock external dependencies (actor, localStorage, etc.)
- Use real implementations for internal logic
- Keep mocks simple and focused

### 4. Test Data

- Use factories for generating test data
- Keep test data small and focused
- Use realistic but not real data

### 5. Async Testing

```javascript
// Correcto
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});

// Incorrecto
expect(screen.getByText('Expected text')).toBeInTheDocument();
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. "Canister not found" en Backend Tests

```bash
# Asegúrate de que dfx esté ejecutándose
dfx start --background

# Deploya los canisters
dfx deploy
```

#### 2. "Module not found" en Frontend Tests

```bash
# Verifica que las dependencias estén instaladas
npm install

# Verifica la configuración de Vitest
cat tests/frontend/vitest.config.js
```

#### 3. Tests E2E fallan por timeouts

```bash
# Aumenta el timeout en playwright.config.js
timeout: 30000

# O ejecuta con --timeout
npx playwright test --timeout=60000
```

#### 4. Problemas con Identity/Auth

```javascript
// Mock la autenticación en tests
beforeEach(() => {
  vi.mock('@dfinity/auth-client', () => ({
    AuthClient: {
      create: () => mockAuthClient
    }
  }));
});
```

### Debugging

#### Backend (Motoko)

```bash
# Ver logs detallados
dfx canister logs test_runner

# Debug específico
dfx canister call test_runner runSoulProfileTests --verbose
```

#### Frontend (React)

```bash
# Debug con Vitest
npm test -- --reporter=verbose

# Debug específico
npm test SoulProfile -- --watch
```

#### E2E (Playwright)

```bash
# Modo debug
npx playwright test --debug

# Con headed browser
npx playwright test --headed

# Screenshots en fallos
npx playwright test --screenshot=only-on-failure
```

## 📊 Coverage Reports

### Frontend Coverage

```bash
npm run test:coverage
```

Genera reportes en:
- `coverage/index.html` - Reporte visual
- `coverage/coverage-final.json` - Datos JSON

### Backend Coverage

El coverage de Motoko se mide manualmente revisando:
- ✅ Todas las funciones públicas probadas
- ✅ Casos de error manejados
- ✅ Edge cases cubiertos

## 🎯 Objetivos de Testing

- **Backend**: 90%+ coverage de funciones públicas
- **Frontend**: 80%+ coverage de componentes
- **E2E**: Flujos críticos de usuario cubiertos
- **Performance**: < 3s tiempo de carga inicial

## 📚 Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Motoko Testing Patterns](https://internetcomputer.org/docs/current/motoko/main/testing)
- [IC Testing Best Practices](https://internetcomputer.org/docs/current/developer-docs/testing)

---

**¡Happy Testing! 🚀**

Para más información o problemas específicos, consulta la documentación del proyecto o abre un issue en el repositorio.