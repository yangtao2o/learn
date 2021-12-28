# 基于 react-avatar-editor 实现头像上传

## 前言

#### 主要内容

- 头像上传核心功能：1、可放大缩小截取；2、可拖动等；3、上传支持常用的图片格式，包括 svg、webp 等，但保存仍是 png 格式
- 上传组件基于 antd 的 `Upload` 组件
- 上传成功最终保存至阿里云的 OSS 上

#### 组件结构

```tree
.
├── AvatarEditorView.js
├── AvatarUpload.js
└── utils.js
```

#### 问题解决

1. 上传头像时限制了图片大小不能超过 2M，但是截取之后反而变得非常大，上传失败
2. 起初，默认加载的是用户已有的线上头像（其他域），裁剪的时候，受到`同源策略`限制

问题 1，主要原因是调取 canvas 裁剪图片的方法不对，按照预定，我是想裁剪出来的宽和高是我初始化时的大小（240x240），但是最终裁剪的结果是以图片的实际大小为基准，所以，通过 canvas 裁剪后，大小极有可能比原片大许多。

那问题又来了，一张大小不是很大的图片，通过 canvas 裁剪之后，为什么反而变大了呢？

要回答这个问题，主要是看[HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)都做了哪些骚操作。

核心就是`toBlob`默认导出 png 格式的高清图。

好吧，回到我们最初的问题，如何拿到我设置的图片大小？其实是我调取的方法`getImage`本身就是获取的图片原始大小，需要使用`getImageScaledToCanvas`就能满足。

当然`react-avatar-editor`官方文档也有详细的说明：

```text
The resulting image will have the same resolution as the original image, regardless of the editor's size.
If you want the image sized in the dimensions of the canvas you can use `getImageScaledToCanvas`.
```

