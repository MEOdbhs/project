<template>
  <div class="new-login">
    <!-- <div class="logo"></div> -->
    <div class="login-box">
      <div class="title">{{ title }}</div>
      <div class="login-form">
        <div class="login-form-box">
          <a-form ref="loginRef" :model="formData" :rules="rules" @keyup.enter.native="loginHandleClick">
            <div class="aui-account">
              <div class="aui-inputClear">
                <a-form-item name="username">
                  <a-input class="form-input" v-model:value="formData.username" allowClear>
                    <template #prefix>
                      <UserOutlined style="color: rgba(255, 255, 255, 0.8); font-size: 20px" />
                    </template>
                  </a-input>
                </a-form-item>
              </div>
              <div class="aui-inputClear">
                <a-form-item name="password">
                  <a-input-password  class="form-input"  v-model:value="formData.password" allowClear visibilityToggle>
                    <template #prefix>
                      <LockOutlined style="color: rgba(255, 255, 255, 0.8); font-size: 20px" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>
              <div class="aui-inputCode">
                <a-form-item name="inputCode">
                  <a-input class="form-input" type="text" v-model:value="formData.inputCode" allowClear>
                    <template #prefix>
                      <SafetyCertificateOutlined style="color: rgba(255, 255, 255, 0.8); font-size: 20px" />
                    </template>
                  </a-input>
                </a-form-item>
                <div class="aui-code">
                  <img v-if="randCodeData.requestCodeSuccess" :src="randCodeData.randCodeImage" @click="handleChangeCheckCode" />
                  <img v-else style="margin-top: 2px; max-width: initial" :src="codeImg" @click="handleChangeCheckCode" />
                </div>
              </div>
              <div class="aui-inputClear">
                <a-form-item>
                    <a-checkbox v-model:checked="formData.rememberMe">保持登录</a-checkbox>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
        <div class="login-submit-btn">
          <a-button :loading="loginLoading" class="aui-link-login" type="primary" @click="loginHandleClick"> 安全登录</a-button>
        </div>
      </div>
    </div>
    <!-- <div class="tip">版本所有：成都智谷耘行信息技术有限公司&emsp;&emsp;技术支持：成都智谷耘行信息技术有限公司</div> -->
  </div>
</template>
<script lang="ts" setup name="login-mini">
  import { getCodeInfo } from '/@/api/sys/user';
  import { onMounted, reactive, ref, toRaw, unref } from 'vue';
  import codeImg from '/@/assets/images/checkcode.png';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
  import { useGlobSetting } from '/@/hooks/setting';

  const { notification, createMessage } = useMessage();
  const userStore = useUserStore();
  const { title } = useGlobSetting();
  const randCodeData = reactive<any>({
    randCodeImage: '',
    requestCodeSuccess: false,
    checkKey: null,
  });
  const rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    inputCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  };
  //手机号登录还是账号登录
  const activeIndex = ref<string>('accountLogin');
  //账号登录表单字段
  const formData = reactive<any>({
    rememberMe: false,
    inputCode: '',
    username: '',
    password: '',
  });

  const loginRef = ref();
  const loginLoading = ref<boolean>(false);

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  /**
   * 获取验证码
   */
  function handleChangeCheckCode() {
    formData.inputCode = '';

    randCodeData.checkKey = 1629428467008;
    getCodeInfo(randCodeData.checkKey).then((res) => {
      randCodeData.randCodeImage = res;
      randCodeData.requestCodeSuccess = true;
    });
  }

  /**
   * 账号或者手机登录
   */
  async function loginHandleClick() {
    if (unref(activeIndex) === 'accountLogin') {
      loginRef.value.validate().then(() => {
        accountLogin();
      });
    }
  }

  async function accountLogin() {
    if (!formData.username) {
      createMessage.warn('请输入账号');
      return;
    }
    if (!formData.password) {
      createMessage.warn('请输入密码');
      return;
    }
    try {
      loginLoading.value = true;
      const { userInfo } = await userStore.login(
        toRaw({
          password: formData.password,
          username: formData.username,
          captcha: formData.inputCode,
          checkKey: randCodeData.checkKey,
          mode: 'none', //不要默认的错误提示
        })
      );
      localStorage.setItem('rememberMe', formData.rememberMe);
      if (userInfo) {
        notification.success({
          message: '登录成功',
          description: `'欢迎回来': ${userInfo.realname}`,
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: '错误提示',
        description: error.message || '网络异常，请检查您的网络连接是否正常!',
        duration: 3,
      });
      handleChangeCheckCode();
    } finally {
      loginLoading.value = false;
    }
  }

  onMounted(() => {
    //加载验证码
    handleChangeCheckCode();
    let rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
      formData.rememberMe = true;
    }
  });
