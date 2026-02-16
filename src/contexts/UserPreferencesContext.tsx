import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { TableDensity, ThemePreference, LandingPage, UserPreferences } from '@/types/settings';

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  defaultLandingPage: '/',
  tableDensity: 'comfortable',
  theme: 'system',
};

function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem('bonddb-user-preferences');
    if (stored) return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch {}
  return defaultPreferences;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
});

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('bonddb-user-preferences', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}

export function useTableDensity() {
  const { preferences } = useContext(UserPreferencesContext);
  return preferences.tableDensity;
}
