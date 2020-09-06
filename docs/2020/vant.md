# Vant 使用总结

## 表单提交

```vue
<template>
  <div class="wrapper">
    <!-- 导航版块 -->
    <van-nav-bar v-if="$isPC" title="开电子发票" left-arrow @click-left="onClickLeft" />

    <!-- 表单版块 -->
    <van-form @submit="onSubmit" :show-error="false">
      <div class="topic">发票信息</div>

      <!-- 抬头类型 -->
      <van-cell-group>
        <van-field name="tttype" label="抬头类型">
          <template #input>
            <van-radio-group v-model="tttype" direction="horizontal">
              <van-radio name="2">
                企业单位
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="1">
                个人
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 发票抬头 -->
      <van-cell-group>
        <van-field
          v-model="buyername"
          name="buyername"
          label="发票抬头"
          placeholder="填写发票抬头"
          :rules="[
            {
              required: true,
              message: '请填写发票抬头'
            }
          ]"
          clearable
        />
      </van-cell-group>

      <!-- 税号 -->
      <van-cell-group v-if="tttype === '2'">
        <van-field
          v-model="taxnum"
          name="taxnum"
          label="税号"
          placeholder="填写税号"
          maxlength="20"
          :formatter="formatter"
          :rules="[
            {
              required: true,
              message: '请填写税号'
            },
            {
              validator: taxnumValidator,
              message: '税号必须是字母和数字，可输入15、18或20位'
            }
          ]"
        />
      </van-cell-group>

      <!-- 发票内容 -->
      <van-cell-group>
        <van-field readonly v-model="buyercontent" label="发票内容" />
      </van-cell-group>

      <!-- 发票金额 -->
      <van-cell-group>
        <van-field class="amount" type="number" label="发票金额">
          <template #input>
            <div class="amount-outer">
              <span class="number">{{ amount }}</span>
              元
            </div>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 更多信息 -->
      <van-cell-group>
        <van-field
          readonly
          label="更多信息"
          right-icon="arrow"
          placeholder="填写备注、地址等（非必填）"
          @click.native="isMoreShow = true"
        ></van-field>
      </van-cell-group>

      <!-- 电子邮箱 -->
      <div class="topic">接收方式</div>
      <van-cell-group>
        <van-field
          v-model="email"
          name="eamil"
          type="text"
          label="电子邮箱"
          placeholder="填写邮件地址"
          :rules="[
            {
              required: true,
              message: '请填写邮件地址'
            },
            {
              validator: eamilValidator,
              message: '请输入正确的邮箱地址'
            }
          ]"
          clearable
        />
      </van-cell-group>
      <p class="warning"><span></span>电子发票与纸质发票具有同等法律效力，可支持报销入账</p>

      <!-- 表单提交 -->
      <div class="btn-wrap">
        <van-button block color="#207CFF" native-type="submit">提交</van-button>
      </div>
    </van-form>

    <!-- 更多信息 -->
    <van-popup
      v-model="isMoreShow"
      position="bottom"
      :style="{ backgroundColor: '#f3f4f5', height: '100%' }"
    >
      <FapiaoMoreDetail @backclick="isMoreShow = false" @moreclick="onMoreSubmit" />
    </van-popup>

    <!-- 确认提交版块 -->
    <van-popup class="popup-wrap" v-model="isConfirmShow" position="bottom">
      <div class="outer">
        <div class="van-hairline--bottom">开具电子发票</div>
        <van-field readonly label="抬头类型" :value="tttype === '2' ? '企业单位' : '个人'" />
        <van-field readonly v-model="buyername" label="发票抬头" />
        <van-field v-if="tttype === '2'" readonly v-model="taxnum" label="税号" />
        <van-field readonly v-model="email" label="电子邮箱" />
        <p class="warning">
          请确认邮箱无误，电子发票将在您提交成功后24小时之内发送至您的邮箱，请注意查收。
        </p>
        <div class="btn-sure">
          <van-button block color="#207CFF" @click.native="onConfirmSubmit">确认提交</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { fapiao_save } from '@/services';
import activeIcon from '@/assets/img/user-active.png';
import inactiveIcon from '@/assets/img/user-inactive.png';
import FapiaoMoreDetail from './FapiaoMore';

export default {
  components: {
    FapiaoMoreDetail
  },
  data() {
    return {
      activeIcon,
      inactiveIcon,
      tttype: '2',
      buyername: '',
      buyercontent: '信息技术服务 软件服务费',
      taxnum: '',
      amount: '0.00',
      email: '',
      isConfirmShow: false,
      isMoreShow: false,
      moreDetail: {},
      appinfo: {}
    };
  },
  watch: {
    tttype(name) {
      if (name === '1') {
        this.taxnum = '';
      }
    }
  },
  methods: {
    onClickLeft() {
      return this.$router.go(-1);
    },
    onMoreSubmit(data) {
      this.moreDetail = data;
      this.isMoreShow = false;
    },
    onSubmit() {
      this.isConfirmShow = true;
    },
    onConfirmSubmit() {
      this.isConfirmShow = false;
      this.fapiaoInfoSave();
    },
    formatter(val) {
      return val.toUpperCase();
    },
    taxnumValidator(val) {
      return /^(([0-9A-Z]{15})|([0-9A-Z]{18})|([0-9A-Z]{20}))$/.test(val);
    },
    eamilValidator(val) {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val);
    },
    // 提交数据
    async fapiaoInfoSave() {
      const { tttype, buyername, taxnum, email } = this.$data;

      const data = {
        tttype: +tttype,
        buyername,
        taxnum,
        email,
        order_no: this.appinfo.order_no,
        ...this.moreDetail
      };

      const [detailErr, detail] = await this.$errorCaptured(fapiao_save, data, this.appinfo);

      if (detailErr) {
        return Dialog({ message: detailErr });
      }

      const { code, message } = detail.data;

      if (code !== 0) {
        return Dialog({ message });
      }

      // 开票成功
      this.$router.replace({
        name: 'FapiaoState',
        query: { state: 'success', ...this.appinfo }
      });
    }
  },
  mounted() {
    const { amount } = this.$route.query;

    if (!amount) {
      return Dialog({ message: '参数有误，无法提交' });
    }

    this.amount = amount;
    this.appinfo = this.$route.query;
  }
};
</script>
```

