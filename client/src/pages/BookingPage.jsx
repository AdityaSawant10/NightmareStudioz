import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    fetchMovieAndShowtimes();
  }, [movieId]);

  useEffect(() => {
    if (selectedTheater && selectedDate && selectedTime) {
      fetchSeats();
    }
  }, [selectedTheater, selectedDate, selectedTime]);

  const fetchMovieAndShowtimes = async () => {
    try {
      const [movieRes, showtimesRes] = await Promise.all([
        fetch(`/api/movies/${movieId}`),
        fetch(`/api/movies/${movieId}/showtimes`)
      ]);
      
      const movieData = await movieRes.json();
      const showtimesData = await showtimesRes.json();
      
      setMovie(movieData);
      setShowtimes(showtimesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(
        `/api/movies/${movieId}/seats?theater_id=${selectedTheater}&show_date=${selectedDate}&show_time=${selectedTime}`
      );
      const seatsData = await response.json();
      setSeats(seatsData);
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const handleTheaterChange = (theaterId) => {
    setSelectedTheater(theaterId);
    setSelectedDate('');
    setSelectedTime('');
    setSeats([]);
    setSelectedSeats([]);
    
    const dates = [...new Set(
      showtimes
        .filter(st => st.theater_id == theaterId)
        .map(st => st.show_date)
    )].sort();
    setAvailableDates(dates);
    setAvailableTimes([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setSeats([]);
    setSelectedSeats([]);
    
    const times = showtimes
      .filter(st => st.theater_id == selectedTheater && st.show_date === date)
      .map(st => st.show_time);
    setAvailableTimes(times);
  };

  const uniqueTheaters = [...new Map(
    showtimes.map(st => [st.theater_id, { id: st.theater_id, name: st.theater_name, area: st.area }])
  ).values()];

  const toggleSeat = (seatNumber) => {
    const seat = seats.find(s => s.seat_number === seatNumber);
    if (seat.is_booked) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBooking = async () => {
    if (!selectedTheater || !selectedDate || !selectedTime) {
      alert('Please select theater, date, and time');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (!customerName || !customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!customerEmail || !customerEmail.trim()) {
      alert('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movie_id: movieId,
          theater_id: selectedTheater,
          show_date: selectedDate,
          show_time: selectedTime,
          seats: selectedSeats,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate(`/confirmation/${data.booking_id}`);
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const rows = {};
  seats.forEach(seat => {
    const row = seat.seat_number[0];
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  const totalPrice = movie ? movie.price * selectedSeats.length : 0;

  return (
    <div className="container">
      <div className="booking-page">
        <div className="booking-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>{movie?.title}</h1>
        </div>

        <div className="booking-content">
          <div className="seat-selection">
            <div className="selection-section">
              <h3>Select Theater</h3>
              <select 
                value={selectedTheater} 
                onChange={(e) => handleTheaterChange(e.target.value)}
                className="select-field"
              >
                <option value="">Choose a cinema near Pune...</option>
                {uniqueTheaters.map(theater => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name} - {theater.area}
                  </option>
                ))}
              </select>
            </div>

            {selectedTheater && (
              <div className="selection-section">
                <h3>Select Date</h3>
                <div className="date-buttons">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      className={`date-button ${selectedDate === date ? 'active' : ''}`}
                      onClick={() => handleDateChange(date)}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && (
              <div className="selection-section">
                <h3>Select Show Time</h3>
                <div className="time-buttons">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      className={`time-button ${selectedTime === time ? 'active' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTime && seats.length > 0 && (
              <>
                <div className="screen">
                  <div className="screen-label">SCREEN</div>
                </div>

                <div className="seats-container">
                  {Object.keys(rows).sort().map(row => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      <div className="seats">
                        {rows[row].map(seat => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.is_booked ? 'booked' : ''} ${selectedSeats.includes(seat.seat_number) ? 'selected' : ''}`}
                            onClick={() => toggleSeat(seat.seat_number)}
                            disabled={seat.is_booked}
                          >
                            {seat.seat_number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="seat-legend">
                  <div className="legend-item">
                    <div className="seat available"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat booked"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="booking-summary">
            <h2>Booking Summary</h2>
            
            <div className="summary-details">
              <div className="detail-row">
                <span>Movie:</span>
                <span>{movie?.title}</span>
              </div>
              {selectedTheater && (
                <div className="detail-row">
                  <span>Theater:</span>
                  <span>{uniqueTheaters.find(t => t.id == selectedTheater)?.name}</span>
                </div>
              )}
              {selectedDate && (
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{formatDate(selectedDate)}</span>
                </div>
              )}
              {selectedTime && (
                <div className="detail-row">
                  <span>Time:</span>
                  <span>{selectedTime}</span>
                </div>
              )}
              <div className="detail-row">
                <span>Price per ticket:</span>
                <span>₹{movie?.price}</span>
              </div>
              <div className="detail-row">
                <span>Selected seats:</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              </div>
              <div className="detail-row total">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="customer-info">
              <input
                type="text"
                placeholder="Your Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Your Email *"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button 
              className="confirm-button"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
