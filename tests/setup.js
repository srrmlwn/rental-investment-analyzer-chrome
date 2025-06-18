// Mock Chrome API
global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
    },
    onMessage: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
    getURL: jest.fn((path) => {
      // Mock the HUD data file URL
      if (path === 'data/hud_rental_data.json') {
        return 'https://example.com/data/hud_rental_data.json';
      }
      return `https://example.com/${path}`;
    }),
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch for HUD data service
global.fetch = jest.fn((url) => {
  if (url.includes('hud_rental_data.json')) {
    // Return mock HUD data
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        "43205": {
          "1": { "rent": 1200 },
          "2": { "rent": 1400 },
          "3": { "rent": 1600 },
          "4": { "rent": 1800 },
          "5": { "rent": 2000 }
        },
        "43206": {
          "1": { "rent": 1100 },
          "2": { "rent": 1300 },
          "3": { "rent": 1500 },
          "4": { "rent": 1700 },
          "5": { "rent": 1900 }
        }
      })
    });
  }
  return Promise.reject(new Error('Not found'));
}); 