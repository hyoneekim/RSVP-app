import React from 'react';
import 'add-to-calendar-button';

// Main App Component
function App() {
  return (
    <div className="App">
      <Header />
      <Introduction />
      <hr />
      <Form />
      <Eventdetails />
      <Calendar />
    </div>
  );
}
 

// Header Component
function Header() {
  return (
    <header>
      <h1>Welcome to Elias's 1st Birthday Party!</h1>
    </header>
  );
}

// Introduction Component
function Introduction() {
  return (
    <section>
      <p>We are excited to invite you to our event! Please fill out the form below to let us know who will be attending.</p>
    </section>
  );
}

function Eventdetails(){
  return (
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.1182472552284!2d24.68002557716805!3d60.26150247507915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df16d31ab312f%3A0x66a255269560b5b7!2sBodom%20Manor!5e0!3m2!1sko!2sfi!4v1734817459324!5m2!1sko!2sfi" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    
    
  );
}


function Form() {
  async function handleSubmit(e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    console.log('Form Data:', formJson); // Check the data being sent
  
    try {
      const response = await fetch('http://localhost:3001/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formJson),
      });
  
      if (response.ok) {
        console.log('Guest added successfully');
      } else {
        console.error('Error adding guest');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="formUnit">
        <label>
          Name: <input type="text" name="name" />
        </label>
        <label>
          Adult/Child: 
          <select name="age">
            <option value="adult">Adult</option>
            <option value="child">Child</option>
          </select>
        </label>
        <label>
          Food Allergies: <input type="text" name="allergies" />
        </label>
        <label>
          Do you wish to join the after-party? <input type="checkbox" name="aftercheck" />
        </label>
      </div>
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}



function Calendar(){
    return (
      <add-to-calendar-button
  name="Title"
  options="'Apple','Google'"
  location="World Wide Web"
  startDate="2025-02-09"
  endDate="2025-02-09"
  startTime="13:00"
  endTime="17:00"
  timeZone="Europe/Helsinki"
></add-to-calendar-button>
    );
  }




export default App;