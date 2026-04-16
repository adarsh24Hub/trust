import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaUsers, FaCalendarAlt, FaSignOutAlt, FaPlus, FaTrash, FaTimes, FaCheck, FaImage } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ totalAmount: 0, totalDonors: 0 });
  const [gallery, setGallery] = useState([]);
  
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null });
  const [newImage, setNewImage] = useState({ description: '', file: null });
  
  const [loading, setLoading] = useState(false);
  const [donationSearch, setDonationSearch] = useState('');
  const [activeTab, setActiveTab] = useState('donations'); // donations, events, gallery

  const token = localStorage.getItem('adminToken');

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDonations = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
         localStorage.removeItem('adminToken');
         navigate('/admin');
      }
    }
  };

  const fetchGallery = async () => {
     try {
       const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`);
       setGallery(res.data);
     } catch(err) {
       console.error(err);
     }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
    } else {
      fetchStats();
      fetchEvents();
      fetchDonations();
      fetchGallery();
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (!token) {
    return <div className="bg-dark min-h-screen flex items-center justify-center"><h2 className="text-white">Redirecting to login...</h2></div>;
  }

  // EVENT HANDLERS
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('date', newEvent.date);
      if (newEvent.image) formData.append('image', newEvent.image);

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setNewEvent({ title: '', description: '', date: '', image: null });
      fetchEvents();
    } catch (err) {
      alert('Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if(!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (eventId, commentId) => {
    if(!window.confirm('Delete this comment permanently?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${eventId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  // DONATION HANDLERS
  const handleApproveUpi = async (id) => {
    if(!window.confirm('Approve this UPI payment? This will add to total and send a receipt.')) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
      fetchStats();
    } catch (err) { alert('Approval failed'); }
  };

  const handleRejectUpi = async (id) => {
    if(!window.confirm('Reject this UPI payment?')) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
    } catch (err) { alert('Rejection failed'); }
  };

  const handleDeleteDonation = async (id) => {
    if(!window.confirm('Delete this donation record?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDonations();
      fetchStats();
    } catch (err) { alert('Delete failed'); }
  };

  // GALLERY HANDLERS
  const handleUploadImage = async (e) => {
     e.preventDefault();
     try {
       setLoading(true);
       const formData = new FormData();
       formData.append('description', newImage.description);
       formData.append('image', newImage.file);

       await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`, formData, {
         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
       });
       setNewImage({ description: '', file: null });
       fetchGallery();
       alert('Image uploaded successfully!');
     } catch (err) {
       alert('Failed to upload image.');
     } finally {
       setLoading(false);
     }
  };
  
  const handleDeleteImage = async (id) => {
     if(!window.confirm('Delete this image?')) return;
     try {
       await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       fetchGallery();
     } catch (err) {
       console.error(err);
     }
  };

  // derived data
  const filteredDonations = donations.filter(d => 
    d.name.toLowerCase().includes(donationSearch.toLowerCase()) || 
    (d.contact && d.contact.toLowerCase().includes(donationSearch.toLowerCase())) ||
    (d.transactionId && d.transactionId.toLowerCase().includes(donationSearch.toLowerCase()))
  );

  return (
    <div className="bg-dark min-h-screen pt-28 pb-20 px-4 relative">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">{t('admin.dashboard_title')} <span className="text-saffron">Panel</span></h1>
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
              <p className="text-gray-400 text-sm">Automated Verified Total</p>
              <h3 className="text-3xl font-bold text-white">₹{(stats.totalAmount || 0).toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-dark-light p-6 rounded-2xl border border-white/5 shadow flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Verified Donors</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalDonors || 0}</h3>
            </div>
          </div>

          <div className="bg-dark-light p-6 rounded-2xl border border-white/5 shadow flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <h3 className="text-3xl font-bold text-white">{events.length}</h3>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-2 overflow-x-auto">
           <button onClick={() => setActiveTab('donations')} className={`px-4 py-2 font-bold text-lg whitespace-nowrap transition-colors ${activeTab === 'donations' ? 'text-saffron border-b-2 border-saffron' : 'text-gray-500 hover:text-white'}`}>Manage Donations</button>
           <button onClick={() => setActiveTab('events')} className={`px-4 py-2 font-bold text-lg whitespace-nowrap transition-colors ${activeTab === 'events' ? 'text-saffron border-b-2 border-saffron' : 'text-gray-500 hover:text-white'}`}>Manage Events</button>
           <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 font-bold text-lg whitespace-nowrap transition-colors ${activeTab === 'gallery' ? 'text-saffron border-b-2 border-saffron' : 'text-gray-500 hover:text-white'}`}>Manage Gallery</button>
        </div>

        {/* Tab Content: Donations */}
        {activeTab === 'donations' && (
          <div className="bg-dark-light rounded-3xl border border-white/5 shadow overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white">Donation Records</h2>
              <input 
                type="text" 
                placeholder="Search..." 
                value={donationSearch}
                onChange={(e) => setDonationSearch(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-1.5 text-sm text-white focus:outline-none focus:border-saffron w-full md:w-64"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-gray-400">
                    <th className="p-4 font-medium">Donor Detail</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Method</th>
                    <th className="p-4 font-medium">Status & Info</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 divide-y divide-white/5">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">No donations found.</td>
                    </tr>
                  ) : (
                    filteredDonations.map(d => (
                      <tr key={d._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{d.name}</div>
                          {d.contact && <div className="text-xs text-gray-500 mt-1">{d.contact}</div>}
                        </td>
                        <td className="p-4 font-bold text-saffron">₹{d.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="uppercase text-xs font-bold font-mono">{d.method}</span>
                          {d.transactionId && <div className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">Txn: {d.transactionId}</div>}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            d.status === 'verified' ? 'bg-green-500/20 text-green-400' : 
                            d.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {d.status.toUpperCase()}
                          </span>
                          {d.receiptId && <div className="text-[10px] text-gray-500 mt-1">Receipt: {d.receiptId}</div>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 text-sm">
                            {(d.method === 'upi' && d.status === 'pending') && (
                              <>
                                <button onClick={() => handleApproveUpi(d._id)} className="text-green-400 bg-green-500/10 p-2 rounded hover:bg-green-500/30" title="Approve">
                                  <FaCheck />
                                </button>
                                <button onClick={() => handleRejectUpi(d._id)} className="text-red-400 bg-red-500/10 p-2 rounded hover:bg-red-500/30" title="Reject">
                                  <FaTimes />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDeleteDonation(d._id)} className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors" title="Delete record">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Events */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-1 h-fit">
              <h2 className="text-xl font-bold text-saffron mb-6 border-b border-white/10 pb-4">Create Event</h2>
              <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                <div>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none" placeholder="Title" required />
                </div>
                <div>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none" required />
                </div>
                <div>
                  <textarea value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none min-h-[120px]" placeholder="Description" required />
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => setNewEvent({...newEvent, image: e.target.files[0]})} className="w-full text-white text-sm" />
                </div>
                <button type="submit" disabled={loading} className="bg-saffron text-black font-bold py-3 rounded-lg hover:bg-gold transition-colors">{loading ? 'Posting...' : 'Post Event'}</button>
              </form>
            </div>
            
            <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Manage Events</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                {events.length === 0 ? <p className="text-gray-500">No events.</p> : events.map(ev => (
                  <div key={ev._id} className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                        <p className="text-saffron text-sm">{new Date(ev.date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleDeleteEvent(ev._id)} className="text-red-500 p-2"><FaTrash/></button>
                    </div>
                    {ev.image && <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${ev.image}`} alt="update" className="w-full h-32 object-cover rounded-lg" />}
                    <p className="text-gray-400 text-sm">{ev.description}</p>
                    {ev.comments && ev.comments.map(c => (
                      <div key={c._id} className="flex justify-between bg-black/40 p-2 mb-1 rounded text-xs text-gray-300">
                        <span><b className="text-saffron">{c.name}:</b> {c.text}</span>
                        <button onClick={() => handleDeleteComment(ev._id, c._id)} className="text-red-400"><FaTimes/></button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Gallery */}
        {activeTab === 'gallery' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-1 h-fit">
              <h2 className="text-xl font-bold text-saffron mb-6 border-b border-white/10 pb-4">Upload Gallery Image</h2>
              <form onSubmit={handleUploadImage} className="flex flex-col gap-4">
                <div>
                  <textarea value={newImage.description} onChange={(e) => setNewImage({...newImage, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none" placeholder="Short Caption (Optional)" rows="2" />
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => setNewImage({...newImage, file: e.target.files[0]})} required className="w-full text-white text-sm" />
                </div>
                <button type="submit" disabled={loading} className="bg-saffron text-black font-bold py-3 rounded-lg hover:bg-gold transition-colors">{loading ? 'Uploading...' : 'Upload Image'}</button>
              </form>
            </div>

            <div className="bg-dark-light rounded-3xl border border-white/5 shadow p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Manage Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {gallery.length === 0 ? <p className="text-gray-500">No images.</p> : gallery.map(img => (
                  <div key={img._id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/10">
                    <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.imageUrl}`} alt={img.description} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-4 text-center">
                      <p className="text-white text-xs line-clamp-2">{img.description}</p>
                      <button onClick={() => handleDeleteImage(img._id)} className="bg-red-500 text-white p-2 rounded-full mt-2 hover:bg-red-600">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
