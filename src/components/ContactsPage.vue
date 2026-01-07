<template>
  <div class="contact-list-page">
    <!-- 차량 정보 -->
    <header class="car-header">
      <h2 class="car-name">{{ car.nickname }}</h2>
      <p class="car-message">{{ car.message }}</p>
    </header>

    <!-- 연락처 목록 -->
    <main class="contact-list">
      <div v-for="contact in contacts" :key="contact.id" class="contact-card">
        <div class="contact-top">
          <div class="contact-title">
            <span class="contact-name">{{ contact.name || '닉네임' }}</span>
            <span
              class="contact-type"
              :class="{ main: contact.type === 'MAIN' }"
              v-if="contact.type === 'MAIN'"
            >
              {{ getContactTypeView(contact.type).label }}
            </span>
            <span class="contact-status" :class="{ unavailable: contact.status === 'UNAVAILABLE' }">
              {{ getContactStatusView(contact.status).label }}
            </span>
          </div>

          <!-- ⋮ 메뉴 -->
          <div class="menu-wrapper">
            <button class="menu-button" @click.stop="toggleMenu(contact.contactId)">⋮</button>

            <!-- 액션 팝업 -->
            <div v-if="openedMenuId === contact.contactId" class="action-menu">
              <button @click="openContactEditModal(contact)">수정</button>
              <!-- 메인 연락처는 삭제 불가 -->
              <button v-if="contact.type !== 'MAIN'" class="danger" @click="confirmDelete(contact)">
                삭제
              </button>
            </div>
          </div>
        </div>
        <p class="contact-phone">{{ formatPhoneNumber(contact.phoneNumber) || '연락처' }}</p>
      </div>
    </main>

    <!-- 추가 버튼 -->
    <button class="add-button" @click="openContactRegisterModal">＋</button>

    <!-- 연락처 수정 모달 -->
    <div v-if="showContactEditModal" class="modal-overlay" @click.self="closeContactEditModal">
      <div class="modal-content">
        <h3>연락처 수정</h3>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <div class="form-label">
              <label>이름</label><FormHint>3~12자, 특수문자 불가</FormHint>
            </div>
            <input v-model="contactEditForm.name" type="text" required />
          </div>
          <div class="form-group">
            <div class="form-label"><label>전화번호</label><FormHint>숫자만 입력</FormHint></div>
            <input
              v-model="contactEditForm.phoneNumber"
              type="text"
              required
              inputmode="numeric"
              @input="onPhoneNumberInput"
              :disabled="contactEditForm.type === 'MAIN'"
            />
          </div>
          <div class="form-group">
            <label>통화 가능 여부</label>
            <select v-model="contactEditForm.status">
              <option v-for="option in statusOptions" :value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" @click="handleUpdateContact">저장</button>
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
            <div class="form-label">
              <label>이름</label><FormHint>3~12자, 특수문자 불가</FormHint>
            </div>
            <input v-model="contactRegisterForm.name" type="text" required />
          </div>
          <div class="form-group">
            <div class="form-label"><label>전화번호</label><FormHint>숫자만 입력</FormHint></div>
            <input
              v-model="contactRegisterForm.phoneNumber"
              type="text"
              required
              inputmode="numeric"
              @input="onPhoneNumberInput"
            />
          </div>
          <!-- <div class="form-group">
            <label>통화 가능 여부</label>
            <select v-model="contactRegisterForm.status">
              <option v-for="option in statusOptions" :value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div> -->

          <div class="button-group">
            <button type="submit" class="save-btn" @click="handleRegisterContact">저장</button>
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
import { onMounted, ref, onUnmounted } from 'vue'
import { getContactStatusView } from '@/constants/ContactStatusView'
import { getContactTypeView } from '@/constants/ContactTypeView'
import { formatPhoneNumber } from '@/utils/Phone'
import {
  validateNickname,
  validateCarMessage,
  validateName,
  validatePhoneNumber,
} from '@/utils/Validation'
import FormHint from '@/components/common/FormHint.vue'
import { getCarInfo } from '@/api/CarApi'
import { getContacts, registerContact, updateContact, deleteContact } from '@/api/ContactApi'

const props = defineProps({
  carId: Number,
})

/* 페이지 mount 시 api 호출 */
onMounted(async () => {
  readCarInfo(props.carId)
  readContacts(props.carId)
})

const car = ref({})

const contacts = ref([])

async function readCarInfo(carId) {
  try {
    car.value = await getCarInfo(carId)
  } catch (e) {
    console.log(e)
  }
}

async function readContacts(carId) {
  try {
    contacts.value = await getContacts(carId)
  } catch (err) {
    console.log(err)
  }
}

/* 모달 창 */
const showContactEditModal = ref(false)
const showContactRegisterModal = ref(false)

const contactEditForm = ref({})
const statusOptions = ref([
  { text: '가능', value: 'AVAILABLE' },
  { text: '불가능', value: 'UNAVAILABLE' },
])
const contactRegisterForm = ref({ id: null, name: '', phoneNumber: '', status: 'AVAILABLE' })

const openedMenuId = ref(null)

const toggleMenu = (contactId) => {
  openedMenuId.value = openedMenuId.value === contactId ? null : contactId
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

const openContactEditModal = (contact) => {
  contactEditForm.value = { ...contact }
  showContactEditModal.value = true
  closeToggleMenu()
}

const openContactRegisterModal = () => {
  showContactRegisterModal.value = true
}

const closeContactEditModal = () => {
  showContactEditModal.value = false
}

const closeContactRegisterModal = () => {
  showContactRegisterModal.value = false
}

const onPhoneNumberInput = (e) => {
  e.target.value.replace(/\D/g, '')
}

const confirmDelete = (contact) => {
  closeToggleMenu()

  const confirmed = window.confirm('이 연락처를 삭제하시겠습니까?')

  if (!confirmed) return

  handleDeleteContact(contact)
}

async function handleDeleteContact(contact) {
  const contactId = contact.contactId
  const carId = car.value.carId

  try {
    await deleteContact(carId, contactId)
  } catch (err) {
    console.log(err)
  } finally {
    readContacts(carId)
  }
}

async function handleRegisterContact() {
  try {
    const name = contactRegisterForm.value.name
    const phoneNumber = contactRegisterForm.value.phoneNumber
    const status = contactRegisterForm.value.status

    const nameError = validateName(name)
    if (nameError) {
      alert(nameError)
      return
    }

    const phoneNumberError = validatePhoneNumber(phoneNumber)
    if (phoneNumberError) {
      alert(phoneNumberError)
      return
    }

    await registerContact({ phoneNumber, name, status }, car.value.carId)

    showContactRegisterModal.value = false
    contactRegisterForm.value = {}
    readContacts(car.value.carId)
  } catch (err) {
    alert('연락처 등록에 실패하였습니다.')
  } finally {
  }
}

async function handleUpdateContact() {
  try {
    const name = contactEditForm.value.name
    const phoneNumber = contactEditForm.value.phoneNumber
    const status = contactEditForm.value.status

    const nameError = validateName(name)
    if (nameError) {
      alert(nameError)
      return
    }

    const phoneNumberError = validatePhoneNumber(phoneNumber)
    if (phoneNumberError) {
      alert(phoneNumberError)
      return
    }

    await updateContact({ phoneNumber, name, status }, contactEditForm.value.contactId)
    showContactEditModal.value = false
    readContacts(car.value.carId)
  } catch (err) {
    alert('연락처 정보 수정에 실패하였습니다.')
  } finally {
  }
}
</script>
