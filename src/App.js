import '../src/styles/App.css';
import Layout from './components/shared/Layout';
import AllAlarms from './pages/AllAlarms';
import AddAlarm from './pages/AddAlarm';
import { Route, Routes } from "react-router-dom";
import Stopwatch from './components/shared/StopWatch';
import Timer from './components/shared/Timer';
import UpdateAlarm from "./pages/UpdateAlarm";
 
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AllAlarms />} />
      </Routes>
      <Routes>
        <Route path="/alarm-create" element={<AddAlarm />} />
      </Routes>
      <Routes>
        <Route
          path="/alarm-update/:id"
          element={<UpdateAlarm />}
        />
      </Routes>

      <Stopwatch/>
      <Timer/>
    </Layout>
  );
}
export default App;