import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { packingService } from '../services/api';

const PackingListPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_name: '', category: '', quantity: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packingService.getPackingList(id).then(data => setItems(data || [])).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const item = await packingService.addItem(id, form);
    setItems([...items, item]);
    setForm({ item_name: '', category: '', quantity: 1 });
  };

  const togglePacked = async (item) => {
    const updated = await packingService.updateItem(item.item_id, { is_packed: !item.is_packed });
    setItems(items.map(i => i.item_id === item.item_id ? updated : i));
  };

  const handleDelete = async (itemId) => {
    await packingService.deleteItem(itemId);
    setItems(items.filter(i => i.item_id !== itemId));
  };

  const packed = items.filter(i => i.is_packed).length;
  const progress = items.length > 0 ? (packed / items.length) * 100 : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>🎒 Packing List</h1>
          <p className="text-muted">{packed} of {items.length} items packed</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="packing-progress">
          <div className="packing-progress-bar" style={{width:`${progress}%`}} />
        </div>
      )}

      <form onSubmit={handleAdd} className="form-card">
        <div className="form-row">
          <div className="form-group" style={{marginBottom:0}}>
            <label>Item Name</label>
            <input value={form.item_name} onChange={e => setForm({...form, item_name: e.target.value})} placeholder="e.g. Passport" required />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label>Category</label>
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Documents" />
          </div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:16,alignItems:'flex-end'}}>
          <div className="form-group" style={{marginBottom:0,width:100}}>
            <label>Qty</label>
            <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} min={1} />
          </div>
          <button type="submit" className="btn btn-primary">Add Item</button>
        </div>
      </form>

      {loading ? <div className="loading-screen" style={{minHeight:200}}><div className="spinner" /></div>
      : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎒</div>
          <h3>Packing list is empty</h3>
          <p>Add items you need to pack for your trip</p>
        </div>
      ) : (
        <div className="packing-list">
          {items.map(item => (
            <div key={item.item_id} className={`packing-item ${item.is_packed ? 'packed' : ''}`}>
              <input type="checkbox" checked={item.is_packed} onChange={() => togglePacked(item)} />
              <span className="item-name">{item.item_name}</span>
              {item.category && <span className="item-category">{item.category}</span>}
              <span className="item-qty">×{item.quantity}</span>
              <button onClick={() => handleDelete(item.item_id)} className="btn btn-sm btn-danger">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackingListPage;
