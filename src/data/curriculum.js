// NIGERIA NERDC CURRICULUM — Classes, Subjects, Emojis
// Edit here to add/remove subjects or classes

const NIGERIA = {
  primary: { label:"Primary School", emoji:"🎒",
    classes:["Primary 1","Primary 2","Primary 3","Primary 4","Primary 5","Primary 6"],
    subjects:["Mathematics","English Language","Basic Science","Social Studies","Yoruba","Verbal Reasoning","Quantitative Reasoning"] },
  junior: { label:"Junior Secondary School (JSS)", emoji:"📚",
    classes:["JSS 1","JSS 2","JSS 3"],
    subjects:["Mathematics","English Language","Yoruba","Igbo","Hausa","IRK","CRK","Computer Studies","Basic Technology","Basic Science","Social Studies"] },
  senior: { label:"Senior Secondary School (SSS)", emoji:"🎓",
    classes:["SSS 1","SSS 2","SSS 3"],
    subjects:["Mathematics","English Language","Yoruba","Igbo","Hausa","IRS","CRS","Literature in English","Accounting","Commerce","Economics","Geography","Computer Studies","Chemistry","Physics","Biology","Further Mathematics","Civic Education","Agricultural Science","Animal Husbandry","Government","Technical Drawing","Marketing"] },
};



const SUBJECT_TOPICS = {
  "Yoruba":{ primary:["Kika ati Iwe (Reading & Writing)","Idile (Family words)","Awon nomba (Numbers 1-20)","Awon awo (Colours)","Ikini (Greetings)","Itan kukuru (Short stories)","Awon ojo ose (Days of week)"], junior:["Iso-oro (Grammar)","Apooowe (Proverbs)","Itan aroso (Folktales)","Ewi (Poetry)","Ohun (Tones)","Abidi Yoruba (Alphabet)","Oriki (Praise chants)","Ajapa (Tortoise tales)"], senior:["D.O. Fagunwa set texts","Ewi ati Oriki (Poetry)","Ere Yoruba (Drama)","Girama Yoruba (Grammar)","Asa Yoruba (Culture)","Itan afose (Prose fiction)","Apooowe ati Owe (Proverbs)"] },
  "Igbo":{ primary:["Ogugu (Reading)","Ide ihe (Writing)","Okwu Igbo (Vocabulary)","Onuogu (Numbers)","Akuko ifo (Folktales)"], junior:["Uzo asusu Igbo (Grammar)","Ilu Igbo (Proverbs)","Uri (Poetry)","Odinala (Culture)","Udaume (Vowels/Tones)","Mbe (Tortoise tales)"], senior:["Pita Nwana — Omenuko","Uri Igbo (Poetry)","Egwu na ere (Drama)","Omenala Igbo (Customs)"] },
  "Hausa":{ primary:["Karatu (Reading)","Rubutu (Writing)","Kalmomi (Vocab)","Lambobi (Numbers)","Labarai (Stories)"], junior:["Nahawun Hausa (Grammar)","Karin Magana (Proverbs)","Tatsuniyoyi (Folktales)","Waka (Poetry)","Al'adun Hausa (Culture)"], senior:["Abubakar Imam — Ruwan Bagaja","Waka (Poetry)","Wasan kwaikwayo (Drama)","Nahawu (Advanced grammar)"] },
  "Islamic Religious Studies (IRK)":{ primary:["Five Pillars of Islam","The Quran","Prophet Muhammad (SAW)","Daily prayers (Salat)","Islamic manners"], junior:["Tawheed","Sunnah and Hadith","Sirah (Prophet life)","Islamic history","Zakat and Sadaqah"], senior:["Sharia","Islam in Nigeria","Islamic ethics","Quran Tajweed","Hajj and Umrah"] },
  "Islamic Religious Studies (IRS)":{ senior:["Sharia in society","History of Islam in Nigeria","Tawheed","Islamic ethics","Quran and Tafsir","Fiqh (jurisprudence)","Hajj and Umrah"] },
  "Christian Religious Studies (CRK)":{ primary:["Creation (Genesis)","Ten Commandments","Stories of Jesus","Lord's Prayer","Christian virtues"], junior:["Old Testament stories","New Testament","Life of Jesus","Miracles & Parables","Church history"], senior:["Christian ethics","Christianity in Nigeria","Early Church","Epistles of Paul","Stewardship"] },
  "Christian Religious Studies (CRS)":{ senior:["Christian ethics in society","Christianity in Nigeria","Early Church","Epistles of Paul","Stewardship","Ecumenism","Eschatology"] },
  "Further Mathematics":{ senior:["Complex numbers","Matrices & determinants","Vectors in 3D","Differential equations","Binomial theorem","Permutations & combinations","Partial fractions","Conic sections","Advanced calculus"] },
  "Animal Husbandry":{ senior:["Classification of farm animals","Livestock breeds in Nigeria","Animal nutrition","Animal reproduction","Poultry management","Cattle rearing","Animal diseases & control","Dairy farming"] },
  "Literature in English":{ senior:["African prose fiction","African poetry","African drama","Plot, character, theme","Figures of speech","Narrative techniques","Oral tradition"] },
};

function getTopics(subject, levelKey) {
  const m = SUBJECT_TOPICS[subject]; if (!m) return null;
  if (levelKey==="primary") return m.primary||m.junior||m.senior;
  if (levelKey==="junior") return m.junior||m.senior||m.primary;
  return m.senior||m.junior||m.primary;
}

// STORAGE ENGINE

export { NIGERIA, SUBJECT_TOPICS };
