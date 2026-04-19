<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

watch(searchQuery, (newVal) => {
  emit('search', newVal)
})
</script>

<template>
  <div class="w-full max-w-3xl mx-auto mt-8 px-4">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-slate-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาโค้ด หรือโน้ตที่จดไว้..."
        class="w-full py-4 pl-12 pr-4 bg-white text-slate-700 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4C5744] transition-all duration-300"
      />
    </div>
  </div>
</template>
