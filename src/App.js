import React, { useState } from 'react';
import './App.css';
import 'add-to-calendar-button';

// Main App Component
function App() {
  return (
    <div className="App">
      <Header />
      <Introduction />
      <hr />
      <Form />
      <hr />
      <Calendar />
      <Eventdetails />

    </div>
  );
}

// Header Component
function Header() {
  return (
    <header>
      <p>You are invited to </p>
      <h1>Elias's 1st Birthday Party!</h1>
    </header>
  );
}

// Introduction Component
function Introduction() {
  return (
    <section>
      <p>We are excited to invite you to our boy's first ever birthday party!</p>
      <h2><strong>09.02.2025 13pm, Bodomin kartano</strong></h2>
      <p><strong>Please fill out the RSVP form below </strong> to let us know who will be attending.</p>
      <a>Food will be served by the venue, you can check the menu </a>
      <a href='https://bodominkartano.fi/brunssi/' target="_blank">here</a><a> in advance.</a>
      <p>(Only in Finnish, please check the BLINIBRUNSSI menu!)</p>
      <p>ps: We'd like to know how many of you want to join the after-party, we're going to prepare for it accordingly!</p>
      <p>- Suhyun & Antti</p>
    </section>
  );
}

function Eventdetails() {
  return (
    <iframe className="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.1182472552284!2d24.68002557716805!3d60.26150247507915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df16d31ab312f%3A0x66a255269560b5b7!2sBodom%20Manor!5e0!3m2!1sko!2sfi!4v1734817459324!5m2!1sko!2sfi" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
  );
}

function Form() {
  const [forms, setForms] = useState([{ name: "", age: "adult", childAge: "" }]);
  const [afterparty, setAfterparty] = useState(false); // State for the after-party checkbox
  const [requirements, setRequirements] = useState(""); // State for special requirements
  const [submissionStatus, setSubmissionStatus] = useState(""); // Track submission status

  const handleAddForm = () => {
    setForms([...forms, { name: "", age: "adult", childAge: "" }]);
  };

  const handleRemoveForm = (index) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedForms = forms.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setForms(updatedForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { guests: forms, afterparty, requirements };

    console.log('Form Data:', formData); // Ensure all fields are logged correctly

    try {
      const response = await fetch('http://localhost:3001/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send all data, including afterparty and requirements
      });

      if (response.ok) {
        console.log('Guest added successfully');
        alert("Thank you for letting us know! See you at the party :)");
        setSubmissionStatus("Thank you for letting us know, see you at the party!");
      } else {
        console.error('Error adding guest');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Guest Details Section */}
      {forms.map((form, index) => (
        <div className="form-container" key={index}>
          <div className="form-inline">
            <label>
              Name:{" "}
              <input
                type="text"
                name="name"
                value={form.name}
                size={20}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
                style={{ marginRight: "40px" }}
              />
            </label>
            <label>
              Adult/Child:{" "}
              <select
                name="age"
                value={form.age}
                onChange={(e) => handleChange(index, "age", e.target.value)}
              >
                <option value="adult">Adult</option>
                <option value="child">Child</option>
              </select>
            </label>
            {form.age === "child" && (
              <div>
                <label>
                  How old is the child?{" "}
                  <input
                    type="number"
                    name="childAge"
                    value={form.childAge}
                    onChange={(e) => handleChange(index, "childAge", e.target.value)}
                    min="1"
                    max="17"
                    required
                  />
                </label>
              </div>
            )}
            <button className="btn-add" type="button" onClick={handleAddForm}>
              +
            </button>
            {index !== 0 && (
              <button className="btn-remove" type="button" onClick={() => handleRemoveForm(index)}>
                -
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Afterparty Checkbox for the Whole Group */}
      <div className="afterparty-container">
        <label>
          Do you want to join the after-party?{" "}
          <input
            type="checkbox"
            name="afterparty"
            checked={afterparty}
            onChange={(e) => setAfterparty(e.target.checked)}
          />
        </label>
      </div>

      {/* Special Requirements for the Whole Group */}
      <div className="requirements-container">
        <label>
          Do you have any special requirements?
          {" "}
          <input
            type="text"
            name="requirements"
            value={requirements}
            style={{ width: "100%", height: "50px" }}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </label>
      </div>

      <button className="btn-submit" type="submit">Submit</button>
      {submissionStatus && <p>{submissionStatus}</p>}
    </form>
  );
}

function Calendar() {
  return (
    <div className='btn-calendar' style={{margin: '20px 0 50px 60px' }}>
      <add-to-calendar-button
        name="Elias's 1st Birthday Party"
        options="'Apple','Google'"
        location="Bodomin kartano"
        startDate="2025-02-09"
        endDate="2025-02-09"
        startTime="13:00"
        endTime="17:00"
        size="5"
        buttonStyle="date"
        lightMode="bodyScheme"
        timeZone="Europe/Helsinki"
      ></add-to-calendar-button>
    </div>
  );
}

export default App;
