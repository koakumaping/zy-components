import React, { useState, useEffect, useMemo } from 'react'
import jssm4 from 'jssm4'
import store from 'store'
import r from '@/util/request'
import { history, useModel } from 'umi'
import { UserItem } from '@/types/user'
import ZyLogin from '@/components/ZyLogin'

interface CaptchaItem {
  img: string
  verificationId: string
}

const Login :React.FC = () => {
  const code = useMemo(() => {
    return history.location?.query?.code
  }, [ history.location ])

  const [captcha, setCaptcha] = useState<CaptchaItem>({ img: '', verificationId: '' })
  const [loading, setLoading] = useState(false)

  const { clearMenuList, handleMenuList } = useModel('menu')
  const getCaptcha = () => {
    return new Promise<string>((resolve) => {
      r().get('getCaptcha').then((res: Record<string, any>) => {
        setCaptcha({ img: res.img, verificationId: res.verificationId })
        resolve(res.img)
      })
    })
  }

  useEffect(() => {
    getCaptcha()
    clearMenuList()
    setUserInfo({
      name: '',
      id: 0,
      account: '',
    })
  }, [])

  const { setUserInfo } = useModel('user')

  const onFinish = (payload: any) => {
    console.log('Success:', payload)
    setLoading(true)
    const sm4 = new jssm4(payload.username)
    payload.password = sm4.encryptData_ECB(payload.password)
    const { username, password, captchaCode } = payload
    const { verificationId } = captcha
    const formdata = {
      username,
      password,
      captcha: captchaCode,
      verificationId,
    }

    r().post('Login', formdata).then((res: Record<string, any>) => {
      const accessToken = res.accessToken
      const userInfo: Record<string, any> = {
        id: res.id,
        name: res.name,
      }

      const user: UserItem = {
        id: res.id,
        name: userInfo.name,
        account: username,
      }

      setUserInfo(user)
      store.set('user', user)
      store.set('token', accessToken)
      store.set('dict', res?.dict?.zh_CN)

      handleMenuList(res.permission).then(() => {
        history.push('/home')
      }).catch((error) => {
        setLoading(false)
        console.log('handleMenuList', error)
      })
    }).catch(() => {
      try {
        setLoading(false)
        getCaptcha()
      } catch (error) {
        console.log(error)
      }
    })
  }

  const getErrorMessage = () => {
    if (!code) return ''
    if (code === '20053') return '账号在其他地方登录，请重新登录'
    return '登录信息已过期，请重新登录'
  }

  return (
    <ZyLogin
      title="能力开放平台"
      loading={ loading }
      captcha={ captcha.img }
      onCaptchaChange={ getCaptcha }
      onFinish={ onFinish }
      message={ getErrorMessage() }
      extraRender={(<span className="pointer">找回密码</span>)}
    />
  )
}

export default Login