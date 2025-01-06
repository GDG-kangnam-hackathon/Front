'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  // 유저 목록 가져오기
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])

  // 유저 수정하기
  const handleEdit = async (id: string) => {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: 'Updated Name',
        email: `updated${id}@example.com`,
      }),
    })

    if (response.ok) {
      const updatedUser = await response.json()
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? updatedUser : user)),
      )
    }
  }

  // 유저 삭제하기
  const handleDelete = async (id: string) => {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    console.log(response)

    if (response.ok) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
    } else {
      console.log('error')
    }
  }

  // 유저 추가하기
  const handleAdd = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New User',
        email: `newuser${Date.now()}@example.com`,
      }),
    })

    if (response.ok) {
      const newUser = await response.json()
      setUsers((prevUsers) => [...prevUsers, newUser])
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-6xl mb-6">Users</h1>
      <ul className="mb-6">
        {users.map((user) => (
          <li key={user.id} className="mb-4">
            <div className="flex items-center gap-4">
              <span onClick={() => router.push(`users/${user.id}`)}>
                {user.name} ({user.email})
              </span>
              <button
                onClick={() => handleEdit(user.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAdd}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add User
      </button>
    </div>
  )
}

export default UsersPage
