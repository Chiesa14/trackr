import {AuthUser, fetchUserAttributes, getCurrentUser} from 'aws-amplify/auth';
import {Hub} from 'aws-amplify/utils';
import React, {useContext, useEffect, useState} from 'react';

interface UserContextType {
  user: AuthUser | null;
  userAttributes: any | null;
  setUser: (u: AuthUser | null) => void;
  loading: boolean;
}

export const UserContext = React.createContext<UserContextType>({
  setUser: () => {},
  user: null,
  userAttributes: null,
  loading: true,
});

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userAttributes, setUserAttributes] = useState<any | null>(null);

  const fetchUser = async () => {
    try {
      const resp = await getCurrentUser();
      setUser(resp);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUser(null);
    }
  };

  const fetchAttributes = async () => {
    try {
      const attr = await fetchUserAttributes();
      setUserAttributes(attr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUserAttributes(null);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAttributes();

    const listener = () => {
      fetchUser();
      fetchAttributes();
    };

    const subscribe = Hub.listen('auth', listener);

    return () => {
      subscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{setUser, user, userAttributes, loading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuthUser = () => {
  const {setUser, user, userAttributes, loading} = useContext(UserContext);

  return {
    user,
    setUser,
    userAttributes,
    loading,
  };
};
