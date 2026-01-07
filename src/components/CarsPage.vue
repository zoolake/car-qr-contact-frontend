<template>
  <div class="car-list-page">
    <!-- 👋 사용자 정보 헤더 -->
    <header class="header">
      <p class="greeting">안녕하세요</p>
      <p class="user-phone">{{ formatPhoneNumber(phoneNumber) }} 님</p>
    </header>

    <!-- 차량 목록 -->
    <main class="car-list">
      <div v-for="car in cars" :key="car.carId" class="car-card" @click="goToContactsPage(car)">
        <img :src="car.imageUrl" alt="car image" class="car-image" />
        <div class="car-info">
          <h2 class="car-name">{{ car.nickname }}</h2>
          <p class="car-desc">{{ car.message }}</p>
        </div>
        <!-- ⋮ 메뉴 -->
        <div class="menu-wrapper">
          <button class="menu-button" @click.stop="toggleMenu(car.carId)">⋮</button>
          <!-- 액션 팝업 -->
          <div v-if="openedMenuId === car.carId" class="action-menu">
            <button @click.stop="openCarInfoEditModal(car)">수정</button>
            <button class="danger" @click.stop="confirmDelete(car)">삭제</button>
          </div>
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
            <div class="form-label">
              <label>닉네임</label><FormHint>3~12자, 특수문자 불가</FormHint>
            </div>
            <input v-model="carRegisterForm.nickname" type="text" required maxlength="12" />
          </div>
          <div class="form-group">
            <div class="form-label"><label>상태 메세지</label><FormHint>최대 30자</FormHint></div>
            <input v-model="carRegisterForm.message" type="text" required maxlength="30" />
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="handleRegisterCar">저장</button>
            <button type="button" class="cancel-btn" @click="closeCarRegisterModal">취소</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 차량 정보 수정 모달 -->
    <div v-if="showCarInfoEditModal" class="modal-overlay" @click.self="closeCarInfoEdtiModal">
      <div class="modal-content">
        <h3>차량 정보 수정</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <div class="form-label">
              <label>닉네임</label><FormHint>3~12자, 특수문자 불가</FormHint>
            </div>
            <input v-model="carInfoEditForm.nickname" type="text" required maxlength="12" />
          </div>
          <div class="form-group">
            <div class="form-label"><label>상태 메세지</label><FormHint>최대 30자</FormHint></div>
            <input v-model="carInfoEditForm.message" type="text" required maxlength="30" />
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="handleUpdateCarInfo">저장</button>
            <button type="button" class="cancel-btn" @click="closeCarInfoEdtiModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatPhoneNumber } from '@/utils/Phone'
import { validateNickname, validateCarMessage } from '@/utils/Validation'
import FormHint from '@/components/common/FormHint.vue'
import { getCars, registerCar, updateCarInfo, deleteCar } from '@/api/CarApi'

const router = useRouter()

const phoneNumber = ref() // 사용자 전화번호
const cars = ref([]) // 등록 차량

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

const openedMenuId = ref(null)

const toggleMenu = (carId) => {
  openedMenuId.value = openedMenuId.value === carId ? null : carId
}

const closeToggleMenu = () => {
  openedMenuId.value = null
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.menu-wrapper')) {
    closeToggleMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const showCarInfoEditModal = ref(false)
const carInfoEditForm = ref({})

const openCarInfoEditModal = (carInfo) => {
  carInfoEditForm.value = { ...carInfo }
  showCarInfoEditModal.value = true
  closeToggleMenu()
}

const closeCarInfoEdtiModal = () => {
  showCarInfoEditModal.value = false
}

function goToContactsPage(car) {
  router.push({
    name: 'contacts',
    query: {
      carId: String(car.carId),
    },
  })
}

async function readCars() {
  try {
    const response = await getCars()
    phoneNumber.value = response.phoneNumber
    cars.value = response.cars
  } catch (e) {
    console.log(e)
  }
}

async function handleRegisterCar() {
  try {
    const nickname = carRegisterForm.value.nickname
    const message = carRegisterForm.value.message

    const nicknameError = validateNickname(nickname)
    if (nicknameError) {
      alert(nicknameError)
      return
    }

    const messageError = validateCarMessage(message)
    if (messageError) {
      alert(messageError)
      return
    }

    await registerCar({ nickname, message })
    showCarRegisterModal.value = false
    readCars()
  } catch (err) {
    console.log(err)
  } finally {
  }
}

async function handleUpdateCarInfo() {
  try {
    const carNickname = carInfoEditForm.value.nickname
    const carMessage = carInfoEditForm.value.message

    const nicknameError = validateNickname(carNickname)
    if (nicknameError) {
      alert(nicknameError)
      return
    }

    const messageError = validateCarMessage(carMessage)
    if (messageError) {
      alert(messageError)
      return
    }

    const request = {
      nickname: carNickname,
      message: carMessage,
    }

    const carId = carInfoEditForm.value.carId

    await updateCarInfo(request, carId)
    closeCarInfoEdtiModal()
    readCars()
  } catch (err) {
    console.log(err)
  } finally {
  }
}

const confirmDelete = (car) => {
  closeToggleMenu()

  const confirmed = window.confirm('차량을 삭제하시겠습니까?')

  if (confirmed) {
    handleDeleteCar(car)
  }
}

async function handleDeleteCar(car) {
  const carId = car.carId
  try {
    await deleteCar(carId)
  } catch (err) {
    console.log(err)
  } finally {
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

.menu-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
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

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
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

.action-menu {
  position: absolute;
  top: 28px;
  right: 0;
  min-width: 100px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  z-index: 10;
  overflow: hidden;
}

.action-menu button {
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
}

.action-menu button:hover {
  background: #f5f5f5;
}

.action-menu button.danger {
  color: #e53935;
}
</style>
