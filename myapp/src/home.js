import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./App.css";

const CalendarComponent = () => {
  console.log("in calendar")
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  // const [timeSlots,setTimeSlots] =useState();

  const handleDateChange1 =(date)=>{
    console.log("in date", date);
    setSelectedDate(date);
    handleDateChange(date);
  }
  const handleDateChange= async(date) => {
    // setTimeSlots(generateTimeSlots())
    console.log("handleDatachange ",date)
    try {
      const response = await fetch("http://localhost:5000/getBookedSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          date
        }), // Send entered OTP to the server
      });

      if (response.ok) {
        const data = await response.json();
        console.log("bookedslots",data.data);
      } else {
        alert("error in the backend");
        console.error('error in booking');
      }

    } catch (error) {
      console.error('Error from backend', error);
    }
  };

  const timeSlots = generateTimeSlots();

  // function getTimeFromDate(date) {
  //     return date.toTimeString().slice(0, 8);
  //   }
  function calculateTimeDifference(startDate, endDate) {
    if (endDate > startDate) {
      const timeDifference = endDate - startDate; // Difference in milliseconds

      const milliseconds = timeDifference % 1000;
      const seconds = Math.floor((timeDifference / 1000) % 60);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return { days, hours, minutes, seconds, milliseconds };
    }
    return -1;
  }

  function generateTimeSlots() {
    const startTime = new Date(selectedDate);
    startTime.setHours(0, 0, 0, 0); // Set hours to midnight

    const endTime = new Date(selectedDate);
    endTime.setHours(23, 59, 0, 0); // Set hours to just before midnight

    const interval = 30; // Interval in minutes
    const timeSlots = [];
    // const currentTime=getTimeFromDate(new Date())

    while (startTime <= endTime) {
      timeSlots.push(new Date(startTime));
      startTime.setMinutes(startTime.getMinutes() + interval);
    }

    const pairs = [];
    for (let i = 0; i < timeSlots.length - 1; i += 1) {
      const pair = [timeSlots[i], timeSlots[i + 1]];
      const timeDifference = calculateTimeDifference(new Date(), timeSlots[i]);
      // console.log(timeDifference);
      if (timeDifference != -1 && (timeDifference.days > 0 || timeDifference.hours > 0 || timeDifference.minutes > 5)) {
        pairs.push(pair);
        // console.log(pair);
      }
    }
    return pairs;
  }

  const handleBookSlot = async () => {
    // console.log("in handleBookSlot", time[0]);
    // const timeslot = time[0];
    try {
      const response = await fetch("http://localhost:5000/book-slot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          selectedDate, 
          token: window.localStorage.getItem("token"),
          name,
          contactNo,
        }), // Send entered OTP to the server
      });
      console.log("response ",response,JSON.stringify({ 
          selectedDate, 
          token: window.localStorage.getItem("token"),
          name,
          contactNo,
        }))
      if (response.ok) {
        const data = await response.json();
        console.log("in booking");
        alert("Your Booking is Successful");
        // window.location.href = "/book-slot";
      } else {
        alert("error in the backend");
        console.error('error in booking');
      }

    } catch (error) {
      console.error('Error from backend', error);
    }
  };

  // const settingTimeSlot = async (time) => {

  // }
  return (
    <div>

      <h2>Calendar Example</h2>
      <div className='calendarComponent'>
        <Calendar
          onChange={handleDateChange1}
          value={selectedDate}
          minDate={new Date()}
        />
        {/* <p>Selected date: {selectedDate.toDateString()}</p> */}
        <div>
          <div>Available Time Slots</div>
          {/* {console.log("vdv0",timeSlots)} */}
          {/* <ul> */}
          {timeSlots.length !== 0 ? timeSlots.map((timeSlot, index) => (
            <div>
              <button onClick={() => handleDateChange(timeSlot[0])} key={index}>
                {timeSlot.map((element, subIndex) => (
                  <span key={subIndex}>{element.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}  </span>
                ))}
              </button>
            </div>
          )) : "No Available Slots on selected date"}
          {/* </ul> */}
        </div>
        
      </div>
      <div>
      <div>Booking of TimeSlot</div>
      
        <div>
          <label for="name">Time Slot:</label>
          <input
            type="text"
            id="name"
            value={selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            required
          />
        </div>
        <div>
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label for="contactNo">Contact Number:</label>
          <input
            type="tel"
            id="contactNo"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleBookSlot }>Submit</button>
      
      </div>

    </div>
  );
}

export default CalendarComponent;