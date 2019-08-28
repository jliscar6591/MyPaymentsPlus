import { MppPage } from './app.po';

describe('mpp App', () => {
  let page: MppPage;

  beforeEach(() => {
    page = new MppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
