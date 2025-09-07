import { useState } from 'react'

const jobList = [
  { id: '1', title: 'Thợ chạm khắc gỗ mỹ nghệ', location: 'Xóm 10tt - Hải Minh - Hải Hậu - Nam Định' },
  { id: '2', title: 'Thợ mộc lành nghề', location: 'Xóm 10tt - Hải Minh - Hải Hậu - Nam Định' },
  { id: '3', title: 'Thợ khảm trai, khảm ốc', location: 'Xóm 3b - Hải Minh - Hải Hậu - Nam Định' },
  { id: '4', title: 'Thợ hoàn thiện sản phẩm gỗ', location: 'Xóm 3b - Hải Minh - Hải Hậu - Nam Định' }
]

function RecruitmentPage() {
  const [form, setForm] = useState({ name: '', email: '', jobId: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gửi dữ liệu lên server / API
    setSubmitted(true)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col'>
      <header className='max-w-5xl mx-auto py-20 px-4 text-center'>
        <h1 className='text-4xl font-bold mb-4 text-yellow-900'>Tuyển Dụng Nghề Thủ Công Đồ Gỗ Mỹ Nghệ</h1>
        <p className='text-lg text-yellow-800 max-w-xl mx-auto'>
          Gia nhập đội ngũ thợ thủ công lành nghề của chúng tôi, cùng tạo ra những sản phẩm gỗ mỹ nghệ tinh xảo, mang
          đậm dấu ấn văn hóa Việt.
        </p>
      </header>

      <main className='max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-16 pb-20'>
        {/* Danh sách việc làm */}
        <section className='flex-1'>
          <h2 className='text-2xl font-semibold mb-6 text-yellow-900'>Vị trí tuyển dụng</h2>
          <ul className='space-y-4'>
            {jobList.map((job) => (
              <li
                key={job.id}
                className='border border-yellow-300 rounded-lg p-4 hover:shadow-lg cursor-pointer transition flex justify-between items-center'
                onClick={() => alert(`Xem chi tiết: ${job.title}`)}
              >
                <div>
                  <h3 className='text-xl font-semibold text-yellow-900'>{job.title}</h3>
                  <p className='text-sm text-yellow-700'>{job.location}</p>
                </div>
                <button
                  className='bg-yellow-600 text-white rounded-full px-4 py-2 text-sm hover:bg-yellow-700 transition'
                  onClick={(e) => {
                    e.stopPropagation()
                    setForm({ ...form, jobId: job.id })
                  }}
                >
                  Ứng tuyển
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Form ứng tuyển */}
        <section className='flex-1 bg-white p-8 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold mb-6 text-yellow-900'>Đăng ký ứng tuyển nhanh</h2>
          {submitted ? (
            <div className='text-green-700 font-semibold text-center'>
              Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-yellow-800 mb-2 font-medium' htmlFor='name'>
                  Họ và tên
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className='w-full border border-yellow-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  placeholder='Nhập họ và tên'
                />
              </div>

              <div>
                <label className='block text-yellow-800 mb-2 font-medium' htmlFor='email'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className='w-full border border-yellow-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  placeholder='Nhập email'
                />
              </div>

              <div>
                <label className='block text-yellow-800 mb-2 font-medium' htmlFor='jobId'>
                  Vị trí ứng tuyển
                </label>
                <select
                  id='jobId'
                  name='jobId'
                  value={form.jobId}
                  onChange={handleInputChange}
                  required
                  className='w-full border border-yellow-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                >
                  <option value=''>Chọn vị trí</option>
                  {jobList.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type='submit'
                className='w-full bg-yellow-600 text-white rounded-full py-3 text-lg font-semibold hover:bg-yellow-700 transition'
              >
                Gửi đăng ký
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

export default RecruitmentPage
