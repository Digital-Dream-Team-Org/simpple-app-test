import { defineComponent } from 'vue'
import { Table, Row } from 'ant-design-vue'
import { RouterLink } from 'vue-router'
import { getNews } from '@/plugins/api'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content'
  },
  {
    title: 'Action',
    key: 'action',
    // slots: { customRender: 'action' },
    customRender: (e: any) => {
      return {
        children: (
          <RouterLink
            style="color: #1890ff; text-decoration: none;"
            to={'/news/' + e.record.key}
          >
            Edit
          </RouterLink>
        )
      }
    }
  }
]

export default defineComponent({
  data() {
    return {
      news: [] as any
    }
  },
  methods: {
    async fetchData() {
      const posts = (await getNews()) || []
      this.news = posts.map(post => {
        const { id, title, content } = post
        return {
          key: id,
          title,
          content
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm: any) => {
      await vm.fetchData()
    })
  },
  render() {
    const data = this.news

    return (
      <>
        <Row type={'flex'} justify={'space-between'} align={'middle'}>
          <h1>Список новостей</h1>
          <div>
            <RouterLink to="/news/create">Add new</RouterLink>
          </div>
        </Row>
        <Table columns={columns} dataSource={data} scroll={{ x: 800 }}></Table>
      </>
    )
  }
})
