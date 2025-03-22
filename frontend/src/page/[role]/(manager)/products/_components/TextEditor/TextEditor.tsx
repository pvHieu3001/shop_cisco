import { Button, Form, Image } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import pencil from '../../../../../../assets/images/manager/pencil.svg'

export default function TextEditor(content: any) {
  const [value, setValue] = useState('')
  const childRef = useRef(null)
  const [editContent, setEditContent] = useState(false)

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // Hãy giữ các định dạng khi dán từ bên ngoài
      matchVisual: false
    }
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
  ]
  return !editContent ? (
    <div className='m-0 flex-1'>
      <Button
        className='mb-1'
        onClick={(e) => {
          e.preventDefault()
          setEditContent(true)
        }}
      >
        <Image className='pr-2' src={pencil} />
        Chỉnh sửa
      </Button>
      <div dangerouslySetInnerHTML={{ __html: content.data }} />
    </div>
  ) : (
    <Form.Item
      name={'content'}
      className='m-0'
      label={'Nội dung'}
      rules={[
        {
          required: true,
          message: 'Trường này là bắt buộc'
        }
      ]}
    >
      <ReactQuill
        ref={childRef}
        value={value}
        modules={modules}
        formats={formats}
        theme='snow' // hoặc 'bubble'
        className='h-[200px]'
      />
    </Form.Item>
  )
}
