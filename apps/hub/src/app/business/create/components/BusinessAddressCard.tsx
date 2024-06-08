"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardHeader, Divider, Box, Typography } from "@mui/material";

import useOnclickOutside from "react-cool-onclickoutside";
import PlacementAutoComplete from "./PlacementAutoComplete";
import { BusinessCreateChildForm } from "../page";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  clickableIcons: false,
  scrollwheel: true,
  disableDoubleClickZoom: true,
};

const getPinIcon = (): google.maps.Icon => {
  return {
    url: "/assets/images/pin.png",
    scaledSize: new google.maps.Size(50, 50),
  } as google.maps.Icon;
};

interface Latlng {
  lat: number;
  lng: number;
}

const BusinessAddressCard = ({setValue} : BusinessCreateChildForm) => {
  const [latlng, setLatlng] = useState<Latlng>({ lat: 0, lng: 0 });
  const [isControl, setControl] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<Latlng | null>(null);
  const [libraries] = useState<any[]>(["places"]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    setValue("latlng", JSON.stringify(latlng))
  }, [latlng])

  const onLoad = useCallback((map: google.maps.Map) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const center = new google.maps.LatLng(lat, lng);
        map.setCenter(center);
        setLatlng({ lat, lng });
        mapRef.current = map;
      }
    );
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  const toggleControl = () => setControl(!isControl);
  const ref = useOnclickOutside(() => setControl(false));

  const handleMapDoubleClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      setMarkerPosition({ lat, lng });
      setControl(false);
      setLatlng({ lat, lng });
    }
  };

  const onSearchSelect = (lat: number, lng: number) => {
    setControl(false);
    setLatlng({ lat, lng });
    setMarkerPosition({ lat, lng });
  };

  if (!isLoaded) return null;

  return (
    <Card ref={ref}>
      <CardHeader
        title="กรุณาเลือกที่อยู่"
        action={<PlacementAutoComplete onSelect={onSearchSelect} />}
      />
      <Divider />

      <Box sx={{ position: "relative" }}>
        {!isControl ? (
          <Box
            sx={{
              zIndex: 5,
              width: "100%",
              height: "100%",
              background: `rgba(0, 0, 0, 0.7)`,
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={toggleControl}
          >
            <Typography
              sx={{
                color: "white",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              คลิกเพื่อเปลี่ยนแปลง
            </Typography>
          </Box>
        ) : null}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={latlng}
          zoom={17}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onDblClick={handleMapDoubleClick}
        >
          {markerPosition && (
            <MarkerF
              position={markerPosition}
              icon={getPinIcon()}
              draggable
              onDragEnd={(event) => {
                const lat = event.latLng?.lat();
                const lng = event.latLng?.lng();
                if (lat !== undefined && lng !== undefined) {
                  setMarkerPosition({ lat, lng });
                }
              }}
            />
          )}
        </GoogleMap>
      </Box>
    </Card>
  );
};

export default BusinessAddressCard;
