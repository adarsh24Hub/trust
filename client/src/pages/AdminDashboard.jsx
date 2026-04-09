import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaUsers, FaCalendarAlt, FaSignOutAlt, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null });
  const [loading, setLoading] = useState(false);
  
  // Offline entry state
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [newOffline, setNewOffline] = useState({ name: '', contact: '', amount: '', paymentMethod: 'Cash (Offline)', note: '' });
  const [offlineLoading, setOfflineLoading] = useState(false);
  
  // Search state
  const [donationSearch, setDonationSearch] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch (err) {
      console.error('Failed to fetch donations', err);
      // Optional: if 401, they have invalid token, force logout
      if (err.response && err.response.status === 401) {
         localStorage.removeItem('adminToken');
         navigate('/admin');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchEvents();
      fetchDonations();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <div className="bg-dark min-h-screen flex items-center justify-center"><h2 className="text-white">Redirecting to login...</h2></div>;
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('date', newEvent.date);
      if (newEvent.image) {
        formData.append('image', newEvent.image);
      }

      await axios.post('http://localhost:5000/api/events', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewEvent({ title: '', description: '', date: '', image: null });
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event. Ensure multer is installed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (eventId, commentId) => {
    if(!window.confirm('Delete this comment permanently?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/events/${eventId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if(!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const handleDeleteDonation = async (id) => {
    if(!window.confirm('Are you sure you want to delete this donation record?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (err) {
      console.error('Failed to delete donation', err);
      alert('Delete failed.');
    }
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    try {
      setOfflineLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/donations', newOffline, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowOfflineModal(false);
      setNewOffline({ name: '', contact: '', amount: '', paymentMethod: 'Cash (Offline)', note: '' });
      fetchDonations();
    } catch (error) {
      console.error('Failed to create offline donation', error);
      alert('Failed to save donation.');
    } finally {
      setOfflineLoading(false);
    }
  };

  // Calculate real stats
  const totalCollections = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = new Set(donations.map(d => d.name)).size;

  const filteredDonations = donations.filter(d => 
    d.name.toLowerCase().includes(donationSearch.toLowerCase()) || 
    (d.contact && d.contact.toLowerCase().includes(donationSearch.toLowerCase()))
  );

  return (
    <div className="bg-dark min-h-screen pt-28 pb-20 px-4 relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">{t('admin.dashboard_title')} <span className="text-saffron">{t('admin.dashboard_subtitle')}</span></h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-900/50 text-red-400 hover:bg-red-900 hover:text-white px-4 py-2 rounded-lg transition-colors border border-red-500/30"
          >
            <FaSignOutAlt /> {t('admin.logout')}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-light p-6 rounded-2xl border border-white/5 shadow flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-2xl">
              <FaRupeeSign />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('admin.total_collections')}</p>
              <h3 className="text-3xl font-bold text-white">₹{totalCollections.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-dark-light p-6 rounded-2xl border border-white/5 shadow flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('admin.total_donors')}</p>
              <h3 className="text-3xl font-bold text-white">{totalDonors}</h3>
            </div>
          </div>

          <div className="bg-dark-light p-6 rounded-2xl border border-white/5 shadow flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('admin.upcoming_events')}</p>
              <h3 className="text-3xl font-bold text-white">{events.length}</h3>
            </div>
          </div>
        </div>

        {/* Event Management Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Add New Event Form */}
          <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-1 h-fit">
            <h2 className="text-xl font-bold text-saffron mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <FaPlus /> Post a New Update / Event
            </h2>
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input 
                  type="date" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron min-h-[120px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Photo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setNewEvent({...newEvent, image: e.target.files[0]})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-saffron file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-saffron/10 file:text-saffron hover:file:bg-saffron/20"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-saffron text-black font-bold py-3 rounded-lg mt-2 hover:bg-gold transition-colors disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Update'}
              </button>
            </form>
          </div>

          {/* Existing Events List */}
          <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              Manage Existing Updates
            </h2>
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No updates found.</p>
              ) : (
                events.map(ev => (
                  <div key={ev._id} className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col gap-3 hover:border-saffron/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                        <p className="text-saffron text-sm mb-2">{new Date(ev.date).toLocaleDateString()} • {ev.likes || 0} Likes</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteEvent(ev._id)}
                        className="text-red-500 bg-red-500/10 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Full Update"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {ev.image && (
                      <img src={`http://localhost:5000${ev.image}`} alt="update" className="w-full h-32 object-cover rounded-lg border border-white/10" />
                    )}
                    <p className="text-gray-400 text-sm line-clamp-2">{ev.description}</p>
                    
                    {ev.comments && ev.comments.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-500 font-bold mb-2 uppercase">Comments ({ev.comments.length})</p>
                        <div className="space-y-2">
                          {ev.comments.map(c => (
                            <div key={c._id} className="flex justify-between items-start bg-black/40 p-2 rounded">
                              <div>
                                <span className="text-saffron text-xs font-bold mr-1">{c.name}:</span>
                                <span className="text-gray-300 text-xs">{c.text}</span>
                              </div>
                              <button onClick={() => handleDeleteComment(ev._id, c._id)} className="text-red-400 hover:text-red-300 ml-2 mt-0.5">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Real Donations Table */}
        <div className="bg-dark-light rounded-3xl border border-white/5 shadow overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white">{t('admin.recent_donations')}</h2>
            <div className="flex gap-4 items-center w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search by name or contact..." 
                value={donationSearch}
                onChange={(e) => setDonationSearch(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-1.5 text-sm text-white focus:outline-none focus:border-saffron w-full md:w-64"
              />
              <button 
                onClick={() => setShowOfflineModal(true)} 
                className="bg-saffron/10 text-saffron px-4 py-1.5 rounded text-sm font-medium hover:bg-saffron hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FaPlus size={12}/> Add Offline Entry
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-gray-400">
                  <th className="p-4 font-medium">{t('admin.donor_name')}</th>
                  <th className="p-4 font-medium">{t('admin.amount')}</th>
                  <th className="p-4 font-medium">{t('admin.method')}</th>
                  <th className="p-4 font-medium">{t('admin.date')}</th>
                  <th className="p-4 font-medium text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 divide-y divide-white/5">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No donations found.</td>
                  </tr>
                ) : (
                  filteredDonations.slice().reverse().map(d => (
                    <tr key={d._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{d.name}</div>
                        {d.contact && <div className="text-xs text-gray-500 mt-1">{d.contact}</div>}
                      </td>
                      <td className="p-4 font-bold text-saffron">₹{d.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs">{d.paymentMethod}</span>
                      </td>
                      <td className="p-4 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => handleDeleteDonation(d._id)} className="text-red-400 hover:text-red-300 text-sm flex gap-1 items-center mt-2">
                          <FaTrash size={12}/> {t('admin.delete')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Offline Entry Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setShowOfflineModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes size={20}/>
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Log Offline Donation</h2>
            <form onSubmit={handleOfflineSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Donor Name</label>
                <input 
                  type="text" 
                  value={newOffline.name}
                  onChange={(e) => setNewOffline({...newOffline, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact (Phone/Email)</label>
                <input 
                  type="text" 
                  value={newOffline.contact}
                  onChange={(e) => setNewOffline({...newOffline, contact: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  value={newOffline.amount}
                  onChange={(e) => setNewOffline({...newOffline, amount: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-colors"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Method</label>
                <select 
                  value={newOffline.paymentMethod}
                  onChange={(e) => setNewOffline({...newOffline, paymentMethod: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-colors appearance-none"
                >
                  <option value="Cash (Offline)" className="bg-gray-800 text-white">Cash</option>
                  <option value="Cheque" className="bg-gray-800 text-white">Cheque</option>
                  <option value="Bank Transfer" className="bg-gray-800 text-white">Bank Transfer</option>
                  <option value="Other Offline" className="bg-gray-800 text-white">Other Offline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Optional Note</label>
                <input 
                  type="text" 
                  value={newOffline.note}
                  onChange={(e) => setNewOffline({...newOffline, note: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={offlineLoading}
                className="bg-saffron text-black font-bold py-3 rounded-lg mt-2 hover:bg-gold transition-colors disabled:opacity-50"
              >
                {offlineLoading ? 'Saving...' : 'Save Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
