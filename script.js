// 1. 로컬스토리지에서 기존 명단 불러오기 (저장된 게 없으면 빈 배열)
let students = JSON.parse(localStorage.getItem('classList')) || [];

// DOM 요소 가져오기
const nameInput = document.getElementById('nameInput');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');
const resultText = document.getElementById('resultText');
const pickBtn = document.getElementById('pickBtn');

// 💾 [저장 전용 함수] 로컬스토리지에 현재 명단 저장하기
function saveToLocalStorage() {
  localStorage.setItem('classList', JSON.stringify(students));
}

// 2. 학생 이름 추가 함수
function addStudent() {
  const name = nameInput.value.trim();

  // 빈칸 검사
  if (name === '') {
    alert('이름을 입력해주세요! 😊');
    nameInput.focus();
    return;
  }

  // 중복 확인
  if (students.includes(name)) {
    alert('이미 등록된 학생입니다! 🎒');
    nameInput.focus();
    return;
  }

  // 명단에 추가 후 저장 및 화면 갱신
  students.push(name);
  saveToLocalStorage();
  nameInput.value = '';
  nameInput.focus();

  updateUI();
}

// 3. 개별 학생 삭제 함수
function removeStudent(index) {
  students.splice(index, 1);
  saveToLocalStorage(); // 변경사항 저장
  updateUI();
}

// 4. 화면 목록 갱신 함수
function updateUI() {
  studentCount.textContent = students.length;
  studentList.innerHTML = '';

  if (students.length === 0) {
    studentList.innerHTML = '<span style="color: #9aa5b1; font-size: 0.9rem;">등록된 학생이 없습니다.</span>';
    return;
  }

  // 등록된 학생 태그 생성
  students.forEach((name, index) => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
      <span>${name}</span>
      <button class="tag-del-btn" onclick="removeStudent(${index})" title="삭제">&times;</button>
    `;
    studentList.appendChild(tag);
  });
}

// 5. 무작위 발표자 뽑기 함수 (두근두근 롤링 효과 포함)
function pickRandomStudent() {
  if (students.length === 0) {
    alert('먼저 학생 이름을 한 명 이상 등록해주세요! 📝');
    nameInput.focus();
    return;
  }

  pickBtn.disabled = true;

  let counter = 0;
  const maxRolls = 15;

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * students.length);
    resultText.textContent = students[randomIndex];
    counter++;

    if (counter >= maxRolls) {
      clearInterval(interval);
      const finalWinner = students[Math.floor(Math.random() * students.length)];
      resultText.textContent = `🎉 ${finalWinner} 학생! 🎉`;
      pickBtn.disabled = false;
    }
  }, 80);
}

// 6. 전체 초기화 함수 (확인창 및 로컬스토리지 삭제 포함)
function resetAll() {
  if (students.length === 0) {
    alert('지울 명단이 없습니다. 🎈');
    return;
  }

  const isConfirmed = confirm('정말로 모든 학생 명단을 초기화할까요? 저장된 데이터도 함께 사라집니다.');
  if (isConfirmed) {
    students = [];
    localStorage.removeItem('classList'); // 저장소 비우기
    resultText.textContent = '누가 나올까요? 👀';
    updateUI();
  }
}

// 7. Enter 키 입력 지원 이벤트 연결
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addStudent();
  }
});

// 처음 실행 시 저장된 명단 화면에 표시
updateUI();
