<script setup>
import { ref } from 'vue'

defineProps({
  isClassic: Boolean
})

defineEmits(['search'])

const searchQuery = ref('')
</script>

<template>
  <div class="relative w-full max-w-3xl mx-auto my-6 group">

    <div v-if="!isClassic" class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

    <input
      v-model="searchQuery"
      @input="$emit('search', searchQuery)"
      type="text"
      placeholder="ค้นหาโค้ด หรือโน้ตที่จดไว้..."
      :class="[
        isClassic
          ? 'w-full bg-white border-4 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-4 py-3 font-mono text-black placeholder-gray-500 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
          : 'w-full relative bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 text-white px-14 py-4 rounded-2xl shadow-2xl focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 placeholder-slate-500'
      ]"
    />

    <svg
      v-if="!isClassic"
      class="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>

    <div
      v-else
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black px-2 py-0.5 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
    >
      <span class="font-mono font-bold text-black text-sm">SEARCH</span>
    </div>

  </div>
</template>
