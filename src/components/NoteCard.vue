<script setup>
// ลบ const props และ const emit ออกถ้าไม่ได้ใช้ใน script เพื่อลดเส้นหยัก
defineProps({
  title: String,
  date: String,
  content: String,
  isClassic: Boolean
})

defineEmits(['delete', 'edit'])
</script>

<template>
  <div
    v-if="!isClassic"
    @click="$emit('edit')"
    class="relative group bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-72 flex flex-col overflow-hidden"
  >
    <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
      <button @click.stop="$emit('delete')" class="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="flex-shrink-0 relative z-10">
      <h3 class="text-lg font-bold text-white mb-1 pr-8 truncate">{{ title }}</h3>
      <p class="text-[10px] text-blue-400/80 font-medium uppercase tracking-wider mb-4">{{ date }}</p>
    </div>

    <div class="bg-slate-800/40 text-slate-300 p-4 rounded-2xl relative flex-grow overflow-hidden border border-white/5 backdrop-blur-sm">
      <pre class="text-xs font-sans whitespace-pre-wrap break-words leading-relaxed">{{ content }}</pre>
      <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none"></div>
    </div>
  </div>

  <div
    v-else
    @click="$emit('edit')"
    class="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer active:shadow-none active:translate-x-1 active:translate-y-1 h-72 flex flex-col"
  >
    <div class="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-3">
        <span class="text-xs font-bold truncate">📄 {{ title }}</span>
        <button @click.stop="$emit('delete')" class="bg-[#c0c0c0] text-black px-1 text-[10px] border border-t-white border-l-white border-b-black border-r-black">X</button>
    </div>
    <div class="bg-white border-2 border-b-white border-r-white border-t-gray-800 border-l-gray-800 p-2 flex-grow overflow-hidden">
        <pre class="text-xs text-black font-mono whitespace-pre-wrap">{{ content }}</pre>
    </div>
  </div>
</template>
