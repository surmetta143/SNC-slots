import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";
import { COURSES, COURSE_PRICE } from "./courses";

function App() {
  const ADMIN_NAME = "sureshmetta";
  const SUCCESS_STORY_DATE = "2099-12-31";
  const COURSE_PURCHASE_DATE = "2099-12-30";

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
  const [candidateSearch, setCandidateSearch] = useState("");
  const [successStories, setSuccessStories] = useState([]);
  const [storyStudentName, setStoryStudentName] = useState("");
  const [storyCompany, setStoryCompany] = useState("");
  const [storyImage, setStoryImage] = useState(null);
  const [storyAdminName, setStoryAdminName] = useState("");
  const [storySearch, setStorySearch] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [courseUserName, setCourseUserName] = useState("");
  const [courseUserEmail, setCourseUserEmail] = useState("");
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [payingCourseId, setPayingCourseId] = useState("");
  const [courseTransactionIds, setCourseTransactionIds] = useState({});
  const [courseAdminName, setCourseAdminName] = useState("");

  const parsePaymentStatus = (paymentRef) => {
    const ref = paymentRef || "";
    if (ref.startsWith("pending:")) return { status: "pending", paymentId: ref.slice(8) };
    if (ref.startsWith("rejected:")) return { status: "rejected", paymentId: ref.slice(9) };
    if (ref.startsWith("approved:")) return { status: "approved", paymentId: ref.slice(9) };
    return { status: "approved", paymentId: ref };
  };

  const getCourseTitle = (courseId) =>
    COURSES.find((c) => c.id === courseId)?.title || courseId;

  const allSlots = [
    "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
    "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
    "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"
  ];
  const ALLOWED_USERS = [
  {
    name: "Suresh",
    email: "suresh@gmail.com"
  },
  {
    name: "mmounika",
    email: "mmounika@gmail.com"
  },
     {
    name: "ravi",
    email: "ravi@gmail.com"
  },
     {
    name: "sampath",
    email: "sampath@gmail.com"
  },
    {
    name: "vamshi",
    email: "vamshi@gmail.com"
  },
  {
    name: "tirupathi",
    email: "tirupathi@gmail.com"
  },
     {
    name: "siva",
    email: "siva@gmail.com"
  },
      {
    name: "rathod",
    email: "rakesh@gmail.com"
  },
    
  {
    name: "sridhar",
    email: "sridhar@gmail.com"
  },
     {
    name: "asha",
    email: "asha@gmail.com"
  },
  {
    name: "sbegam",
    email: "ssbegam12@gmail.com"
  },
  {
    name: "jawhar",
    email: "jawhar@gmail.com"
  },
    {
    name: "amar",
    email: "amar@gmail.com"
  },
    {
    name: "pasanth",
    email: "prasanth@gmail.com"
  },
    {
    name: "siva kumar",
    email: "Shivadhunukunala9133@gmail.com"
  },
     {
    name: "guravareddy",
    email: "guravareddy@gmail.com"
  }
];

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (!error) {
      setBookings(data.filter((b) => b.date !== SUCCESS_STORY_DATE && b.date !== COURSE_PURCHASE_DATE));
    }
  };

  const fetchSuccessStories = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", SUCCESS_STORY_DATE)
      .order("slot", { ascending: false });

    if (!error) {
      setSuccessStories(
        (data || []).map((story) => ({
          id: story.id,
          student_name: story.name,
          company: story.email,
          image_url: story.emails,
          created_at: story.slot,
        }))
      );
    }
  };

  const fetchPurchasedCourses = useCallback(async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", COURSE_PURCHASE_DATE)
      .order("id", { ascending: false });

    if (!error && data) {
      const purchases = data.map((row) => {
        const { status, paymentId } = parsePaymentStatus(row.email);
        return {
          id: row.id,
          courseId: row.slot,
          email: row.emails,
          name: row.name,
          paymentId,
          status,
        };
      });
      setPurchasedCourses(purchases);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchSuccessStories();
    fetchPurchasedCourses();
  }, [fetchPurchasedCourses]);

  const getCoursePaymentStatus = (courseId, email, userName = courseUserName) => {
    if (!email.trim() || !userName.trim()) return "none";
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = userName.trim().toLowerCase();
    const record = purchasedCourses.find(
      (p) =>
        p.courseId === courseId &&
        p.email?.toLowerCase().trim() === normalizedEmail &&
        p.name?.trim().toLowerCase() === normalizedName
    );
    return record?.status || "none";
  };

  const validateCourseUserDetails = () => {
    if (!courseUserName.trim() || !courseUserEmail.trim()) {
      alert("Please enter your name and email.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courseUserEmail.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const saveCoursePurchase = async (course, paymentId) => {
    const normalizedEmail = courseUserEmail.trim().toLowerCase();
    const existing = purchasedCourses.find(
      (p) => p.courseId === course.id && p.email === normalizedEmail
    );

    if (existing?.status === "pending") {
      alert("Your payment is already submitted and waiting for admin approval.");
      return false;
    }

    if (existing?.status === "approved") {
      alert("You already have access to this course.");
      return false;
    }

    if (existing?.status === "rejected") {
      await supabase.from("bookings").delete().eq("id", existing.id);
    }

    const { error } = await supabase.from("bookings").insert({
      date: COURSE_PURCHASE_DATE,
      slot: course.id,
      name: courseUserName.trim(),
      email: `pending:${paymentId}`,
      emails: normalizedEmail,
      phoneNumber: 0,
    });

    if (error) {
      alert(`Could not save purchase: ${error.message}`);
      return false;
    }

    await fetchPurchasedCourses();
    return true;
  };

  const approveCoursePayment = async (purchase) => {
    if (courseAdminName !== ADMIN_NAME) {
      alert("Only admin can approve payments!");
      return;
    }

    await supabase
      .from("bookings")
      .update({
        email: `approved:${purchase.paymentId}`,
        phoneNumber: 1,
      })
      .eq("id", purchase.id);

    fetchPurchasedCourses();
  };

  const rejectCoursePayment = async (purchase) => {
    if (courseAdminName !== ADMIN_NAME) {
      alert("Only admin can reject payments!");
      return;
    }

    await supabase
      .from("bookings")
      .update({
        email: `rejected:${purchase.paymentId}`,
        phoneNumber: 2,
      })
      .eq("id", purchase.id);

    fetchPurchasedCourses();
  };

  const pendingCoursePayments = purchasedCourses.filter(
    (p) => p.status === "pending"
  );

  const submitCoursePayment = async (course) => {
    if (!validateCourseUserDetails()) return;

    const paymentStatus = getCoursePaymentStatus(course.id, courseUserEmail);
    if (paymentStatus === "pending") {
      alert("Your payment is already submitted. Please wait for admin approval.");
      return;
    }

    if (paymentStatus === "approved") {
      window.open(course.playlistUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const transactionId = (courseTransactionIds[course.id] || "").trim();
    if (!transactionId || transactionId.length < 6) {
      alert("Please enter a valid payment transaction ID (at least 6 characters).");
      return;
    }

    setPayingCourseId(course.id);

    const saved = await saveCoursePurchase(course, transactionId);

    setPayingCourseId("");

    if (saved) {
      alert(
        "Payment submitted! Admin will verify and approve your course access shortly."
      );
      setCourseTransactionIds((prev) => ({ ...prev, [course.id]: "" }));
    }
  };

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

  // Allow only authorized users
  const authorizedUser = ALLOWED_USERS.find(
    (user) =>
      user.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      user.email.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (!authorizedUser) {
    alert("You are not authorized to book a slot.");
    return;
  }

  // Mobile number validation
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

  const { error } = await supabase
    .from("bookings")
    .insert(bookingsToInsert);

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
  } else {
    alert("Booking failed");
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

  const getBookingStatus = (detailsText) => {
    const text = detailsText?.toLowerCase() || "";
    if (text.includes("selected")) return "selected";
    if (text.includes("attended")) return "attended";
    if (text.includes("3")) return "cleared";
    if (text.includes("postponed")) return "postponed";
    return "scheduled";
  };

  const getBookingStyle = (detailsText) => {
    const status = getBookingStatus(detailsText);
    const styles = {
      selected: { bgColor: "#22c55e", textColor: "white", fontWeight: "bold" },
      cleared: { bgColor: "#2291c5", textColor: "black", fontWeight: "bold" },
      attended: { bgColor: "#facc15", textColor: "black", fontWeight: "bold" },
      postponed: { bgColor: "#a086860c", textColor: "black", fontWeight: "bold" },
      scheduled: { bgColor: "transparent", textColor: "black", fontWeight: "normal" },
    };
    return styles[status];
  };

  const matchesCandidate = (bookingName, searchTerm) => {
    if (!searchTerm.trim()) return true;
    return bookingName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
  };

  const getCandidateStats = (searchTerm) => {
    const candidateBookings = bookings.filter((b) =>
      matchesCandidate(b.name, searchTerm)
    );

    const stats = {
      total: candidateBookings.length,
      attended: 0,
      selected: 0,
      cleared: 0,
      postponed: 0,
      scheduled: 0,
    };

    candidateBookings.forEach((b) => {
      const status = getBookingStatus(b.email);
      stats[status]++;
    });

    return stats;
  };

  const renderBookingRow = (b, showDate = false) => {
    const { bgColor, textColor, fontWeight } = getBookingStyle(b.email);

    return (
      <div key={b.id} className="booking-row">
        <span
          className="booking-badge"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            fontWeight,
          }}
        >
          {showDate && <strong>{b.date}</strong>}
          {showDate && " | "}
          <strong>{b.slot}</strong> - {b.name} - {b.email}
        </span>

        {name === ADMIN_NAME && (
          <button
            className="delete-booking-btn"
            onClick={() => deleteBooking(b.id)}
          >
            ✖
          </button>
        )}
      </div>
    );
  };

  const handleUploadSuccessStory = async () => {
    if (storyAdminName !== ADMIN_NAME) {
      alert("Only admin can upload success stories!");
      return;
    }

    if (!storyStudentName.trim() || !storyImage) {
      alert("Please enter student name and select a screenshot.");
      return;
    }

    if (storyImage.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please use a screenshot under 5MB.");
      return;
    }

    setUploadingStory(true);

    try {
      const imageDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(storyImage);
      });

      const { error: insertError } = await supabase.from("bookings").insert({
        date: SUCCESS_STORY_DATE,
        slot: new Date().toISOString(),
        name: storyStudentName.trim(),
        email: storyCompany.trim(),
        emails: imageDataUrl,
        phoneNumber: 0,
      });

      if (insertError) {
        alert(`Upload failed: ${insertError.message}`);
        return;
      }

      alert("Success story uploaded!");
      setStoryStudentName("");
      setStoryCompany("");
      setStoryImage(null);
      fetchSuccessStories();
    } catch (err) {
      alert(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadingStory(false);
    }
  };

  const deleteSuccessStory = async (story) => {
    if (storyAdminName !== ADMIN_NAME) {
      alert("Only admin can delete success stories!");
      return;
    }

    await supabase.from("bookings").delete().eq("id", story.id);
    fetchSuccessStories();
    if (selectedStory?.id === story.id) setSelectedStory(null);
  };

  const filteredSuccessStories = successStories.filter((story) => {
    if (!storySearch.trim()) return true;
    const term = storySearch.toLowerCase().trim();
    return (
      story.student_name?.toLowerCase().includes(term) ||
      story.company?.toLowerCase().includes(term)
    );
  });

  const navTabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "success", label: "Success Stories" },
    { id: "courses", label: "Courses" },
  ];

  return (
    <>
      <header className="site-header">
        <div className="top-bar">
          <div className="left">
            <span className="contact-label">Contact:</span>
            <a href="tel:8985256492">8985256492</a>
          </div>

          <div className="right">
            <a
              href="https://www.linkedin.com/in/suresh-metta-785689112/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/@SNCsoftwaresolutions-Testing"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="nav-bar">
          <div className="brand" onClick={() => setPage("home")}>
            SNC Software Solutions
          </div>

          <nav className="nav-menu">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${page === tab.id ? "active" : ""}`}
                onClick={() => setPage(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="container">

        {/* HOME */}
        {page === "home" && (
          <div className="page-content">
            <h1>Welcome to SNC Software Solutions</h1>
            <p className="home-subtitle">
              Expert software testing training and interview slot booking for aspiring QA professionals.
            </p>

            <div className="home-cards">
              <div className="home-card">
                <h3>Book Interview Slot</h3>
                <p>Schedule your mock or real interview slot at a convenient time.</p>
                <button className="main-btn" onClick={() => setPage("book")}>
                  Book Now
                </button>
              </div>
              <div className="home-card">
                <h3>Check Scheduled Interviews</h3>
                <p>View all booked interview slots for any selected date.</p>
                <button className="main-btn" onClick={() => setPage("view")}>
                  View Schedule
                </button>
              </div>
              <div className="home-card">
                <h3>Student Success Stories</h3>
                <p>See real placement success messages and screenshots from our students.</p>
                <button className="main-btn" onClick={() => setPage("success")}>
                  View Stories
                </button>
              </div>
              <div className="home-card">
                <h3>Online Courses</h3>
                <p>Access YouTube course playlists for just ₹99 per course.</p>
                <button className="main-btn" onClick={() => setPage("courses")}>
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {page === "about" && (
          <div className="page-content">
            <h2>About SNC Software Solutions</h2>

            <div className="about-section">
              <img src="/myphoto.png" alt="Suresh Metta" className="founder-img" />

              <h3>Suresh Metta</h3>
              <p className="role">Founder & CEO</p>

              <p className="about-text">
                I have 7+ years of experience in Software Testing.
                Trained <b>1k+ students</b>, helped <b>500+ placements</b>.
              </p>

              <div className="skills">
                <span>Java Automation</span>
                <span>Python Automation</span>
                <span>API Testing</span>
                <span>Playwright</span>
              </div>

              <a
                className="linkedin-btn"
                href="https://www.linkedin.com/in/suresh-metta-785689112/"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        )}

        {/* BOOK */}
        {page === "book" && (
          <div className="page-content">
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
          </div>
        )}

        {/* VIEW */}
        {page === "view" && (
          <div className="page-content">
            <h2>Check Scheduled Interviews</h2>

            <div className="view-filters">
              <div className="date-field">
                <label>Select Date: </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="search-field">
                <label>Search Candidate: </label>
                <input
                  type="text"
                  placeholder="Enter candidate name"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                />
              </div>
            </div>

            {candidateSearch.trim() && (
              <div className="candidate-stats">
                <h3>
                  Stats for &quot;{candidateSearch.trim()}&quot;
                </h3>
                {(() => {
                  const stats = getCandidateStats(candidateSearch);
                  if (stats.total === 0) {
                    return <p className="no-results">No bookings found for this candidate.</p>;
                  }
                  return (
                    <div className="stats-grid">
                      <div className="stat-card">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total</span>
                      </div>
                      <div className="stat-card attended">
                        <span className="stat-value">{stats.attended}</span>
                        <span className="stat-label">Attended</span>
                      </div>
                      <div className="stat-card selected">
                        <span className="stat-value">{stats.selected}</span>
                        <span className="stat-label">Selected</span>
                      </div>
                      <div className="stat-card cleared">
                        <span className="stat-value">{stats.cleared}</span>
                        <span className="stat-label">Cleared</span>
                      </div>
                      <div className="stat-card postponed">
                        <span className="stat-value">{stats.postponed}</span>
                        <span className="stat-label">Postponed</span>
                      </div>
                      <div className="stat-card scheduled">
                        <span className="stat-value">{stats.scheduled}</span>
                        <span className="stat-label">Scheduled</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {candidateSearch.trim() && getCandidateStats(candidateSearch).total > 0 && (
              <div className="list candidate-history">
                <h3>All Interviews for &quot;{candidateSearch.trim()}&quot;</h3>
                {bookings
                  .filter((b) => matchesCandidate(b.name, candidateSearch))
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return allSlots.indexOf(a.slot) - allSlots.indexOf(b.slot);
                  })
                  .map((b) => renderBookingRow(b, true))}
              </div>
            )}

            <div className="list">
              <h3>Bookings ({selectedDate || "select a date"})</h3>

              {!selectedDate && (
                <p className="no-results">Please select a date to view daily bookings.</p>
              )}

              {selectedDate &&
                allSlots.map((slot) =>
                  bookings
                    .filter(
                      (b) =>
                        b.date === selectedDate &&
                        b.slot === slot &&
                        matchesCandidate(b.name, candidateSearch)
                    )
                    .map((b) => renderBookingRow(b))
                )}

              {selectedDate &&
                !allSlots.some((slot) =>
                  bookings.some(
                    (b) =>
                      b.date === selectedDate &&
                      b.slot === slot &&
                      matchesCandidate(b.name, candidateSearch)
                  )
                ) && (
                  <p className="no-results">No bookings found for this date.</p>
                )}
            </div>
          </div>
        )}

        {/* SUCCESS STORIES */}
        {page === "success" && (
          <div className="page-content">
            <h2>Student Success Stories</h2>
            <p className="home-subtitle">
              Real placement success messages and evidence from our students.
            </p>

            <div className="search-field story-search">
              <label>Search Student: </label>
              <input
                type="text"
                placeholder="Search by student or company name"
                value={storySearch}
                onChange={(e) => setStorySearch(e.target.value)}
              />
            </div>

            <div className="upload-section">
              <h3>Upload Success Story (Admin)</h3>
              <div className="form story-upload-form">
                <input
                  placeholder="Student Name"
                  value={storyStudentName}
                  onChange={(e) => setStoryStudentName(e.target.value)}
                />
                <input
                  placeholder="Company Name (optional)"
                  value={storyCompany}
                  onChange={(e) => setStoryCompany(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStoryImage(e.target.files[0] || null)}
                />
                <input
                  placeholder="Admin"
                  value={storyAdminName}
                  onChange={(e) => setStoryAdminName(e.target.value)}
                />
                <button
                  onClick={handleUploadSuccessStory}
                  disabled={uploadingStory}
                >
                  {uploadingStory ? "Uploading..." : "Upload Success Story"}
                </button>
              </div>
            </div>

            {filteredSuccessStories.length === 0 ? (
              <p className="no-results">No success stories found yet.</p>
            ) : (
              <div className="success-gallery">
                {filteredSuccessStories.map((story) => (
                  <div key={story.id} className="success-card">
                    <button
                      className="success-image-btn"
                      onClick={() => setSelectedStory(story)}
                    >
                      <img
                        src={story.image_url}
                        alt={`${story.student_name} success story`}
                        className="success-thumbnail"
                      />
                    </button>
                    <div className="success-card-info">
                      <h4>{story.student_name}</h4>
                      {story.company && <p>{story.company}</p>}
                      {storyAdminName === ADMIN_NAME && (
                        <button
                          className="delete-story-btn"
                          onClick={() => deleteSuccessStory(story)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedStory && (
              <div
                className="story-modal-overlay"
                onClick={() => setSelectedStory(null)}
              >
                <div
                  className="story-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="story-modal-close"
                    onClick={() => setSelectedStory(null)}
                  >
                    ✕
                  </button>
                  <img
                    src={selectedStory.image_url}
                    alt={`${selectedStory.student_name} success story`}
                    className="story-modal-image"
                  />
                  <div className="story-modal-info">
                    <h3>{selectedStory.student_name}</h3>
                    {selectedStory.company && <p>{selectedStory.company}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COURSES */}
        {page === "courses" && (
          <div className="page-content">
            <h2>Online Courses</h2>
            <p className="home-subtitle">
              Enter your name and email, submit your payment details, and access the playlist after admin approval.
              Name: Suresh Metta Phonepe/Gpay:8985256492
            </p>

            <div className="course-user-form">
              <input
                placeholder="Your Name"
                value={courseUserName}
                onChange={(e) => setCourseUserName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={courseUserEmail}
                onChange={(e) => setCourseUserEmail(e.target.value)}
              />
            </div>
            <p className="course-access-note">
              Use the same name and email here to check your course access or open approved playlists.
            </p>

            <div className="courses-grid">
              {COURSES.map((course) => {
                const paymentStatus = getCoursePaymentStatus(course.id, courseUserEmail);
                const isPaying = payingCourseId === course.id;

                return (
                  <div key={course.id} className="course-card">
                    <div className="course-badge">{course.videos} Videos</div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-price">₹{COURSE_PRICE}</div>

                    {paymentStatus === "approved" && (
                      <>
                        <span className="course-purchased">Approved</span>
                        <button
                          className="main-btn course-btn"
                          onClick={() =>
                            window.open(course.playlistUrl, "_blank", "noopener,noreferrer")
                          }
                        >
                          Watch Playlist
                        </button>
                      </>
                    )}

                    {paymentStatus === "pending" && (
                      <>
                        <span className="course-pending">Pending Admin Approval</span>
                        <p className="course-status-note">
                          Payment submitted. Enter the same name and email after approval to watch the playlist.
                        </p>
                      </>
                    )}

                    {paymentStatus === "rejected" && (
                      <>
                        <span className="course-rejected">Payment Rejected</span>
                        <input
                          type="text"
                          className="course-txn-input"
                          placeholder="Payment Transaction ID"
                          value={courseTransactionIds[course.id] || ""}
                          onChange={(e) =>
                            setCourseTransactionIds((prev) => ({
                              ...prev,
                              [course.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="main-btn course-btn"
                          onClick={() => submitCoursePayment(course)}
                          disabled={isPaying}
                        >
                          {isPaying ? "Submitting..." : `Resubmit Payment (₹${COURSE_PRICE})`}
                        </button>
                      </>
                    )}

                    {paymentStatus === "none" && (
                      <>
                        <input
                          type="text"
                          className="course-txn-input"
                          placeholder="Payment Transaction ID"
                          value={courseTransactionIds[course.id] || ""}
                          onChange={(e) =>
                            setCourseTransactionIds((prev) => ({
                              ...prev,
                              [course.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="main-btn course-btn"
                          onClick={() => submitCoursePayment(course)}
                          disabled={isPaying}
                        >
                          {isPaying ? "Submitting..." : `Submit Payment (₹${COURSE_PRICE})`}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="upload-section course-admin-section">
              <h3>Approve Course Payments (Admin)</h3>
              <input
                placeholder="Admin"
                value={courseAdminName}
                onChange={(e) => setCourseAdminName(e.target.value)}
              />

              {courseAdminName === ADMIN_NAME && (
                <div className="admin-payments-list">
                  {pendingCoursePayments.length === 0 ? (
                    <p className="no-results">No pending payments.</p>
                  ) : (
                    pendingCoursePayments.map((purchase) => (
                      <div key={purchase.id} className="admin-payment-row">
                        <div>
                          <strong>{purchase.name}</strong> — {purchase.email}
                          <br />
                          <span>{getCourseTitle(purchase.courseId)}</span>
                          <br />
                          <small>Txn: {purchase.paymentId}</small>
                        </div>
                        <div className="admin-payment-actions">
                          <button
                            className="approve-btn"
                            onClick={() => approveCoursePayment(purchase)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => rejectCoursePayment(purchase)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <p className="course-note">
              Pay ₹{COURSE_PRICE} to the admin, enter your payment transaction ID on the course card, and wait for approval. Once approved, enter the same name and email to open the playlist.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
