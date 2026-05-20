"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      termsAgreement: formData.get("termsAgreement") === "on",
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      const result = raw
        ? (JSON.parse(raw) as {
            success?: boolean;
            message?: string;
            error?: string;
          })
        : { success: false, error: "Empty response from server." };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            result.message ??
            "Failed to submit application. Please try again."
        );
      }

      formElement.reset();
      alert(result.message ?? "Application submitted successfully.");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit application. Please try again.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="chreso-form-wrapper">
      <div className="chreso-form-header">
        <h2>Accommodation Application Form</h2>
        <p>
          Please provide precise records to request and reserve university
          housing provisions
        </p>
      </div>

      <form id="chresoAccommodationForm" onSubmit={handleSubmit}>
        <div className="chreso-form-section">
          <h3 className="chreso-section-title">Student Details</h3>
          <div className="chreso-section-body">
            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Full Name <span>*</span>
              </label>
              <input
                type="text"
                name="student_name"
                className="chreso-input"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Date of Birth <span>*</span>
              </label>
              <input type="date" name="dob" className="chreso-input" required />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Student Number <span>*</span>
              </label>
              <input
                type="text"
                name="student_number"
                className="chreso-input"
                placeholder="e.g. CU-2026-XXXX"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Gender <span>*</span>
              </label>
              <select name="gender" className="chreso-select" required>
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Year of Study <span>*</span>
              </label>
              <select name="year_of_study" className="chreso-select" required>
                <option value="">-- Select Year --</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Marital Status <span>*</span>
              </label>
              <select name="marital_status" className="chreso-select" required>
                <option value="">-- Select Status --</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Academic Program <span>*</span>
              </label>
              <input
                type="text"
                name="program"
                className="chreso-input"
                placeholder="e.g. Business Administration"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                NRC / ID Number <span>*</span>
              </label>
              <input
                type="text"
                name="nrc_id"
                className="chreso-input"
                placeholder="e.g. XXXXXX/XX/X"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Nationality <span>*</span>
              </label>
              <input
                type="text"
                name="nationality"
                className="chreso-input"
                placeholder="e.g. Zambian"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Accommodation Type &amp; Rate <span>*</span>
              </label>
              <select name="type_rate" className="chreso-select" required>
                <option value="">-- Select Preference --</option>
                <option value="City - 2 Per Room (K2,000)">
                  City Campus: 2 Per Room - K2,000/mo
                </option>
                <option value="City - 4 Per Room (K1,700)">
                  City Campus: 4 Per Room - K1,700/mo
                </option>
                <option value="City - 6 Per Room (K1,500)">
                  City Campus: 6 Per Room - K1,500/mo
                </option>
                <option value="City - 8 Per Room (K1,300)">
                  City Campus: 8 Per Room - K1,300/mo
                </option>
                <option value="City - 10 Per Room (K1,200)">
                  City Campus: 10 Per Room - K1,200/mo
                </option>
                <option value="City - 12 Per Room (K1,000)">
                  City Campus: 12 Per Room - K1,000/mo
                </option>
                <option value="Copperbelt - 6 Per Room (K800)">
                  Copperbelt Campus: 6 Per Room - K800/mo
                </option>
                <option value="Makeni - 4 Per Room (K500)">
                  Makeni Campus: 4 Per Room - K500/mo
                </option>
              </select>
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Email Address <span>*</span>
              </label>
              <input
                type="email"
                name="email_address"
                className="chreso-input"
                placeholder="student@domain.edu"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Contact Phone Number <span>*</span>
              </label>
              <input
                type="tel"
                name="contact_number"
                className="chreso-input"
                placeholder="e.g. +260XXXXXXXXX"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Academic Intake Period <span>*</span>
              </label>
              <input
                type="text"
                name="intake"
                className="chreso-input"
                placeholder="e.g. January / June Intake"
                required
              />
            </div>

            <div className="chreso-field-col-50">
              <label className="chreso-label">
                Residential / Permanent Physical Address <span>*</span>
              </label>
              <textarea
                name="address"
                className="chreso-textarea"
                placeholder="Enter complete physical address details"
                required
              />
            </div>
          </div>
        </div>

        <div className="chreso-split-container">
          <div className="chreso-split-block">
            <div className="chreso-form-section">
              <h3 className="chreso-section-title">Sponsor Details</h3>
              <div className="chreso-section-body">
                <div className="chreso-field-col-100">
                  <label className="chreso-label">
                    Name of Sponsor <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="sponsor_name"
                    className="chreso-input"
                    required
                  />
                </div>
                <div className="chreso-field-col-100">
                  <label className="chreso-label">
                    Sponsor Contact Number <span>*</span>
                  </label>
                  <input
                    type="tel"
                    name="sponsor_phone"
                    className="chreso-input"
                    required
                  />
                </div>
                <div
                  className="chreso-field-col-100"
                  style={{ marginBottom: 0 }}
                >
                  <label className="chreso-label">
                    Sponsor Email Address <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="sponsor_email"
                    className="chreso-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="chreso-split-block">
            <div className="chreso-form-section">
              <h3 className="chreso-section-title">Next of Kin Details</h3>
              <div className="chreso-section-body">
                <div className="chreso-field-col-100">
                  <label className="chreso-label">
                    Name of Next of Kin <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="kin_name"
                    className="chreso-input"
                    required
                  />
                </div>
                <div className="chreso-field-col-100">
                  <label className="chreso-label">
                    Contact Phone Number <span>*</span>
                  </label>
                  <input
                    type="tel"
                    name="kin_phone"
                    className="chreso-input"
                    required
                  />
                </div>
                <div
                  className="chreso-field-col-100"
                  style={{ marginBottom: 0 }}
                >
                  <label className="chreso-label">
                    Email Address <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="kin_email"
                    className="chreso-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chreso-notes-box">
          <h4>Important Information Notice (NB):</h4>
          <ul className="chreso-notes-list">
            <li>
              Reservation of a room is confirmed strictly upon receipt of valid
              payment.
            </li>
            <li>
              Allocation of spaces is processed strictly on a{" "}
              <strong>First Come, First Served</strong> basis.
            </li>
            <li>
              There is a strict <strong>NO Refund</strong> policy of payment
              after a successful reservation has been logged.
            </li>
            <li>
              The University administration reserves absolute rights to assign
              and configure Accommodation Arrangements for all resident
              students.
            </li>
          </ul>

          <label className="chreso-checkbox-container">
            I hereby declare that the information provided is correct and I
            explicitly agree to the rules and terms listed above.
            <input type="checkbox" name="termsAgreement" required />
            <span className="chreso-checkmark"></span>
          </label>
        </div>

        <div className="chreso-form-actions">
          <button
            type="submit"
            className="chreso-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "SUBMITTING..."
              : "Submit Accommodation Application"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .chreso-form-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          color: #2c3e50;
          line-height: 1.5;
          max-width: 950px;
          margin: 40px auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .chreso-form-wrapper *,
        .chreso-form-wrapper *::before,
        .chreso-form-wrapper *::after {
          box-sizing: border-box;
        }

        .chreso-form-header {
          text-align: center;
          margin-bottom: 35px;
          border-bottom: 3px solid #1b5e20;
          padding-bottom: 15px;
        }

        .chreso-form-header h2 {
          color: #1b5e20;
          font-size: 26px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.75px;
          font-weight: 700;
        }

        .chreso-form-header p {
          color: #666666;
          margin: 6px 0 0 0;
          font-size: 14px;
        }

        .chreso-form-section {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          margin-bottom: 30px;
          overflow: hidden;
        }

        .chreso-section-title {
          background-color: #f1f8e9;
          color: #1b5e20;
          margin: 0;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 700;
          border-bottom: 1px solid #d0e7b7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chreso-section-body {
          padding: 20px;
          font-size: 0;
        }

        .chreso-field-col-100 {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          padding: 0 10px;
          font-size: 14px;
          margin-bottom: 18px;
        }

        .chreso-field-col-50 {
          display: inline-block;
          vertical-align: top;
          width: 50%;
          padding: 0 10px;
          font-size: 14px;
          margin-bottom: 18px;
        }

        @media (max-width: 650px) {
          .chreso-field-col-50 {
            width: 100%;
          }

          .chreso-section-body {
            padding: 15px 10px;
          }
        }

        .chreso-label {
          display: block;
          font-weight: 600;
          color: #455a64;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .chreso-label span {
          color: #c62828;
        }

        .chreso-input,
        .chreso-select,
        .chreso-textarea {
          width: 100%;
          padding: 10px 12px;
          font-size: 14.5px;
          color: #333333;
          background-color: #ffffff;
          border: 1px solid #cfd8dc;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .chreso-input:focus,
        .chreso-select:focus,
        .chreso-textarea:focus {
          border-color: #1b5e20;
          box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.12);
        }

        .chreso-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .chreso-split-container {
          font-size: 0;
          margin: 0 -10px;
        }

        .chreso-split-block {
          display: inline-block;
          vertical-align: top;
          width: 50%;
          padding: 0 10px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .chreso-split-block {
            width: 100%;
            margin-bottom: 20px;
          }

          .chreso-split-block:last-child {
            margin-bottom: 0;
          }
        }

        .chreso-notes-box {
          background-color: #fffde7;
          border: 1px solid #fff59d;
          border-left: 5px solid #fbc02d;
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .chreso-notes-box h4 {
          margin-top: 0;
          margin-bottom: 12px;
          color: #f57f17;
          font-size: 15px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .chreso-notes-list {
          margin: 0;
          padding-left: 20px;
        }

        .chreso-notes-list li {
          margin-bottom: 8px;
          font-size: 13.5px;
          color: #5d4037;
        }

        .chreso-notes-list li:last-child {
          margin-bottom: 0;
        }

        .chreso-form-actions {
          text-align: center;
          margin-top: 25px;
          padding-bottom: 20px;
        }

        .chreso-submit-btn {
          background-color: #1b5e20;
          color: #ffffff;
          border: none;
          padding: 14px 35px;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s, transform 0.1s;
        }

        .chreso-submit-btn:hover {
          background-color: #144d18;
        }

        .chreso-submit-btn:active {
          transform: scale(0.98);
        }

        .chreso-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .chreso-checkbox-container {
          display: block;
          position: relative;
          padding-left: 28px;
          margin-top: 15px;
          cursor: pointer;
          font-size: 13.5px;
          user-select: none;
          color: #37474f;
          font-weight: 600;
        }

        .chreso-checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .chreso-checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #eceff1;
          border: 1px solid #b0bec5;
          border-radius: 3px;
        }

        .chreso-checkbox-container:hover input ~ .chreso-checkmark {
          background-color: #b0bec5;
        }

        .chreso-checkbox-container input:checked ~ .chreso-checkmark {
          background-color: #1b5e20;
          border-color: #1b5e20;
        }

        .chreso-checkmark::after {
          content: "";
          position: absolute;
          display: none;
        }

        .chreso-checkbox-container input:checked ~ .chreso-checkmark::after {
          display: block;
        }

        .chreso-checkmark::after {
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>
    </div>
  );
}
