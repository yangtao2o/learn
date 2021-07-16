# 获取本地图片并上传至 oss

## react-native-image-picker

### Upload

```sh
yarn add react-native-image-picker

# RN >= 0.60
cd ios && pod install
```

另，对于`iOS 10+`设备，需要在`info.plist`中配置`NSPhotoLibraryUsageDescription`和`NSCameraUsageDescription`。具体的可查阅资料。

```html
<key>NSPhotoLibraryUsageDescription</key>
<string>This app requires access to the photo library.</string>
```

### 使用 launchImageLibrary

```js
import { launchImageLibrary } from 'react-native-image-picker'

const selectImage = () => {
  const options = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 1000,
    maxWidth: 1000,
    quality: 0.6,
  }

  launchImageLibrary(options, ({ didCancel, assets, errorMessage }) => {
    if (didCancel) return
    if (errorMessage) {
      return showToast(errorMessage)
    }

    const { uri, type, fileName, fileSize } = assets[0]
    if (beforeUpload({ fileSize, type })) {
      getImgSignature({ uri, type, fileName })
    }
  })
}

const beforeUpload = ({ fileSize, type }) => {
  const imgTypes = ['image/jpeg', 'image/png', 'image/jpg']

  const isJpgOrPng = imgTypes.findIndex(item => item === type) > -1

  if (!isJpgOrPng) {
    showToast('图片格式为jpeg、png、jpg')
    return false
  }

  const isLt = fileSize / 1024 / 1024 < 2
  if (!isLt) {
    showToast('图片大小不能超过2MB')
    return false
  }
  return isJpgOrPng && isLt
}
```

### 获取上传图片签名

```js
// 上传图片获取上传签名
const getImgSignature = async (params = {}) => {
  const key = Toast.loading('加载中')
  const res = await getOssSignature({
    type: '2',
    token: token.access_token,
  })

  if (res.code === 0) {
    await getUploadImage({ ...res.data, ...params })
  } else {
    showToast('出错了，请稍候重试')
  }

  Portal.remove(key)
}

// 获取上传图片结果
const getUploadImage = async data => {
  const { access_id, dir, callback, policy, signature, host } = data
  const { uri, type, fileName } = data

  // file 字段可以是blob二进制，也可以是如下对象
  const params = {
    policy,
    callback,
    signature,
    OSSAccessKeyId: access_id,
    key: dir + fileName.replace('rn_image_picker_lib_temp_', ''),
    file: {
      uri,
      type,
      name: fileName,
    },
  }

  const res = await uploadImage(host, params)

  if (res && res.code === 0) {
    setUploadImg([...uploadImg, res.data])
  } else {
    showToast('上传图片失败，请稍候重试')
  }
}
```

### 使用 fetch 实现图片上传

```js
/**
 * 使用fetch实现图片上传
 * @param {string} url  接口地址
 * @param {JSON} params body的请求参数
 * @return 返回Promise
 */
export function uploadImage(url, params) {
  return new Promise(function (resolve, reject) {
    const formData = new FormData()

    for (const key in params) {
      formData.append(key, params[key])
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('uploadImage', responseData)
        resolve(responseData)
      })
      .catch(err => {
        console.log('err', err)
        reject(err)
      })
  })
}
```

### base64 转 Blob

有时候需要将 base64 格式的图片转成二进制：

```js
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}
```

## 参考资料

- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker)
- [React Native 使用 react-native-image-picker 库实现图片上传功能](https://cloud.tencent.com/developer/article/1038604)
