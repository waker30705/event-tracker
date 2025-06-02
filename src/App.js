import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#c0f3ba"
};

function App() {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    temperature: "",
    condition: "Sunny",
    sales: "",
    customerCount: "",
    notes: ""
  });

  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [viewingEvents, setViewingEvents] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateDoc(doc(db, "events", editingId), eventData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "events"), eventData);
    }
    setEventData({
      name: "",
      date: "",
      location: "",
      temperature: "",
      condition: "Sunny",
      sales: "",
      customerCount: "",
      notes: ""
    });
    fetchEvents();
  };

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(data);
  };

  const editEvent = (evt) => {
    setEventData(evt);
    setEditingId(evt.id);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{
      backgroundImage: "url('/background.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "50px"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(2px)",
        padding: "2rem",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "90%"
      }}>
        <h2>{editingId ? "Edit Event" : "Track New Event"}</h2>
        <input name="name" placeholder="Event Name" value={eventData.name} onChange={handleChange} style={inputStyle} />
        <input type="date" name="date" value={eventData.date} onChange={handleChange} style={inputStyle} />
        <input name="location" placeholder="Location" value={eventData.location} onChange={handleChange} style={inputStyle} />
        <div style={{ display: "flex", gap: "10px" }}>
          <input name="temperature" placeholder="Degrees" value={eventData.temperature} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
          <select name="condition" value={eventData.condition} onChange={handleChange} style={{ ...inputStyle, flex: 1 }}>
            <option>Sunny</option>
            <option>Cloudy</option>
            <option>Rainy</option>
            <option>Hot</option>
            <option>Cold</option>
          </select>
        </div>
        <input type="number" step="0.01" name="sales" placeholder="Total Sales" value={eventData.sales} onChange={handleChange} style={inputStyle} />
        <input type="number" name="customerCount" placeholder="Customer Count" value={eventData.customerCount} onChange={handleChange} style={inputStyle} />
        <textarea name="notes" placeholder="Notes" value={eventData.notes} onChange={handleChange} style={{ ...inputStyle, height: "100px" }} />
        <button onClick={handleSubmit} style={{ ...inputStyle, backgroundColor: "#8ee593", cursor: "pointer" }}>{editingId ? "Update Event" : "Save Event"}</button>

        <button onClick={() => { setViewingEvents(!viewingEvents); if (!viewingEvents) fetchEvents(); }}
          style={{ ...inputStyle, backgroundColor: "#ddd", cursor: "pointer" }}>
          {viewingEvents ? "Hide Past Events" : "View Past Events"}
        </button>

        {viewingEvents && (
          <div>
            <h3>Saved Events</h3>
            {events.map(evt => (
              <div key={evt.id} style={{ border: "1px solid #ccc", marginTop: "10px", padding: "10px", backgroundColor: "#fff" }}>
                <strong>{evt.name}</strong> - {evt.date}<br />
                Location: {evt.location}<br />
                Temp: {evt.temperature}° - Condition: {evt.condition}<br />
                Sales: ${evt.sales}<br />
                Customer Count: {evt.customerCount}<br />
                Notes: {evt.notes}<br />
                <button onClick={() => editEvent(evt)} style={{ marginTop: "5px", backgroundColor: "#cfc", padding: "5px", cursor: "pointer" }}>Edit</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
