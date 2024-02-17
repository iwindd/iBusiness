import React from 'react'
import Selectize, { Option } from './selectize'
import { SelectizeProductFilter } from './action';
import { useStorage } from '@/storage';

interface ProductFieldProps {
  onSelected: (payload: Option) => void,
  
  addProductToCart?: (serial : string) => void,
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const ProductField = (props: ProductFieldProps) => {
  const { use, declare } = useStorage('ProductField');
  const [filter, onFilter] = React.useState<string>("1");
  const [options, setOptions] = React.useState<Option[]>(use('options', []));

  const filtering = async (filter: string) => {
    if (filter.length <= 0) return;
    const resp = await SelectizeProductFilter(filter);

    if (resp.success && resp.data && resp.data.length > 0) {
      setOptions((prevData) => {
        const currentTime = new Date().getTime(); 

        const newData = resp.data.map(p => ({
          label: p.title,
          value: p.serial,
          keywords: p.keywords,
          uptime: currentTime
        }));
      
        const uniqueOptions = newData.filter(newOption =>
          !prevData.some(prevOption => prevOption.value === newOption.value)
        );
      
        const updatedOptions = prevData.filter(prevOption =>
          !newData.some(newOption => newOption.value === prevOption.value)
        );
      

        const updatedOptionsWithTime = updatedOptions.map(option => ({
          ...option,
          uptime: currentTime 
        }));

        const allOptions = [...updatedOptionsWithTime, ...uniqueOptions];

        if (allOptions.length > 50) {
          allOptions.sort((a, b) => new Date(a.uptime).getTime() - new Date(b.uptime).getTime());
      
          allOptions.splice(0, allOptions.length - 50);
        }

        return allOptions;
      });
    }
  }

  const handleSelectChange = (newValue: Option | null) => {
    if (newValue) props.onSelected(newValue);
  };

  React.useEffect(() => {
    if (filtering){
      filtering(filter)
    }
  }, [filter])

  React.useEffect(() => declare("options", options), [options])

  return (
    <Selectize
      options={options}
      addProductToCart={props.addProductToCart}
      onKeyDown={props.onKeyDown}
      onChange={handleSelectChange}
      onFilter={onFilter}
      placeholder="ค้นหาสินค้า"
    />
  )
}

export default ProductField