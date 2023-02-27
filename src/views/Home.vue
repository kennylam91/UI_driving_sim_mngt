<script lang="ts" setup>
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