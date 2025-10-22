export function saveSession(session){
  const all = JSON.parse(localStorage.getItem('ai_sessions')||'[]')
  all.unshift(session)
  localStorage.setItem('ai_sessions', JSON.stringify(all))
  return session.id
}
export function loadSessions(){ return JSON.parse(localStorage.getItem('ai_sessions')||'[]') }