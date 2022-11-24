import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'
import axios from 'axios'

interface FormData {
  title: string
  content: string
  id: string
}

interface notesProps {
  notes: {
    id: string
    title: string
    content: string
  }[]

}



const Home = ({ notes }: notesProps) => {
  const [form, setForm] = useState<FormData>({ title: '', content: '', id: '' })
  const router = useRouter()
  const refresh = () => {
    router.replace('/')
  }

  async function create(data: FormData) {
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/create',
      data: data
    }).then(res => {
      console.log(res)
      setForm({ title: '', content: '', id: '' })
      refresh()
    }).catch(err => {
      console.log(err)
    })
  }


  const handleDelete = async (id: string) => {
    axios({
      method: 'delete',
      url: `http://localhost:3000/api/note/${id}`,
    }).then((res) => {
      refresh()
    }).catch(err => {
      console.log(err)
    })
  }




  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(form)
      }}>
        <input type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}

        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}

        />
        <button type="submit">Add +</button>
      </form>
      <div>
        <ul>
          {notes.map((item, index) => {
            return (
              <>
                <li key={item.id}>
                  <div>
                    <h1>{item.title}</h1>
                    <p>{item.content}</p>
                  </div>
                </li>
                <button onClick={() => handleDelete(item.id)}>delete</button>
              </>
            )
          })}

        </ul>
      </div>
    </div>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async () => {

  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  })


  return {
    props: {
      notes
    }
  }
}