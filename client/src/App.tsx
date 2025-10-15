import { useEffect, useRef } from "react";
import "./App.css";
import { BrowserMultiFormatReader } from "@zxing/library";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  useEffect(() => {
    const startCamera = async () => {
      try {
        codeReader.current = new BrowserMultiFormatReader();

        // List video devices
        const devices = await codeReader.current.listVideoInputDevices();
        console.log("Available camera devices:");
        devices.forEach((device, index) => {
          console.log(`${index}: ${device.label} (id: ${device.deviceId})`);
        });

        // Choose the 2nd camera (index 1)
        const selectedDeviceId = devices[1]?.deviceId;

        if (!selectedDeviceId) {
          console.error("Second camera not found, using default camera");
        }

        // Start video stream on the selected camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Start barcode scanning from the same camera
        if (videoRef.current) {
          codeReader.current.decodeFromVideoDevice(
            selectedDeviceId || "",
            videoRef.current,
            (result) => {
              if (result) {
                console.log("Barcode detected:", result.getText());
                handleBarcode(result.getText());
              }
              // Ignore NotFoundException
              // if (err && err.name !== "NotFoundException") {
              //   console.error("ZXing error:", err);
              // }
            }
          );
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      // Cleanup video stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      codeReader.current?.reset();
    };
  }, []);
  const handleBarcode = async (barcodeData: string) => {
    try {
      console.log("Barcode detected:", barcodeData);

      // Send GET request to backend
      const response = await fetch(
        `/api/get-participant?barcode=${encodeURIComponent(barcodeData)}`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Participant data:", data);

      // 🔥 Do something with the data, e.g., show on UI
      alert(`Participant: ${data.name} | Status: ${data.status}`);
    } catch (err) {
      console.error("Error fetching participant:", err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded shadow-lg"
          style={{ width: "640px", height: "480px" }}
        />
      </div>
    </>
  );
}

export default App;
