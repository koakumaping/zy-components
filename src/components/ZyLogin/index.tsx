import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  ConfigProvider,
} from 'antd'
import logo from './image/login-logo.png'
import './index.sass'

interface FormData {
  username: string
  password: string
  captchaCode: string
}

interface Props {
  title: string | React.ReactNode | React.ReactNode[]
  message?: string
  captcha: string
  onCaptchaChange: () => Promise<string>
  onFinish: (payload: FormData) => void
  loading?: boolean
}

const emptyImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

const rules = {
  username: [{ required: true, message: '必填项', trigger: 'blur' }],
  password: [
    { required: true, message: '必填项', trigger: 'blur' },
    { min: 6, message: '不能少于6位', trigger: 'blur' },
  ],
  captchaCode: [
    { required: true, message: '必填项', trigger: 'blur' },
    { min: 4, max: 4, message: '长度为4位', trigger: 'blur' },
  ],
}

const Login :React.FC<Props> = (props) => {
  const { title, loading, message, onFinish, captcha, onCaptchaChange } = props
  const [ captchaImage, setCaptchaImage ] = useState<string>(captcha || emptyImg)

  const getCaptcha = () => {
    onCaptchaChange().then((res: string) => {
      setCaptchaImage(res || emptyImg)
    })
  }

  useEffect(() => {
    setCaptchaImage(captcha || emptyImg)
  }, [ captcha ])

  return (
    <ConfigProvider input={{ autoComplete: 'off' }}>
      <div className="zy-login">
        <div className="login-logo">
          <img className="logo-image" src={ logo } alt="logo" />
          <span className="logo-title">{ title }</span>
        </div>
        <div className="login-container">
          <div className="login-container-title">欢迎登录</div>
          <Form className="login-form" onFinish={ onFinish }>
            <Form.Item
              name="username"
              rules={ rules.username }
            >
              <Input bordered={ false } prefix={ <span className="input-label">用户名</span> } />
            </Form.Item>
            <Form.Item
              name="password"
              rules={ rules.password }
            >
              <Input.Password bordered={ false } prefix={ <span className="input-label">密码</span> } />
            </Form.Item>
            <Form.Item
              name="captchaCode"
              rules={ rules.captchaCode }
            >
              <Input
                prefix={ <span className="input-label">验证码</span> }
                bordered={false}
                suffix={ <img onClick={ getCaptcha } src={ captchaImage } alt="code" className="random-img" /> }
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" shape="round" block className="login-submit" loading={ loading }>
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="login-error"><span>{ message }</span></div>
        </div>
        <footer className="footer-copyright">
          版权所有@浙江正元智慧科技股份有限公司
        </footer>
      </div>
    </ConfigProvider>
  )
}

export default Login