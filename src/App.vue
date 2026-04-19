<script setup>
import Navbar from './components/Navbar.vue'
import SearchBar from './components/SearchBar.vue'
import NoteCard from './components/NoteCard.vue'
import NoteModal from './components/NoteModal.vue'
import { ref, onMounted, watch, computed } from 'vue'

const isModalOpen = ref(false)
const notes = ref([])
const editingNoteIndex = ref(null)
const editingNoteData = ref(null)
const currentSearchQuery = ref('')

// === 1. เพิ่มตัวแปรสำหรับระบบสลับโหมดคลาสสิก ===
const isClassic = ref(false)

const toggleTheme = () => {
  isClassic.value = !isClassic.value
}
// =======================================

onMounted(() => {
  const savedNotes = localStorage.getItem('my-wiki-notes-v2')
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes)
  }
})

watch(notes, (newNotes) => {
  localStorage.setItem('my-wiki-notes-v2', JSON.stringify(newNotes))
}, { deep: true })

const filteredNotes = computed(() => {
  if (!currentSearchQuery.value) return notes.value
  const lowerQuery = currentSearchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery)
  )
})

const handleSearch = (query) => {
  currentSearchQuery.value = query
}

const openModalForNew = () => {
  editingNoteIndex.value = null
  editingNoteData.value = null
  isModalOpen.value = true
}

const openModalForEdit = (noteDataToEdit) => {
  const actualIndex = notes.value.findIndex(n => n === noteDataToEdit)
  editingNoteIndex.value = actualIndex
  editingNoteData.value = noteDataToEdit
  isModalOpen.value = true
}

const handleSaveNote = (noteData) => {
  if (editingNoteIndex.value !== null) {
    notes.value[editingNoteIndex.value] = noteData
  } else {
    notes.value.unshift(noteData)
  }
  isModalOpen.value = false
}

const handleDeleteNote = (noteDataToDelete) => {
  if(confirm('แน่ใจนะว่าจะลบโน้ตนี้ทิ้ง?')) {
      const actualIndex = notes.value.findIndex(n => n === noteDataToDelete)
      notes.value.splice(actualIndex, 1)
  }
}

// 1. ฟังก์ชันส่งออกไฟล์ (Export)
const exportNotes = () => {
  const data = JSON.stringify(notes.value, null, 2); // แปลงโน้ตเป็นตัวหนังสือ JSON
  const blob = new Blob([data], { type: 'application/json' }); // สร้างก้อนข้อมูลไฟล์
  const url = URL.createObjectURL(blob); // สร้างลิงก์ชั่วคราว

  const link = document.createElement('a'); // สร้างปุ่มดาวน์โหลดล่องหน
  link.href = url;
  link.download = `my-wiki-backup-${new Date().toLocaleDateString()}.json`; // ตั้งชื่อไฟล์
  link.click(); // สั่งให้คอมดาวน์โหลดทันที!
};

// 2. ฟังก์ชันนำเข้าไฟล์ (Import) ที่แก้บั๊กแล้ว!
const importNotes = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        notes.value = importedData; // ทับข้อมูลเดิมด้วยข้อมูลใหม่ (เดี๋ยว watch มันจัดการเซฟให้เอง)
        alert('นำเข้าข้อมูลสำเร็จ!');
      } else {
        alert('ไฟล์นี้ไม่ใช่ไฟล์ Backup ของ My Wiki นะ!');
      }
    } catch (err) {
      alert('ไฟล์เสีย หรือไม่ใช่ไฟล์ .json ครับน้อง!');
    }
    event.target.value = ''; // เคลียร์ช่องให้กดโหลดไฟล์เดิมซ้ำได้
  };
  reader.readAsText(file);
};
</script>

<template>
  <div
    :class="isClassic ? 'bg-[#008080] font-mono' : 'bg-slate-50 font-sans'"
    class="min-h-screen flex flex-col"
    :style="isClassic ? '' : 'background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;'"
  >

    <Navbar :isClassic="isClassic" @toggle-theme="toggleTheme" />



    <main class="flex-grow w-full max-w-6xl mx-auto px-6 pb-12 pt-6">

      <div class="flex justify-end gap-3 mb-4">
        <button @click="exportNotes" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
          📥 Backup
        </button>

        <label class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer shadow-sm transition-all active:scale-95">
          📤 Restore
          <input type="file" @change="importNotes" class="hidden" accept=".json" />
        </label>
      </div>

      <SearchBar @search="handleSearch" />


      <div class="mt-8">
        <h2 :class="isClassic ? 'text-white drop-shadow-md' : 'text-slate-700'" class="text-xl font-semibold mb-6 px-2">Knowledge Base</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

          <div
            v-if="!isClassic"
            @click="openModalForNew"
            class="bg-white/80 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition-colors h-72"
          >
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl mb-3 shadow-sm hover:scale-105 transition-transform">+</div>
            <span class="text-blue-600 font-medium">สร้างโน้ตใหม่</span>
          </div>

          <div
            v-else
            @click="openModalForNew"
            class="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black cursor-pointer flex flex-col items-center justify-center h-72 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none"
          >
            <div class="bg-[#000080] text-white px-4 py-2 font-bold mb-3 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">NEW NOTE</div>
            <span class="text-black font-bold border-b border-black">สร้างโน้ตใหม่</span>
          </div>

          <NoteCard
            v-for="(note, index) in filteredNotes"
            :key="index"
            :title="note.title"
            :date="note.date"
            :content="note.content"
            :isClassic="isClassic"
            @edit="openModalForEdit(note)"
            @delete="handleDeleteNote(note)"
          />

        </div>

        <div v-if="notes.length > 0 && filteredNotes.length === 0" :class="isClassic ? 'text-white' : 'text-slate-400'" class="text-center py-12 mt-8">
          <span class="text-4xl block mb-4">?</span>
          หาโน้ตไม่เจอเลย ลองพิมพ์คำอื่นดูนะ
        </div>

        <div v-if="notes.length === 0" :class="isClassic ? 'text-white' : 'text-slate-400'" class="text-center py-12 mt-8">
          <span class="text-4xl block mb-4">👋</span>
          ยังไม่มีโน้ตเลย กดสร้างโน้ตใหม่ด้านบนได้เลย!
        </div>

      </div>
      
    </main>

    <NoteModal
      v-if="isModalOpen"
      :initialData="editingNoteData"
      @close="isModalOpen = false"
      @save="handleSaveNote"
    />

  </div>
</template>

<!-- <style>
/* สร้างคลาสพื้นหลังแบบขยับได้ โทนดาร์กนีออน-ไซอัน-ม่วง */
.animated-aurora-bg {
  /* ไล่สี 5 เฉด */
  background: linear-gradient(
    -45deg,
    #0f172a, /* สีกรมท่าดาร์กๆ */
    #3b0764, /* สีม่วงเข้ม */
    #0d9488, /* สีไซอัน (นีออน) */
    #1e1b4b  /* สีน้ำเงินเข้มลึก */
  );
  /* ขยายขนาดพื้นหลังให้ใหญ่ขึ้น 4 เท่า */
  background-size: 400% 400%;
  /* สั่งให้เล่นแอนิเมชันชื่อ moveAurora วนลูปไปเรื่อยๆ รอบละ 12 วินาที */
  animation: moveAurora 12s ease infinite;
}

/* คำสั่งบอกให้พื้นหลังเลื่อนตำแหน่งไปมา */
@keyframes moveAurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> -->
