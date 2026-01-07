<template>
  <div class="signup-page">
    <main class="card" role="main">
      <h1 class="brand">chacall</h1>

      <form @submit.prevent="handleSignup" novalidate>
        <div class="field">
          <label for="phoneNumber">아이디 (핸드폰 번호)</label>
          <input
            id="phoneNumber"
            v-model="form.phoneNumber"
            type="tel"
            inputmode="tel"
            placeholder="예) 01012345678"
            autocomplete="tel"
            aria-describedby="phoneNumberHelp"
            required
          />
          <p v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</p>
        </div>

        <div class="field">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호 입력 (8~16자, 영문/숫자/특수문자 포함)"
          />
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <div class="field">
          <label for="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호 확인"
          />
          <p v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</p>
        </div>

        <div class="actions">
          <button :disabled="submitting" type="submit" class="btn" v-on:click="handleSignup">
            {{ submitting ? '등록중...' : '회원가입' }}
          </button>
        </div>
      </form>

      <p class="signin-link">이미 계정이 있으신가요? <a href="/login">로그인</a></p>
    </main>
  </div>
</template>

<script setup>
import { signup } from '@/api/UserApi'
import { validatePasswordForSignup, validatePhoneNumber } from '@/utils/Validation'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  phoneNumber: '',
  password: '',
  passwordConfirm: '',
})

const errors = reactive({ phoneNumber: '', password: '', passwordConfirm: '' })
const submitting = ref(false)

function validate() {
  errors.phoneNumber = validatePhoneNumber(form.phoneNumber.trim())
  errors.password = validatePasswordForSignup(form.password)
  errors.passwordConfirm = ''

  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
  }

  return !errors.phoneNumber && !errors.name && !errors.password && !errors.passwordConfirm
}

async function handleSignup() {
  if (!validate()) {
    return
  }
  submitting.value = true

  try {
    const request = {
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
    }

    await signup(request)

    alert('회원가입이 완료되었습니다!')
    await router.push('/login')

    // 폼 초기화
    form.password = ''
    form.passwordConfirm = ''
  } catch (err) {
    console.error(err)
    alert('회원가입에 실패하였습니다.')
  } finally {
    submitting.value = false
  }
}
</script>
