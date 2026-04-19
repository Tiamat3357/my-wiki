<script setup>
defineProps({
  isClassic: Boolean
})
defineEmits(['toggle-theme'])
</script>

<template>
  <nav :class="isClassic ? 'bg-[#c0c0c0] border-b-2 border-b-black border-t-2 border-t-white' : 'bg-white border-b border-slate-200'" class="w-full sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

      <h1 :class="isClassic ? 'text-[#000080]' : 'text-slate-800'" class="text-2xl font-bold tracking-tight">My Wiki</h1>

      <button
        @click="$emit('toggle-theme')"
        :class="isClassic
          ? 'px-4 py-1 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white font-bold text-sm'
          : 'px-4 py-2 rounded-lg font-medium text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        {{ isClassic ? 'Modern' : 'Classic' }}
      </button>

    </div>
  </nav>
</template>
