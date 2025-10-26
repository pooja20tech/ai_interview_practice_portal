import React, { createContext, useContext, useEffect, useState } from 'react'
const AuthContext = createContext()
export function AuthProvider({children}){
  const [user,setUser] = useState(null)
  useEffect(()=>{ const raw = localStorage.getItem('ai_user'); if(raw) setUser(JSON.parse(raw)) },[])
  const login=(payload)=>{ setUser(payload); localStorage.setItem('ai_user', JSON.stringify(payload)) }
  const logout=()=>{ setUser(null); localStorage.removeItem('ai_user') }
  return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }