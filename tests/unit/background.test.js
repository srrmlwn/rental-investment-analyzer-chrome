describe('Background Script', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should initialize on install', () => {
    // Simulate extension installation
    const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    onInstalledCallback();
    
    // Verify console.log was called
    expect(console.log).toHaveBeenCalledWith('Extension installed');
  });

  test('should handle GET_HUD_DATA message', () => {
    // Simulate message handling
    const onMessageCallback = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    const sendResponse = jest.fn();
    
    onMessageCallback({ type: 'GET_HUD_DATA' }, {}, sendResponse);
    
    // Verify response
    expect(sendResponse).toHaveBeenCalledWith({ status: 'not_implemented' });
  });
}); 