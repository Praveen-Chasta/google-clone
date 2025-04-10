import { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { IoMdSearch } from "react-icons/io";
import { IoImages } from "react-icons/io5";
import axios from "axios";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { BiHomeAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiNumberSquareSixBold } from "react-icons/pi";
import "../App.css";

const HomePage = () => {
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [lenseShowModal, setLenseShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lenseSearchResults, setLenseSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [fullscreen] = useState(true);

  const [products, setProducts] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  const clearAllResults = () => {
    setSearchResults([]);
    setLenseSearchResults([]);
    setProducts([]);
  };

   {/* Mic Function */}

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    setShow(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputRef.current.value = transcript;
      triggerSearch(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error: " + event.error);
      setShow(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setShow(false);
    };

    recognition.start();
  };

   {/* Manually Enter Search Function Function */}

  const triggerSearch = async (searchTerm) => {
    if (searchTerm.trim()) {
      clearAllResults();
      setLoading(true);
      try {
        const response = await axios.get(
          `https://apis.ccbp.in/wiki-search?search=${searchTerm}`
        );
        setSearchResults(response.data.search_results);
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch(inputRef.current.value);
    }
  };

  {/* Desktop Drag and Drop Function */}

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Image selected:", file.name);
      clearAllResults();
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        setLenseSearchResults(response.data);
        setLenseShowModal(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log("Image dropped:", file.name);
      clearAllResults();
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        setSearchResults(response.data);
        setLenseShowModal(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

   {/* Search Function */}

  const handleSearch = async () => {
    if (!imageUrl.trim()) {
      alert("Please paste an image URL");
      return;
    }

    clearAllResults();
    setLoading(true);
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setLenseSearchResults(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  {/* Mobile Camera Functionality */}

  const handleCaptureImage = async () => {
    try {
   
      clearAllResults();

      setLoading(true);

      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        allowEditing: true,
        saveToGallery: false,
      });

      setCapturedImage(image.webPath || null);

      const response = await axios.get("https://fakestoreapi.com/products");
  
      setProducts(response.data);
      console.log("Fetched Products:", response.data);
  
    } catch (error) {
      console.error("Error capturing image or fetching data:", error);
    } finally {
   
      setLoading(false);
    }
  };
  

  return (
    <div className="homepage-main-container d-flex flex-column justify-content-center align-items-center text-white">
      
      {/* Desktop Header */}
      <div className="header-desktop-section w-100 ">
        <span className="me-3">Gmail</span>
        <span className="me-3">Images</span>
        <img src="/labs.svg" className="me-3" />
        <img src="/praveen.jpg" className="profile-pic" />
      </div>
      
      {/* Mobile Header */}
      <div className="header-mobile-section w-100">
        <div>
          <BiHomeAlt2 className="react-icon" />
        </div>
        <div>
          <img src="/praveen.jpg" className="profile-pic me-3" />
          <PiNumberSquareSixBold className="react-icon me-2" />
          <BsThreeDotsVertical className="react-icon " />
        </div>
      </div>

      <img src="/google-1.svg" alt="Google Logo" className="google-logo" />

      <div className="search-bar d-flex align-items-center w-100 justify-content-center">
        <div className="search-box d-flex align-items-center w-100 px-3">
          <IoMdSearch className="text-[#202124] me-2 google-mic" />
           
          {/* Text Area */}

          <input
            type="text"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className="form-control bg-transparent border-0 shadow-none search-element"
            placeholder="Search Google"
          />

          {/* Google Mic */}

          <img
            src="/png-transparent-google-mic-logo-icon-removebg-preview.png"
            alt="Google mic"
            className="google-mic"
            onClick={startListening}
            style={{ cursor: "pointer" }}
          />

          {/* Image for mobile screens */}
          <img
            src="/Google_Lens_Icon.svg.png"
            alt="Google Lens Mobile"
            className="google-lense-mobile"
            onClick={handleCaptureImage}
          />

          {/* Image for Desktop screens */}

          <img
            src="/Google_Lens_Icon.svg.png"
            alt="Google Lens"
            className="google-lense-desktop"
            onClick={() => setLenseShowModal(true)}
          />

          {lenseShowModal && (
            <div className="lense-modal-overlay">
              <div className="lense-modal-content">
                <h3>Search any image with Lens</h3>
                <div
                  className="drop-area"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <IoImages />
                  <p>
                    Drag an image here or{" "}
                    <label htmlFor="fileInput" className="upload-link">
                      upload a file
                    </label>
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>

                <div className="divider">OR</div>

                <div className="url-search">
                  <input
                    type="text"
                    placeholder="Paste image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />

                  <button onClick={handleSearch}>Search</button>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setLenseShowModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/*  recent tabs  */}
      <div className="add-shortcut mt-4 overflow-auto scroll-wrapper">
        <div className="shortcut-container d-inline-flex justify-content-center">
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/facebook.svg"
              alt="Facebook"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Facebook</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/dribble.svg"
              alt="Dribble"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Dribble</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/instagram.svg"
              alt="Instagram"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Instagram</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/linkedin.svg"
              alt="Linkedin"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Linkedin</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/pinterest.svg"
              alt="Pinteresr"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Pinterest</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/spotify.svg"
              alt="Spotify"
              className="google-shortcuts"
            />
            <span className="shortcut-text">Spotify</span>
          </div>
          <div className="shortcut-icon d-flex flex-column justify-content-center align-items-center">
            <img
              src="/youtube.svg"
              alt="YouTube"
              className="google-shortcuts"
            />
            <span className="shortcut-text">YouTube</span>
          </div>
        </div>
      </div>

      {/*  Search Input Data */}
      <div>
        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 ">
            {searchResults.map((result, index) => (
              <div key={index} className="result-item-custom">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="result-title"
                >
                  {result.title}
                </a>
                <p className="result-link">{result.link}</p>
                <p className="result-description">{result.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Drag and Drop  Data */}
      <div className="drag-drop-result">
          <div className="row mt-5">
            {lenseSearchResults.map((result, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="result-card-dark p-3 h-100 rounded shadow-sm">
                  <div className="text-center">
                    <img
                      src={result.image}
                      className="img-fluid result-img mb-3"
                      alt={`item-${index}`}
                    />
                  </div>
                  <h5 className="result-title text-white fw-semibold mb-2 text-start">
                    {result.title}
                  </h5>
                  <p className="result-description text-light text-start">
                    {result.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>
      
      {/* Mobile Click Image */}
      <div className="drag-drop-result">
          <div className="row mt-5">
            {products.map((result, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="result-card-dark p-3 h-100 rounded shadow-sm">
                  <div className="text-center">
                    <img
                      src={result.image}
                      className="img-fluid result-img mb-3"
                      alt={`item-${index}`}
                    />
                  </div>
                  <h5 className="result-title text-white fw-semibold mb-2 text-start">
                    {result.title}
                  </h5>
                  <p className="result-description text-light text-start">
                    {result.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* 🎤 Bootstrap Modal with Mic and Dots */}
      <Modal
        show={show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Body
          className="d-flex flex-column align-items-center justify-content-center bg-dark text-white"
          style={{ height: "100vh" }}
        >
          <img
            src="/png-transparent-google-mic-logo-icon-removebg-preview.png"
            alt="Mic"
            className="big-mic"
            style={{ width: "80px", marginBottom: "30px" }}
          />
          <div className="dots d-flex gap-2">
            <div
              className="dot-1 rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                animation: "blink 1s infinite alternate",
              }}
            ></div>
            <div
              className="dot-2 rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                animation: "blink 1.2s infinite alternate",
              }}
            ></div>
            <div
              className="dot-3 rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                animation: "blink 1.4s infinite alternate",
              }}
            ></div>
            <div
              className="dot-4 rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                animation: "blink 1.6s infinite alternate",
              }}
            ></div>
          </div>
          <p className="mt-4 fs-5">Listening...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
