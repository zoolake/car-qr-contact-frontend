<template>
  <div class="car-detail-page">
    <!-- 차량 정보 -->
    <header class="car-header">
      <div class="header-top">
        <div class="header-left">
          <h2 class="car-name">{{ car.nickname }}</h2>
          <p class="car-status">{{ car.message }}</p>
        </div>

        <!-- 상단 우측 버튼 영역 -->
        <div class="header-buttons">
          <img
            src="../assets/edit_button.png"
            class="icon-button edit"
            width="22px"
            height="22px"
            @click="openCarInfoEditModal(car)"
            alt="✏️"
          />
        </div>
      </div>
    </header>

    <!-- 연락처 목록 -->
    <main class="contact-list">
      <div v-for="contact in contacts" :key="contact.id" class="contact-card">
        <div class="contact-top">
          <div class="contact-title">
            <span class="contact-name">{{ contact.name || '닉네임' }}</span>
            <span class="contact-status" :class="{ unavailable: contact.status === '불가능' }">
              {{ contact.status }}
            </span>
          </div>
          <button class="menu-button" @click="openContactEditModal(contact)">⋮</button>
        </div>
        <p class="contact-phone">{{ contact.phoneNumber || '연락처' }}</p>
      </div>
    </main>

    <!-- 추가 버튼 -->
    <button class="add-button" @click="openContactRegisterModal">＋</button>

    <!-- 차량 정보 수정 모달 -->
    <div v-if="showCarInfoEditModal" class="modal-overlay" @click.self="closeCarInfoEdtiModal">
      <div class="modal-content">
        <h3>차량 정보 수정</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label>닉네임</label>
            <input v-model="carInfoEditForm.nickname" type="text" required />
          </div>
          <div class="form-group">
            <label>상태 메세지</label>
            <input v-model="carInfoEditForm.message" type="text" required />
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="updateCarInfo">저장</button>
            <button type="button" class="cancel-btn" @click="closeCarInfoEdtiModal">취소</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 연락처 수정 모달 -->
    <div v-if="showContactEditModal" class="modal-overlay" @click.self="closeContactEditModal">
      <div class="modal-content">
        <h3>연락처 수정</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label>이름</label>
            <input v-model="contactEditForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>전화번호</label>
            <input v-model="contactEditForm.phoneNumber" type="text" required />
          </div>
          <div class="form-group">
            <label>상태</label>
            <select v-model="contactEditForm.status">
              <option v-for="option in statusOptions" :value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="updateContact">저장</button>
            <button type="button" class="cancel-btn" @click="closeContactEditModal">취소</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 연락처 등록 모달 -->
    <div
      v-if="showContactRegisterModal"
      class="modal-overlay"
      @click.self="closeContactRegisterModal"
    >
      <div class="modal-content">
        <h3>연락처 등록</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label>이름</label>
            <input v-model="contactRegisterForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>전화번호</label>
            <input v-model="contactRegisterForm.phoneNumber" type="text" required />
          </div>
          <div class="form-group">
            <label>상태</label>
            <select v-model="contactRegisterForm.status">
              <option v-for="option in statusOptions" :value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="registerContact">저장</button>
            <button type="button" class="cancel-btn" @click="closeContactRegisterModal">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const { data } = history.state

/* 페이지 mount 시 api 호출 */
onMounted(async () => {
  readCarInfo(data.carId)
  readContacts(data.carId)
})

const car = ref({})

const contacts = ref([])

