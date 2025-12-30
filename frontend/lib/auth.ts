import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "DOCTOR" | "ADMIN" | "AUDITOR"

interface User {
  id: string
  email: string
  name: string
  role: Role
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, role: Role) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (email, role) => {
        // Mock login - in production this would involve JWT and API calls
        const mockUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          name: email.split("@")[0],
          role,
        }
        set({ user: mockUser, token: "mock-jwt-token" })
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
