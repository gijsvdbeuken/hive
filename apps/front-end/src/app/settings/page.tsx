'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSession } from '../components/SessionProvider';

interface User {
  auth0Id: string;
  email: string;
  createdAt: string;
  username: string;
  role: string;
  plan: string;
}

interface UserPreferences {
  language: 'en' | 'nl' | 'pt' | 'es';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  betaOptIn: boolean;
}

const SettingsPage: React.FC = () => {
  const session = useSession();
  if (!session.user.sub || !session.user.email) {
    return;
  }

  const [user, setUser] = useState<User>({
    auth0Id: session.user.sub,
    email: session.user.email,
    createdAt: '',
    username: '',
    role: '',
    plan: '',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: 'dark',
    notifications: false,
    betaOptIn: false,
  });

  const [loading, setLoading] = useState(true);

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferencesChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setPreferences((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [name]: target.value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/users/${session.user.sub}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          language: preferences.language,
          theme: preferences.theme,
          email_notifications: preferences.notifications,
          beta_features_opt_in: preferences.betaOptIn,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update preferences');
      }

      const updatedPrefs = await response.json();

      setPreferences((prev) => ({
        ...prev,
        language: updatedPrefs.language,
        theme: updatedPrefs.theme,
        notifications: updatedPrefs.email_notifications,
        betaOptIn: updatedPrefs.beta_features_opt_in,
      }));

      alert('Preferences updated successfully!');
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(`Failed to update preferences: ${error.message}`);
    }
  };

  const inputClass = 'w-full bg-white bg-opacity-10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${session.user.sub}`);
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();

        setUser({
          auth0Id: data.auth0_id ?? session.user.sub,
          email: data.email ?? session.user.email,
          createdAt: data.created_at ?? '',
          username: data.username ?? '',
          role: data.role ?? '',
          plan: data.plan ?? '',
        });

        setPreferences({
          language: data.language ?? 'en',
          theme: data.theme ?? 'light',
          notifications: !!data.email_notifications,
          betaOptIn: !!data.beta_features_opt_in,
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading settings...</p>;

  return (
    <div className="mx-auto max-w-3xl p-6 font-sans">
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Profile */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">User Profile</h2>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="auth0Id">
              Auth0 ID (read-only)
            </label>
            <input id="auth0Id" name="auth0Id" type="text" value={user.auth0Id} readOnly className={inputClass + ' cursor-not-allowed'} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="createdAt">
              Created At (read-only)
            </label>
            <input id="createdAt" name="createdAt" type="text" value={user.createdAt} readOnly className={inputClass + ' cursor-not-allowed'} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" value={user.email} onChange={handleUserChange} className={inputClass} required />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="role">
              Role (read-only)
            </label>
            <input id="role" name="role" type="text" value={user.role} readOnly className={inputClass + ' cursor-not-allowed'} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" type="text" value={user.username} onChange={handleUserChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block font-medium" htmlFor="plan">
              Plan
            </label>
            <select id="plan" name="plan" value={user.plan} onChange={handleUserChange} className={inputClass}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">User Preferences</h2>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="language">
              Language
            </label>
            <select id="language" name="language" value={preferences.language} onChange={handlePreferencesChange} className={inputClass}>
              <option value="en">English</option>
              <option value="nl">Dutch</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium" htmlFor="theme">
              Theme
            </label>
            <select id="theme" name="theme" value={preferences.theme} onChange={handlePreferencesChange} className={inputClass}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="mb-4 flex items-center">
            <input id="notifications" name="notifications" type="checkbox" checked={preferences.notifications} onChange={handlePreferencesChange} className="mr-2" />
            <label htmlFor="notifications" className="font-medium">
              Email Notifications
            </label>
          </div>

          <div className="mb-4 flex items-center">
            <input id="betaOptIn" name="betaOptIn" type="checkbox" checked={preferences.betaOptIn} onChange={handlePreferencesChange} className="mr-2" />
            <label htmlFor="betaOptIn" className="font-medium">
              Opt-in Beta Features
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
