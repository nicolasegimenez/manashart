// Test utilities for Manashart testing

export const mockIdentity = {
  getPrincipal: () => ({
    toString: () => 'test-principal-id',
    toText: () => 'test-principal-id',
  }),
  transformRequest: (request) => request,
};

export const mockProfile = {
  id: mockIdentity.getPrincipal(),
  username: 'TestUser',
  vibration: 50,
  avatar: null,
  createdAt: Date.now() * 1000000, // Motoko Time format
  modules: [
    { name: 'SOUL', enabled: true, level: 1, unlockedAt: [Date.now() * 1000000] },
    { name: 'FLOW', enabled: false, level: 0, unlockedAt: [] },
    { name: 'WALLET', enabled: false, level: 0, unlockedAt: [] },
    { name: 'STORE', enabled: false, level: 0, unlockedAt: [] },
    { name: 'STREAM', enabled: false, level: 0, unlockedAt: [] },
  ],
};

export const mockProject = {
  id: 'project-test-123',
  owner: mockIdentity.getPrincipal(),
  title: 'Test Music Album',
  description: 'A test album for our Web3 platform',
  tokenized: true,
  venue: null,
  services: [
    {
      name: 'Recording',
      provider: ['Studio A'],
      cost: 2000,
      confirmed: true,
    },
    {
      name: 'Mixing',
      provider: [],
      cost: 1500,
      confirmed: false,
    },
  ],
  budget: 5000,
  status: { Planning: null },
};

export const createMockActor = (overrides = {}) => ({
  getSoulProfile: vi.fn().mockResolvedValue([]),
  createSoulProfile: vi.fn().mockResolvedValue({ ok: mockProfile }),
  unlockModule: vi.fn().mockResolvedValue({ ok: 'Module unlocked!' }),
  getProjects: vi.fn().mockResolvedValue([]),
  createProject: vi.fn().mockResolvedValue({ ok: mockProject }),
  ...overrides,
});

export const mockAuthClient = {
  create: vi.fn().mockResolvedValue({
    isAuthenticated: vi.fn().mockResolvedValue(false),
    getIdentity: vi.fn().mockReturnValue(mockIdentity),
    login: vi.fn().mockImplementation(({ onSuccess }) => {
      if (onSuccess) onSuccess();
    }),
    logout: vi.fn().mockResolvedValue(undefined),
  }),
};

// Test data generators
export const generateMockProfile = (overrides = {}) => ({
  ...mockProfile,
  ...overrides,
});

export const generateMockProject = (overrides = {}) => ({
  ...mockProject,
  id: `project-${Math.random().toString(36).substr(2, 9)}`,
  ...overrides,
});

// Helper functions for test assertions
export const waitForElement = async (getByText, text, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const element = getByText(text);
      if (element) return element;
    } catch (e) {
      // Element not found yet
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Element with text "${text}" not found within ${timeout}ms`);
};

export const mockModuleRequirements = {
  SOUL: 0,
  FLOW: 60,
  WALLET: 65,
  STORE: 70,
  STREAM: 75,
  INVEST: 80,
  CONNECT: 85,
  DAO: 90,
};

// Mock localStorage for tests
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Helper to setup test environment
export const setupTestEnvironment = () => {
  // Mock environment variables
  process.env.DFX_NETWORK = 'local';
  process.env.CANISTER_ID_MANASHART_BACKEND = 'rdmx6-jaaaa-aaaah-qcaiq-cai';
  
  // Mock browser APIs
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
  
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
};

// Helper to reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
  mockLocalStorage.clear.mockClear();
};

// Custom matchers for Motoko types
export const expectMotokResult = (result, expectedType = 'ok') => {
  expect(result).toHaveProperty(expectedType);
  if (expectedType === 'ok') {
    expect(result.ok).toBeDefined();
  } else {
    expect(result.err).toBeDefined();
  }
};

export const expectModuleState = (module, expectedEnabled) => {
  expect(module).toHaveProperty('name');
  expect(module).toHaveProperty('enabled', expectedEnabled);
  expect(module).toHaveProperty('level');
  expect(module).toHaveProperty('unlockedAt');
};