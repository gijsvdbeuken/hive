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

const inputClass = 'w-full bg-white bg-opacity-10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

const SettingsPage: React.FC = () => {
  const session = useSession();
  const userId = session.user?.sub;
  const userEmail = session.user?.email;

  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: 'light',
    notifications: false,
    betaOptIn: false,
  });
  let loading = true;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !userEmail) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();

        setUser({
          auth0Id: data.auth0_id ?? userId,
          email: data.email ?? userEmail,
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else if (typeof err === 'string') {
          setErrorMsg(err);
        } else {
          setErrorMsg('Unexpected error');
        }
      }
    };

    fetchUser();
  }, [userId, userEmail]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name in preferences) {
      const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value;

      setPreferences((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setUser((prev) => prev && { ...prev, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !user) return;

    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          language: preferences.language,
          theme: preferences.theme,
          email_notifications: preferences.notifications,
          beta_features_opt_in: preferences.betaOptIn,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }

      const updated = await res.json();
      setPreferences({
        language: updated.language,
        theme: updated.theme,
        notifications: !!updated.email_notifications,
        betaOptIn: !!updated.beta_features_opt_in,
      });

      setSuccessMsg('Preferences updated successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else if (typeof err === 'string') {
        setErrorMsg(err);
      } else {
        setErrorMsg('Unexpected error');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    try {
      console.log('Deleting user with ID:', userId);
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete account');
      }
      window.location.href = '/auth/logout';
      return;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else if (typeof err === 'string') {
        setErrorMsg(err);
      } else {
        setErrorMsg('Unexpected error');
      }
    }
  };

  if (!userId || !userEmail) return <p className="p-6 text-red-400">User not authenticated.</p>;
  if (loading) return <p className="p-6 text-gray-400">Loading settings...</p>;
  if (!user) return <p className="p-6 text-red-400">Failed to load user.</p>;

  return (
    <div className="mx-auto max-w-3xl p-6 font-sans">
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>

      {errorMsg && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{errorMsg}</p>}
      {successMsg && <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Profile */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">User Profile</h2>
          {[
            { id: 'auth0Id', label: 'Auth0 ID', readOnly: true },
            { id: 'createdAt', label: 'Created At', readOnly: true },
            { id: 'email', label: 'Email' },
            { id: 'role', label: 'Role', readOnly: true },
            { id: 'username', label: 'Username' },
          ].map(({ id, label, readOnly }) => (
            <div className="mb-4" key={id}>
              <label htmlFor={id} className="mb-1 block font-medium">
                {label}
              </label>
              <input id={id} name={id} type="text" value={user[id as keyof User] ?? ''} onChange={handleInputChange} readOnly={readOnly} className={`${inputClass} ${readOnly ? 'cursor-not-allowed' : ''}`} />
            </div>
          ))}

          <div>
            <label htmlFor="plan" className="mb-1 block font-medium">
              Plan
            </label>
            <select id="plan" name="plan" value={user.plan} onChange={handleInputChange} className={inputClass}>
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
            <label htmlFor="language" className="mb-1 block font-medium">
              Language
            </label>
            <select id="language" name="language" value={preferences.language} onChange={handleInputChange} className={inputClass}>
              <option value="en">English</option>
              <option value="nl">Dutch</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="theme" className="mb-1 block font-medium">
              Theme
            </label>
            <select id="theme" name="theme" value={preferences.theme} onChange={handleInputChange} className={inputClass}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          {[
            { id: 'notifications', label: 'Email Notifications' },
            { id: 'betaOptIn', label: 'Opt-in Beta Features' },
          ].map(({ id, label }) => (
            <div className="mb-4 flex items-center" key={id}>
              <input id={id} name={id} type="checkbox" checked={preferences[id as keyof UserPreferences] as boolean} onChange={handleInputChange} className="mr-2" />
              <label htmlFor={id} className="font-medium">
                {label}
              </label>
            </div>
          ))}
        </section>

        <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
          Save Changes
        </button>
      </form>
      <div className="mt-12 border-t border-white/10 pt-6">
        <h2 className="mb-4 text-xl font-semibold text-red-600">Danger Zone</h2>
        <button type="button" onClick={handleDeleteAccount} className="rounded-md bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
