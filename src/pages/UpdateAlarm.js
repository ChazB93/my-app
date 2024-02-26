import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UpdateAlarm() {
  const [newAlarm, setNewAlarm] = useState(new Date());
  const [email, setEmail] = useState("");
  const emailRef = useRef("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchAlarmData(id);
  }, [id]);

  const fetchAlarmData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:44377/Alarms/${id}`);
      const { Date, Email } = response.data;
      setNewAlarm(new Date(Date));
      setEmail(Email);
    } catch (error) {
      console.error("Error fetching alarm data:", error);
    }
  };

  const updateAlarmHandler = () => {
    const payload = {
      Date: newAlarm,
      Email: emailRef.current.value,
    };

    axios
      .put(`https://localhost:44377/Alarms/${id}`, payload)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating alarm:", error);
      });
  };

  return (
    <>
      <legend>Alarm aktualisieren</legend>
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
          <Form.Control
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Button variant="primary" type="button" onClick={updateAlarmHandler}>
        Aktualisieren
      </Button>
    </>
  );
}

export default UpdateAlarm;
