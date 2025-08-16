import React, { useEffect, useState } from 'react'
import { socket } from '../socket/socket'

export function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')

  useEffect(() => {
    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')
    const onConnectError = () => setStatus('disconnected')
    const onReconnectAttempt = () => setStatus('connecting')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.io.on('reconnect_attempt', onReconnectAttempt)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.io.off('reconnect_attempt', onReconnectAttempt)
    }
  }, [])

  const ui = {
    connected: { label: 'Connected', cls: 'bg-green-100 text-green-700 border-green-200' },
    connecting: { label: 'Connecting…', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    disconnected: { label: 'Disconnected', cls: 'bg-red-100 text-red-700 border-red-200' },
  }[status]

  return (
    <span className={`text-xs px-2 py-1 rounded border ${ui.cls}`}>
      {ui.label}
    </span>
  )
}
