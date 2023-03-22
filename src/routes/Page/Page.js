import React from "react";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TermsAndCondition from "../Pages/TermsAndConditions";
import AboutUs from "../Pages/Aboutus";
import ContactUs from "../Pages/Contactus";

function Page() {
  return (
    <div className="user-management bnash_qw">
      <div className="mb-3 newlinks_1">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="privacy-tab"
              data-toggle="tab"
              href="#privacy"
              role="tab"
              aria-controls="home"
              aria-selected="true"
            >
              Privacy Policy
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="terms-tab"
              data-toggle="tab"
              href="#terms"
              role="tab"
              aria-controls="terms"
              aria-selected="false"
            >
              Terms & Conditions
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="about-tab"
              data-toggle="tab"
              href="#about"
              role="tab"
              aria-controls="about"
              aria-selected="false"
            >
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="contact-tab"
              data-toggle="tab"
              href="#contact"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
            >
              Contact Us
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="privacy"
            role="tabpanel"
            aria-labelledby="privacy-tab"
          >
            <PrivacyPolicy />
          </div>
          <div
            className="tab-pane fade"
            id="terms"
            role="tabpanel"
            aria-labelledby="terms-tab"
          >
            <TermsAndCondition />
          </div>
          <div
            className="tab-pane fade"
            id="about"
            role="tabpanel"
            aria-labelledby="about-tab"
          >
            <AboutUs />
          </div>
          <div
            className="tab-pane fade"
            id="contact"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <ContactUs />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
