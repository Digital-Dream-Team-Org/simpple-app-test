import { createNewsPost, getNewsPost, updateNewsPost } from '@/plugins/api'
import { FormRules } from '@/types'
import { Button, Form, Input, Space } from 'ant-design-vue'
import { defineComponent, reactive } from 'vue'

interface PostData {
  title: string
  content: string
}
interface Data {
  isNew: boolean
  postId: string
  currentPostData: PostData | any
}

const rules: FormRules = {
  title: [
    {
      required: true,
      message: 'Поле не должно быть пустым',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: 'Поле не должно быть пустым',
      trigger: 'blur'
    }
  ]
}

export default defineComponent({
  data(): Data {
    return {
      isNew: true,
      postId: '',
      currentPostData: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    async fetchData() {
      const fetchedId = this.$route.params.id

      if (fetchedId === 'create') {
        this.isNew = true
      } else {
        this.isNew = false
        this.postId = fetchedId as string

        const post = await getNewsPost(this.postId)

        if (!post) {
          this.$router.push({ path: '/news' })
        }
        this.currentPostData = post
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm: any) => {
      await vm.fetchData()
    })
  },
  render() {
    const currentPostData = this.currentPostData

    const formData = reactive({
      ...currentPostData,
      loading: false
    })

    const onSubmit = async (data: typeof formData) => {
      formData.loading = true
      try {
        let res = null
        if (this.isNew) {
          res = await createNewsPost(data.title, data.content)
        } else {
          res = await updateNewsPost(this.postId, data.title, data.content)
        }
        this.$router.push('/news')
      } finally {
        formData.loading = false
      }
    }

    return (
      <>
        {this.isNew ? <h1>Создать новость</h1> : <h1>Редактировать новость</h1>}
        <Form
          model={formData}
          onFinish={onSubmit}
          layout="vertical"
          rules={rules as any}
          class="form-default"
        >
          <Form.Item label="Title" name="title">
            <Input
              placeholder="Введите заголовок"
              v-model={[formData.title, 'value']}
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item label="Content" name="content">
            <Input
              placeholder="Введите текст"
              v-model={[formData.content, 'value']}
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Space size={24}>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
                loading={formData.loading}
              >
                Отправить
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </>
    )
  }
})
