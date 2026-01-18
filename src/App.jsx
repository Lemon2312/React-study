import { useState, useEffect, useMemo } from 'react'

const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) throw new Error('データの取得に失敗しました')
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])
  return { users, loading, error }
}

const StatusBadge = ({ active }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {active ? 'Active' : 'Inactive'}
  </span>
)

const UserCard = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </div>
      <StatusBadge active={user.id % 2 === 0} />
    </div>
    
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center">
        <span className="w-4 h-4 mr-2">📧</span>
        {user.email}
      </div>
      <div className="flex items-center">
        <span className="w-4 h-4 mr-2">🏢</span>
        {user.company.name}
      </div>
    </div>
  </div>
)

function App() {
  const { users, loading, error } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">システムユーザー管理</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="検索..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App