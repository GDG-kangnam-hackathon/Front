'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

interface Item {
  id: number
  title: string
  content: string
}

const UserItemsPage = () => {
  const [items, setItems] = useState<Item[]>([])
  const [userName, setUserName] = useState('')
  const { id } = useParams()
  const router = useRouter()

  // 유저와 관련된 아이템 가져오기
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items)
        setUserName(data.name)
      })
  }, [id])

  // 아이템 추가
  const handleAdd = async () => {
    const response = await fetch(`/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: id,
        title: 'New Item',
        content: 'This is a new item.',
      }),
    })

    if (response.ok) {
      const newItem = await response.json()
      setItems((prevItems) => [...prevItems, newItem])
    }
  }

  // 아이템 수정
  const handleEdit = async (itemId: number) => {
    const response = await fetch(`/api/items`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: itemId,
        title: 'Updated Title',
        content: 'This is updated content.',
      }),
    })

    if (response.ok) {
      const updatedItem = await response.json()
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? updatedItem : item)),
      )
    }
  }

  // 아이템 삭제
  const handleDelete = async (itemId: number) => {
    const response = await fetch(`/api/items`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId }),
    })

    if (response.ok) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">{userName}&apos Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="mb-4">
            <div className="flex items-center gap-4">
              <span>
                {item.title}: {item.content}
              </span>
              <button
                onClick={() => handleEdit(item.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
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
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
      >
        Add Item
      </button>
      <button
        onClick={() => router.push('/users')}
        className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 mt-4"
      >
        Back to Users
      </button>
    </div>
  )
}

export default UserItemsPage
