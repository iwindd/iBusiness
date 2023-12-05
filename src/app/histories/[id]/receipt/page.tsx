"use client";
import React, { useMemo } from 'react'
import PreviewReceipt from './components/preview'
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { v4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { getDesigns } from './action';
import ConfirmButton from '@/app/components/confirm_button';
import DesignDialog, { Design } from './components/Dialog';

export interface Field {
  id: string,
  fId: string,
  title: string
}

const FieldCompo = ({f, onRemoveField, setFields} : {
  f: Field,
  onRemoveField: (id: string) => void,
  setFields: React.Dispatch<React.SetStateAction<Field[]>>
}) => {
  const [title, setTitle] = React.useState<string>(f.title);

  return (
    <li key={f.fId} className='flex-col'>
      <div className=' px-2 flex justify-end'>
        <button className='text-xs' onClick={() => onRemoveField(f.fId)}>ลบ Field</button>
      </div>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder='หัวข้อ'
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={(e) => {
          setFields((fs) => {
            return fs.map((f2) => {
              if (f2.fId === f.fId) {
                return { ...f2, title };
              }
              return f2;
            });
          });
        }}
      />
    </li>
  )
}

const Receipt = () => {
  /* DETAILS */
  const [rows, setRows] = React.useState<{ id: string, state: boolean }[]>([]);
  const [fields, setFields] = React.useState<Field[]>([]);

  const onAddRow = () => setRows(rows => [...rows, { id: v4(), state: true }])
  const onRemoveRow = (id: string) => {
    setRows(rows => rows.filter(r => r.id != id))
    setFields(fields => fields.filter(f => f.id != id))
  }

  const { data, isLoading: isLoadingDesign } = useQuery({
    queryKey: ["OrderReceiptDesigns"],
    queryFn: async () => {
      return await getDesigns()
    }
  })

  const onRemoveField = (id: string) => setFields(fields => fields.filter(f => f.fId != id))
  const onAddField = (id: string) => setFields(fields => [...fields, { id: id, fId: v4(), title: `FIELD` }])

  const [design, setDesign] = React.useState<string>("-1");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("Title");
  const [subtitle, setSubTitle] = React.useState<string>("Subtitle");
  const [paragraph, setParagraph] = React.useState<string>("Paragraph");
  const [logo, setLogo] = React.useState<File | null>(null);
  const [cache, setCache] = React.useState<Design | null>();
  const [shouldCache, setShouldCache] = React.useState<boolean>(true);

  const designObj = useMemo(() => {
    return {
      title: title,
      subtitle: subtitle,
      paragraph: paragraph,
      rows: rows.length,
      fields: fields.map(f => {
        return {
          row: rows.findIndex(r => r.id == f.id) + 1,
          title: f.title
        }
      })
    }
  }, [title, subtitle, paragraph, rows, fields])

  React.useEffect(() => {
    const payload = data?.data?.find(d => String(d.id) == design);


    if (shouldCache) { setCache(designObj); setShouldCache(false) };
    if (design == "-1") setShouldCache(true);
    if (!payload && cache == null) return onClearDesign();
    const info: Design = payload?.design ? JSON.parse(payload.design as string) : cache;
    setTitle(info.title)
    setSubTitle(info.subtitle)
    setParagraph(info.paragraph)
    console.log('set info header', info.title, info.subtitle, info.paragraph);

    const FixDetails = async () => {
      const rrs = Array.from({ length: info.rows }, () => ({ id: v4(), state: true }));
      await setRows(() => rrs);
      setFields(() => {
        const newFields = info.fields.reduce((payload: Field[], f) => {
          const row = rrs[f.row - 1];
          if (row) {
            payload.push({
              id: row.id,
              fId: v4(),
              title: f.title,
            });
          }
          return payload;
        }, []);

        return newFields
      });
    }

    FixDetails()
  }, [design, cache, data, shouldCache, fields, paragraph, rows, subtitle, title, designObj])

  const onClearDesign = () => {
    setTitle("Title");
    setSubTitle("Subtitle");
    setParagraph("Paragraph");
    setLogo(null);
    setFields([]);
    setRows([]);
  }

  const onSaveDesign = () => {
    setIsOpen(true)
  }

  return (
    <>
      <DesignDialog
        target={design}
        state={isOpen}
        setState={setIsOpen}
        setDesign={setDesign}
        design={designObj}
        values={
          {
            title: data?.data?.find(d => String(d.id) == design)?.title as string
          }
        }
      />

      <div className="container flex gap-2">
        <div className='w-96 space-y-2'>
          <div className="divider">Design</div>
          <select className='select select-bordered w-full' value={design} onChange={(e) => setDesign(e.target.value)} disabled={isLoadingDesign}>
            <option value="-1">กำหนดเอง...</option>
            {data?.data ? (
              data.data.map((design) => {
                return (
                  <option value={design.id} key={design.id}>{design.title}</option>
                )
              })
            ) : (
              null
            )}
          </select>
          <div className="divider"></div>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className="bg-primary hover:bg-primary-focus flex w-full justify-between px-4 py-2 text-left text-sm font-medium outline-none transition-all">
                  <span>รายละเอียด</span>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="text-end">
                  <section>
                    {rows.map((row, rowIndex) => {
                      return (
                        <Disclosure defaultOpen={row.state} key={v4()}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="bg-base-200 hover:bg-base-300 flex w-full justify-between px-4 py-2 text-left text-sm font-medium outline-none transition-all">
                                <span>ROW : {rowIndex + 1}</span>
                                <ChevronUpIcon
                                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-2 px-2 mt-1">
                                <ul className='space-y-2 mt-2'>
                                  {fields
                                    .filter((f) => f.id === row.id)
                                    .map((f) => {
                                      return <FieldCompo key={f.fId} f={f} onRemoveField={onRemoveField} setFields={setFields} />
                                    })}
                                </ul>

                                <div className='border-t border-base-200 px-2 mt-2 flex justify-between'>
                                  <button className='text-xs' onClick={() => onRemoveRow(row.id)}>ลบ Row</button>
                                  <button className='text-xs' onClick={() => onAddField(row.id)}>เพิ่ม Field</button>
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )
                    })}
                  </section>
                  <div className='border-t border-primary px-2 mt-2'>
                    <button className='text-xs' onClick={onAddRow}>เพิ่ม Row</button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <div className="divider"></div>
          <section className='flex justify-between'>
            <ConfirmButton
              className="btn btn-error"
              onClick={onClearDesign}
              label='ล้าง'
              label2='ล้าง ?'
              disabled={rows.length <= 0}
            />
            <button
              className="btn btn-primary"
              onClick={onSaveDesign}
            >จัดการ</button>
          </section>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className='flex-grow'>
          <div className="divider">PREVIEW </div>
          <PreviewReceipt
            rows={rows}
            fields={fields}
            logo={logo}
            title={title}
            subtitle={subtitle}
            paragraph={paragraph}
            setLogo={setLogo}
            setTitle={setTitle}
            setSubTitle={setSubTitle}
            setParagraph={setParagraph}
          />
        </div>
      </div>
    </>
  )
}

export default Receipt