## 容器组件内容

```vue
<template>
  <div class="box-wrapper">
    <div v-if="isLoading">
      <van-skeleton title :row="3" />
    </div>
    <transition v-else>
      <router-view />
    </transition>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { fapiao_order_detail, get_fapiao_info } from '@/services';

export default {
  data() {
    return {
      isLoading: true,
      appinfo: {}
    };
  },
  methods: {
    setState(code) {
      const WARN = 'warn'; // 用户身份异常
      const FAIL = 'fail'; // 订单不存在、退款、超时等
      const COMPLETE = 'complete'; // 纸质发票（非电子发票）
      const ERROR = 'error'; // 其他错误信息

      const state = {
        1002: WARN,
        1005: WARN,
        1200: WARN,
        1201: WARN,
        4002: FAIL,
        4006: FAIL,
        4009: COMPLETE
      };

      return (code && state[code]) || ERROR;
    },
    // 判断如何跳转页面
    getOrderState(data = {}) {
      const { code } = data;
      const { amount } = data.data;

      // 未开票，填写发票
      if (code === 0) {
        return this.goInfoPage(amount);
      }

      // 已开票，跳往详情页
      else if (code === 4003) {
        return this.goDetailPage();
      }

      // 开票异常，跳往状态页
      else {
        return this.goStatePage(this.setState(code));
      }
    },
    // 路由跳转
    replaceRouter(name = 'Fapiao', data = {}) {
      this.isLoading = false;
      this.$router.replace({
        name,
        query: {
          ...data,
          ...this.appinfo
        }
      });
    },
    goInfoPage(amount) {
      this.replaceRouter('FapiaoInfo', { amount });
    },
    goStatePage(state) {
      this.replaceRouter('FapiaoState', { state });
    },
    async goDetailPage() {
      const [detailErr, detail] = await this.$errorCaptured(get_fapiao_info, this.appinfo);

      if (detailErr) {
        return Dialog({ message: detailErr });
      }

      const { code, message: msg } = detail.data;
      const { status: state } = detail.data.data;

      const detailData = detail.data.data;

      if (code !== 0) {
        return Dialog({ message: msg });
      }

      this.replaceRouter('FapiaoDetail', { state, ...detailData });
    },
    async getOrderDetail() {
      const [detailErr, detail] = await this.$errorCaptured(fapiao_order_detail, this.appinfo);

      if (detailErr) {
        return Dialog({ message: detailErr });
      }

      this.getOrderState(detail.data);
    }
  },
  watch: {
    $route(to, from) {
      if (from.name === 'FapiaoState') {
        this.getOrderDetail();
      }
    }
  },
  created() {
    // 规则可参看 doc 目录
    const { order_no, appId, token, dataSource } = this.$route.query;

    this.appinfo = {
      token,
      order_no,
      appId,
      dataSource
    };

    // 获取活动详情
    this.getOrderDetail();
  }
};
</script>
```

## 路由使用

```js
/* eslint-disable prettier/prettier */
import Vue from 'vue';
import VueRouter from 'vue-router';

// 解决两次刷新路由报错问题
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push(location) {
  return originalReplace.call(this, location).catch(err => err)
}

const Fapiao = () => import(/* webpackChunkName: "fapiao" */ '../views/fapiao/Fapiao.vue');
const FapiaoInfo = () => import(/* webpackChunkName: "fapiao" */ '../views/fapiao/FapiaoInfo.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/fapiao',
    name: 'Fapiao',
    component: Fapiao,
    meta: {
      title: '开电子发票'
    },
    children: [
      {
        path: 'info',
        name: 'FapiaoInfo',
        component: FapiaoInfo,
        meta: {
          title: '开电子发票'
        }
      }
    ]
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
```

使用name代替path:

```js
this.$router.replace({ name: 'Fapiao', query: { ...this.appinfo } });
```
