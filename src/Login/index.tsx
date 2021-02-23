import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider, Row, Col } from 'antd';
import moment from 'moment';
import backgroundImage from './image/login-bg.png';
import logo from './image/login-logo.png';
import './index.sass';
import { KeyOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';

interface FormData {
  username: string;
  password: string;
  captchaCode: string;
}

interface Props {
  title: string | React.ReactNode | React.ReactNode[];
  message?: string;
  captcha: string;
  onCaptchaChange: () => Promise<string>;
  onFinish: (payload: FormData) => void;
  loading?: boolean;
  backgroundImage?: string;
  extraRender?: React.ReactNode | React.ReactNode[];
}

const emptyImg =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

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
};

const ZyLogin: React.FC<Props> = props => {
  const { title, loading, message, onFinish, captcha, onCaptchaChange } = props;
  const [captchaImage, setCaptchaImage] = useState<string>(captcha || emptyImg);

  const getCaptcha = () => {
    onCaptchaChange().then((res: string) => {
      setCaptchaImage(res || emptyImg);
    });
  };

  useEffect(() => {
    setCaptchaImage(captcha || emptyImg);
  }, [captcha]);

  return (
    <ConfigProvider input={{ autoComplete: 'off' }}>
      <div
        className="zy-login"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="login-logo">
          <img className="logo-image" src={logo} alt="logo" />
          <span className="logo-title">{title}</span>
        </div>
        <div className="login-container">
          <div className="login-container-title">登录</div>
          <Form className="login-form" size="large" onFinish={onFinish}>
            <Form.Item name="username" rules={rules.username}>
              <Input prefix={<UserOutlined />} placeholder="账号" />
            </Form.Item>
            <Form.Item name="password" rules={rules.password}>
              <Input.Password prefix={<KeyOutlined />} placeholder="密码" />
            </Form.Item>
            <Row>
              <Col span={14}>
                <Form.Item name="captchaCode" rules={rules.captchaCode}>
                  <Input prefix={<SafetyOutlined />} placeholder="验证码" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <div className="login-captcha">
                  <dl
                    className="login-captcha-image"
                    onClick={getCaptcha}
                    style={{
                      backgroundImage: `url(${captchaImage})`,
                      height: '40px',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="login-submit"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="login-error">
            <span>{message}</span>
          </div>
          <div className="login-extra">{props.extraRender}</div>
        </div>
        <footer className="footer-copyright">
          Copyright {moment().format('YYYY')} 正元智慧
        </footer>
      </div>
    </ConfigProvider>
  );
};

export default ZyLogin;
