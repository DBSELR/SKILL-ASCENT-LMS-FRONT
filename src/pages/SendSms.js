import { useEffect, useState } from "react";
import axios from "axios";
import HeaderTop from "../components/HeaderTop";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import Footer from "../components/Footer";
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
  const [groups, setGroups] = useState([]);
  const [semesters, setSemesters] = useState([]);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadFilters();
    loadCount(); // overall count on page load
  }, []);

  const loadFilters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/filters`);
      setUnames(res.data.unames || []);
      setProgrammes(res.data.programmes || []);
      setGroups(res.data.groups || []);
      setSemesters(res.data.semesters || []);
    } catch (err) {
      toast.error("Failed to load dropdowns");
    }
  };

  /* ---------------- COUNT (DYNAMIC) ---------------- */
  const loadCount = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/count`, {
        params: {
          uname: uname || null,
          programme: programme || null,
          group: group || null,
          semester: semester || null
        }
      });
      setCount(res.data);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    loadCount();
  }, [uname, programme, group, semester]);

  /* ---------------- SEND SMS ---------------- */
  const sendSms = async () => {
    if (!message.trim()) {
      toast.warning("Please enter SMS message");
      return;
    }

    if (count === 0) {
      toast.warning("No mobile numbers found");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/BulkSms/enqueue`, {
        uname: uname || null,
        programme: programme || null,
        group: group || null,
        semester: semester || null,
        message
      });

      toast.success(`✅ SMS queued for ${count} students`);
      setMessage("");
    }catch (err) {
  console.error(err);
  toast.error(
    err.response?.data?.message ||
    err.message ||
    "Failed to queue SMS"
  );
}

  };

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    setUname("");
    setProgramme("");
    setGroup("");
    setSemester("");
    loadCount();
  };

  return (
    <div id="main_content" className="font-muli theme-blush">
      <HeaderTop />
      <RightSidebar />
      <LeftSidebar />

      <div className="section-wrapper">
        <div className="page pt-0">
          <div className="section-body mt-3 pt-0">
            <div className="container-fluid">
              <h3 className="mb-3">📢 Student Bulk SMS</h3>

              {/* FILTERS */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label>Uname</label>
                  <select
                    className="form-control"
                    value={uname}
                    onChange={e => setUname(e.target.value)}
                  >
                    <option value="">All Unames</option>
                    {unames.map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Programme</label>
                  <select
                    className="form-control"
                    value={programme}
                    onChange={e => setProgramme(e.target.value)}
                  >
                    <option value="">All Programmes</option>
                    {programmes.map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Group</label>
                  <select
                    className="form-control"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option value="">All Groups</option>
                    {groups.map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Semester</label>
                  <select
                    className="form-control"
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COUNT */}
              <div className="alert alert-info">
                <b>📱 Total Mobile Numbers :</b> {count}
              </div>

              {/* MESSAGE */}
              <div className="mb-3">
                <label>SMS Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Use {MOBILE} if needed"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              {/* ACTIONS */}
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={sendSms}>
                  Send SMS
                </button>

                <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
