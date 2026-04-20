<script setup>
import Navbar from './components/Navbar.vue'
import SearchBar from './components/SearchBar.vue'
import NoteCard from './components/NoteCard.vue'
import NoteModal from './components/NoteModal.vue'
import { ref, onMounted, computed } from 'vue'

// --- 🌟 อาวุธลับ: นำเข้า Firebase ---
import { db } from './firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

const isModalOpen = ref(false)
const notes = ref([])
const editingNoteData = ref(null)
const currentSearchQuery = ref('')
const isClassic = ref(false)

// ชี้เป้าไปที่คอลเลกชันชื่อ "notes" ในฐานข้อมูล Firestore
const notesCollection = collection(db, 'notes')

const toggleTheme = () => {
  isClassic.value = !isClassic.value
}

// --- 📡 1. ฟังก์ชันดึงข้อมูลจาก Cloud (มาแทน LocalStorage) ---
const fetchNotes = async () => {
  try {
    const querySnapshot = await getDocs(notesCollection)
    const loadedNotes = []
    querySnapshot.forEach((doc) => {
      // เอา id จาก Cloud มาแปะติดไว้กับข้อมูลโน้ตด้วย (สำคัญมากตอนสั่งลบ/แก้)
      loadedNotes.push({ id: doc.id, ...doc.data() })
    })
    notes.value = loadedNotes
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล: ", error)
    alert("โหลดข้อมูลไม่ได้ครับ ลองเช็กเน็ตดูนะ!")
  }
}

// โหลดข้อมูลทันทีที่เปิดเว็บ
onMounted(() => {
  fetchNotes()
})

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
  editingNoteData.value = null
  isModalOpen.value = true
}

const openModalForEdit = (noteDataToEdit) => {
  editingNoteData.value = noteDataToEdit
  isModalOpen.value = true
}

// --- 🚀 2. ฟังก์ชันเซฟข้อมูลขึ้น Cloud ---
const handleSaveNote = async (noteData) => {
  try {
    if (editingNoteData.value && editingNoteData.value.id) {
      // แก้ไขของเดิม: ยิงไปอัปเดตที่ Cloud
      const noteRef = doc(db, 'notes', editingNoteData.value.id)
      await updateDoc(noteRef, {
        title: noteData.title,
        content: noteData.content,
        date: noteData.date
      })
    } else {
      // สร้างใหม่: โยนก้อนข้อมูลใหม่เข้า Cloud
      await addDoc(notesCollection, {
        title: noteData.title,
        content: noteData.content,
        date: noteData.date
      })
    }
    // พอเซฟลง Cloud เสร็จ ก็สั่งให้โหลดข้อมูลมาอัปเดตหน้าเว็บใหม่
    await fetchNotes()
    isModalOpen.value = false
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึก: ", error)
    alert("เซฟขึ้น Cloud ไม่สำเร็จครับ!")
  }
}

// --- 💥 3. ฟังก์ชันลบข้อมูลออกจาก Cloud ---
const handleDeleteNote = async (noteDataToDelete) => {
  if(confirm('แน่ใจนะว่าจะลบโน้ตนี้ทิ้ง? บินหายไปจาก Cloud เลยนะ!')) {
    try {
      const noteRef = doc(db, 'notes', noteDataToDelete.id)
      await deleteDoc(noteRef)
      // พอลบเสร็จ ก็โหลดข้อมูลใหม่มาแสดง
      await fetchNotes()
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ: ", error)
    }
  }
}
</script>

<template>

  <div
    :class="isClassic ? 'bg-[#008080] font-mono crt-container' : 'bg-[#030712] font-sans text-slate-200'"
    class="min-h-screen flex flex-col transition-all duration-700"
    :style="!isClassic ? 'background-image: radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(147, 51, 234, 0.15) 0px, transparent 50%);' : ''"
  >

    <Navbar :isClassic="isClassic" @toggle-theme="toggleTheme" />

    <main class="flex-grow w-full max-w-6xl mx-auto px-6 pb-12 pt-6">

      <div class="flex justify-end gap-3 mb-4">
        <button @click="exportNotes" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
          Backup
        </button>

        <label class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer shadow-sm transition-all active:scale-95">
          Restore
          <input type="file" @change="importNotes" class="hidden" accept=".json" />
        </label>
      </div>

      <SearchBar :isClassic="isClassic" @search="handleSearch" />


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
          หาโน้ตไม่เจอเลย ลองพิมพ์คำอื่นดู
        </div>

        <div v-if="notes.length === 0" :class="isClassic ? 'text-white' : 'text-slate-400'" class="text-center py-12 mt-8">
          <span class="text-4xl block mb-4">!</span>
          ยังไม่มีโน้ต กดสร้างโน้ตใหม่ได้เลย
        </div>

      </div>

    </main>

    <NoteModal
      v-if="isModalOpen"
      :initialData="editingNoteData"
      :isClassic="isClassic"  
      @close="isModalOpen = false"
      @save="handleSaveNote"
    />

  </div>
</template>

<style scoped>
/* 📺 ดีไซน์จอคอมเหลี่ยม (Classic Industrial) - ใช้งานง่าย ไม่ทะลุ */
.crt-container {
  /* เปลี่ยนจาก fixed เป็น min-h เพื่อให้เลื่อนได้ปกติ */
  min-height: 100vh;
  width: 100%;
  position: relative;

  /* ขอบเหลี่ยมกริบแบบคลาสสิก ยุค 90 */
  border: 20px solid #a0a0a0;
  border-radius: 0px;

  /* เงาสร้างมิติจอคอม */
  box-shadow: inset 0 0 80px rgba(0,0,0,0.4);
  overflow: hidden;
  transition: all 0.5s ease;
}

/* 🎞️ เส้นขีดๆ (Scanlines) เพิ่มความเท่ */
.crt-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.08) 50%
  );
  background-size: 100% 4px;
  z-index: 5; /* อยู่หลัง Navbar แต่หน้าเนื้อหา */
  pointer-events: none;
  opacity: 0.4;
}

/* 🖱️ Scrollbar ย้อนยุค (ปรับความหนาให้พอดี) */
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: #808080;
}
::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid white;
}

/* 🌑 Modern Dark Mode Tweaks */
.bg-white\/80 {
  background-color: rgba(30, 41, 59, 0.7) !important;
  border-color: rgba(51, 65, 85, 1) !important;
}

:not(.isClassic) h2 {
  color: #94a3b8 !important;
}
</style>
