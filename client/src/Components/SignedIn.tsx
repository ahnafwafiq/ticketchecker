import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button, Tabs } from "@mantine/core";
import { socket } from "../socket";
import Participants from "./Participants";
import InstallPWAButton from "./InstallPWAButton";

function SignedIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | null>("scanner");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  useEffect(() => {
    // Web Socket connection
    socket.on("connect", () => {
      console.log("Web Socket Connected ✅");
    });
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
    // console.log("Barcode detected:", barcodeData);

    // Send barcode to backend
    if (barcodeData.length === 8) {
      socket.emit("barcode_detected", barcodeData);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="scanner">Scanner</Tabs.Tab>
            <Tabs.Tab value="participants">Participants</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="scanner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded shadow-lg"
              style={{ width: "640px", height: "480px" }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="participants">
            <Participants />
          </Tabs.Panel>
        </Tabs>
        <Button
          loading={loading}
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            supabase.auth.signOut();
          }}
        >
          Sign Out
        </Button>
        <InstallPWAButton />
      </div>
    </>
  );
}

export default SignedIn;
