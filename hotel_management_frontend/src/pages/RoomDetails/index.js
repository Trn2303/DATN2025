const RoomDetails = () => {
  return (
    <>
      <div className="room-details-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="room-details-item">
                <img src="img/room/room-details.jpg" alt />
                <div className="rd-text">
                  <div className="rd-title">
                    <h3>Premium King Room</h3>
                    <div className="rdt-right">
                      <div className="rating">
                        <i className="icon_star" />
                        <i className="icon_star" />
                        <i className="icon_star" />
                        <i className="icon_star" />
                        <i className="icon_star-half_alt" />
                      </div>
                      <a href="#">Booking Now</a>
                    </div>
                  </div>
                  <h2>
                    159$<span>/Pernight</span>
                  </h2>
                  <table>
                    <tbody>
                      <tr>
                        <td className="r-o">Size:</td>
                        <td>30 ft</td>
                      </tr>
                      <tr>
                        <td className="r-o">Capacity:</td>
                        <td>Max persion 5</td>
                      </tr>
                      <tr>
                        <td className="r-o">Bed:</td>
                        <td>King Beds</td>
                      </tr>
                      <tr>
                        <td className="r-o">Services:</td>
                        <td>Wifi, Television, Bathroom,...</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="f-para">
                    Motorhome or Trailer that is the question for you. Here are
                    some of the advantages and disadvantages of both, so you
                    will be confident when purchasing an RV. When comparing Rvs,
                    a motorhome or a travel trailer, should you buy a motorhome
                    or fifth wheeler? The advantages and disadvantages of both
                    are studied so that you can make your choice wisely when
                    purchasing an RV. Possessing a motorhome or fifth wheel is
                    an achievement of a lifetime. It can be similar to
                    sojourning with your residence as you search the various
                    sites of our great land, America.
                  </p>
                  <p>
                    The two commonly known recreational vehicle classes are the
                    motorized and towable. Towable rvs are the travel trailers
                    and the fifth wheel. The rv travel trailer or fifth wheel
                    has the attraction of getting towed by a pickup or a car,
                    thus giving the adaptability of possessing transportation
                    for you when you are parked at your campsite.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="room-booking">
                <h3>Your Reservation</h3>
                <form action="#">
                  <div className="check-date">
                    <label htmlFor="date-in">Check In:</label>
                    <input type="text" className="date-input" id="date-in" />
                    <i className="icon_calendar" />
                  </div>
                  <div className="check-date">
                    <label htmlFor="date-out">Check Out:</label>
                    <input type="text" className="date-input" id="date-out" />
                    <i className="icon_calendar" />
                  </div>
                  <div className="select-option">
                    <label htmlFor="guest">Guests:</label>
                    <select id="guest">
                      <option value>3 Adults</option>
                    </select>
                  </div>
                  <div className="select-option">
                    <label htmlFor="room">Room:</label>
                    <select id="room">
                      <option value>1 Room</option>
                    </select>
                  </div>
                  <button type="submit">Check Availability</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RoomDetails;
