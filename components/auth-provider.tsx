'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, UserRole } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, pass: string) => Promise<void>
  signUp: (email: string, pass: string, name: string, role: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Helper to fetch role from 'profiles' table
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error || !data) return null
    return data
  }

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const profile = await fetchUserProfile(session.user.id)
          
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.full_name,
              email: session.user.email!,
              role: profile.role as UserRole, 
              department: 'General',
              // FIXED: Added missing properties
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString() 
            })
          }
        }
      } catch (error) {
        console.error("Session check failed", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let profile = await fetchUserProfile(session.user.id)
        
        // Retry logic for race conditions on signup
        if (!profile) {
           await new Promise(r => setTimeout(r, 500))
           profile = await fetchUserProfile(session.user.id)
        }

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name,
            email: session.user.email!,
            role: profile.role as UserRole,
            department: 'General',
            // FIXED: Added missing properties here too
            createdAt: session.user.created_at || new Date().toISOString(),
            lastLogin: new Date().toISOString()
          })
        }
      } else {
        setUser(null)
        if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
            setLoading(false) 
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) throw error
  }

  const signUp = async (email: string, pass: string, name: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          role: role, 
        },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)