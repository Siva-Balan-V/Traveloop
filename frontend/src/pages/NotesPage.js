import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { noteService } from '../services/api';

const NotesPage = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ note_title: '', note_content: '', note_date: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noteService.getNotes(id).then(data => setNotes(data || [])).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const note = await noteService.createNote(id, form);
    setNotes([note, ...notes]);
    setShowForm(false);
    setForm({ note_title: '', note_content: '', note_date: '' });
  };

  const handleDelete = async (noteId) => {
    await noteService.deleteNote(noteId);
    setNotes(notes.filter(n => n.note_id !== noteId));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Trip Notes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Note</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Title</label>
            <input value={form.note_title} onChange={e => setForm({...form, note_title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea value={form.note_content} onChange={e => setForm({...form, note_content: e.target.value})} rows={4} required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.note_date} onChange={e => setForm({...form, note_date: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Save Note</button>
        </form>
      )}
      {loading ? <p>Loading...</p> : notes.length === 0 ? (
        <div className="empty-state"><p>No notes yet.</p></div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.note_id} className="note-card">
              <div className="note-header">
                <h3>{note.note_title || 'Untitled'}</h3>
                <button onClick={() => handleDelete(note.note_id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
              <p>{note.note_content}</p>
              {note.note_date && <small>{new Date(note.note_date).toLocaleDateString()}</small>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
