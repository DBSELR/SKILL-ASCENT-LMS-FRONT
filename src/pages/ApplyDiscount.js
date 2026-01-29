import { useEffect, useState } from "react";
import axios from "axios";
import HeaderTop from "../components/HeaderTop";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

export default function ApplyDiscount() {
  const [courses, setCourses] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [mobile, setMobile] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coupon, setCoupon] = useState("");

  const [offerPrice, setOfferPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const courseRes = await axios.get(
        `${API_BASE_URL}/student/LandingFeeCalculation`
      );
      const couponRes = await axios.get(
        `${API_BASE_URL}/student/coupons`
      );

      setCourses(courseRes.data || []);
      setCoupons(couponRes.data || []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  /* ---------------- RESET FUNCTION ---------------- */
const resetFields = () => {
  setStudentName("");
  setMobile("");
  setSelectedCourse(null);
  setCoupon("");
  setOfferPrice(0);
  setDiscount(0);
  setDiscountPercent(0);
  setFinalPrice(0);
};

  /* ---------------- CALCULATE DISCOUNT ---------------- */
  const calculateDiscount = async (course, couponCode) => {
    if (!course || !couponCode) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/student/calculate`,
        {
          params: {
            price: course.offerFee, // ✅ Running offer price
            coupon: couponCode
          }
        }
      );
      setDiscountPercent(Number(res.data.discountPercent || 0));
      setDiscount(Number(res.data.discountAmount || 0));
      setFinalPrice(Number(res.data.finalPrice || course.offerFee));
    } catch {
      toast.error("Failed to calculate discount");
    }
  };

  /* ---------------- SAVE ---------------- */
const save = async () => {
  if (!studentName || !mobile || !selectedCourse) {
    toast.warning("Please fill all required fields");
    return;
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/student/SaveAppliedDiscount`, {
      studentName,
      mobile,
      programmeId: selectedCourse.programmeId,
      coursePrice: selectedCourse.offerFee,
      couponCode: coupon,
      discountPercent,
      discountAmount: discount,
      finalPrice
    });

    if (res.data.message.includes("already applied")) {
      toast.warning(res.data.message);
    } else {
      toast.success(res.data.message);

      // RESET CONTROLS
      setStudentName("");
      setMobile("");
      setSelectedCourse(null);
      setCoupon("");
      setOfferPrice(0);
      setDiscount(0);
      setDiscountPercent(0);
      setFinalPrice(0);
    }
  } catch {
    toast.error("Failed to apply discount");
  }
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
              <h3 className="mb-3">🎓 Apply Course Discount</h3>

              {/* STUDENT DETAILS */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Student Name</label>
                  <input
                    className="form-control"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label>Mobile Number</label>
                  <input
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              {/* COURSE + COUPON */}
              <div className="row mb-3">
                {/* COURSE SELECT */}
<div className="col-md-4">
  <label>Course</label>
  <select
    className="form-control"
    value={selectedCourse?.programmeId || ""} // ✅ bind value
    onChange={(e) => {
      const c = courses.find(
        (x) => x.programmeId == e.target.value
      );

      setSelectedCourse(c);
      setOfferPrice(c?.offerFee || 0);
      setFinalPrice(c?.offerFee || 0);
      setDiscount(0);
      setDiscountPercent(0);
      setCoupon("");
    }}
  >
    <option value="">Select Course</option>
    {courses.map((c) => (
      <option key={c.programmeId} value={c.programmeId}>
        {c.programmeName}
      </option>
    ))}
  </select>
</div>


                <div className="col-md-4">
                  <label>Coupon Code</label>
                  <select
                    className="form-control"
                    value={coupon}
                    onChange={(e) => {
                      const selectedCoupon = e.target.value;
                      setCoupon(selectedCoupon);
                      calculateDiscount(selectedCourse, selectedCoupon);
                    }}
                    disabled={!selectedCourse}
                  >
                    <option value="">Select Coupon</option>
                    {coupons.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RUNNING OFFER */}
              {selectedCourse && (
                <div className="alert alert-info">
                  <b>🔥 Running Offer:</b> {selectedCourse.runningOffer}
                </div>
              )}

              {/* PRICE DETAILS */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label>Running Offer Price</label>
                  <input
                    className="form-control"
                    value={offerPrice.toFixed(2)}
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label>Discount Amount</label>
                  <input
                    className="form-control"
                    value={discount.toFixed(2)}
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label>Final Price</label>
                  <input
                    className="form-control fw-bold"
                    value={finalPrice.toFixed(2)}
                    readOnly
                  />
                </div>
              </div>

              {/* ACTION */}
              <button className="btn btn-primary" onClick={save}>
                Apply Discount
              </button>
               <button className="btn btn-secondary" onClick={resetFields}>
    Reset
  </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
