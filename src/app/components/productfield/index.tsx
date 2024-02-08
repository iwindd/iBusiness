import React from 'react'
import Selectize, { Option } from './selectize'
import { SelectizeProductFilter } from './action';
import { useStorage } from '@/storage';

interface ProductFieldProps {
  onSelected: (payload: Option) => void
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
        const newData = resp.data.map(p => {
          return {
            label: p.title,
            value: p.serial,
            keywords: p.keywords,
          }
        })

        const uniqueNewData = newData.filter(newOption =>
          !prevData.some(prevOption => prevOption.value === newOption.value)
        );

        return [...prevData, ...uniqueNewData];
      })
    }
  }

  const handleSelectChange = (newValue: Option | null) => {
    if (newValue) props.onSelected(newValue);
  };

  React.useEffect(() => {
    filtering(filter)
  }, [filter, filtering])

  React.useEffect(() => declare("options", options), [options])

  return (
    <Selectize
      options={options}
      onChange={handleSelectChange}
      onFilter={onFilter}
      placeholder="ค้นหาสินค้า"
    />
  )
}

export default ProductField