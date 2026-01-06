import { useEffect, useState } from "react";
import axios from "axios";
import HeaderTop from "../components/HeaderTop";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import Footer from "../components/Footer";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

export default function StudentBulkSms() {
  const [uname, setUname] = useState("");
  const [programme, setProgramme] = useState("");
  const [group, setGroup] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const [unames, setUnames] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [groupSem, setGroupSem] = useState([]);

    
  

  useEffect(() => {
    axios.get(`${API_BASE_URL}/BulkSms/unames`)
      .then(r => setUnames(r.data));
  }, []);

  useEffect(() => {
    if (uname)
      axios.get(`${API_BASE_URL}/BulkSms/programmes/${uname}`)
        .then(r => setProgrammes(r.data));
  }, [uname]);

  useEffect(() => {
    if (uname && programme)
      axios.get(`${API_BASE_URL}/BulkSms/groupsemester`, {
        params: { uname, programme }
      }).then(r => setGroupSem(r.data));
  }, [programme]);

  useEffect(() => {
    if (uname && programme && group && semester)
      axios.get(`${API_BASE_URL}/BulkSms/count`, {
        params: { uname, programme, group, semester }
      }).then(r => setCount(r.data));
  }, [group, semester]);

  const sendSms = async () => {
    await axios.post(`${API_BASE_URL}/BulkSms/enqueue`, {
      uname,
      programme,
      group,
      semester,
      message
    });
    alert(`✅ SMS queued for ${count} students`);
  };

  return (
    
    <div style={{ padding: 20 }}>
         <HeaderTop />
              <RightSidebar />
              <LeftSidebar />
      <h2>Student Bulk SMS</h2>

      <select onChange={e => setUname(e.target.value)}>
        <option value="">Select Uname</option>
        {unames.map(x => <option key={x}>{x}</option>)}
      </select>

      <select onChange={e => setProgramme(e.target.value)}>
        <option value="">Select Programme</option>
        {programmes.map(x => <option key={x}>{x}</option>)}
      </select>

      <select onChange={e => setGroup(e.target.value)}>
        <option value="">Select Group</option>
        {[...new Set(groupSem.map(x => x.group))].map(x =>
          <option key={x}>{x}</option>
        )}
      </select>

      <select onChange={e => setSemester(e.target.value)}>
        <option value="">Select Semester</option>
        {[...new Set(groupSem.map(x => x.semester))].map(x =>
          <option key={x}>{x}</option>
        )}
      </select>

      <p><b>📱 Mobile Count:</b> {count}</p>

      <textarea
        placeholder="Message (use {MOBILE})"
        rows="5"
        onChange={e => setMessage(e.target.value)}
        style={{ width: "100%" }}
      />

      <button onClick={sendSms} disabled={!count}>
        Send SMS
      </button>
    </div>
  );
}
