import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { isValidEAN } from '@/libs/utils';

export interface Option {
  label: string;
  value: string;
  keywords: string;
  uptime: number;
}

interface SelectizeProps {
  options: Option[];
  onChange: (newValue: Option | null) => void;
  placeholder: string;
  onFilter?: React.Dispatch<React.SetStateAction<string>>;
  addProductToCart?: (serial: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Selectize: React.FC<SelectizeProps> = (props) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filterOptions = (options: Option[], { inputValue }: { inputValue: string }) => {
    // Trim leading and trailing whitespace, and remove extra spaces
    const trimmedInputValue = inputValue.trim().replace(/\s+/g, ' ');
  
    if (!trimmedInputValue) return options; // If no input value after trimming, return all options
  
    const lowerCaseInput = trimmedInputValue.toLowerCase();
  
    return options.filter((option) => {
      // Custom comparison function for case-insensitive search
      const matchLabel = option.label.toLowerCase().includes(lowerCaseInput);
      const matchValue = option.value.toLowerCase().includes(lowerCaseInput);
      const matchKeywords = option.keywords.toLowerCase().includes(lowerCaseInput);
  
      return matchLabel || matchValue || matchKeywords;
    });
  };
  
  const optionChanger = debounce((value: string) => {
    if (props.onFilter) {
      props.onFilter(value);
    }
  }, 500);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (!isNaN(Number(inputValue)) && isValidEAN(inputValue)) {
      setBarcodeInput(inputValue);
      submitForm(inputValue);
    } else {
      optionChanger(inputValue);
    }
  };

  const submitForm = (inputValue: string) => {
    if (props.addProductToCart) {
      props.addProductToCart(inputValue);
    }
    setBarcodeInput(''); // Reset barcode input after successful submission
    if (inputRef.current) {
      inputRef.current.blur(); // Remove focus from the input field
    }
  };

  return (
    <Autocomplete
      options={props.options}
      getOptionLabel={(option) => option.label}
      onChange={(e, newValue) => props.onChange(newValue)}
      blurOnSelect
      filterOptions={filterOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={props.placeholder}
          onChange={onChange}
          value={barcodeInput} // Ensure the TextField value reflects the state
          fullWidth
          autoFocus
          onKeyDown={props.onKeyDown}
          inputRef={inputRef} // Set ref for the input field
        />
      )}
    />
  );
};

export default Selectize;