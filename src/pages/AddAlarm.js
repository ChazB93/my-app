import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddAlarm() {
  const [newAlarm, setNewAlarm] = useState(new Date());
  const emailRef = useRef("");
  const navigate = useNavigate();

  function addAlarmHandler() {
    const payload = {
      Date: newAlarm.toISOString(), // Store in UTC format
      Email: emailRef.current.value,
    };

    axios.post("https://localhost:44377/Alarms", payload).then((response) => {
      navigate("/");
    });
  }

  return (
    <>
      <legend>Alarm hinzufügen</legend>
      <Form>
        <Form.Group className="mb-3" controlId="DateTime">
          <Form.Label>Datum und Uhrzeit</Form.Label>
          <DatePicker
            selected={newAlarm}
            onChange={(date) => setNewAlarm(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Email">
          <Form.Label>E-Mail </Form.Label>
          <Form.Control type="email" ref={emailRef} />
        </Form.Group>
      </Form>
      <Button variant="primary" type="button" onClick={addAlarmHandler}>
        Senden
      </Button>
    </>
  );
}

export default AddAlarm;
