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
