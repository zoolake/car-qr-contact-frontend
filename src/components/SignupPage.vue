<template>
  <div class="signup-page">
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
            placeholder="비밀번호 입력"
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
          <button :disabled="submitting" type="submit" class="btn" v-on:click="onSubmit">
            {{ submitting ? '등록중...' : '회원가입' }}
          </button>
        </div>
      </form>

      <p class="signin-link">이미 계정이 있으신가요? <a href="/login">로그인</a></p>
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
  passwordConfirm: '',
})

const errors = reactive({ phoneNumber: '', password: '', passwordConfirm: '' })
const submitting = ref(false)

function validate() {
  errors.phoneNumber = ''
  errors.password = ''
  errors.passwordConfirm = ''

  const phoneNumberClean = form.phoneNumber.trim()
  const phoneNumberRegex = /^\+?\d{9,15}$/
  if (!phoneNumberClean) {
    errors.phoneNumber = '핸드폰 번호를 입력해주세요.'
  } else if (!phoneNumberRegex.test(phoneNumberClean)) {
    errors.phoneNumber = '유효한 전화번호를 입력해주세요. (숫자만, 9~15자리)'
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (form.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
  }

  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
  }

  return !errors.phoneNumber && !errors.name && !errors.password && !errors.passwordConfirm
}

async function onSubmit() {
  if (!validate()) {
    return
  }
  submitting.value = true

  try {
    const payload = {
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
    }

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`회원가입 실패: ${errorData.message || response.statusText}`)
      return
    }

    alert('회원가입이 완료되었습니다!')
    await router.push('/login')

    // 폼 초기화
    //form.password = ''
    //form.passwordConfirm = ''
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

.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 420px;
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

.field input[type='text'],
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

.help {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
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

.signin-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--muted);
}
.signin-link a {
  color: var(--main-blue);
  text-decoration: none;
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
    border-radius: 10px;
  }
  .brand {
    font-size: 24px;
  }
}
</style>