问题 2，主要原因当然就是跨域问题了，后来改成了使用本地随机头像，避过了这个问题。具体解决办法看这里：[Canvas 跨域如何解决](https://www.yisu.com/zixun/122449.html)。

## 弹窗组件 AvatarUpload

AvatarUpload 组件主要负责修改头像按钮、弹窗内容渲染、以及最终的保存逻辑：

```js
import { useState, useCallback } from 'react'
import { Avatar, Modal, message } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import { getHttpsUrl } from '@/utils/tools'
import { getSaveImageSrc, updateProfile } from './utils'
import AvatarEditorView from './AvatarEditorView'

const AVATAR_IMG = '/static/img/icons/user.png'

export default function AvatarUpload(props) {
  const { url, onUpdate } = props
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(() => setVisible(false), [])

  const handleSave = async blob => {
    const res = await getSaveImageSrc(blob)

    if (res) {
      const params = {
        avatar: res,
      }
      updateProfile(() => {
        setVisible(false)
        message.success('修改成功')
        onUpdate()
      }, params)
    }
  }

  const avatarSrc = getHttpsUrl(url) || AVATAR_IMG

  const UploadModalView = (
    <Modal
      className="upload-avatar-modal"
      centered={true}
      footer={null}
      width={550}
      visible={visible}
      maskClosable={false}
      onOk={handleClose}
      onCancel={handleClose}
      title="修改头像"
    >
      <AvatarEditorView onSave={handleSave} />
    </Modal>
  )

  return (
    <>
      <div className="avatar-box">
        <Avatar
          className="avatar"
          icon={<img src={AVATAR_IMG} />}
          src={avatarSrc}
        />
        <div className="upload-btn" onClick={() => setVisible(true)}>
          <CameraOutlined style={{ fontSize: 25 }} />
          <span className="desc">修改头像</span>
        </div>
      </div>
      {visible ? UploadModalView : null}
    </>
  )
}
```

## 编辑头像核心组件 AvatarEditorView

这里就是最最核心的内容了，上传图片之前的各种判断处理，截取图片之后图片文件格式的转化等：

```js
import { useState, useRef } from 'react'
import { Upload, Slider, Button, message } from 'antd'
import AvatarEditor from 'react-avatar-editor'
import { SAVE_FAIL, randomAvatar, beforeUpload, getBase64 } from './utils'

const INIT_PROPS = {
  width: 240,
  height: 240,
  border: 20,
  rotate: 0,
  scale: 1,
  color: [0, 0, 0, 0.6],
  backgroundColor: '#fff',
  image: '/static/img/icons/user.png',
}

export default function AvatarEditorView(props) {
  const { onSave } = props
  const [scale, setScale] = useState(INIT_PROPS.scale)
  const [image, setImage] = useState(randomAvatar())

  const editorRef = useRef()

  const handleScale = value => setScale(parseFloat(value))

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setImage(imageUrl)
        setScale(1)
      })
    }
  }

  const uploadBtnProps = {
    name: 'avatar',
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
  }

  const handleSave = () => {
    if (!editorRef.current) {
      console.error('editorRef.current value is null')
      return message.error(SAVE_FAIL)
    }
    try {
      const editor = editorRef.current
      const canvas = editor.getImageScaledToCanvas()

      // HTMLCanvasElement.toBlob()
      // 注意：canvas使用资源需要同源策略
      canvas.toBlob(blob => onSave(blob))
    } catch (error) {
      console.error(error)
      message.error(SAVE_FAIL)
    }
  }

  return (
    <div className="upload-content">
      <div className="left">
        <AvatarEditor
          {...INIT_PROPS}
          ref={editorRef}
          scale={scale}
          image={image}
          borderRadius={INIT_PROPS.width}
        />
      </div>
      <div className="right">
        <div className="top">
          <span className="name">选择图片</span>
          <Upload {...uploadBtnProps}>
            <Button>点击上传头像</Button>
          </Upload>
        </div>
        <div className="center">
          <span className="name">调整大小</span>
          <Slider
            defaultValue={1}
            value={scale}
            min={1}
            max={2}
            step={0.01}
            onChange={handleScale}
          />
        </div>
        <Button className="bottom" type="primary" onClick={handleSave}>
          保存头像
        </Button>
      </div>
    </div>
  )
}
```

## 工具函数集合 utils

```js
import { fileOssRequest } from '@/services/request'
import { message } from 'antd'
import { profileService } from '@dataozi/user-service-sdk'
import { uploadUserAvatar } from '@/services/ownerApi'

export const SAVE_FAIL = '保存失败，请稍后重试'

const AVATARS_SRC = [
  '/static/img/avatar/1.png',
  '/static/img/avatar/2.png',
  '/static/img/avatar/3.png',
  '/static/img/avatar/4.png',
  '/static/img/avatar/5.png',
  '/static/img/avatar/6.png',
]

// 初始时随机一个头像
export const randomAvatar = (m = 6) => {
  const index = Math.floor(Math.random() * m) // 0 <= index < m
  return AVATARS_SRC[index]
}

// 上传阿里云OSS
function uploadImageToOSS({ name, data, blob }) {
  const { access_id, cdn, host, policy, signature } = data

  const params = {
    key: name,
    policy,
    signature,
    OSSAccessKeyId: access_id,
    'x-oss-content-type': 'text/plain', // OSS 配置固定为'text/plain'不能修改
    file: blob,
  }

  const formData = new FormData()

  for (const key in params) {
    formData.append(key, params[key])
  }

  return fileOssRequest.post(cdn || host, { data: formData })
}

const getOssRes = async () => {
  const res = await uploadUserAvatar({ type: 1 })
  if (res && res.code === 0) {
    return res.res
  }
  return null
}

export const getSaveImageSrc = async blob => {
  const oss = await getOssRes()
  if (!oss || !blob) {
    console.error('保存上传头像缺失 oss 或 blob')
    message.warn(SAVE_FAIL)
    return false
  }

  const { cdn, host, dir } = oss
  const name = dir + new Date().getTime() + '.png'

  try {
    const res = await uploadImageToOSS({ data: oss, name, blob })

    if (!res) {
      message.warn(SAVE_FAIL)
      return false
    }

    const { status } = res.response
    if ([200, 201, 204, 206].some(code => code === status)) {
      return `${cdn || host}/${name}`
    }
  } catch (error) {
    message.error(SAVE_FAIL)
    return false
  }
}

export function beforeUpload(file) {
  const IMG_TYPE = 'image/'
  if (!file.type || file.type.indexOf(IMG_TYPE) === -1) {
    message.warn('图片格式不正确')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.warn('图片大小不能超过2MB!')
    return false
  }
  if (file.name && file.name.length > 54) {
    message.warn('图片名称过长，请修改至50个字符内')
    return false
  }
  return true
}

// 读取本地文件
export function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

// 更新用户信息
export const updateProfile = async (callback, params) => {
  const res = await profileService.updateProfile(params)
  if (!res || !res.code) {
    if (typeof callback === 'function') {
      callback()
    }
  } else {
    message.warning(res ? res.message : '出错了，请稍候重试')
  }
}
```

## 其他

#### 获取本地图片

```js
function isDataURL(str) {
  if (str === null) {
    return false
  }
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
  return !!str.match(regex)
}

export default function loadImageURL(imageURL, crossOrigin) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    if (isDataURL(imageURL) === false && crossOrigin) {
      image.crossOrigin = crossOrigin
    }
    image.src = imageURL
  })
}

export default function loadImageFile(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const image = loadImageURL(e.target.result)
        resolve(image)
      } catch (e) {
        reject(e)
      }
    }
    reader.readAsDataURL(imageFile)
  })
}
```

#### react-dropzone

Simple React hook to create a HTML5-compliant drag'n'drop zone for files.

```js
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  )
}
```

## 参考资料

- [react-avatar-editor](https://github.com/mosch/react-avatar-editor)
- [HTML5 file API 加 canvas 实现图片前端 JS 压缩并上传](https://www.zhangxinxu.com/wordpress/2017/07/html5-canvas-image-compress-upload/)
- [HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [Canvas 跨域如何解决](https://www.yisu.com/zixun/122449.html)
- [react-dropzone](https://react-dropzone.js.org/)
