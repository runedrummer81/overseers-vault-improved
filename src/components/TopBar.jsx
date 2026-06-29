import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function TopBar({ user }) {
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <div className="fixed top-15 right-30 z-[10000] flex items-center gap-4">
      {/* Info / onboarding */}
      <button
        title="Information"
        className="text-secondary hover:text-primary transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Settings */}
      <button
        title="Settings"
        className="text-secondary hover:text-primary transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Avatar */}
      <div className="relative">
        <button
          onClick={() => setAvatarOpen(!avatarOpen)}
          className="w-8 h-8 rounded-full overflow-hidden border border-secondary hover:border-primary transition-colors duration-200"
          title="Account"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center text-dark-bg font-bold text-sm">
              {user?.displayName?.[0] ?? user?.email?.[0] ?? "?"}
            </div>
          )}
        </button>

        {/* Dropdown */}
        {avatarOpen && (
          <>
            {/* Backdrop to close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setAvatarOpen(false)}
            />
            <div className="absolute top-10 right-0 bg-dark-muted border border-dark-border p-4 flex flex-col gap-3 z-50 min-w-48">
              <p className="text-primary text-sm font-semibold">
                {user?.displayName ?? "Adventurer"}
              </p>
              <p className="text-secondary text-xs">{user?.email}</p>
              <hr className="border-dark-border" />
              <button
                onClick={() => signOut(auth)}
                className="text-left text-sm text-secondary hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
