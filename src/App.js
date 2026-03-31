import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

function App() {
  const ADMIN_NAME = "sureshmetta";

  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [bookings, setBookings] = useState([]);

  const allSlots = [
    "09:00 AM","09:30 AM",
    "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
    "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
    "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM",
    "06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"
  ];

  // 🔥 Fetch bookings
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

  // ✅ Booking
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
      alert("Congratulations, your Slot booked successfully!");
      fetchBookings();
      setSelectedSlot("");
      setName("");
      setDetails("");
    }
  };

  // ❌ Delete (Admin only)
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
      {/* HEADER */}
      <div className="top-bar">
        <div className="left">
          📞 Contact: <a href="tel:8985256492">8985256492</a>
        </div>

        <div className="right">
          <a href="https://www.youtube.com/@SNCsoftwaresolutions-Testing" target="_blank" rel="noreferrer">
            ▶ YouTube
          </a>

          <a href="https://www.linkedin.com/in/suresh-metta-785689112/" target="_blank" rel="noreferrer">
            💼 LinkedIn
          </a>

          <button className="about-link" onClick={() => setPage("about")}>
            ℹ About
          </button>
        </div>
      </div>

      <div className="container">

        {/* HOME */}
        {page === "home" && (
          <>
            <h1>SNC Software Solutions</h1>

            <div className="home-buttons">
              <button className="main-btn" onClick={() => setPage("book")}>
                📅 Book Your Interview Slot
              </button>

              <button className="main-btn" onClick={() => setPage("view")}>
                📋 Check Scheduled Interviews
              </button>
            </div>

            <div className="about-section">
              <h2>About SNC Software Solutions</h2>

              <img src="/myphoto.png" alt="Suresh Metta" className="founder-img" />

              <h3>Suresh Metta</h3>
              <p className="role">Founder</p>

              <p className="about-text">
                I have 7+ years of experience in Software Testing.
                Trained <b>400+ students</b>, helped <b>350+ placements</b>.
              </p>

              <div className="skills">
                <span>Java Automation</span>
                <span>Python Automation</span>
                <span>API Testing</span>
                <span>Playwright</span>
              </div>
            </div>
          </>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <>
            <button className="back-btn" onClick={() => setPage("home")}>
              ⬅ Back
            </button>

            <h2>About SNC Software Solutions</h2>

            <div className="about-section">
              <img src="/myphoto.png" alt="Suresh Metta" className="founder-img" />

              <h3>Suresh Metta</h3>
              <p className="role">Founder & CEO</p>

              <p className="about-text">
                7+ years experience. 400+ students trained.
              </p>
            </div>
          </>
        )}

        {/* BOOK */}
        {page === "book" && (
          <>
            <button className="back-btn" onClick={() => setPage("home")}>
              ⬅ Back
            </button>

            <h2>Book Interview Slot</h2>

            <div className="date-field">
              <label>Select Date: </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
              />
            </div>

            <div className="slots">
              {allSlots.map((slot) => (
                <button
                  key={slot}
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
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Enter Company - Round (e.g. TCS-L1 / Selected)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <button onClick={handleBooking}>Book Slot</button>
            </div>
          </>
        )}

        {/* VIEW */}
        {page === "view" && (
          <>
            <button className="back-btn" onClick={() => setPage("home")}>
              ⬅ Back
            </button>

            <h2>Check Scheduled Interviews</h2>

            <div className="date-field">
              <label>Select Date: </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="list">
              <h3>Bookings ({selectedDate})</h3>

              {allSlots.map((slot) =>
                bookings
                  .filter(b => b.date === selectedDate && b.slot === slot)
                  .map((b) => {
                    const isSelected = b.email?.toLowerCase().includes("selected");

                    return (
                      <div
                        key={b.id}
                        style={{
                          marginBottom: "8px",
                          padding: "6px",
                          borderRadius: "5px",
                          backgroundColor: isSelected ? "#22c55e" : "transparent",
                          color: isSelected ? "white" : "black",
                          fontWeight: isSelected ? "bold" : "normal"
                        }}
                      >
                        <strong>{b.slot}</strong> - {b.name} - {b.email}

                        {name === ADMIN_NAME && (
                          <button
                            onClick={() => deleteBooking(b.id)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              padding: "3px 6px",
                              cursor: "pointer"
                            }}
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default App;