import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@App:token');
    const user = localStorage.getItem('@App:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');

    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('user/login', {
      email,
      password,
    });
    console.log(response.data);
    if (
      response &&
      response.data &&
      response.data.message === 'Authenticated login!'
    ) {
      const token = 'token_' + Math.random() * 1000;

      localStorage.setItem('@App:token', token);
      localStorage.setItem('@App:user', JSON.stringify(response.data));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user: response.data });
    }
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@App:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
