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
      <p>You are invited to</p>
      <h1>Elias's 1st Birthday Party!</h1>
    </header>
  );
}

// Introduction Component
function Introduction() {
  return (
    <section>
      <p>We are excited to invite you to our boy's first-ever birthday party!</p>
      <h2><strong>09.02.2025 13:00, Bodomin Kartano</strong></h2>
      <p><strong>Please fill out the RSVP form below</strong> to let us know who will be attending.</p>
      <p>
        Food will be served by the venue. You can check the menu{" "}
        <a href="https://bodominkartano.fi/brunssi/" target="_blank" rel="noopener noreferrer">here</a>.
      </p>
      <p>(Only in Finnish. Please check the BLINIBRUNSSI menu!)</p>
      <p>PS: We'd like to know how many of you want to join the after-party so we can prepare accordingly!</p>
      <p>- Suhyun & Antti</p>
    </section>
  );
}

// Event Details Component
function Eventdetails() {
  return (
    <iframe
      className="map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.1182472552284!2d24.68002557716805!3d60.26150247507915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df16d31ab312f%3A0x66a255269560b5b7!2sBodom%20Manor!5e0!3m2!1sko!2sfi!4v1734817459324!5m2!1sko!2sfi"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

// RSVP Form Component
function Form() {
  const [forms, setForms] = useState([{ name: "", age: "adult", childAge: "" }]);
  const [afterparty, setAfterparty] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");

  const handleAddForm = () => setForms([...forms, { name: "", age: "adult", childAge: "" }]);

  const handleRemoveForm = (index) => setForms(forms.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const updatedForms = forms.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setForms(updatedForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { guests: forms, afterparty, requirements };

    try {
      const response = await fetch(`/api/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for letting us know! See you at the party :)");
        setSubmissionStatus("Thank you for letting us know, see you at the party!");
      } else {
        console.error('Error adding guest');
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {forms.map((form, index) => (
        <div className="form-container" key={index}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
          </label>
          <label>
            Adult/Child:
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
            <label>
              Child's Age:
              <input
                type="number"
                name="childAge"
                value={form.childAge}
                onChange={(e) => handleChange(index, "childAge", e.target.value)}
                min="0"
                max="17"
                required
              />
            </label>
          )}
          <button type="button" onClick={handleAddForm}>+</button>
          {index > 0 && (
            <button type="button" onClick={() => handleRemoveForm(index)}>-</button>
          )}
        </div>
      ))}
      <label>
        Join after-party? 
        <input
          type="checkbox"
          checked={afterparty}
          onChange={(e) => setAfterparty(e.target.checked)}
        />
      </label>
      <label>
        Special Requirements:
        <input
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
      {submissionStatus && <p>{submissionStatus}</p>}
    </form>
  );
}

// Calendar Component
function Calendar() {
  return (
    <div style={{ margin: '20px 0' }}>
      <add-to-calendar-button
        name="Elias's 1st Birthday Party"
        location="Bodomin kartano"
        startDate="2025-02-09"
        endDate="2025-02-09"
        startTime="13:00"
        endTime="15:30"
        timeZone="Europe/Helsinki"
        buttonStyle="date"
      ></add-to-calendar-button>
    </div>
  );
}

export default App;
