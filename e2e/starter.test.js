describe('Senior Care App', () => {
  beforeAll(async () => {
    await device.launchApp({
      launchArgs: {detoxEnableSynchronization: 0},
      newInstance: true,
    });
  });

  it('should log in with correct credentials and view ClientListScreen', async () => {
    // Introduce a delay to help the app fully render the elements
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type text in the username and password fields
    await element(by.id('usernameInput')).typeText('admin');
    // await new Promise(resolve => setTimeout(resolve, 1000));
    await element(by.id('passwordInput')).typeText('password');
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // Tap the login button
    await expect(element(by.id('loginButton'))).toBeVisible();
    await element(by.id('loginButton')).tap();

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify that ClientListScreen is visible
    await expect(element(by.id('clientListScreen'))).toBeVisible();
  });

  it('should apply sorting/filtering and select a client', async () => {
    // Open sort menu
    await element(by.id('sortButton')).tap();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await element(by.id('firstNameOption')).tap();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Open filter and search for a client by name or building
    await element(by.id('search-input')).typeText('Beatrix');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Select a client from the list
    await element(by.id('client-name')).tap();

    await new Promise(resolve => setTimeout(resolve, 1000));
    // Expect ClientDetailScreen to be visible
    await expect(element(by.id('gesture-handler'))).toBeVisible();
  });

  it('should modify status in ClientDetailScreen', async () => {
    // Change status to "Completed"
    await element(by.id('status-button-completed')).tap();

    // Go back to ClientListScreen
    await element(by.id('backButton')).tap();
    await new Promise(resolve => setTimeout(resolve, 1500));
    // await expect(element(by.id('clientListScreen'))).toBeVisible();
  });

  it('should logout successfully', async () => {
    // Tap logout button
    await element(by.id('logoutButton')).tap();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await element(by.text('Logout')).atIndex(1).tap();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Confirm we are back on the login screen
    await expect(element(by.id('loginScreen'))).toBeVisible();
  });
});
