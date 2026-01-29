import { useEffect, useState, useRef } from "react";
import axios from "axios";
import HeaderTop from "../components/HeaderTop";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

export default function StudentBulkSms() {
  const [uname, setUname] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const [unames, setUnames] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [selectedProgrammes, setSelectedProgrammes] = useState([]);
  const [showProgrammeDropdown, setShowProgrammeDropdown] = useState(false);
  const programmeRef = useRef(null);

  /* 🔄 Loader + Status */
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const pollingRef = useRef(null);

  const [templateCodes, setTemplateCodes] = useState([]);
const [templateCode, setTemplateCode] = useState("");


  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadFilters();
    loadCount();
    loadTemplateCodes();
  }, []);

  /* ---------------- CLICK OUTSIDE PROGRAMME ---------------- */
  useEffect(() => {
    const handleOutside = (e) => {
      if (programmeRef.current && !programmeRef.current.contains(e.target)) {
        setShowProgrammeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const loadTemplateCodes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/tempcodes`);
      setTemplateCodes(res.data || []);
    } catch {
      toast.error("Failed to load template codes");
    }
  };

  const loadTemplateContent = async (code) => {
    if (!code) {
      setMessage("");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/TemplateContent/${code}`);
      setMessage(res.data || "");
    } catch {
      toast.error("Failed to load template content");
      setMessage("");
    }
  };


  /* ---------------- LOAD FILTERS ---------------- */
  const loadFilters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/filters`);
      setUnames(res.data.unames || []);
      setProgrammes(res.data.programmes || []);
      setSemesters(res.data.semesters || []);
    } catch {
      toast.error("Failed to load dropdowns");
    }
  };

  /* ---------------- PROGRAMME TOGGLE ---------------- */
  const toggleProgramme = (prog) => {
    setSelectedProgrammes((prev) =>
      prev.includes(prog)
        ? prev.filter((x) => x !== prog)
        : [...prev, prog]
    );
  };

  /* ---------------- COUNT ---------------- */
  const loadCount = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/BulkSms/count`, {
        params: {
          uname: uname || null,
          semester: semester || null,
          programmes:
            selectedProgrammes.length > 0
              ? selectedProgrammes.join(",")
              : null,
        },
      });
      setCount(res.data);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    loadCount();
  }, [uname, semester, selectedProgrammes]);

  /* ---------------- POLLING STATUS ---------------- */
  const startPolling = () => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/BulkSms/status-summary`
        );
        setSummary(res.data);

        if (res.data.inProgress === 0) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setLoading(false);

          toast.success(
            `✅ Sent: ${res.data.sent}, ❌ Failed: ${res.data.failed}`
          );
        }
      } catch {
        clearInterval(pollingRef.current);
        setLoading(false);
        toast.error("Failed to fetch SMS status");
      }
    }, 3000);
  };

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

    setLoading(true);
    setSummary(null);

    try {
      await axios.post(`${API_BASE_URL}/BulkSms/enqueue`, {
        uname: uname || null,
        semester: semester || null,
        programmes: selectedProgrammes,
        message,
      });

      toast.success("📨 SMS queued successfully");
      startPolling();
    } catch {
      setLoading(false);
      toast.error("Failed to queue SMS");
    }
  };

  /* ---------------- RESET ---------------- */
  const resetFilters = () => {
    setUname("");
    setSemester("");
    setSelectedProgrammes([]);
    setTemplateCode("");
    setMessage("");
    setSummary(null);
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
                  <label>University</label>
                  <select
                    className="form-control"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  >
                    <option value="">All</option>
                    {unames.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>

                <div
                  className="col-md-4"
                  ref={programmeRef}
                  style={{ position: "relative" }}
                >
                  <label>Course</label>
                  <button
                    type="button"
                    className="form-control text-start"
                    onClick={() =>
                      setShowProgrammeDropdown((s) => !s)
                    }
                  >
                    {selectedProgrammes.length
                      ? selectedProgrammes.join(", ")
                      : "All"}
                  </button>

                  {showProgrammeDropdown && (
                    <div
                      className="border rounded p-2 bg-white"
                      style={{
                        position: "absolute",
                        zIndex: 1000,
                        width: "100%",
                        maxHeight: 180,
                        overflowY: "auto",
                      }}
                    >
                      {programmes.map((p, idx) => (
                        <div key={p} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`prog-${idx}`}
                            checked={selectedProgrammes.includes(p)}
                            onChange={() => toggleProgramme(p)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`prog-${idx}`}
                          >
                            {p}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <label>Course Status</label>
                  <select
                    className="form-control"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="">All</option>
                    {semesters.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Template Code</label>
                  <select
                    className="form-control"
                    value={templateCode}
                    onChange={(e) => {
                      setTemplateCode(e.target.value);
                      loadTemplateContent(e.target.value);
                    }}
                  >
                    <option value="">Select Template</option>
                    {templateCodes.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="alert alert-info">
                <b>📱 Total Mobile Numbers :</b> {count}
              </div>

              <div className="mb-3">
                <label>SMS Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-primary"
                  onClick={sendSms}
                  disabled={loading}
                >
                  Send SMS
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={resetFilters}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>

              {/* LOADER */}
              {loading && (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary"></div>
                  <p>Sending SMS… please wait</p>
                </div>
              )}

              {/* SUMMARY */}
              {summary && !loading && (
                <div className="alert alert-success">
                  <b>Total:</b> {summary.total} |
                  <b> Sent:</b> {summary.sent} |
                  <b> Failed:</b> {summary.failed}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
