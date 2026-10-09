import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import heart from "../../assets/images/shapes/heart-2-1.png";
import contactMessageService from "../../services/contactMessageService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  occupation: "",
  message: "",
};

const VolunteerForm = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Volunteer applications are stored as contact messages so they show up
    // in the admin Contact Messages section.
    const details = [
      formData.dateOfBirth && `Date of birth: ${formData.dateOfBirth}`,
      formData.address && `Address: ${formData.address}`,
      formData.occupation && `Occupation: ${formData.occupation}`,
      "",
      formData.message,
    ]
      .filter((line) => line !== false && line !== undefined)
      .join("\n")
      .trim();

    try {
      await contactMessageService.createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Volunteer application - ${formData.name}`.slice(0, 200),
        message: details,
        type: "general",
        preferredContactMethod: "email",
        source: "website",
        userAgent: navigator.userAgent,
      });
      setSubmitStatus("success");
      setFormData(emptyForm);
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="become-volunteer pt-120 pb-80">
      <Container>
        <Row>
          <Col lg={5}>
            <div className="become-volunteer__content mb-40">
              <div className="block-title">
                <p>
                  <img src={heart} width="15" alt="" />
                  Join Us Now
                </p>
                <h3>
                  Register yourself as <br /> our volunteer.
                </h3>
              </div>
              <p className="block-text mb-40 pr-10">
                Serve alongside Hope For All MENA as we equip local churches
                and reach communities across the Middle East and North Africa.
                Tell us a little about yourself and we will get in touch.
              </p>
              <ul className="list-unstyled ul-list-one">
                <li>Support training and discipleship programs</li>
                <li>Help with events and community outreach</li>
                <li>Share your skills with our ministry teams</li>
              </ul>
            </div>
          </Col>
          <Col lg={7}>
            <form
              className="contact-form-validated become-volunteer__form form-one mb-40"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <div className="form-control">
                  <label htmlFor="name" className="sr-only">
                    name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="email" className="sr-only">
                    email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="phone" className="sr-only">
                    phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="date-of-birth" className="sr-only">
                    date of birth
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    id="date-of-birth"
                    placeholder="Date of Birth"
                    onFocus={(e) => (e.target.type = "date")}
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="address" className="sr-only">
                    address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="occupation" className="sr-only">
                    occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    placeholder="Occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-control form-control-full">
                  <label htmlFor="message" className="sr-only">
                    message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Why would you like to volunteer? (minimum 10 characters)"
                    value={formData.message}
                    onChange={handleInputChange}
                    minLength={10}
                    maxLength={1500}
                    required
                  ></textarea>
                </div>
                <div className="form-control form-control-full">
                  <button type="submit" className="thm-btn " disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Register Now"}
                  </button>
                </div>
              </div>
            </form>
            <div className="result" role="status">
              {submitStatus === "success" && (
                <p className="text-success">
                  Thank you for registering! We will contact you soon.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-danger" style={{ whiteSpace: "pre-line" }}>
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default VolunteerForm;
