import React, { useState, ChangeEvent, FocusEvent } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

const MathTextField: React.FC<TextFieldProps> = ({
  onChange: propOnChange,
  onBlur: propOnBlur,
  onFocus: propOnFocus,
  value: propValue,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [beforeEval, setBefore] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (propOnChange) {
      try {
        event.target.value = eval(newValue) || "0";
        propOnChange(event);
      } catch (error) {
        event.target.value = "0";
        propOnChange(event);
      }
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    try {
      setBefore(inputValue);
      const result = eval(inputValue) || "0";
      setInputValue(result.toString());
    } catch (error) {

    }

    if (propOnBlur) {
      propOnBlur(event);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setInputValue(beforeEval);

    if (propOnFocus) {
      propOnFocus(event);
    }
  };

  return (
    <TextField
      type="text"
      {...props}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
};

export default MathTextField;
