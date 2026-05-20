"use client"

import React, { useEffect, useState } from "react"

type Sentence = {
  id: number
  sentence: string
  sentence_type: string
  sentence_structure: string
  created_at?: string
  updated_at?: string
}

export default function SentencesPage() {
  const [q, setQ] = useState("")
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Sentence | null>(null)
  const [formText, setFormText] = useState("")
  const [formType, setFormType] = useState("")
  const [formStructure, setFormStructure] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSentences()
  }, [])

  async function fetchSentences(query = "") {
    setLoading(true)
    try {
      const url = `http://localhost:8000/api/sentences/${query ? '?q=' + encodeURIComponent(query) : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setSentences(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    fetchSentences(q)
  }

  function startCreate() {
    setEditing(null)
    setFormText("")
    setFormType("")
    setFormStructure("")
  }

  function startEdit(s: Sentence) {
    setEditing(s)
    setFormText(s.sentence)
    setFormType(s.sentence_type)
    setFormStructure(s.sentence_structure)
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      if (editing) {
        const res = await fetch(`http://localhost:8000/api/sentences/${editing.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentence: formText, sentence_type: formType, sentence_structure: formStructure }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }
        const updated = await res.json()
        setSentences(s => s.map(x => (x.id === updated.id ? updated : x)))
        setEditing(null)
        setFormText("")
        setFormType("")
        setFormStructure("")
      } else {
        const res = await fetch('http://localhost:8000/api/sentences/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentence: formText, sentence_type: formType, sentence_structure: formStructure }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }
        const created = await res.json()
        setSentences(s => [created, ...s])
        startCreate()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error("Submit error:", err)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this sentence?')) return
    try {
      const res = await fetch(`http://localhost:8000/api/sentences/${id}/`, { method: 'DELETE' })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }
      setSentences(s => s.filter(x => x.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error("Delete error:", err)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Sentences</h1>

      {error && <div style={{ padding: 12, marginBottom: 16, backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: 4 }}>{error}</div>}

      <section style={{ marginBottom: 16 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by text or identifier" />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setQ(''); fetchSentences(); }}>Reset</button>
        </form>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>{editing ? 'Edit Sentence' : 'Create Sentence'}</h2>
        <form onSubmit={submitForm} style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
          <textarea value={formText} onChange={e => setFormText(e.target.value)} placeholder="Sentence text" rows={3} />
          <input value={formType} onChange={e => setFormType(e.target.value)} placeholder="Sentence type (optional)" />
          <input value={formStructure} onChange={e => setFormStructure(e.target.value)} placeholder="Sentence structure (optional)" />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={startCreate}>Clear</button>
          </div>
        </form>
      </section>

      <section>
        <h2>Results {loading ? '(loading...)' : `(${sentences.length})`}</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sentences.map(s => (
            <li key={s.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{s.sentence}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{s.sentence_type} — {s.sentence_structure}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
