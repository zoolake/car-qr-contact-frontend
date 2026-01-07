<template>
  <div class="login-page">
    <main class="card" role="main">
      <h1 class="brand">chacall</h1>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="field">
          <label for="phoneNumber">아이디 (핸드폰 번호)</label>
          <input
            id="phoneNumber"
            v-model="form.phoneNumber"
            type="tel"
            inputmode="tel"
            placeholder="01012345678"
            autocomplete="tel"
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
            autocomplete="current-password"
            placeholder="비밀번호 입력"
            required
          />
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <div class="actions">
          <button :disabled="submitting" type="submit" class="btn">
            {{ submitting ? '로그인 중...' : '로그인' }}
          </button>
        </div>
      </form>

      <p class="signup-link">아직 계정이 없으신가요? <a href="/signup">회원가입</a></p>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/UserApi'
import { validatePassword, validatePhoneNumber } from '@/utils/Validation'

const router = useRouter()

const form = reactive({
  phoneNumber: '',
  password: '',
})

const errors = reactive({ phoneNumber: '', password: '' })
const submitting = ref(false)

function validate() {
  errors.phoneNumber = validatePhoneNumber(form.phoneNumber.trim())
  errors.password = validatePassword(form.password)

  return !errors.phoneNumber && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  submitting.value = true

  try {
    const request = {
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
    }

    await login(request)

    localStorage.setItem('loggedIn', 'true')
    await router.push({
      name: 'cars',
    })
  } catch (err) {
    alert(`로그인에 실패하였습니다. 아이디와 비밀번호를 확인해 주세요.`)
  } finally {
    submitting.value = false
  }
}
</script>
