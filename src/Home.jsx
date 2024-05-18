import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
function Home() {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [showModal, setShowModal] = useState(false);
  //   const [userData, setUserData] = useState("");

  const id = sessionStorage.getItem("Id");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    position: "",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!id) {
      navigate("/login");
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/display/${id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleDeleteProfile = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/delete-profile/${id}`)
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your profile has been deleted.",
                icon: "success",
              }).then(() => {
                // navigate("/home");
                logout();
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Failed to delete profile. Please try again later.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting profile:", error);
            Swal.fire({
              title: "Error!",
              text: "An unexpected error occurred. Please try again later.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleUpdate = () => {
    axios
      .post(`http://localhost:3001/update-profile/${id}`, userData)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Profile updated successfully!",
            showConfirmButton: false,
            timer: 2200,
          });
          closeModal();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to update profile. Please try again later.",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while updating profile. Please try again later.",
        });
      });
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfwidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfwidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfwidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("details.pdf");
    });
  };
  return (
    <div className="container mt-5">
      <div className="row d-flex justify-content-center" ref={pdfRef}>
        <div className="col-md-7">
          <div className="card p-3 py-4">
            <div className="text-center">
              <h2 style={{ float: "right" }} onClick={logout}>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
              </h2>
              <img
                src="https://i.imgur.com/bDLhJiP.jpg"
                width="100"
                className="rounded-circle"
                alt="Profile Picture"
              />
            </div>

            <div className="text-center mt-3">
              <span className="bg-secondary p-1 px-4 rounded text-white">
                {userData.email ?? "No Records"}
              </span>
              <h5 className="mt-2 mb-0"> {userData.name ?? "No Records"}</h5>
              <span> {userData.position ?? "No Records"}</span>

              <div className="px-4 mt-1">
                <p className="fonts">{userData.about ?? "No Records"}</p>
              </div>

              <ul className="social-list">
                <li>
                  <i className="fa fa-facebook"></i>
                </li>
                <li>
                  <i className="fa fa-dribbble"></i>
                </li>
                <li>
                  <i className="fa fa-instagram"></i>
                </li>
                <li>
                  <i className="fa fa-linkedin"></i>
                </li>
                <li>
                  <i className="fa fa-google"></i>
                </li>
              </ul>

              <div className="buttons">
                <button
                  className="btn btn-outline-primary px-4"
                  onClick={openModal}
                >
                  Edit Profile
                </button>

                <button
                  class="btn btn-primary px-4 ms-3"
                  onClick={handleDeleteProfile}
                >
                  Delete Profile
                </button>

                <button class="btn btn-primary px-4 ms-3" onClick={downloadPDF}>
                  Download PDF
                </button>
                {/* Bootstrap modal */}
                <div
                  className={`modal fade ${showModal ? "show" : ""}`}
                  style={{ display: showModal ? "block" : "none" }}
                  tabIndex="-1"
                  role="dialog"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Profile</h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                          onClick={closeModal}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <label htmlFor="name">
                              <strong>Name</strong>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Name"
                              autoComplete="off"
                              name="name"
                              className="form-control rounded-0"
                              value={userData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email">
                              <strong>Email</strong>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Email"
                              autoComplete="off"
                              name="email"
                              className="form-control rounded-0"
                              value={userData.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="position">
                              <strong>Position</strong>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Position"
                              name="position"
                              className="form-control rounded-0"
                              value={userData.position}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="password">
                              <strong>About</strong>
                            </label>
                            <textarea
                              placeholder="Enter About"
                              name="about"
                              className="form-control rounded-0"
                              value={userData.about}
                              onChange={handleChange}
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-outline-primary px-4"
                          data-dismiss="modal"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleUpdate}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of Bootstrap modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
