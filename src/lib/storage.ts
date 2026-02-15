const USERS_KEY = 'palmcar_users'
const SESSION_KEY = 'palmcar_session'

export interface StoredUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  passwordHash: string
}

/** Simple hash for demo only – not secure. */
function simpleHash(str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return String(h)
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  const defaultUsers: StoredUser[] = [
    { id: 'admin-1', email: 'admin@palmcar.com', name: 'Admin', role: 'admin', passwordHash: simpleHash('admin123') },
    { id: 'user-1', email: 'user@example.com', name: 'Jane Doe', role: 'user', passwordHash: simpleHash('user123') },
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function validateLogin(email: string, password: string): StoredUser | null {
  const user = findUserByEmail(email)
  if (!user || user.passwordHash !== simpleHash(password)) return null
  return user
}

export function registerUser(email: string, password: string, name: string, role: 'user' | 'admin' = 'user'): StoredUser {
  const users = getUsers()
  if (findUserByEmail(email)) throw new Error('Email already registered')
  const id = `user-${Date.now()}`
  const newUser: StoredUser = {
    id,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    passwordHash: simpleHash(password),
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function getSession(): { userId: string; email: string; name: string; role: 'user' | 'admin' } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

export function setSession(user: { id: string; email: string; name: string; role: 'user' | 'admin' }) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, email: user.email, name: user.name, role: user.role }))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function updateStoredUser(userId: string, updates: { name?: string; email?: string }) {
  const users = getUsers()
  const i = users.findIndex((u) => u.id === userId)
  if (i === -1) return
  if (updates.name !== undefined) users[i].name = updates.name.trim()
  if (updates.email !== undefined) users[i].email = updates.email.trim().toLowerCase()
  saveUsers(users)
  const session = getSession()
  if (session && session.userId === userId) {
    setSession({
      id: userId,
      email: users[i].email,
      name: users[i].name,
      role: users[i].role,
    })
  }
}
