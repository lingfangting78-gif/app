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
                    {/* Footer - 保持原有 */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-6 flex justify-around items-center z-50 pb-[calc(env(safe-area-inset-bottom)+20px)]">
                        <button onClick={() => setActiveTab('view')} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 'view' ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg></div>
                            <span className={`text-[8px] font-black tracking-widest ${activeTab === 'view' ? 'text-indigo-600' : 'text-slate-300'}`}>LIST</span>
                        </button>
                        <button onClick={() => { setEditingId(null); setForm({...form, title: '', amount: '', date: getToday()}); setActiveTab('add'); }} className="flex flex-col items-center gap-2 -mt-8">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${activeTab === 'add' ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-900 text-white'}`}><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg></div>
                            <span className={`text-[8px] font-black tracking-widest ${activeTab === 'add' ? 'text-indigo-600' : 'text-slate-300'}`}>ADD</span>
                        </button>
                        <button onClick={() => setActiveTab('settle')} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 'settle' ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2M12 8V7m0 1v8m0 0v1"/></svg></div>
                            <span className={`text-[8px] font-black tracking-widest ${activeTab === 'settle' ? 'text-indigo-600' : 'text-slate-300'}`}>SETTLE</span>
                        </button>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CoupleTracker />);
    </script>
</body>
</html>