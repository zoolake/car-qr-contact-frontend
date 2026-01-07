<template>
  <div class="car-detail-page">
    <!-- 차량 정보 -->
    <header class="car-header">
      <div class="header-top">
        <div class="header-left">
          <h2 class="car-name">{{ carNickname }}</h2>
          <p class="car-status">{{ carMessage }}</p>
        </div>
      </div>
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
          <img
            src="../assets/copy_button.png"
            class="icon-button edit"
            width="18px"
            height="18px"
            @click="copyPhoneNumber(contact.phoneNumber)"
          />
        </div>
        <p class="contact-phone" @click="call(contact.phoneNumber)">
          {{ formatPhoneNumber(contact.phoneNumber) }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getContactStatusView } from '@/constants/ContactStatusView'
import { getContactTypeView } from '@/constants/ContactTypeView'
import { formatPhoneNumber } from '@/utils/Phone'
import { getCarInfoByScanningQR } from '@/api/QRApi'

const route = useRoute()

/* 페이지 mount 시 api 호출 */
onMounted(async () => {
  readCarInfo(route.params.serialNo)
})

const carNickname = ref()
const carMessage = ref()
const contacts = ref([])

const call = (phoneNumber) => {
  if (!phoneNumber) return
  window.location.href = `tel:${phoneNumber}`
}

function copyPhoneNumber(phoneNumber) {
  navigator.clipboard.writeText(phoneNumber)
  alert('클립보드에 복사되었습니다.')
}

async function readCarInfo(serialNo) {
  try {
    const response = await getCarInfoByScanningQR(serialNo)

    carNickname.value = response.carNickname
    carMessage.value = response.carMessage
    contacts.value = response.contacts
  } catch (err) {
    console.log(err)
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
  background: #ffc3cc;
  color: #ff4040;
}

.contact-type.main {
  font-size: 13px;
  background: #defdcf;
  color: #31a71c;
  padding: 2px 8px;
  border-radius: 8px;
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
