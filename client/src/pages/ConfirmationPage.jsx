import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ConfirmationPage.css';

function ConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
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
        <div className="loading">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Booking not found</h2>
          <button className="home-button" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="confirmation-page">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p className="success-message">Your tickets have been successfully booked</p>

        <div className="ticket">
          <div className="ticket-header">
            <h2>{booking.movie_title}</h2>
            <span className="booking-id">Booking #{booking.id}</span>
          </div>

          <div className="ticket-details">
            <div className="detail-item">
              <span className="label">Customer Name:</span>
              <span className="value">{booking.customer_name}</span>
            </div>
            
            {booking.customer_email && (
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{booking.customer_email}</span>
              </div>
            )}

            <div className="detail-item">
              <span className="label">Theater:</span>
              <span className="value">{booking.theater_name}</span>
            </div>

            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{booking.theater_area}, Pune</span>
            </div>

            <div className="detail-item">
              <span className="label">Show Date:</span>
              <span className="value">{formatDate(booking.show_date)}</span>
            </div>

            <div className="detail-item">
              <span className="label">Show Time:</span>
              <span className="value">{booking.show_time}</span>
            </div>

            <div className="detail-item">
              <span className="label">Seats:</span>
              <span className="value seats-display">
                {booking.seats.map(seat => (
                  <span key={seat} className="seat-badge">{seat}</span>
                ))}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Number of Tickets:</span>
              <span className="value">{booking.seats.length}</span>
            </div>

            <div className="detail-item total">
              <span className="label">Total Amount:</span>
              <span className="value">₹{booking.total_price}</span>
            </div>

            <div className="detail-item">
              <span className="label">Booking Date:</span>
              <span className="value">
                {new Date(booking.booking_date).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="home-button" onClick={() => navigate('/')}>
            Book More Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
