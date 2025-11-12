<template>
  <div class="car-list-page">
    <!-- 👋 사용자 정보 헤더 -->
    <header class="header">
      <p class="greeting">안녕하세요 👋</p>
      <p class="user-phone">{{ userPhone }} 님</p>
    </header>

    <!-- 차량 목록 -->
    <main class="car-list">
      <div v-for="car in cars" :key="car.carId" class="car-card" @click="goToContactsPage(car)">
        <img :src="car.imageUrl" alt="car image" class="car-image" />
        <div class="car-info">
          <h2 class="car-name">{{ car.nickname }}</h2>
          <p class="car-desc">{{ car.message }}</p>
        </div>
      </div>
      <div class="empty-container" v-if="cars.length <= 0">
        <p class="empty-text">아직 등록된 차량이 없어요 😢</p>
      </div>
    </main>

    <!-- 등록 버튼 -->
    <button class="add-button" @click="openContactRegisterModal">+</button>

    <!-- 연락처 등록 모달 -->
    <div v-if="showCarRegisterModal" class="modal-overlay" @click.self="closeCarRegisterModal">
      <div class="modal-content">
        <h3>차량 등록</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label>닉네임</label>
            <input v-model="carRegisterForm.nickname" type="text" required />
          </div>
          <div class="form-group">
            <label>상태 메세지</label>
            <input v-model="carRegisterForm.message" type="text" required />
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="registerCar">저장</button>
            <button type="button" class="cancel-btn" @click="closeCarRegisterModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 사용자 전화번호 (나중에 로그인 정보에서 가져오면 됨)
const userPhone = ref('010-7900-7514')

// 차량 데이터 예시
const cars = ref([])

/* 페이지 mount 시 api 호출 */
onMounted(async () => {
  readCars()
})

/* 모달 창 */
const showCarRegisterModal = ref(false)
const carRegisterForm = ref({ nickname: '', message: '' })
const openContactRegisterModal = () => {
  showCarRegisterModal.value = true
}
const closeCarRegisterModal = () => {
  showCarRegisterModal.value = false
}

function goToContactsPage(car) {
  router.push({
    name: 'contacts',
    state: {
      data: {
        carId: car.carId,
        nickname: car.nickname,
        statusMessage: car.message,
      },
    },
  })
}

function goToRegister() {
  router.push('/cars/register')
}

async function readCars() {
  try {
    const userId = 3
    const response = await fetch('/api/users/' + userId + '/cars', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    cars.value = await response.json()
  } catch (err) {
    console.log(err)
  }
}

async function registerCar() {
  try {
    const request = {
      nickname: carRegisterForm.value.nickname,
      message: carRegisterForm.value.message,
    }

    const userId = 3 // 추후 수정 필요
    const response = await fetch('/api/users/' + userId + '/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`차량 등록 실패: ${errorData}`)
      return
    }
  } catch (err) {
    console.log(err)
  } finally {
    showCarRegisterModal.value = false
    readCars()
  }
}
</script>

<style>
.car-list-page {
  background-color: #f9fafb;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #333;
  position: relative;
}

/* 👤 사용자 정보 영역 */
.header {
  margin-bottom: 24px;
  text-align: left;
  line-height: 1.5;
}

.greeting {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.user-phone {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

/* 차량 카드 */
.car-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.car-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.car-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
}

.car-info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.car-info {
  flex: 1;
}

.car-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.car-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.car-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}

/* 0건 일때 등록 안내 문구 */
.empty-container {
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center; /* 세로 중앙 */
  height: calc(100vh - 200px); /* 상단 header 높이만큼 빼서 조정 (필요시 수정) */
}

.empty-text {
  font-size: 15px;
  color: #555;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.25s ease;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.save-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
  color: black;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* + 버튼 */
.add-button {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    background 0.2s,
    color 0.2s;
}

.add-button:hover {
  background: #2563eb;
  color: white;
}
</style>
