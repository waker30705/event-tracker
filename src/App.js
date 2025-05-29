import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
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
    weather: "Sunny",
    sales: "",
    attendance: "",
    notes: ""
  });

  const [events, setEvents] = useState([]);
  const [viewingEvents, setViewingEvents] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchOption, setSearchOption] = useState("");

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await addDoc(collection(db, "events"), eventData);
    setEventData({
      name: "",
      date: "",
      location: "",
      weather: "Sunny",
      sales: "",
      attendance: "",
      notes: ""
    });
  };

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(data);
  };

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  const searchByOption = async () => {
    let q;
    const eventsRef = collection(db, "events");
    const today = new Date();

    if (searchOption === "dateRange" && startDate && endDate) {
      q = query(eventsRef, where("date", ">=", startDate), where("date", "<=", endDate));
    } else if (searchOption === "past30Days") {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const from = thirtyDaysAgo.toISOString().split("T")[0];
      const to = today.toISOString().split("T")[0];
      q = query(eventsRef, where("date", ">=", from), where("date", "<=", to));
    } else if (searchOption === "lastYear") {
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      const from = lastYearStart.toISOString().split("T")[0];
      const to = lastYearEnd.toISOString().split("T")[0];
      q = query(eventsRef, where("date", ">=", from), where("date", "<=", to));
    }

    if (q) {
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    }
  };

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
        <h2>Track New Event</h2>
        <input name="name" placeholder="Event Name" value={eventData.name} onChange={handleChange} style={inputStyle} />
        <input type="date" name="date" value={eventData.date} onChange={handleChange} style={inputStyle} />
        <input name="location" placeholder="Location" value={eventData.location} onChange={handleChange} style={inputStyle} />
        <select name="weather" value={eventData.weather} onChange={handleChange} style={inputStyle}>
          <option>Sunny</option>
          <option>Cloudy</option>
          <option>Rainy</option>
          <option>Hot</option>
          <option>Cold</option>
        </select>
        <input name="sales" placeholder="Total Sales" value={eventData.sales} onChange={handleChange} style={inputStyle} />
        <input name="attendance" placeholder="Attendance" value={eventData.attendance} onChange={handleChange} style={inputStyle} />
        <textarea name="notes" placeholder="Notes" value={eventData.notes} onChange={handleChange} style={{ ...inputStyle, height: "100px" }} />
        <button onClick={handleSubmit} style={{ ...inputStyle, backgroundColor: "#8ee593", cursor: "pointer" }}>Save Event</button>

        <button onClick={() => { setViewingEvents(!viewingEvents); if (!viewingEvents) fetchEvents(); }}
          style={{ ...inputStyle, backgroundColor: "#ddd", cursor: "pointer" }}>
          {viewingEvents ? "Hide Past Events" : "View Past Events"}
        </button>

        {viewingEvents && (
          <div>
            <h3>Search By</h3>
            <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} style={inputStyle}>
              <option value="">-- Select Option --</option>
              <option value="dateRange">Date Range</option>
              <option value="past30Days">Past 30 Days</option>
              <option value="lastYear">Last Year</option>
            </select>

            {searchOption === "dateRange" && (
              <>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
              </>
            )}

            {searchOption && (
              <button onClick={searchByOption} style={{ ...inputStyle, backgroundColor: "#ccc", cursor: "pointer" }}>Search</button>
            )}

            <h3>Saved Events</h3>
            {events.map(evt => (
              <div key={evt.id} style={{ border: "1px solid #ccc", marginTop: "10px", padding: "10px", backgroundColor: "#fff" }}>
                <strong>{evt.name}</strong> - {evt.date}<br />
                Location: {evt.location}<br />
                Weather: {evt.weather}<br />
                Sales: ${evt.sales}<br />
                Attendance: {evt.attendance}<br />
                Notes: {evt.notes}<br />
                <button onClick={() => deleteEvent(evt.id)} style={{ marginTop: "5px", backgroundColor: "#f99", padding: "5px", cursor: "pointer" }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;