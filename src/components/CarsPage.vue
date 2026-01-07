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
