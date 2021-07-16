# React-Native Android 自动下载 APK 并安装

## 新建

在`android/app/src/main/java/com/xxx/app/`目录下新建如下三个文件，也就是和`MainActivity.java`文件同级目录下：

- DownloadApk.java
- DownloadApkPackage.java
- DownLoadBroadcastReceiver.java

### DownloadApk

```java
package com.xxx.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.DownloadManager.Request;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DownloadApk
  extends ReactContextBaseJavaModule
  implements ActivityEventListener {

  public static String description;

  DownloadManager downManager;
  Activity myActivity;
  String url;

  public DownloadApk(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return "DownloadApk";
  }

  @ReactMethod
  public void downloading(String url, String description) {
    DownloadApk.description = description;
    myActivity = getCurrentActivity();
    this.url = url;
    checkVesion();
  }

  /**
   * 下载
   */
  private void downLoadApk() {
    downManager =
      (DownloadManager) myActivity.getSystemService(Context.DOWNLOAD_SERVICE);
    Uri uri = Uri.parse(url);
    DownloadManager.Request request = new Request(uri);

    // 设置允许使用的网络类型，这里是移动网络和wifi都可以
    request.setAllowedNetworkTypes(
      DownloadManager.Request.NETWORK_MOBILE | DownloadManager.Request.NETWORK_WIFI
    );

    //设置通知栏标题
    request.setNotificationVisibility(Request.VISIBILITY_VISIBLE);
    request.setMimeType("application/vnd.android.package-archive");
    request.setTitle("app");

    if (description == null || "".equals(description)) {
      description = "正在下载";
    }

    request.setDescription(description);
    request.setAllowedOverRoaming(false);

    // 设置文件存放目录
    request.setDestinationInExternalFilesDir(
      myActivity,
      Environment.DIRECTORY_DOWNLOADS,
      description
    );
    long downloadid = downManager.enqueue(request);
    SharedPreferences sPreferences = myActivity.getSharedPreferences(
      "ggfw_download",
      0
    );
    sPreferences.edit().putLong("ggfw_download_apk", downloadid).commit();
  }

  /**
   * 检测版本
   */
  public void checkVesion() {
    boolean haveInstallPermission;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      //先获取是否有安装未知来源应用的权限
      haveInstallPermission =
        myActivity.getPackageManager().canRequestPackageInstalls();
      if (!haveInstallPermission) { //没有权限
        new AlertDialog.Builder(myActivity)
          .setTitle("提示")
          .setMessage("安装应用需要打开未知来源权限，请去设置中开启权限")
          .setNegativeButton(
            "退出",
            new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
                Toast.makeText(myActivity, "ss", Toast.LENGTH_LONG).show();
                System.exit(0);
              }
            }
          )
          .setPositiveButton(
            "确定",
            new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog, int which) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                  Uri packageURI = Uri.parse(
                    "package:" + myActivity.getPackageName()
                  );
                  //注意这个是8.0新API
                  Intent intent = new Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    packageURI
                  );
                  (myActivity).startActivityForResult(intent, 2);
                  dialog.cancel();
                }
              }
            }
          )
          .show()
          .setCanceledOnTouchOutside(false);
      } else {
        downLoadApk();
      }
    } else {
      downLoadApk();
    }
  }

  //回调
  @Override
  public void onActivityResult(
    Activity activity,
    int requestCode,
    int resultCode,
    Intent data
  ) {
    if (resultCode == Activity.RESULT_OK) {
      switch (requestCode) {
        case 2:
          downLoadApk();
          break;
      }
    }
  }

  @Override
  public void onNewIntent(Intent intent) {}
}
```

### DownloadApkPackage

```java
package com.xxx.app;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DownloadApkPackage implements ReactPackage {

  @Override
  public List createNativeModules(ReactApplicationContext reactContext) {
    List modules = new ArrayList<>();
    modules.add(new DownloadApk(reactContext));
    return modules;
  }

  // @Override
  public List createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
```

### DownLoadBroadcastReceiver

