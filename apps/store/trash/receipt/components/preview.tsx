import React, { useRef } from 'react'
import { Field } from '../page'
import Image from 'next/image'

interface Title {
  logo: File | null,
  title: string,
  subtitle: string,
  paragraph: string,

  setLogo: React.Dispatch<React.SetStateAction<File | null>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setSubTitle: React.Dispatch<React.SetStateAction<string>>,
  setParagraph: React.Dispatch<React.SetStateAction<string>>
}

interface Details {
  rows: { id: string }[],
  fields: Field[]
}

interface Props extends Details, Title { }

const PreviewReceipt = (props: Props) => {
  const ImageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="paper flex-grow">
      <form className='space-y-1'>
        <input type="file" ref={ImageRef} name="logo" style={{ display: 'none' }} onChange={e => props.setLogo(e.target.files ? e.target.files[0] : null)} accept="image/png, image/gif, image/jpeg" />

        <main className='px-4 py-4 bg-white text-black'>
          <header className='flex'>
            <section className='flex-grow flex gap-2 space-x-5'>
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <Image
                    alt='background'
                    src={
                      props.logo ? (
                        URL.createObjectURL(props.logo)
                      ) : (
                        "https://cdn.logo.com/hotlink-ok/logo-social.png"
                      )
                    }
                    onClick={() => {
                      ImageRef.current?.click()
                    }}
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder='Title'
                  value={props.title}
                  onChange={e => props.setTitle(e.target.value)}
                  className='w-full bg-transparent outline-none ring-0 border-none text-3xl'
                />
                <input
                  type="text"
                  placeholder='Subtitle...'
                  value={props.subtitle}
                  onChange={e => props.setSubTitle(e.target.value)}
                  className='w-full bg-transparent outline-none ring-0 border-none text-xl'
                />
                <input
                  type="text"
                  placeholder='Paragraph...'
                  value={props.paragraph}
                  onChange={e => props.setParagraph(e.target.value)}
                  className='w-full bg-transparent outline-none ring-0 border-none text-base'
                />

              </div>
            </section>
            <section className='flex-grow text-end'>
              <p>เลขที่ <span>x</span></p>
              <p>
                {new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
              </p>
            </section>
          </header>
          <section className='my-4'>
            {
              props.rows.map((row) => {
                const cols = props.fields.filter(f => f.id == row.id)

                return (
                  <section key={row.id} className={`flex gap-2`}>
                    {
                      cols.map((field) => {
                        return (
                          <div className='flex-grow flex gap-2' key={row.id + "-" + field.id + field.fId}>
                            <b>{field.title}</b>
                            <div className='flex-grow border'>
                              <input
                                type="text"
                                placeholder='ป้อนข้อมูลที่นี่'
                                className='w-full bg-transparent outline-none ring-0 border-none'
                              />
                            </div>
                          </div>
                        )
                      })
                    }
                  </section>
                )
              })
            }
          </section>
          <article>
            <table className="table table-striped text-center ">
              <thead>
                <tr className='text-black'>
                  <th>ลำดับ</th>
                  <th>รายการ</th>
                  <th>หน่วยละ</th>
                  <th>หน่วยละ</th>
                  <th>จำนวนเงิน</th>
                </tr>
              </thead>
            </table>
          </article>
        </main>
      </form>
    </div >
  )
}

export default PreviewReceipt