</script>

<style lang="less" scoped>
  .new-login {
    position: relative;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: url(/@/assets/business/img/bg_new.png) no-repeat;
    background-size: 100% 100%;

    .logo {
      position: absolute;
      top: 4vh;
      left: 4vh;
      width: 8vh;
      height: 8vh;
      background: url(/@/assets/business/img/sys-logo.png) no-repeat;
      background-size: 100% 100%;
    }

    .login-box {
      position: absolute;
      top: 40%;
      right: 10%;
      width: 622px;
      height: 528px;
      margin-top: -188px;
      background: rgba(16, 16, 16, 0.25);
      background: url(/@/assets/business/img/login-form-bg.png) no-repeat !important;
      background-size: 100% 100% !important;

      .title {
        height: 35%;
        width: 100%;
        color: #00aeba;
        text-align: center;
        background: linear-gradient(0deg, #f0ffff 0%, #b6fffd 54.2724609375%, #83b8ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 400;
        font-size: 36px;
        color: #ffffff;
        line-height: 12.5rem;
        text-shadow: 0px 2px 7px rgba(39, 6, 221, 0.43);
      }

      .input {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        // width: 60%;
        height: 48px;
        padding: 0 40px 0 20px;
        font-size: 14px;
        line-height: 48px;
        color: #2ec3d3;
        background: rgba(37, 93, 164, 0.5);
        border: 2px solid #024c44;
        border-radius: 5px;
        outline: none;
      }
    }

    .login-form-box {
      width: 364.8px;
      margin: 0 auto;

      .form-input {
        height: 48px;
        line-height: 48px;
        background: transparent;
        border: 1px solid #409eff;
        border-radius: 5px;
        outline: none;

        :deep(.ant-input) {
          background: transparent !important;
          color: #ffffff !important;
        }
        :deep(.ant-input-clear-icon) {
          color: #ffffff;
        }
      }

      .form-input:hover,
      .form-input:focus {
        border-color: #00eaff !important;
      }

      .aui-inputCode {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .aui-code {
          margin-bottom: 24px;
          cursor: pointer;
        }
      }
      .aui-inputClear {
        background: transparent !important;
        border: none !important;
      }
    }

    .login-submit-btn {
      // width: 364.8px;
      margin: 0 auto;
      width: 370px;
      height: 48px;
      background: linear-gradient(0deg, #65b9e3 0%, #1d65ca 100%);
      border-radius: 0px 4px 4px 0px;
      border: 1px solid #21deff;

      .ant-btn {
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: #fff;
        background: transparent;
        border: none;
        outline: none;
        font-size: 26px;
        text-shadow: 0px 3px 4px rgba(0, 199, 217, 0.35);

        span {
          letter-spacing: 10px;
        }
      }

      .ant-btn:hover,
      .ant-btn:focus {
        background: #00eaff;
      }
    }

    .tip {
      position: absolute;
      color: #66b1ff;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
    }
  }

  :deep(.ant-form-item){
    margin-bottom: 16px;
  }
</style>
