<template>
  <div class="login-page">
    <main class="card" role="main">
      <h1 class="brand">chacall</h1>

      <form @submit.prevent="onSubmit" novalidate>
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

const router = useRouter()

const form = reactive({
  phoneNumber: '',
  password: '',
})

const errors = reactive({ phoneNumber: '', password: '' })
const submitting = ref(false)

function validate() {
  errors.phoneNumber = ''
  errors.password = ''

  const phoneNumberRegex = /^\+?\d{9,15}$/
  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = '핸드폰 번호를 입력해주세요.'
  } else if (!phoneNumberRegex.test(form.phoneNumber.trim())) {
    errors.phoneNumber = '유효한 전화번호를 입력해주세요.'
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.'
  }

  return !errors.phoneNumber && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true

  try {
    const payload = {
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
    }

    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`로그인 실패: ${errorData.message || response.statusText}`)
      return
    }

    // const data = await response.json()
    // console.log('로그인 성공:', data)

    await router.push('/cars')
  } catch (err) {
    console.error(err)
    alert('서버 요청 중 오류가 발생했습니다.')
  } finally {
    submitting.value = false
  }
}
</script>

<style>
:root {
  --main-blue: #1e90ff;
  --muted: #6b7280;
  --bg: #ffffff;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  padding: 28px;
}

.brand {
  margin: 0 0 18px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--main-blue);
  text-align: center;
}

.field {
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #111827;
}

.field input[type='tel'],
.field input[type='password'] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6e9ee;
  font-size: 14px;
  outline: none;
}

.field input:focus {
  box-shadow: 0 0 0 4px rgba(30, 144, 255, 0.08);
  border-color: var(--main-blue);
}

.error {
  margin-top: 6px;
  color: #ef4444;
  font-size: 13px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.btn {
  background: var(--main-blue);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  min-width: 140px;
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--muted);
}
.signup-link a {
  color: var(--main-blue);
  text-decoration: none;
}
</style>
