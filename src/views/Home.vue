<script lang="ts" setup>
import { login } from '@/services/user.service';
import { ref } from 'vue';

const loggedInUser= ref()
login({username: 'lampv', password: 'pass'}).then(response => {
  loggedInUser.value = response.data
})
</script>
<template>
  <VContainer>
    <VCard title="Tao bo de thi ngau nhien">
      <VCardText>
        Tao bo de thi ngau nhien dua theo bo de cua bo gtvt
      </VCardText>
      <VCardActions>
        <VBtn block color="primary" variant="tonal" :to="{ name: 'CreateRandomExam' }">
          Tao ngay
        </VBtn>
      </VCardActions>
    </VCard>
  </VContainer>
</template>
<style lang="scss"></style>