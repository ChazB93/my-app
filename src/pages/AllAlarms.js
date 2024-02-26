import { Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DeleteConfirmation from "../components/shared/DeleteConfirmation";
import { convertMillisecondsToTime } from "../Helpers/TimeHelper";

function AllAlarms() {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(0);
  const [notificationSent, setNotificationSent] = useState({});

  useEffect(() => {
    axios.get("https://localhost:44377/Alarms").then((response) => {
      setAlarms(response.data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAlarmsTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  });

  function updateAlarmsTimeLeft() {
    const updatedAlarms = alarms.map((alarm) => {
      const timeDiff = new Date(alarm.date).getTime() - Date.now();
      const timeLeft = Math.max(0, timeDiff);

      if (timeLeft === 0 && !notificationSent[alarm.id]) {
        sendNotification(alarm);
        setNotificationSent((prev) => ({
          ...prev,
          [alarm.id]: true,
        }));
      }

      return {
        ...alarm,
        timeLeft: timeLeft > 0 ? timeLeft : 0,
      };
    });

    setAlarms(updatedAlarms);
  }

  function sendNotification(alarm) {
    const notificationData = {
      receiver: alarm.email,
      subject: "Timer hit",
      content: "Get ready for rumble",
    };

    axios
      .post(
        "https://prod-17.switzerlandnorth.logic.azure.com:443/workflows/3b6d3d7477dd4cbd85e6034a2a6b137a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KvoYC8v-VcvwSuGIyWGD6DD603NM28dnT6fzS9iTyrY",
        notificationData
      )
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  }

  function confirmDeleteHandler() {
    axios
      .delete(`https://localhost:44377/Alarms/${itemToDeleteId}`)
      .then((response) => {
        setShowModal(false);
        setAlarms((existingData) => {
          return existingData.filter((_) => _.id !== itemToDeleteId);
        });
        setItemToDeleteId(0);
      });
  }

  function showConfirmDeleteHandler(id) {
    setShowModal(true);
    setItemToDeleteId(id);
  }

  function hideConfirmDeleteHandler() {
    setShowModal(false);
    setItemToDeleteId(0);
  }

  return (
    <>
      <DeleteConfirmation
        showModal={showModal}
        title="Löschen Bestätigen"
        body="Sind Sie sicher, dass Sie diesen Alarm löschen möchten??"
        confirmDeleteHandler={confirmDeleteHandler}
        hideConfirmDeleteHandler={hideConfirmDeleteHandler}
      />
      <Row className="mt-2">
        <Col md={{ span: 4, offset: 4 }}>
          <Button
            variant="primary"
            type="button"
            onClick={() => navigate("/alarm-create")}
          >
            Alarm hinzufügen
          </Button>
        </Col>
      </Row>
      <Row md={3} className="g-4 mt-1">
        {alarms.map((item) => {
          const localTime = new Date(item.date).toLocaleString();
          const {
            hours = 0,
            minutes = 0,
            seconds = 0,
          } = convertMillisecondsToTime(item.timeLeft);

          return (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <b>Alarmzeit:</b> {localTime}
                  </Card.Text>
                  <Card.Text>
                    <b>E-Mail: </b>
                    {item.email}
                  </Card.Text>
                  <Card.Text>
                    <b>Verbleibende Zeit:</b> {hours}h {minutes}m {seconds}s
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/alarm-update/${item.id}`)}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => showConfirmDeleteHandler(item.id)}
                  >
                    Löschen
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
export default AllAlarms;
