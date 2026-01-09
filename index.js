import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PlusCircle, ShoppingBag, History, Trash2, TrendingUp } from 'lucide-react';

// 这里的 BusinessTracker 是你的主界面组件
function BusinessTracker() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('biz_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ name: '', type: 'IN', price: '', quantity: '' });

  useEffect(() => {
    localStorage.setItem('biz_data', JSON.stringify(records));
  }, [records]);

  const stats = records.reduce((acc, cur) => {
    const total = Number(cur.price) * Number(cur.quantity);
    if (cur.type === 'IN') acc.in += total;
    else acc.out += total;
    return acc;
  }, { in: 0, out: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) return;
    const newRecord = { ...form, id: Date.now(), time: new Date().toLocaleString() };
    setRecords([newRecord, ...records]);
    setForm({ name: '', type: 'IN', price: '', quantity: '' });
  };

  const deleteRecord = (id) => {
    if (window.confirm('确认删除？')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="max-w-md mx-auto">
        {/* 顶部卡片 */}
        <div className="bg-blue-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShoppingBag /> 我的生意账本
          </h1>
          <div className="grid grid-cols-2 gap-4 border-t border-blue-400 pt-4">
            <div>
              <p className="text-blue-100 text-xs">总入库支出</p>
              <p className="text-xl font-black">¥{stats.in.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs">总出货收入</p>
              <p className="text-xl font-black">¥{stats.out.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input 
              placeholder="商品名称" 
              className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <div className="flex gap-2">
              <select 
                className="w-1/3 p-3 bg-slate-50 rounded-xl"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="IN">进货 (+)</option>
                <option value="OUT">出货 (-)</option>
              </select>
              <input 
                type="number" placeholder="金额" 
                className="w-2/3 p-3 bg-slate-50 rounded-xl outline-none"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>
            <input 
              type="number" placeholder="数量" 
              className="w-full p-3 bg-slate-50 rounded-xl outline-none"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
            />
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all">
              保存记录
            </button>
          </form>
        </div>

        {/* 列表 */}
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${r.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  <TrendingUp size={16} className={r.type === 'OUT' ? 'rotate-180' : ''} />
                </div>
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-[10px] text-slate-400">{r.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-bold ${r.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {r.type === 'IN' ? '+' : '-'}{Number(r.price) * Number(r.quantity)}
                  </p>
                  <p className="text-[10px] text-slate-400">{r.quantity}件</p>
                </div>
                <button onClick={() => deleteRecord(r.id)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
