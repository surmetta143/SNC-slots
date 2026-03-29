import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

function App() {
  const ADMIN_NAME = "sureshmetta";

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState(""); // email / company details
  const [bookings, setBookings] = useState([]);

  const allSlots = [
    "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
    "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
    "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM"
  ];

  // 🔥 Fetch bookings
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*");

    if (error) {
      console.log("Error:", error.message);
    } else {
      setBookings(data);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 👉 Get booked slots
  const getBookedSlots = () => {
    return bookings
      .filter(b => b.date === selectedDate)
      .map(b => b.slot);
  };

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

    if (error) {
      alert("Error booking slot");
      console.log(error);
    } else {
      alert("Slot booked successfully!");
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
    <div className="container">
      <h1>SNC Software Solutions</h1>
      <h2>Interview Slot Booking</h2>

      {/* Date */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedSlot("");
        }}
      />

      {/* Slots */}
      <div className="slots">
        {allSlots.map((slot, i) => (
          <button
            key={i}
            disabled={getBookedSlots().includes(slot)}
            onClick={() => setSelectedSlot(slot)}
            className={selectedSlot === slot ? "selected" : ""}
          >
            {slot} {getBookedSlots().includes(slot) ? "(Booked)" : ""}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="form">
        <input
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Enter Company-Round Type"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <button onClick={handleBooking}>Book Slot</button>
      </div>

      {/* Booking List */}
      <div className="list">
  <h3>Bookings ({selectedDate})</h3>

  {bookings
    .filter(b => b.date === selectedDate)
    .map((b) => (
      <div key={b.id} style={{ marginBottom: "8px" }}>
        <strong>{b.slot}</strong> → {b.name} - {b.email}
      </div>
    ))}
</div>
    </div>
  );
}

export default App;