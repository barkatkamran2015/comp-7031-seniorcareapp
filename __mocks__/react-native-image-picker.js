export const launchImageLibrary = jest.fn(() =>
    Promise.resolve({
      assets: [{ uri: 'mocked-image-uri' }],
    })
);