```java
package com.xxx.app;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;

public class DownLoadBroadcastReceiver extends BroadcastReceiver {

  public void installApp(Context context) {
    File file = new File(
      context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),
      DownloadApk.description
    );

    if (file.exists()) {
      Intent intent = new Intent(Intent.ACTION_VIEW);
      // 由于没有在Activity环境下启动Activity,设置下面的标签
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      if (Build.VERSION.SDK_INT >= 24) { //判读版本是否在7.0以上
        // 参数1 上下文, 参数2 Provider主机地址 和配置文件中保持一致, 参数3  共享的文件
        Uri apkUri = FileProvider.getUriForFile(
          context,
          BuildConfig.APPLICATION_ID + "" + ".fileprovider",
          file
        );
        // 添加这一句表示对目标应用临时授权该Uri所代表的文件
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
      } else {
        intent.setDataAndType(
          Uri.fromFile(file),
          "application/vnd.android.package-archive"
        );
      }
      context.startActivity(intent);
    } else {
      Toast.makeText(context, "安装包下载失败", Toast.LENGTH_SHORT).show();
    }
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    long myDwonloadID = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
    SharedPreferences sPreferences = context.getSharedPreferences(
      "ggfw_download",
      0
    );
    long refernece = sPreferences.getLong("ggfw_download_apk", 0);
    String appName = sPreferences.getString("appName", "app.apk");

    if (refernece == myDwonloadID) {
      DownloadManager dManager = (DownloadManager) context.getSystemService(
        Context.DOWNLOAD_SERVICE
      );
      DownloadManager.Query querybyId = new DownloadManager.Query();

      querybyId.setFilterById(myDwonloadID);
      Cursor myDownload = dManager.query(querybyId);
      String dolownname = null;

      if (myDownload.moveToFirst()) {
        int status = myDownload.getInt(
          myDownload.getColumnIndex(DownloadManager.COLUMN_STATUS)
        );

        if (status == DownloadManager.STATUS_SUCCESSFUL) {
          installApp(context);
        } else {
          Toast
            .makeText(context, "下载失败，删除残留文件", Toast.LENGTH_LONG)
            .show();
          dManager.remove(myDwonloadID);
          myDownload.close();
          return;
        }
        myDownload.close();
      }

      if (dolownname == null) {
        return;
      }
    }
  }
}
```

## 配置

### MainApplication

在之前新建同级目录中的`MainApplication.java`添加：

```java
package com.xxx.app;

// ...
// 引入DownloadApkPackage，XXX为包名，与头部package com.XXX保持一致
import com.xxx.app.DownloadApkPackage;
// ...

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:

      // 添加DownloadApkPackage
      packages.add(new DownloadApkPackage());

      return packages;
    }
    // ...
  }
}
```

### 修改 xml

第一步：在`android/app/src/main/res/`下新建`xml/file_paths.xml`，并编辑`file_paths.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
	<paths>
		<external-path path="" name="download" />
	</paths>
</resources>
```

第二步：修改``android/app/src/main/res/`下的`AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.xxx.app">
    <!-- ... -->

    <!-- 添加如下内容 -->
    <application>
      <receiver android:name="com.xxx.app.DownLoadBroadcastReceiver">
          <intent-filter>
              <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
          </intent-filter>
      </receiver>
      <provider
          android:name="androidx.core.content.FileProvider"
          android:authorities="${applicationId}.fileprovider"
          android:grantUriPermissions="true"
          android:exported="false">
          <!-- 元数据 -->
          <meta-data
              android:name="android.support.FILE_PROVIDER_PATHS"
              android:resource="@xml/file_paths" />
      </provider>

      <!-- ... -->
    </application>
</manifest>
```

### 添加下载权限

在`android/app/src/main/res/`下的`AndroidManifest.xml`添加：

```xml
<manifest>
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>
</manifest>
```

## 使用

```js
import { NativeModules } from 'react-native'

const androidUpdate = () => {
  NativeModules.DownloadApk.downloading(
    latestVersionInfo.downloadUrl,
    'xxx.apk'
  )
}
```

## 重新编译

```sh
yarn run android
```

## 其他更新方案

### rn-fetch-blob

用于访问管理文件与请求传输数据。正好存在集下载、通知与自动安装 apk 的 api

### react-native-fs

实现了 react native 的访问本地文件系统，支持文件的创建、删除、查看、上传、下载

### 参考资料

- [rn-fetch-blob](https://github.com/joltup/rn-fetch-blob) --- 停止维护
- [react-native-fs](https://github.com/itinance/react-native-fs) --- 停止维护
- [react-native-blob-util](https://github.com/RonRadtke/react-native-blob-util) ---继续维护
- [React-Native 原生 APP 更新](https://www.cnblogs.com/Grewer/p/14518357.html)
- [react-native App 更新方案](https://www.jianshu.com/p/77e5bd98a7f1)
- [react-native install download apk file](https://blog.csdn.net/u011149565/article/details/100575218)
- [React-Native 安卓 自动下载 APK 文件并安装](https://blog.csdn.net/weixin_42284466/article/details/84898859)
- [React-Native 安卓 自动下载 APK 文件并安装 兼容 8.0 以上](https://www.jianshu.com/p/bd9495425d7f)
