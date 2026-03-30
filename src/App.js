import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

function App() {
  const ADMIN_NAME = "sureshmetta";

  const [page, setPage] = useState("home"); // 🔥 navigation

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [bookings, setBookings] = useState([]);

  const allSlots = [
    "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
    "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
    "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM"
  ];

  // Fetch bookings
  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (!error) setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookedSlots = () => {
    return bookings
      .filter(b => b.date === selectedDate)
      .map(b => b.slot);
  };

  const bookedSlots = getBookedSlots();

  // Booking
  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !name || !details) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("bookings").insert([
      {
        date: selectedDate,
        slot: selectedSlot,
        name,
        email: details
      }
    ]);

    if (!error) {
      alert("Slot booked!");
      fetchBookings();
      setSelectedSlot("");
      setName("");
      setDetails("");
    }
  };

  // Delete
  const deleteBooking = async (id) => {
    if (name !== ADMIN_NAME) {
      alert("Only admin can delete!");
      return;
    }
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
  };

  return (
    <>
      {/* 🔝 Header */}
      <div className="top-bar">
        <div className="left">
          📞 Contact: <a href="tel:8985256492">8985256492</a>
        </div>

        <div className="right">
          <a href="https://www.youtube.com/@SNCsoftwaresolutions-Testing" target="_blank">▶ YouTube</a>
          <a href="https://www.linkedin.com/in/suresh-metta-785689112/" target="_blank">💼 LinkedIn</a>
        </div>
      </div>

      <div className="container">

        {/* 🏠 HOME PAGE */}
        {page === "home" && (
          <>
            <h1>SNC Software Solutions</h1>

            <div style={{ marginTop: "40px" }}>
              <button className="main-btn" onClick={() => setPage("book")}>
                📅 Book Your Interview Slot
              </button>

              <button className="main-btn" onClick={() => setPage("view")}>
                📋 Check Scheduled Interviews
              </button>
            </div>
          </>
        )}

        {/* 📅 BOOK SLOT PAGE */}
        {page === "book" && (
          <>
            <button className="back-btn" onClick={() => setPage("home")}>
              ⬅ Back
            </button>

            <h2>Book Interview Slot</h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot("");
              }}
            />

            <div className="slots">
              {allSlots.map((slot, i) => (
                <button
                  key={i}
                  disabled={bookedSlots.includes(slot)}
                  onClick={() => setSelectedSlot(slot)}
                  className={selectedSlot === slot ? "selected" : ""}
                >
                  {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                </button>
              ))}
            </div>

            <div className="form">
              <input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Enter Company - Round"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <button onClick={handleBooking}>Book Slot</button>
            </div>
          </>
        )}

        {/* 📋 VIEW PAGE */}
        {page === "view" && (
          <>
            <button className="back-btn" onClick={() => setPage("home")}>
              ⬅ Back
            </button>

            <h2>Check Scheduled Interviews</h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="list">
              {bookings
                .filter(b => b.date === selectedDate)
                .map((b) => (
                  <div key={b.id} className="booking-item">
                    <span>
                      <strong>{b.slot}</strong> - {b.name} - {b.email}
                    </span>

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="delete-btn"
                    >
                      ❌
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default App;