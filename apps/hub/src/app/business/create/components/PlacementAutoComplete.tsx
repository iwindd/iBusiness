import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface LocationPlace {
  value: string;
  label: string;
  description: string;
}

const PlacementAutoComplete = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  const [locations, setLocations] = React.useState<LocationPlace[]>([]);
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "th" },
    },
    debounce: 100,
  });

  const onSearchChange = (value: string) => {
    setValue(value);
    setLocations(() => {
      const result = data.reduce(
        (suggestion: google.maps.places.AutocompletePrediction[], current) => {
          let exists = suggestion.find(
            (item: google.maps.places.AutocompletePrediction) => {
              return (
                item.place_id === current.place_id ||
                item.structured_formatting.main_text ===
                  current.structured_formatting.main_text
              );
            }
          );
          if (!exists) {
            suggestion = suggestion.concat(current);
          }
          return suggestion;
        },
        []
      );

      return result.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text },
        } = suggestion;

        return {
          value: place_id,
          label: main_text,
          description: suggestion.description,
        };
      });
    });
  };

  const onSelectPlace = (place: LocationPlace | null) => {
    if (!place) return null;
    clearSuggestions();

    getGeocode({ address: place.description }).then((results) => {
      const latlng = getLatLng(results[0]);
      onSelect(latlng.lat, latlng.lng)
    });
  };

  return (
    <Autocomplete
      options={locations}
      disabled={!ready}
      blurOnSelect
      fullWidth
      onChange={(e, val) => onSelectPlace(val)}
      filterOptions={() => locations}
      sx={{ width: "15rem" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ค้นหา"
          value={value}
          fullWidth
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
    />
  );
};

export default PlacementAutoComplete;
