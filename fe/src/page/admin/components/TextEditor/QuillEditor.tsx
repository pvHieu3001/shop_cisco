import { useRef, useState, useEffect, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import http from '../../../../app/http-common'
import { getImageUrl } from '@/utils/getImageUrl'

interface TextEditorProps {
  height?: number
  content: string
  onHandleChange: (value: string) => void
}

export default function TextEditor({ content, onHandleChange, height }: TextEditorProps) {
  const [value, setValue] = useState(content)
  const childRef = useRef<ReactQuill>(null)

  useEffect(() => {
    setValue(content)
  }, [content])

  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        // 👉 Gọi API upload ảnh
        const res = await http.post(`/api/v1/admin/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const imageUrl = res.data.data.fileName // URL trả về từ server

        // 👉 Dùng ref để insert ảnh
        const editor = childRef.current?.getEditor()
        if (!editor) return

        const range = editor.getSelection()
        if (range) {
          editor.insertEmbed(range.index, 'image', getImageUrl(imageUrl))
        }
      }
    }
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      },
      clipboard: {
        matchVisual: false
      }
    }),
    []
  )

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

  return (
    <div className='react-quill-wrapper' style={height ? { height:height+50 } : {}}>
      <ReactQuill
        ref={childRef}
        value={value}
        modules={modules}
        formats={formats}
        theme='snow'
        className='custom-quill'
        style={height ? { height } : {}}
        onChange={(val) => {
          setValue(val)
          onHandleChange(val)
        }}
      />
    </div>
  )
}
