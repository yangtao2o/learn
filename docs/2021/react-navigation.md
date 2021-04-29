# React-navigation

## react-navigation 中 TabNavigator 切换时重新渲染

```js
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => toggleUpdate())
  return unsubscribe
}, [navigation])
```

## Warning

### Non-serializable values were found in the navigation state

主要是因为 params 为空的情况没有做判断：

```js
onPress={route.params?.onSubmit}

// 由于函数引入关系，需要显式传参，否则变化state不会是最新的
useLayoutEffect(() => {
  navigation.setParams({ onSubmit: () => changeNickName(name) })
}, [navigation, name])
```

## 动态修改标题、页面导航、自定义点击事件等

You can also pass a function to options. The function will receive the navigation prop and the route prop for that screen. This can be useful if you want to perform navigation in your options:

```js
// 头部通用设置
const options = {
  headerBackImage: () => (
    <Image style={{ width: 24, height: 24 }} source={icons.back} />
  ),
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: 15,
  },
  headerRightContainerStyle: {
    paddingRight: 15,
  },
  headerTitleStyle: {
    fontSize: 18,
    color: '#222',
  },
}
```

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={({ navigation, route }) => ({
    ...options,
    headerTitle: 'Awesome app',
    headerLeft: () => (
      <DrawerButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: () => (
      <Text style={styles.clickBtn} onPress={() => route.params.onSubmit()}>
        保存
      </Text>
    ),
  })}
/>
```

```js
export const HomeScreen = ({ navigation }) => {
  // ...
  useLayoutEffect(() => {
    navigation.setParams({ onSubmit: () => alert('ok') })
  }, [navigation])
  // ...
}
```

## 引入字体库

## 渐变效果

```sh
yarn add react-native-linear-gradient
```

## 缩小效果

`react-native-touchable-scale`

## 如何给 screen 中传参

Render callback to return React Element to use for the screen:

```js
export function HomeStackScreen({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTE_NAME['Home']}
        options={({ navigation, route }) => ({
          headerStyle: styles.homeHeader,
          headerTitleStyle: { color: '#fff', fontSize: 20 },
          headerTitle: '首页',
          headerLeft: () => (
            <HomeHeaderLeft
              navigation={navigation}
              isLogin={route.params?.isLogin}
              userAvatar={route.params?.userAvatar}
            />
          ),
        })}
      >
        {props => <HomeScreen {...props} route={route} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
```

## createMaterialTopTabNavigator 自定义 tabBar

```js
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Animated from 'react-native-reanimated'

const Tab = createMaterialTopTabNavigator()

const TABS_NAME = {
  OwnerCreated: '我的创作',
  OwnerFavorite: '我的收藏',
  OwnerShare: '我的分享',
  OwnerRecycle: '回收站',
}

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //     ? options.title
        //     : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }
        // modify inputRange for custom behavior
        const inputRange = state.routes.map((_, i) => i)
        const opacity = Animated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.9)),
        })

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Animated.Text
              style={{
                opacity,
                textAlign: 'center',
                color: isFocused ? '#222' : '#666',
                fontSize: isFocused ? 20 : 16,
                fontWeight: isFocused ? '600' : '500',
              }}
            >
              {TABS_NAME[route.name]}
            </Animated.Text>
            <View
              style={[
                styles.tabBarUnderlineStyle,
                { backgroundColor: isFocused ? '#12BB37' : 'transparent' },
              ]}
            ></View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export const OwnerFileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name="OwnerCreated"
          component={() => <Text>我的创作</Text>}
        />
        <Tab.Screen
          name="OwnerFavorite"
          component={() => <Text>我的收藏</Text>}
        />
        <Tab.Screen name="OwnerShare" component={() => <Text>我的分享</Text>} />
        <Tab.Screen name="OwnerRecycle" component={() => <Text>回收站</Text>} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  tabBarUnderlineStyle: {
    marginVertical: 6,
    width: 24,
    height: 4,
    borderRadius: 2,
  },
})
```

## 抽屉、路由、底部 tabbar
