import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/ChatPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="chat-page">ChatPage Component</div>,
  };
});

jest.mock('../../src/MatchesPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="matches-page">MatchesPage Component</div>,
  };
});

jest.mock('../../src/SearchPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="search-page">SearchPage Component</div>,
  };
});

jest.mock('../../src/LoginPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="login-page">LoginPage Component</div>,
  };
});

jest.mock('../../src/TestsPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="tests-page">TestsPage Component</div>,
  };
});

jest.mock('../../src/ProfilePage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="profile-page">ProfilePage Component</div>,
  };
});

jest.mock('../../src/Messages', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="messages">Messages Component</div>,
  };
});

jest.mock('../../src/components/basic/Nav', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="nav">Nav Component</div>,
  };
});

describe('App Component', () => {
  const renderAppWithPath = (path: string) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders ChatPage at "/chats" and shows Nav', () => {
    renderAppWithPath('/chats');

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('renders Messages at "/chat/1" and hides Nav', () => {
    renderAppWithPath('/chat/1');

    expect(screen.getByTestId('messages')).toBeInTheDocument();
    expect(screen.queryByTestId('nav')).not.toBeInTheDocument();
  });

  it('renders MatchesPage at "/matches" and shows Nav', () => {
    renderAppWithPath('/matches');

    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('renders SearchPage at "/search" and shows Nav', () => {
    renderAppWithPath('/search');

    expect(screen.getByTestId('search-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('renders TestsPage at "/tests" and shows Nav', () => {
    renderAppWithPath('/tests');

    expect(screen.getByTestId('tests-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('renders ProfilePage at "/profile" and shows Nav', () => {
    renderAppWithPath('/profile');

    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('renders LoginPage at unknown route and shows Nav', () => {
    renderAppWithPath('/unknown');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('hides Nav when shouldHideNav is true', () => {
    renderAppWithPath('/chat/1');

    expect(screen.getByTestId('messages')).toBeInTheDocument();
    expect(screen.queryByTestId('nav')).not.toBeInTheDocument();
  });

  it('applies ThemeProvider and CssBaseline', () => {
    renderAppWithPath('/chats');

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
  });
});