async function readCarInfo(carId) {
  try {
    const response = await fetch('/api/cars/' + carId, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    car.value = await response.json()
  } catch (err) {
    console.log(err)
  }
}

async function readContacts(carId) {
  try {
    const response = await fetch('/api/cars/' + carId + '/contacts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    contacts.value = await response.json()
  } catch (err) {
    console.log(err)
  }
}

const addContact = () => {
  const newId = contacts.value.length + 1
  contacts.value.push({
    id: newId,
    name: '',
    phoneNumber: '',
    status: '가능',
  })
}

/* 모달 창 */
const showCarInfoEditModal = ref(false)
const showContactEditModal = ref(false)
const showContactRegisterModal = ref(false)

const carInfoEditForm = ref({ id: null, nickname: '', statusMessage: '' })
const contactEditForm = ref({ id: null, name: '', phone: '', status: '' })
const statusOptions = ref([
  { text: '가능', value: 'AVAILABLE' },
  { text: '불가능', value: 'UNAVAILABLE' },
])
const contactRegisterForm = ref({ id: null, name: '', phone: '', status: 'AVAILABLE' })

const openCarInfoEditModal = (carInfo) => {
  carInfoEditForm.value = { ...carInfo }
  showCarInfoEditModal.value = true
}

const openContactEditModal = (contact) => {
  contactEditForm.value = { ...contact }
  showContactEditModal.value = true
}

const openContactRegisterModal = () => {
  showContactRegisterModal.value = true
}

const closeCarInfoEdtiModal = () => {
  showCarInfoEditModal.value = false
}

const closeContactEditModal = () => {
  showContactEditModal.value = false
}

const closeContactRegisterModal = () => {
  showContactRegisterModal.value = false
}

async function updateCarInfo() {
  try {
    const request = {
      nickname: carInfoEditForm.value.nickname,
      message: carInfoEditForm.value.message,
    }

    const response = await fetch('/api/cars/' + car.value.carId, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`차량 정보 수정 실패: ${errorData}`)
      return
    }
  } catch (err) {
    console.log(err)
  } finally {
    closeCarInfoEdtiModal()
    readCarInfo(car.value.carId)
  }
}

async function registerContact() {
  try {
    const request = {
      phoneNumber: contactRegisterForm.value.phoneNumber,
      name: contactRegisterForm.value.name,
      status: contactRegisterForm.value.status,
    }

    const response = await fetch('/api/cars/' + car.value.carId + '/contacts', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`연락처 등록 실패: ${errorData}`)
      return
    }
  } catch (err) {
    console.log(err)
  } finally {
    showContactRegisterModal.value = false
    readContacts(car.value.carId)
  }
}

async function updateContact() {
  try {
    const request = {
      phoneNumber: contactEditForm.value.phoneNumber,
      name: contactEditForm.value.name,
      status: contactEditForm.value.status,
    }

    const contactId = contactEditForm.value.contactId
    const response = await fetch('/api/contacts/' + contactId, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      alert(`연락처 수정 실패: ${errorData}`)
      return
    }
  } catch (err) {
    console.log(err)
  } finally {
    showContactEditModal.value = false
    readContacts(car.value.carId)
  }
}
</script>

<style scoped>
.car-detail-page {
  background-color: #f9fafb;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #333;
  position: relative;
}

/* 차량 상단 정보 */
.car-header {
  margin-bottom: 24px;
  text-align: left;
  line-height: 1.5;
}

/* 상단 구조 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.car-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.car-status {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

/* 상단 버튼 */
.header-buttons {
  display: flex;
  gap: 8px;
}

.icon-button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  transition:
    transform 0.2s ease,
    opacity 0.2s;
}

.icon-button:hover {
  transform: scale(1.15);
  opacity: 0.8;
}

.icon-button.delete:hover {
  color: #dc2626;
}

.icon-button.edit:hover {
  color: #2563eb;
}

/* 연락처 카드 리스트 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-card {
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.contact-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-name {
  font-size: 16px;
  font-weight: 500;
}

.contact-status {
  font-size: 13px;
  background: #e0edff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 8px;
}

.contact-status.unavailable {
  background: #f3f4f6;
  color: #9ca3af;
}

.menu-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
}

.contact-phone {
  margin: 8px 0 0 2px;
  font-size: 14px;
  color: #4b5563;
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
