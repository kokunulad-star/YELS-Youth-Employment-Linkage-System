import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notifications/')
      .then(({ data }) => setNotifications(data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      toast.success('All marked as read')
    } catch {
      toast.error('Failed')
    }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch { /* silent */ }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>

  return (
    <div className="page">
      <div className="container container-narrow">
        <div className="page-header">
          <h1><Bell size={24} /> Notifications</h1>
          {notifications.some(n => !n.is_read) && (
            <button className="btn btn-outline" onClick={markAllRead}>
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state"><p>No notifications yet.</p></div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                onClick={() => !n.is_read && markRead(n.id)}
              >
                <div className="notif-dot" />
                <div className="notif-content">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{new Date(n.created_at).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
