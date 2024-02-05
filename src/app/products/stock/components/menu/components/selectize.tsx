import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

export interface Option {
  label: string;
  value: string;
  keywords: string;
}

interface SelectizeProps {
  options: Option[];
  onChange: (newValue: Option | null) => void;
  placeholder: string;
  onFilter?: React.Dispatch<React.SetStateAction<string>>
}

const Selectize: React.FC<SelectizeProps> = (props) => {
  const filterOptions = (options: Option[], { inputValue }: { inputValue: string }) => {
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.keywords.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const onChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onFilter) {
      props.onFilter(event.target.value);
    }
  }, 500);

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
        />
      )}
    />
  );
};

export default Selectize