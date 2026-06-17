import { useState, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Messages() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [recipientId, setRecipientId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/messages/conversations')
      .then(({ data }) => setConversations(data))
      .catch(() => toast.error('Failed to load conversations'))
      .finally(() => setLoading(false))
  }, [])

  const openConversation = async (conv) => {
    setActiveConv(conv)
    const { data } = await api.get(`/messages/conversations/${conv.id}`)
    setMessages(data.messages || [])
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    const targetId = activeConv
      ? (activeConv.participant_1 === user.id ? activeConv.participant_2 : activeConv.participant_1)
      : parseInt(recipientId)

    if (!targetId) return toast.error('Enter a recipient ID')
    try {
      const { data } = await api.post('/messages/', { recipient_id: targetId, body: newMsg })
      setMessages(prev => [...prev, data])
      setNewMsg('')
      if (!activeConv) {
        const { data: convs } = await api.get('/messages/conversations')
        setConversations(convs)
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Send failed')
    }
  }

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>

  return (
    <div className="page">
      <div className="container">
        <h1><MessageCircle size={24} /> Messages</h1>
        <div className="messages-layout">

          {/* Sidebar */}
          <div className="conv-list">
            <h3>Conversations</h3>
            {conversations.length === 0 && <p className="muted">No conversations yet</p>}
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                onClick={() => openConversation(conv)}
              >
                <div className="conv-avatar">
                  {conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1}
                </div>
                <span>User #{conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1}</span>
              </div>
            ))}

            {/* New conversation */}
            {!activeConv && (
              <form onSubmit={sendMessage} className="new-conv-form">
                <h4>New Message</h4>
                <input
                  type="number"
                  placeholder="Recipient User ID"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Type your message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  required
                  rows={3}
                />
                <button type="submit" className="btn btn-primary"><Send size={14} /> Send</button>
              </form>
            )}
          </div>

          {/* Chat area */}
          <div className="chat-area">
            {!activeConv ? (
              <div className="empty-state"><p>Select a conversation or start a new one.</p></div>
            ) : (
              <>
                <div className="chat-messages">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`msg-bubble ${msg.sender_id === user.id ? 'mine' : 'theirs'}`}>
                      <p>{msg.body}</p>
                      <small>{new Date(msg.sent_at).toLocaleTimeString()}</small>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="chat-input">
                  <input
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary"><Send size={16} /></button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
