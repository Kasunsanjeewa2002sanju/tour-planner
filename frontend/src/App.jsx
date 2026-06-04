import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from './features/counterSlice'
import axios from 'axios'
import './App.css'

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const [backendStatus, setBackendStatus] = useState('Checking...')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:5000/')
        setBackendStatus(response.data)
      } catch (error) {
        setBackendStatus('Backend is offline')
      }
    }
    checkBackend()
  }, [])

  return (
    <div className="app-container">
      <header>
        <h1>Tour Planner</h1>
        <p>Project Scratch Started</p>
      </header>

      <main>
        <section className="status-section">
          <h2>System Status</h2>
          <div className="status-card">
            <p><strong>Frontend:</strong> React + Redux Toolkit</p>
            <p><strong>Backend:</strong> {backendStatus}</p>
          </div>
        </section>

        <section className="redux-demo">
          <h2>Redux Counter Demo</h2>
          <div className="counter-controls">
            <button onClick={() => dispatch(decrement())}>-</button>
            <span className="count-display">{count}</span>
            <button onClick={() => dispatch(increment())}>+</button>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Tour Planner</p>
      </footer>
    </div>
  )
}

export default App

