<template>
  <span class="form-hint">
    <slot />
  </span>
</template>

<script setup>
// 별도 로직 없음 (순수 UI 컴포넌트)
</script>

<style scoped>
.form-hint {
  font-size: 12px;
  color: #9aa0a6; /* 옅은 회색 */
}
</style>
