import React, { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";

function App() {
  const ADMIN_NAME = "sureshmetta";

  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [repeatType, setRepeatType] = useState("none");
  const [repeatCount, setRepeatCount] = useState(1);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState("");
  const [hrNumber, setHrNumber] = useState("");

  const allSlots = [
    "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
    "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
    "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"
  ];

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (!error) setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookedSlots = () => {
    return bookings.filter(b => b.date === selectedDate).map(b => b.slot);
  };

  const bookedSlots = getBookedSlots();

  const handleBooking = async () => {
    const finalSlot = useCustomTime ? customTime : selectedSlot;

    if (!selectedDate || !finalSlot || !name || !details || !email) {
      alert("Please fill all fields");
      return;
    }

    // ✅ HR Number validation
    if (!/^\d{10}$/.test(hrNumber)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const bookingsToInsert = [];
    const baseDate = new Date(selectedDate);
    const loopCount = repeatType === "none" ? 1 : repeatCount;

    for (let i = 0; i < loopCount; i++) {
      let newDate = new Date(baseDate);

      if (repeatType === "daily") {
        newDate.setDate(baseDate.getDate() + i);
      } else if (repeatType === "weekly") {
        newDate.setDate(baseDate.getDate() + i * 7);
      }

      bookingsToInsert.push({
        date: newDate.toISOString().split("T")[0],
        slot: finalSlot,
        name,
        email: details,
        emails: email,
        phoneNumber: hrNumber
      });
    }

    const { error } = await supabase.from("bookings").insert(bookingsToInsert);

    if (!error) {
      alert("Congratulations, your Slot booked successfully!");
      fetchBookings();
      setSelectedSlot("");
      setCustomTime("");
      setUseCustomTime(false);
      setName("");
      setDetails("");
      setEmail("");
      setHrNumber("");
      setRepeatType("none");
      setRepeatCount(1);
    }
  };

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

        {/* ABOUT PAGE */}
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
                  setUseCustomTime(false);
                }}
              />
            </div>

            <div className="slots">
              {allSlots.map((slot) => (
                <button
                  key={slot}
                  disabled={bookedSlots.includes(slot)}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setUseCustomTime(false);
                  }}
                  className={selectedSlot === slot ? "selected" : ""}
                >
                  {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                </button>
              ))}

              <button
                onClick={() => {
                  setUseCustomTime(true);
                  setSelectedSlot("");
                }}
                className={useCustomTime ? "selected" : ""}
              >
                Other Time
              </button>
            </div>

            {useCustomTime && (
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                style={{ marginTop: "10px" }}
              />
            )}

            <div className="form">
              <input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
             
              <input
                placeholder="CompanyName-RoundType(L1/L2)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter HR Number"
                value={hrNumber}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setHrNumber(value);
                  }
                }}
              />
              {hrNumber && hrNumber.length !== 10 && (
                <p style={{ color: "red", margin: "4px 0 0" }}>
                  Mobile number must be exactly 10 digits
                </p>
              )}

              <div style={{ marginTop: "10px" }}>
                <label>Repeat: </label>

                <select onChange={(e) => setRepeatType(e.target.value)}>
                  <option value="none">No Repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>

                {repeatType !== "none" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Count"
                    onChange={(e) => setRepeatCount(Number(e.target.value))}
                  />
                )}
              </div>

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

                    const emailText = b.email?.toLowerCase() || "";

                    const isSelected = emailText.includes("selected");
                    const isAttended = emailText.includes("attended");
                    const isCleared = emailText.includes("3");
                    const ispostponed = emailText.includes("postponed");

                    let bgColor = "transparent";
                    let textColor = "black";
                    let fontWeight = "normal";

                    if (isSelected) {
                      bgColor = "#22c55e"; textColor = "white"; fontWeight = "bold";
                    } else if (isCleared) {
                      bgColor = "#2291c5"; textColor = "black"; fontWeight = "bold";
                    } else if (isAttended) {
                      bgColor = "#facc15"; textColor = "black"; fontWeight = "bold";
                    }
                     else if (ispostponed) {
                      bgColor = "#151dfa"; textColor = "black"; fontWeight = "bold";
                    }

                    return (
                      <div
                        key={b.id}
                        style={{ marginBottom: "8px", padding: "6px", borderRadius: "5px" }}
                      >
                        <span
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            fontWeight: fontWeight,
                            padding: "4px 8px",
                            borderRadius: "6px",
                            display: "inline-block"
                          }}
                        >
                          <strong>{b.slot}</strong> - {b.name} - {b.email}
                        </span>

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